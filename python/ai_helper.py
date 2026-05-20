"""
ai_helper.py — ask the Freshket dataset questions in plain English.

How it works: your question + the table schema go to an LLM, which writes a
single DuckDB SQL query. That query runs against ../data/freshketdanny.csv and
the result comes back as a DataFrame. (Inspired by how Agoda uses GPT to help
write/optimize SQL.)

Setup:
    pip install -r requirements.txt
    export OPENAI_API_KEY=sk-...          # your key
    # optional: export OPENAI_MODEL=gpt-4o-mini

CLI:
    python python/ai_helper.py "Which province had the highest net GMV?"

In code / a DataLab notebook:
    from ai_helper import ask
    ask("Average order value for chains vs independents?")
"""
import os, sys
import pandas as pd
import duckdb

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "freshketdanny.csv")

SCHEMA_HINT = """Table name: freshket  (one row per ORDER LINE ITEM).
Columns: order_id, line_no, order_datetime, order_date, day_of_week, customer_id,
customer_name, customer_type, is_chain (TRUE/FALSE), is_key_account, province,
region_zone, city_area, customer_since, is_new_customer (TRUE/FALSE), account_manager,
channel, sku_id, product_name, product_category, unit, quantity, unit_price_thb,
gross_revenue_thb, discount_thb, promo_code, cogs_thb, gross_margin_thb,
gross_margin_pct, payment_terms, payment_status, delivery_status, delivery_date,
net_revenue_thb (= gross_revenue_thb - discount_thb).
Rules: orders = COUNT(DISTINCT order_id); line items = COUNT(*). For booked revenue
exclude delivery_status = 'Cancelled'. Currency is Thai Baht (THB)."""


def _load():
    df = pd.read_csv(DATA)
    df["net_revenue_thb"] = df["gross_revenue_thb"] - df["discount_thb"]
    return df


def _extract_sql(text: str) -> str:
    """Pull a bare SQL statement out of an LLM reply (strip code fences / language tag)."""
    t = text.strip()
    if "```" in t:
        t = t.split("```")[1]
    lines = t.splitlines()
    if lines and lines[0].strip().lower() == "sql":
        lines = lines[1:]
    return "\n".join(lines).strip()


def generate_sql(question: str) -> str:
    """Turn a plain-English question into a DuckDB SQL query using an LLM."""
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("Set OPENAI_API_KEY to use the AI helper "
                           "(see README). The query harness still works via run_sql().")
    from openai import OpenAI
    client = OpenAI()
    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0,
        messages=[
            {"role": "system", "content": "You are a senior analytics engineer. "
             "Reply with ONE DuckDB SQL query and nothing else."},
            {"role": "user", "content": f"{SCHEMA_HINT}\n\nQuestion: {question}"},
        ],
    )
    return _extract_sql(resp.choices[0].message.content)


def run_sql(sql: str) -> pd.DataFrame:
    """Run a SQL query against the dataset (table is named `freshket`)."""
    con = duckdb.connect()
    con.register("freshket", _load())
    return con.execute(sql).df()


def ask(question: str, show_sql: bool = True) -> pd.DataFrame:
    """Plain-English question -> generated SQL -> result DataFrame."""
    sql = generate_sql(question)
    if show_sql:
        print("Generated SQL:\n" + sql + "\n")
    return run_sql(sql)


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "What is the net GMV by province, top 5?"
    print(ask(q).to_string(index=False))

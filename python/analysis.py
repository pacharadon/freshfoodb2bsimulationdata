"""Freshket-style sales analysis — pure pandas. Run: python python/analysis.py"""
import os, pandas as pd
HERE = os.path.dirname(os.path.abspath(__file__))
df = pd.read_csv(os.path.join(HERE, "..", "data", "freshketdanny.csv"))
df["net_revenue_thb"] = df["gross_revenue_thb"] - df["discount_thb"]
booked = df[df["delivery_status"] != "Cancelled"]

print("1) lines / orders / customers:",
      len(df), df.order_id.nunique(), df.customer_id.nunique())

print("\n2) orders by customer_type:")
print(booked.groupby("customer_type")["order_id"].nunique().sort_values(ascending=False))

basket = booked.groupby("order_id")["net_revenue_thb"].sum()
print("\n3) Average Order Value (THB):", round(basket.mean()), "over", basket.size, "orders")

print("\n4) net GMV by province (top 5, THB):")
print(booked.groupby("province")["net_revenue_thb"].sum().sort_values(ascending=False).head(5).astype(int))

print("\n5) chain vs independent:")
g = booked.groupby("is_chain").agg(orders=("order_id","nunique"), gmv=("net_revenue_thb","sum"))
g["aov"] = (g["gmv"]/g["orders"]).round()
print(g)

print("\n6) account-manager leaderboard (top 5 by GMV, THB):")
print(booked.groupby("account_manager")["net_revenue_thb"].sum().sort_values(ascending=False).head(5).astype(int))

print("\n7) new vs existing customer GMV (THB):")
print(booked.groupby("is_new_customer")["net_revenue_thb"].sum().astype(int))

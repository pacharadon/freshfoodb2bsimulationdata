# Build journal & learning roadmap

How I built **Freshket Data Lab**, the decisions I made along the way, and what I picked up — kept as a record of the process, not just the result.

## What I set out to learn
pandas, matplotlib and SQL — not as syntax to memorize, but as the everyday moves of a working analyst: load a file, look at it, filter to what matters, group and total, chart it, and connect separate tables to answer a real question.

## The build, in order
1. **Grounded it in a real business.** Researched the data stacks behind Agoda (SQL Server), Shopee (MySQL + TiDB), and Freshket (AWS, ~201 staff, digital + sales-led) so the project mirrors how these companies actually run.
2. **Generated a synthetic transactions dataset** — 978 order lines / 221 orders across Thai provinces, in THB, seeded so it's reproducible.
3. **Designed three dataframes** — `transactions_df` (sales), `mkt_df` (marketing spend & performance), `ops_df` (the workforce) — and learned that tables with different grains connect through shared dimensions, not direct row joins.
4. **Matched a real teaching format.** Studied how DataCamp and IBM write exercises, then built each question as context → think-first task → halfway hint → reveal (code + output + insight).
5. **Iterated on the experience** (the part I'm most proud of):
   - named tables for what they hold instead of a generic `df`;
   - made each new dataset load its own CSV so the data flow is clear;
   - rewrote every explanation into plain English, stripping the jargon;
   - tuned a dark Freshket-green theme and a six-color syntax legend, adding orange so no two colors clash.
6. **Shipped it** as a single self-contained page to GitHub Pages.

## Skills I can now demonstrate
- **pandas:** read_csv, indexing & filtering, calculated columns, `groupby` aggregations, `value_counts`, `pivot_table`, average order value.
- **matplotlib:** bar, line, stacked-bar and scatter charts.
- **SQL:** the same questions written in SQL alongside the pandas.
- **Data modeling & synthetic data:** designing a schema, generating reproducible fake data with realistic distributions.
- **Shipping:** git, GitHub, and GitHub Pages.

## The numbers (verified against the data)
- Marketing: blended **CAC ฿2,879**, **ROAS 3.9×**; Referral and Email are the cheapest channels, paid social the priciest.
- Operations: **201 employees**, **~69%** frontline (warehouse / logistics / sourcing).
- Sales: average order value **฿12,548**; chains drive the majority of revenue.

## What's next
Point a custom domain at the site; add a join/`merge` lesson; expand the marketing and ops question sets.

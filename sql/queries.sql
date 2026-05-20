-- Freshket-style sales analysis (DuckDB / standard SQL)
-- After uploading the CSV, the table is named `freshketdanny`.

-- 1) The grain: line items vs orders vs customers
SELECT COUNT(*) AS line_items,
       COUNT(DISTINCT order_id) AS orders,
       COUNT(DISTINCT customer_id) AS customers
FROM freshketdanny;

-- 2) Orders by HoReCa customer type
SELECT customer_type, COUNT(DISTINCT order_id) AS orders
FROM freshketdanny
WHERE delivery_status <> 'Cancelled'
GROUP BY customer_type
ORDER BY orders DESC;

-- 3) Average Order Value (roll lines up to orders first)
SELECT ROUND(AVG(order_total)) AS aov_thb, COUNT(*) AS orders
FROM (SELECT order_id, SUM(gross_revenue_thb - discount_thb) AS order_total
      FROM freshketdanny WHERE delivery_status <> 'Cancelled' GROUP BY order_id);

-- 4) GMV by province (provincial expansion view)
SELECT province, SUM(gross_revenue_thb - discount_thb) AS gmv_thb
FROM freshketdanny WHERE delivery_status <> 'Cancelled'
GROUP BY province ORDER BY gmv_thb DESC LIMIT 5;

-- 5) Chain vs independent
SELECT is_chain, COUNT(DISTINCT order_id) AS orders,
       SUM(gross_revenue_thb - discount_thb) AS gmv_thb,
       ROUND(SUM(gross_revenue_thb - discount_thb)/COUNT(DISTINCT order_id)) AS aov_thb
FROM freshketdanny WHERE delivery_status <> 'Cancelled' GROUP BY is_chain;

-- 6) Account-manager leaderboard
SELECT account_manager, SUM(gross_revenue_thb - discount_thb) AS gmv_thb
FROM freshketdanny WHERE delivery_status <> 'Cancelled'
GROUP BY account_manager ORDER BY gmv_thb DESC;

const COLS=["order_id","customer_type","is_chain","province","product_category","channel","day_of_week","quantity","gross_revenue_thb","discount_thb"];
const DATA=[
 {order_id:"ORD-0001",customer_type:"Casual Dining",is_chain:true,province:"Bangkok",product_category:"Vegetables",channel:"Mobile App",day_of_week:"Monday",quantity:12,gross_revenue_thb:3600,discount_thb:0},
 {order_id:"ORD-0002",customer_type:"Hotel",is_chain:true,province:"Phuket",product_category:"Seafood",channel:"Sales Rep",day_of_week:"Tuesday",quantity:20,gross_revenue_thb:12800,discount_thb:600},
 {order_id:"ORD-0003",customer_type:"Café & Bakery",is_chain:false,province:"Bangkok",product_category:"Eggs & Dairy",channel:"Web",day_of_week:"Wednesday",quantity:8,gross_revenue_thb:1900,discount_thb:0},
 {order_id:"ORD-0004",customer_type:"QSR",is_chain:true,province:"Chiang Mai",product_category:"Meat",channel:"Mobile App",day_of_week:"Thursday",quantity:30,gross_revenue_thb:9400,discount_thb:400},
 {order_id:"ORD-0005",customer_type:"Cloud Kitchen",is_chain:false,province:"Bangkok",product_category:"Vegetables",channel:"LINE",day_of_week:"Friday",quantity:15,gross_revenue_thb:4200,discount_thb:0},
 {order_id:"ORD-0006",customer_type:"Fine Dining",is_chain:false,province:"Phuket",product_category:"Seafood",channel:"Mobile App",day_of_week:"Friday",quantity:10,gross_revenue_thb:8800,discount_thb:500},
 {order_id:"ORD-0007",customer_type:"Catering",is_chain:true,province:"Songkhla",product_category:"Dry Goods",channel:"Sales Rep",day_of_week:"Saturday",quantity:40,gross_revenue_thb:7600,discount_thb:300},
 {order_id:"ORD-0008",customer_type:"Casual Dining",is_chain:false,province:"Chiang Mai",product_category:"Fruits",channel:"Web",day_of_week:"Sunday",quantity:18,gross_revenue_thb:3300,discount_thb:0}
];
DATA.forEach((r,i)=>{r._i=i; r.net_revenue_thb=r.gross_revenue_thb-r.discount_thb;});
const WEEK=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function hlPy(code){
  const kw=new Set(["import","as","True","False","None","in","not","and","or","for","print"]);
  const objs=new Set(["df","plt","daily"]);
  const mods=new Set(["pd"]);
  const re=/(\s+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\d+\.?\d*)|([A-Za-z_][A-Za-z0-9_]*)|([().,\[\]=<>!+\-*/:%&|\\])/g;
  let out="",m,prev="";
  while((m=re.exec(code))!==null){
    if(m[1]){out+=m[1];continue;}
    let tok=m[0],cls="t-punct";
    if(m[2])cls="t-str"; else if(m[3])cls="t-num";
    else if(m[4]){ if(prev===".")cls="t-method"; else if(kw.has(tok))cls="t-kw"; else if(objs.has(tok))cls="t-df"; else if(mods.has(tok))cls="t-mod"; else cls="t-ident"; }
    out+='<span class="'+cls+'">'+esc(tok)+'</span>'; prev=tok;
  }
  return out;
}
function hlSql(code){
  const cmds=new Set(["SELECT","FROM","WHERE","GROUP","BY","ORDER","HAVING","SUM","COUNT","AVG","MIN","MAX","AS","DESC","ASC","LIMIT","DISTINCT","AND","OR","ON","TRUE","FALSE"]);
  const tables=new Set(["freshket"]);
  const re=/(\s+)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(--[^\n]*)|(\d+\.?\d*)|([A-Za-z_][A-Za-z0-9_]*)|([().,*=<>!+\-\/;])/g;
  let out="",m;
  while((m=re.exec(code))!==null){
    if(m[1]){out+=m[1];continue;}
    let tok=m[0],cls="t-punct";
    if(m[2])cls="t-str"; else if(m[3])cls="t-cmt"; else if(m[4])cls="t-num";
    else if(m[5]){ if(cmds.has(tok.toUpperCase()))cls="t-kw"; else if(tables.has(tok))cls="t-table"; else cls="t-ident"; }
    out+='<span class="'+cls+'">'+esc(tok)+'</span>';
  }
  return out;
}

function disp(c,v){return c==="is_chain"?(v?"True":"False"):String(v);}
function tbl(cols,rows){
  let h='<div class="tw"><table><thead><tr><th class="ix"></th>'+cols.map(c=>'<th>'+c+'</th>').join("")+'</tr></thead><tbody>';
  rows.forEach(r=>{h+='<tr><td class="ix">'+r._i+'</td>'+cols.map(c=>'<td>'+disp(c,r[c])+'</td>').join("")+'</tr>';});
  return h+'</tbody></table></div>';
}
function ser(pairs,name,dtype){
  let h='<div class="ser">';
  pairs.forEach(p=>{h+='<div class="srow"><span class="sk">'+p[0]+'</span><span class="sv">'+p[1]+'</span></div>';});
  return h+'<div class="sft">Name: '+name+', dtype: '+dtype+'</div></div>';
}
function valb(t){return '<pre class="oval">'+esc(t)+'</pre>';}
function chart(el,cfg){const cv=document.createElement("canvas");cv.style.maxHeight="260px";el.appendChild(cv);new Chart(cv,cfg);}
const GREENS=["#43d68b","#1f9d63","#5fcdb6","#5bb8ec","#9b8cf0","#df8fcb","#6fbf73"];
function baseOpts(extra){return Object.assign({responsive:true,plugins:{legend:{labels:{color:"#cfe6da"}}},scales:{x:{ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}},y:{ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}}}},extra||{});}

function vcounts(col){const m=new Map();DATA.forEach(r=>m.set(r[col],(m.get(r[col])||0)+1));return [...m.entries()].sort((a,b)=>b[1]-a[1]);}
function gmap(col,key){const m=new Map();DATA.forEach(r=>m.set(r[col],(m.get(r[col])||0)+r[key]));return m;}
function gmean(col,key){const s=new Map(),c=new Map();DATA.forEach(r=>{s.set(r[col],(s.get(r[col])||0)+r[key]);c.set(r[col],(c.get(r[col])||0)+1);});const m=new Map();[...s.keys()].forEach(k=>m.set(k,Math.round(s.get(k)/c.get(k))));return m;}
function alpha(m){return [...m.entries()].sort((a,b)=>String(a[0]).localeCompare(String(b[0])));}
function desc(m){return [...m.entries()].sort((a,b)=>b[1]-a[1]);}
function sumK(k){return DATA.reduce((a,r)=>a+r[k],0);}
function corr(x,y){const n=x.length,mx=x.reduce((a,b)=>a+b,0)/n,my=y.reduce((a,b)=>a+b,0)/n;let c=0,sx=0,sy=0;for(let i=0;i<n;i++){const dx=x[i]-mx,dy=y[i]-my;c+=dx*dy;sx+=dx*dx;sy+=dy*dy;}return c/Math.sqrt(sx*sy);}

const Q=[
{tier:"easy",prompt:"Load the data file into a pandas DataFrame called df.",answer:'df=pd.read_csv("freshketdanny.csv")',py:'import pandas as pd\ndf = pd.read_csv("freshketdanny.csv")',out:e=>{e.innerHTML='<div class="ok">loaded — 8 rows, 10 columns (a hand-checkable slice; the same code runs on the full 978-row file)</div>'+tbl(COLS,DATA);}},
{tier:"easy",prompt:"How many rows and columns does df have?",answer:'df.shape',py:'df.shape',sql:'SELECT COUNT(*) AS rows FROM freshket;',out:e=>{e.innerHTML=valb('(8, 10)');}},
{tier:"easy",prompt:"List every column name.",answer:'df.columns.tolist()',py:'df.columns.tolist()',out:e=>{e.innerHTML=valb("['order_id', 'customer_type', 'is_chain', 'province',\n 'product_category', 'channel', 'day_of_week', 'quantity',\n 'gross_revenue_thb', 'discount_thb']");}},
{tier:"easy",prompt:"Show the first 5 rows.",answer:'df.head()',py:'df.head()',sql:'SELECT * FROM freshket LIMIT 5;',out:e=>{e.innerHTML=tbl(COLS,DATA.slice(0,5));}},
{tier:"easy",prompt:"Show the last 3 rows.",answer:'df.tail(3)',py:'df.tail(3)',out:e=>{e.innerHTML=tbl(COLS,DATA.slice(-3));}},
{tier:"easy",prompt:"What data type is each column?",answer:'df.dtypes',py:'df.dtypes',out:e=>{e.innerHTML=valb('order_id            object\ncustomer_type       object\nis_chain              bool\nprovince            object\nproduct_category    object\nchannel             object\nday_of_week         object\nquantity             int64\ngross_revenue_thb    int64\ndiscount_thb         int64\ndtype: object');}},
{tier:"easy",prompt:"Select just the gross_revenue_thb column (a Series).",answer:'df["gross_revenue_thb"]',py:'df["gross_revenue_thb"]',out:e=>{e.innerHTML=ser(DATA.map(r=>[r._i,r.gross_revenue_thb]),"gross_revenue_thb","int64");}},
{tier:"easy",prompt:"Get summary statistics for the numeric columns.",answer:'df.describe()',py:'df.describe()',out:e=>{const cols=["quantity","gross_revenue_thb","discount_thb"];const stat=(f)=>cols.map(c=>f(DATA.map(r=>r[c])));const mean=a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length*100)/100;const rows=[["count",cols.map(()=>8)],["mean",stat(mean)],["min",stat(a=>Math.min(...a))],["max",stat(a=>Math.max(...a))]];let h='<div class="tw"><table><thead><tr><th class="ix"></th>'+cols.map(c=>'<th>'+c+'</th>').join("")+'</tr></thead><tbody>';rows.forEach(rw=>{h+='<tr><td class="ix">'+rw[0]+'</td>'+rw[1].map(v=>'<td>'+v+'</td>').join("")+'</tr>';});e.innerHTML=h+'</tbody></table></div>';}},
{tier:"easy",prompt:"How many unique provinces appear?",answer:'df["province"].nunique()',py:'df["province"].nunique()',sql:'SELECT COUNT(DISTINCT province) FROM freshket;',out:e=>{e.innerHTML=valb('4');}},
{tier:"easy",prompt:"Count how many orders each customer_type has.",answer:'df["customer_type"].value_counts()',py:'df["customer_type"].value_counts()',sql:'SELECT customer_type, COUNT(*) AS n\nFROM freshket GROUP BY customer_type ORDER BY n DESC;',out:e=>{e.innerHTML=ser(vcounts("customer_type"),"count","int64");}},
{tier:"easy",prompt:"What is the total gross revenue?",answer:'df["gross_revenue_thb"].sum()',py:'df["gross_revenue_thb"].sum()',sql:'SELECT SUM(gross_revenue_thb) FROM freshket;',out:e=>{e.innerHTML=valb(String(sumK("gross_revenue_thb")));}},
{tier:"easy",prompt:"What is the average quantity per line?",answer:'df["quantity"].mean()',py:'df["quantity"].mean()',sql:'SELECT AVG(quantity) FROM freshket;',out:e=>{e.innerHTML=valb(String(Math.round(sumK("quantity")/8*1000)/1000));}},

{tier:"intermediate",prompt:"Show only the orders from Phuket.",answer:'df[df["province"]=="Phuket"]',py:'df[df["province"] == "Phuket"]',sql:"SELECT * FROM freshket WHERE province = 'Phuket';",out:e=>{e.innerHTML=tbl(COLS,DATA.filter(r=>r.province==="Phuket"));}},
{tier:"intermediate",prompt:"Show only chain customers.",answer:'df[df["is_chain"]==True]',py:'df[df["is_chain"] == True]',sql:"SELECT * FROM freshket WHERE is_chain = TRUE;",out:e=>{e.innerHTML=tbl(COLS,DATA.filter(r=>r.is_chain));}},
{tier:"intermediate",prompt:"Create a net_revenue_thb column = gross minus discount.",answer:'df["net_revenue_thb"]=df["gross_revenue_thb"]-df["discount_thb"]',py:'df["net_revenue_thb"] = df["gross_revenue_thb"] - df["discount_thb"]\ndf[["order_id", "gross_revenue_thb", "discount_thb", "net_revenue_thb"]]',out:e=>{e.innerHTML=tbl(["order_id","gross_revenue_thb","discount_thb","net_revenue_thb"],DATA);}},
{tier:"intermediate",prompt:"Total net revenue by province, highest first.",answer:'df.groupby("province")["net_revenue_thb"].sum().sort_values(ascending=False)',py:'df.groupby("province")["net_revenue_thb"].sum().sort_values(ascending=False)',sql:"SELECT province, SUM(gross_revenue_thb - discount_thb) AS net\nFROM freshket GROUP BY province ORDER BY net DESC;",out:e=>{e.innerHTML=ser(desc(gmap("province","net_revenue_thb")),"net_revenue_thb","int64");}},
{tier:"intermediate",prompt:"Average gross revenue per customer_type.",answer:'df.groupby("customer_type")["gross_revenue_thb"].mean()',py:'df.groupby("customer_type")["gross_revenue_thb"].mean()',out:e=>{e.innerHTML=ser(alpha(gmean("customer_type","gross_revenue_thb")),"gross_revenue_thb","float64");}},
{tier:"intermediate",prompt:"How many lines come from each province? (value_counts)",answer:'df["province"].value_counts()',py:'df["province"].value_counts()',out:e=>{e.innerHTML=ser(vcounts("province"),"count","int64");}},
{tier:"intermediate",prompt:"Top 3 product categories by revenue.",answer:'df.groupby("product_category")["gross_revenue_thb"].sum().sort_values(ascending=False).head(3)',py:'df.groupby("product_category")["gross_revenue_thb"].sum().sort_values(ascending=False).head(3)',out:e=>{e.innerHTML=ser(desc(gmap("product_category","gross_revenue_thb")).slice(0,3),"gross_revenue_thb","int64");}},
{tier:"intermediate",prompt:"Count orders per day of the week.",answer:'df["day_of_week"].value_counts()',py:'df["day_of_week"].value_counts()',out:e=>{e.innerHTML=ser(vcounts("day_of_week"),"count","int64");}},
{tier:"intermediate",prompt:"Bar chart: gross revenue by province.",answer:'.plot(kind="bar")',py:'import matplotlib.pyplot as plt\ndf.groupby("province")["gross_revenue_thb"].sum().plot(kind="bar")\nplt.ylabel("THB")\nplt.show()',out:e=>{const a=alpha(gmap("province","gross_revenue_thb"));chart(e,{type:"bar",data:{labels:a.map(x=>x[0]),datasets:[{label:"gross revenue (THB)",data:a.map(x=>x[1]),backgroundColor:GREENS[0]}]},options:baseOpts()});}},
{tier:"intermediate",prompt:"Bar chart: number of orders by customer_type.",answer:'.plot(kind="bar")',py:'df["customer_type"].value_counts().plot(kind="bar")\nplt.show()',out:e=>{const v=vcounts("customer_type");chart(e,{type:"bar",data:{labels:v.map(x=>x[0]),datasets:[{label:"orders",data:v.map(x=>x[1]),backgroundColor:GREENS[1]}]},options:baseOpts()});}},
{tier:"intermediate",prompt:"Line chart: gross revenue across the days of the week.",answer:'.plot(kind="line")',py:'order = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]\ndaily = df.groupby("day_of_week")["gross_revenue_thb"].sum().reindex(order)\ndaily.plot(kind="line", marker="o")\nplt.show()',out:e=>{const m=gmap("day_of_week","gross_revenue_thb");chart(e,{type:"line",data:{labels:WEEK,datasets:[{label:"gross revenue (THB)",data:WEEK.map(d=>m.get(d)||0),borderColor:GREENS[0],backgroundColor:GREENS[0],tension:.25,pointRadius:4}]},options:baseOpts()});}},
{tier:"intermediate",prompt:"Pie chart: share of lines by channel.",answer:'.plot(kind="pie")',py:'df["channel"].value_counts().plot(kind="pie", autopct="%1.0f%%")\nplt.ylabel("")\nplt.show()',out:e=>{const v=vcounts("channel");chart(e,{type:"pie",data:{labels:v.map(x=>x[0]),datasets:[{data:v.map(x=>x[1]),backgroundColor:GREENS}]},options:{responsive:true,plugins:{legend:{labels:{color:"#cfe6da"}}}}});}},
{tier:"intermediate",prompt:"Filter: chains located in Bangkok (two conditions).",answer:'df[(df["is_chain"]==True)&(df["province"]=="Bangkok")]',py:'df[(df["is_chain"] == True) & (df["province"] == "Bangkok")]',sql:"SELECT * FROM freshket WHERE is_chain = TRUE AND province = 'Bangkok';",out:e=>{e.innerHTML=tbl(COLS,DATA.filter(r=>r.is_chain&&r.province==="Bangkok"));}},
{tier:"intermediate",prompt:"Group by two columns: revenue by province AND chain status.",answer:'df.groupby(["province","is_chain"])["gross_revenue_thb"].sum()',py:'df.groupby(["province", "is_chain"])["gross_revenue_thb"].sum()',out:e=>{const m=new Map();DATA.forEach(r=>{const k=r.province+" / "+(r.is_chain?"True":"False");m.set(k,(m.get(k)||0)+r.gross_revenue_thb);});const pairs=[...m.entries()].sort((a,b)=>a[0].localeCompare(b[0]));e.innerHTML=ser(pairs,"gross_revenue_thb","int64");}},

{tier:"hard",prompt:"Pivot table: total revenue by province (rows) and is_chain (columns).",answer:'pd.pivot_table(df,values="gross_revenue_thb",index="province",columns="is_chain",aggfunc="sum",fill_value=0)',py:'pd.pivot_table(df, values="gross_revenue_thb",\n               index="province", columns="is_chain",\n               aggfunc="sum", fill_value=0)',out:e=>{const provs=[...new Set(DATA.map(r=>r.province))].sort();const piv=p=>({F:DATA.filter(r=>r.province===p&&!r.is_chain).reduce((a,r)=>a+r.gross_revenue_thb,0),T:DATA.filter(r=>r.province===p&&r.is_chain).reduce((a,r)=>a+r.gross_revenue_thb,0)});let h='<div class="tw"><table><thead><tr><th class="ix">province</th><th>False</th><th>True</th></tr></thead><tbody>';provs.forEach(p=>{const v=piv(p);h+='<tr><td class="ix">'+p+'</td><td>'+v.F+'</td><td>'+v.T+'</td></tr>';});e.innerHTML=h+'</tbody></table></div>';}},
{tier:"hard",prompt:"Average order value: total revenue per order, then the mean.",answer:'df.groupby("order_id")["gross_revenue_thb"].sum().mean()',py:'df.groupby("order_id")["gross_revenue_thb"].sum().mean()',sql:"SELECT AVG(order_total) FROM (\n  SELECT order_id, SUM(gross_revenue_thb) AS order_total\n  FROM freshket GROUP BY order_id);",out:e=>{e.innerHTML=valb(String(Math.round(sumK("gross_revenue_thb")/8*100)/100)+'\n\n(here each order has one line, so it equals the row mean — on the\nfull file this first rolls many lines up into each order, then averages)');}},
{tier:"hard",prompt:"Stacked bar chart: revenue by province, split into chain vs independent.",answer:'.plot(kind="bar",stacked=True)',py:'df.pivot_table(values="gross_revenue_thb", index="province",\n               columns="is_chain", aggfunc="sum", fill_value=0) \\\n  .plot(kind="bar", stacked=True)\nplt.show()',out:e=>{const provs=[...new Set(DATA.map(r=>r.province))].sort();const ind=provs.map(p=>DATA.filter(r=>r.province===p&&!r.is_chain).reduce((a,r)=>a+r.gross_revenue_thb,0));const ch=provs.map(p=>DATA.filter(r=>r.province===p&&r.is_chain).reduce((a,r)=>a+r.gross_revenue_thb,0));chart(e,{type:"bar",data:{labels:provs,datasets:[{label:"independent",data:ind,backgroundColor:GREENS[2]},{label:"chain",data:ch,backgroundColor:GREENS[1]}]},options:baseOpts({scales:{x:{stacked:true,ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}},y:{stacked:true,ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}}}})});}},
{tier:"hard",prompt:"Correlation between quantity and revenue, then a scatter plot.",answer:'df["quantity"].corr(df["gross_revenue_thb"])',py:'print(df["quantity"].corr(df["gross_revenue_thb"]))\ndf.plot(kind="scatter", x="quantity", y="gross_revenue_thb")\nplt.show()',out:e=>{const c=Math.round(corr(DATA.map(r=>r.quantity),DATA.map(r=>r.gross_revenue_thb))*1000)/1000;const d=document.createElement("div");d.innerHTML=valb("correlation = "+c);e.appendChild(d);chart(e,{type:"scatter",data:{datasets:[{label:"orders",data:DATA.map(r=>({x:r.quantity,y:r.gross_revenue_thb})),backgroundColor:GREENS[0],pointRadius:6}]},options:baseOpts({scales:{x:{title:{display:true,text:"quantity",color:"#9fc1b2"},ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}},y:{title:{display:true,text:"gross_revenue_thb",color:"#9fc1b2"},ticks:{color:"#9fc1b2"},grid:{color:"rgba(120,200,160,.10)"}}}})});}}
];

Q.push(
{tier:"management",prompt:"Total booked GMV (net revenue, excluding cancellations).",answer:'.sum()',py:'df["net_revenue_thb"] = df["gross_revenue_thb"] - df["discount_thb"]\nbooked = df[df["delivery_status"] != "Cancelled"]\nbooked["net_revenue_thb"].sum()',sql:"SELECT SUM(gross_revenue_thb - discount_thb) AS gmv\nFROM freshket WHERE delivery_status <> 'Cancelled';",out:e=>{e.innerHTML=valb("2635102")+'<div style="font-size:13px;color:var(--muted);margin-top:8px;">THB 2,635,102 across the full 978-row file (booked = excludes cancelled orders).</div>';}},
{tier:"management",prompt:"Average order value (AOV) - revenue per order.",answer:'.mean()',py:'booked.groupby("order_id")["net_revenue_thb"].sum().mean()',out:e=>{e.innerHTML=valb("12548.0")+'<div style="font-size:13px;color:var(--muted);margin-top:8px;">THB 12,548 per order. Lines are rolled up to orders first, then averaged.</div>';}},
{tier:"management",prompt:"Top 5 accounts by revenue.",answer:'.head(5)',py:'booked.groupby("customer_name")["net_revenue_thb"].sum().sort_values(ascending=False).head(5)',out:e=>{e.innerHTML=ser([["Andaman Brew House (Mueang Branch)",106111],["Som Tam Cloud Kitchen Group",90235],["Royal Fast Kitchen Group (Bang Phli Branch)",82144],["Jay Hotel Group (Din Daeng Branch)",81808],["Baan To-Go",73408]],"net_revenue_thb","int64");}},
{tier:"management",prompt:"Do chains spend more than independents?",answer:'is_chain',py:'booked.groupby("is_chain")["net_revenue_thb"].sum()',sql:"SELECT is_chain, SUM(gross_revenue_thb - discount_thb) AS net\nFROM freshket WHERE delivery_status <> 'Cancelled' GROUP BY is_chain;",out:e=>{e.innerHTML=ser([["False  (independent)",1068303],["True  (chain)",1566799]],"net_revenue_thb","int64")+'<div style="font-size:13px;color:var(--muted);margin-top:8px;">Chains drive ~59% of revenue - worth protecting.</div>';}},
{tier:"management",prompt:"Revenue by region zone (the expansion view).",answer:'region_zone',py:'booked.groupby("region_zone")["net_revenue_thb"].sum().sort_values(ascending=False)',out:e=>{e.innerHTML=ser([["Greater Bangkok",1321935],["South",738691],["North",221212],["Northeast",189401],["East",100340],["West",63523]],"net_revenue_thb","int64");}},
{tier:"management",prompt:"Account-manager leaderboard (top 5 by revenue).",answer:'account_manager',py:'booked.groupby("account_manager")["net_revenue_thb"].sum().sort_values(ascending=False).head(5)',out:e=>{e.innerHTML=ser([["Supaporn Imm",501770],["Self-serve / Inside Sales",454576],["Kittisak Wong",379379],["Arada Phuwadon",355326],["Chayan Rattana",279601]],"net_revenue_thb","int64");}},
{tier:"management",prompt:"New vs existing customers - how much revenue is new business?",answer:'is_new_customer',py:'booked.groupby("is_new_customer")["net_revenue_thb"].sum()',out:e=>{e.innerHTML=ser([["False  (existing)",2299450],["True  (new)",335652]],"net_revenue_thb","int64")+'<div style="font-size:13px;color:var(--muted);margin-top:8px;">New accounts = 23 of 210 booked orders, mostly up-country - the growth frontier.</div>';}},
{tier:"management",prompt:"Top 5 products by revenue.",answer:'product_name',py:'df.groupby("product_name")["gross_revenue_thb"].sum().sort_values(ascending=False).head(5)',out:e=>{e.innerHTML=ser([["Chicken Breast",175810],["Minced Pork",173766],["Chicken Thigh (Premium)",114628],["Jasmine Rice 5kg (Grade A)",102060],["Wheat Flour",89846]],"gross_revenue_thb","int64");}},
{tier:"plumbing",prompt:"CSV vs DataFrame - what is the difference?",answer:'read_csv',py:'import pandas as pd\ndf = pd.read_csv("freshketdanny.csv")',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">A <b>CSV</b> is plain text on disk - comma-separated values, nothing else. <code>read_csv</code> parses it into a <b>DataFrame</b>: an in-memory table you compute on. Analyze the DataFrame, then <code>to_csv()</code> to save back.</div>';}},
{tier:"plumbing",prompt:"Load only the columns you need.",answer:'usecols',py:'df = pd.read_csv("freshketdanny.csv",\n                 usecols=["order_id", "province", "gross_revenue_thb"],\n                 encoding="utf-8")',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;"><code>usecols</code> loads only those columns (faster, less memory on big files). <code>encoding</code> tells pandas how the text is stored.</div>';}},
{tier:"plumbing",prompt:"Fix the BOM bug - first column reads as a garbled order_id.",answer:'utf-8-sig',py:'df = pd.read_csv("freshketdanny.csv", encoding="utf-8-sig")',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">A UTF-8 <b>BOM</b> is 3 invisible bytes at the start of a file. With plain utf-8 the first column name becomes a garbled order_id and <code>SELECT order_id</code> fails. <code>encoding="utf-8-sig"</code> strips it. We hit this exact bug and fixed your file.</div>';}},
{tier:"plumbing",prompt:"Check column types, then make is_chain a real boolean.",answer:'astype',py:'df.dtypes\ndf["is_chain"] = df["is_chain"].astype(bool)',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;"><code>object</code> = text, <code>int64</code> = whole number, <code>bool</code> = True/False. <code>astype()</code> converts a column to the right type.</div>';}},
{tier:"plumbing",prompt:"Save your DataFrame back to a clean CSV.",answer:'to_csv',py:'df.to_csv("freshketdanny.csv", index=False)',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;"><code>index=False</code> drops the row numbers pandas adds, so you avoid a stray unnamed first column.</div>';}},
{tier:"plumbing",prompt:"Why do some order_ids repeat? (line items vs orders)",answer:'nunique',py:'len(df)\ndf["order_id"].nunique()',sql:"SELECT COUNT(*) AS lines, COUNT(DISTINCT order_id) AS orders FROM freshket;",out:e=>{e.innerHTML=valb("978\n221")+'<div style="font-size:13px;color:var(--muted);margin-top:8px;">978 line items roll up to 221 orders - one order has many product lines, so order_id repeats. Use COUNT(DISTINCT order_id) for the order count.</div>';}},
{tier:"plumbing",prompt:"What makes a clean schema?",answer:'order_id',lang:"text",py:'unique row key  =  order_id + line_no\nfacts          =  quantity, gross_revenue_thb, discount_thb\ndimensions     =  customer, product, province, channel',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">One row per product line. A <b>key</b> uniquely identifies a row, <b>facts</b> are numbers you sum, <b>dimensions</b> are what you slice by. This is the shape we designed for your dataset.</div>';}},
{tier:"plumbing",prompt:"How is synthetic data generated?",answer:'random',py:'import random\nrandom.seed(7)\nrandom.choices(provinces, weights=weights, k=1)',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;"><code>seed(7)</code> makes the fake data reproducible. <code>weights</code> make the distribution realistic - Bangkok far more likely than Rayong. That is how we built freshketdanny.csv.</div>';}},
{tier:"plumbing",prompt:"Run the same question in SQL (DuckDB / MotherDuck).",answer:'duckdb',py:'import duckdb\nduckdb.query("SELECT province, SUM(gross_revenue_thb) FROM df GROUP BY province")',sql:"SELECT province, SUM(gross_revenue_thb) AS gmv\nFROM freshket GROUP BY province ORDER BY gmv DESC;",out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">DuckDB queries a DataFrame or CSV directly with SQL. Upload freshketdanny.csv to your <b>MotherDuck</b> cloud and the same query runs server-side - shareable and fast.</div>';}},
{tier:"plumbing",prompt:"Version your work with git.",answer:'commit',lang:"sh",py:'git init\ngit add .\ngit commit -m "Freshket dataset and analysis"',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">git tracks every change as a commit you can return to. <code>add</code> stages files, <code>commit</code> snapshots them with a message.</div>';}},
{tier:"plumbing",prompt:"Push the repo to GitHub.",answer:'push',lang:"sh",py:'git remote add origin https://github.com/pacharadon/freshfoodb2bsimulationdata.git\ngit push -u origin main',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">This is exactly what we did to put your project online at github.com/pacharadon/freshfoodb2bsimulationdata.</div>';}},
{tier:"plumbing",prompt:"Deploy this page free with GitHub Pages.",answer:'pages',lang:"text",py:'Settings  ->  Pages  ->  Source: Deploy from a branch\nBranch: main    Folder: / (root)    ->  Save',out:e=>{e.innerHTML='<div style="font-size:13.5px;line-height:1.65;">GitHub serves your repo as a website. This trainer goes live at <code>pacharadon.github.io/freshfoodb2bsimulationdata</code> - then point your Namecheap domain at it.</div>';}}
);

function codeBlock(label,lang,code){return '<div class="lang">'+label+'</div><pre class="code">'+(lang==="py"?hlPy(code):lang==="sql"?hlSql(code):esc(code))+'</pre>';}
function renderSolution(el,q){
  var L={py:"python",sh:"shell",text:"structure"};
  var lg=q.lang||"py";
  var h=codeBlock(L[lg]||"python",lg,q.py);
  if(q.sql)h+=codeBlock("sql (same question)","sql",q.sql);
  h+='<div class="outlab">output</div>';
  el.innerHTML=h;
  var ob=document.createElement("div");ob.className="outbox";el.appendChild(ob);
  q.out(ob);
}
const seen=new Set();
function updateProgress(){const n=seen.size;document.getElementById("pcount").textContent=n+" / "+Q.length;document.getElementById("pbar").style.width=(n/Q.length*100)+"%";}
const TIERS=[["easy","Easy","12 questions - read and summarize"],["intermediate","Intermediate","14 questions - filter, group and plot"],["hard","Hard","4 questions - pivots, AOV and advanced charts"],["plumbing","Plumbing","12 lessons - the real pipeline: data, CSV, SQL, git, deploy"],["management","Management","8 questions - commercial and account analysis (full 978-row file)"]];
function buildTier(tier){
  const wrap=document.getElementById("qwrap");wrap.innerHTML="";
  const meta=TIERS.find(t=>t[0]===tier);
  let stepN=0;
  Q.forEach((q,gi)=>{
    if(q.tier!==tier)return;stepN++;
    const c=document.createElement("div");c.className="qcard";
    const n=stepN;
    c.innerHTML='<div class="qhead"><span class="step">'+n+'</span><span class="qtext">'+q.prompt+'</span></div>'+
      '<textarea class="try" placeholder="your turn — type the pandas here, then Check (optional)"></textarea>'+
      '<div class="btns"><button class="check">Check</button><button class="reveal">Show solution</button><span class="fb"></span></div>'+
      '<div class="sol"></div>';
    const ta=c.querySelector(".try"),fb=c.querySelector(".fb"),sol=c.querySelector(".sol");
    c.querySelector(".check").addEventListener("click",()=>{
      const norm=s=>s.toLowerCase().replace(/\s+/g,"").replace(/'/g,'"');
      const u=norm(ta.value);
      if(!u){fb.textContent="type an attempt first";fb.className="fb";return;}
      if(u.includes(norm(q.answer))){fb.textContent="✓ correct";fb.className="fb good";}
      else{fb.textContent="not quite — peek with Show solution";fb.className="fb bad";}
    });
    c.querySelector(".reveal").addEventListener("click",()=>{
      if(!sol.dataset.done){renderSolution(sol,q);sol.dataset.done="1";sol.style.display="block";seen.add(gi);updateProgress();}
      else{sol.style.display=sol.style.display==="none"?"block":"none";}
    });
    wrap.appendChild(c);
  });
  document.getElementById("tiersub").innerHTML=meta[2];
  document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("on",t.dataset.tier===tier));
}
const AI=[
 {nl:"How much revenue did each province make?",qi:15},
 {nl:"Which product categories sell the most?",qi:18},
 {nl:"Show me a chart of revenue by province",qi:20},
 {nl:"What's the average order value?",qi:27}
];
function runAI(qi){const box=document.getElementById("aiout");box.innerHTML='<div class="aihdr">the assistant turned your question into this query and ran it:</div>';const inner=document.createElement("div");box.appendChild(inner);renderSolution(inner,Q[qi]);}
function initAI(){
  const chips=document.getElementById("aichips");
  AI.forEach(a=>{const b=document.createElement("button");b.className="chip";b.textContent=a.nl;b.addEventListener("click",()=>{document.getElementById("aiq").value=a.nl;runAI(a.qi);});chips.appendChild(b);});
  document.getElementById("aiask").addEventListener("click",()=>{
    const q=document.getElementById("aiq").value.toLowerCase();let best=AI[0];
    AI.forEach(a=>{const words=a.nl.toLowerCase().split(/\W+/);const score=words.filter(w=>w.length>3&&q.includes(w)).length;if(score>0)best=a;});
    runAI(best.qi);
  });
}
window.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>buildTier(t.dataset.tier)));
  buildTier("easy");initAI();updateProgress();
});

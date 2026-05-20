import csv, random, datetime
random.seed(7)
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")
TODAY=datetime.date(2026,5,21); NEW_CUTOFF=TODAY-datetime.timedelta(days=180)
WEEK=[datetime.date(2026,5,d) for d in range(11,18)]
DOW_W=[0.155,0.150,0.150,0.160,0.180,0.115,0.090]
DOW=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
HOUR_W=[0.2,0.1,0.1,0.4,1.5,4.0,6.5,7.0,5.5,3.0,2.0,1.8,1.6,1.8,2.6,3.0,3.4,4.5,6.0,6.8,6.2,4.5,2.8,1.2]
def wc(p): i,w=zip(*p); return random.choices(i,weights=w,k=1)[0]
def rdate(a,b): return datetime.date.fromordinal(random.randint(a.toordinal(),b.toordinal()))

GBKK=["Watthana","Bang Rak","Huai Khwang","Chatuchak","Phaya Thai","Khlong Toei","Sathon","Phra Khanong","Lat Phrao","Din Daeng","Ratchathewi","Bang Na"]
PROV={
 "Bangkok":(42,"Greater Bangkok",GBKK,datetime.date(2019,1,1),datetime.date(2025,6,30)),
 "Nonthaburi":(4,"Greater Bangkok",["Pak Kret","Mueang","Bang Yai"],datetime.date(2020,1,1),datetime.date(2025,9,30)),
 "Samut Prakan":(3,"Greater Bangkok",["Mueang","Bang Phli","Phra Pradaeng"],datetime.date(2020,1,1),datetime.date(2025,9,30)),
 "Pathum Thani":(2,"Greater Bangkok",["Khlong Luang","Thanyaburi"],datetime.date(2020,6,1),datetime.date(2025,12,31)),
 "Nakhon Pathom":(1.5,"Greater Bangkok",["Mueang","Sam Phran"],datetime.date(2021,1,1),datetime.date(2026,2,28)),
 "Chiang Mai":(9,"North",["Nimman","Old City","Hang Dong","Mae Rim","Santitham"],datetime.date(2022,1,1),datetime.date(2026,5,10)),
 "Chiang Rai":(2,"North",["Mueang","Mae Sai"],datetime.date(2024,1,1),datetime.date(2026,5,10)),
 "Phitsanulok":(1,"North",["Mueang"],datetime.date(2024,6,1),datetime.date(2026,5,10)),
 "Phuket":(8,"South",["Patong","Phuket Town","Kata","Kamala","Chalong"],datetime.date(2022,6,1),datetime.date(2026,5,10)),
 "Surat Thani":(3,"South",["Koh Samui (Chaweng)","Mueang","Koh Phangan"],datetime.date(2023,1,1),datetime.date(2026,5,10)),
 "Krabi":(2.5,"South",["Ao Nang","Mueang"],datetime.date(2023,6,1),datetime.date(2026,5,10)),
 "Songkhla":(2,"South",["Hat Yai","Mueang"],datetime.date(2024,1,1),datetime.date(2026,5,10)),
 "Nakhon Si Thammarat":(1,"South",["Mueang"],datetime.date(2024,6,1),datetime.date(2026,5,10)),
 "Chon Buri":(5,"East",["Pattaya","Si Racha","Mueang","Bang Lamung"],datetime.date(2022,1,1),datetime.date(2026,5,10)),
 "Rayong":(2,"East",["Mueang","Ban Chang"],datetime.date(2023,6,1),datetime.date(2026,5,10)),
 "Chanthaburi":(1,"East",["Mueang"],datetime.date(2024,6,1),datetime.date(2026,5,10)),
 "Nakhon Ratchasima":(3,"Northeast",["Mueang (Korat)","Pak Chong"],datetime.date(2023,6,1),datetime.date(2026,5,10)),
 "Khon Kaen":(2.5,"Northeast",["Mueang"],datetime.date(2024,1,1),datetime.date(2026,5,10)),
 "Udon Thani":(2,"Northeast",["Mueang"],datetime.date(2024,6,1),datetime.date(2026,5,10)),
 "Ubon Ratchathani":(1,"Northeast",["Mueang"],datetime.date(2024,9,1),datetime.date(2026,5,10)),
 "Prachuap Khiri Khan":(2.5,"West",["Hua Hin","Mueang"],datetime.date(2023,1,1),datetime.date(2026,5,10)),
 "Ayutthaya":(1.5,"Central",["Phra Nakhon Si Ayutthaya"],datetime.date(2023,6,1),datetime.date(2026,5,10)),
 "Kanchanaburi":(1,"West",["Mueang"],datetime.date(2024,6,1),datetime.date(2026,5,10)),
}
PROV_PAIRS=[(p,v[0]) for p,v in PROV.items()]
HORECA=[("Casual Dining Restaurant",0.22),("Café & Bakery",0.16),("Quick Service Restaurant (QSR)",0.12),
        ("Hotel",0.10),("Cloud Kitchen",0.09),("Street Food / Food Stall",0.08),
        ("Fine Dining / Chef's Table",0.07),("Catering",0.06),("Canteen / Institutional",0.05),("Bar & Pub",0.05)]
CHAIN_P={"Quick Service Restaurant (QSR)":0.75,"Hotel":0.55,"Cloud Kitchen":0.45,"Café & Bakery":0.40,
         "Casual Dining Restaurant":0.35,"Canteen / Institutional":0.30,"Bar & Pub":0.25,"Catering":0.20,
         "Fine Dining / Chef's Table":0.12,"Street Food / Food Stall":0.05}
SUF={"Casual Dining Restaurant":["Kitchen","Bistro","Restaurant","Eatery","Grill","Table"],
 "Café & Bakery":["Cafe","Coffee","Bakery","Roasters","Patisserie","Brew House"],
 "Quick Service Restaurant (QSR)":["Express","Quick Bites","Fast Kitchen","To-Go","Snack Bar"],
 "Hotel":["Hotel","Grand Hotel","Resort","Suites","Boutique Hotel"],
 "Cloud Kitchen":["Cloud Kitchen","Virtual Kitchen","Delivery Kitchen","Ghost Kitchen"],
 "Street Food / Food Stall":["Street Food","Food Stall","Soi Eats","Corner Stall"],
 "Fine Dining / Chef's Table":["Fine Dining","Chef's Table","Atelier","Dining Room","Prive"],
 "Catering":["Catering","Catering Co.","Banquet","Events Catering"],
 "Canteen / Institutional":["Canteen","Cafeteria","Staff Canteen","Hospital Kitchen"],
 "Bar & Pub":["Bar","Pub","Tavern","Lounge","Taproom"]}
A=["Baan","Krua","Som Tam","Thip","Charn","Sabai","Ruen","Lay","Mae","Jay","Siam","Bangkok","Golden","Royal","Lotus","Bamboo","Riverside","Sukhumvit","Lanna","Andaman","Nara","Benja","Issaya","Doi","Talay"]
AMS=["Napat Srisai","Praewa Thongchai","Kittisak Wong","Arada Phuwadon","Chayan Rattana","Supaporn Imm","Tanawat Boon","Mali Charoen"]

CAT_DEF={
 "Fresh Vegetables":dict(unit="kg",cost=(18,130),margin=(0.15,0.24),qty=(2,30),pop=2.2,
   names=["Holy Basil","Morning Glory","Chinese Kale","Pak Choi","Tomato","Cucumber","Shallot","Garlic","Coriander","Spring Onion","Long Bean","Thai Eggplant","Cabbage","Carrot","Bean Sprouts"]),
 "Fruits":dict(unit="kg",cost=(25,160),margin=(0.14,0.22),qty=(2,25),pop=1.4,
   names=["Mango Nam Dok Mai","Pineapple","Banana Hom Thong","Papaya","Pomelo","Longan","Watermelon","Guava","Lime","Young Coconut"]),
 "Herbs & Aromatics":dict(unit="kg",cost=(70,320),margin=(0.18,0.28),qty=(1,8),pop=0.9,
   names=["Kaffir Lime Leaves","Thai Basil","Mint","Pandan Leaf","Turmeric","Krachai","Coriander Root","Lemongrass"]),
 "Meat":dict(unit="kg",cost=(90,420),margin=(0.09,0.15),qty=(3,40),pop=1.8,
   names=["Pork Belly","Pork Loin","Minced Pork","Pork Ribs","Chicken Breast","Chicken Whole","Chicken Thigh","Beef Brisket","Beef Striploin","Minced Beef"]),
 "Seafood":dict(unit="kg",cost=(120,420),margin=(0.11,0.17),qty=(2,20),pop=1.1,
   names=["White Shrimp","Sea Bass","Squid","Tilapia","Blue Crab","Green Mussels","Mackerel","Tuna Loin"]),
 "Eggs & Dairy":dict(unit="pack",cost=(28,120),margin=(0.10,0.16),qty=(2,30),pop=1.2,
   names=["Chicken Eggs L","Chicken Eggs M","Duck Eggs","Fresh Milk 1L","Butter","Cheddar Cheese","Whipping Cream","Yogurt"]),
 "Dry Goods & Grocery":dict(unit="bag",cost=(22,220),margin=(0.07,0.13),qty=(3,50),pop=1.5,
   names=["Jasmine Rice 5kg","Rice Noodles","Wheat Flour","White Sugar","Palm Oil","Glass Noodles","Tapioca Starch","Dried Chili","Peanuts","Sticky Rice"]),
 "Seasonings & Sauces":dict(unit="bottle",cost=(18,140),margin=(0.12,0.20),qty=(2,24),pop=0.8,
   names=["Fish Sauce","Oyster Sauce","Light Soy Sauce","Palm Sugar Syrup","Coconut Milk","Chili Paste"]),
 "Frozen":dict(unit="pack",cost=(60,260),margin=(0.12,0.20),qty=(2,20),pop=0.5,
   names=["Frozen Spring Rolls","Frozen Dumplings","Frozen Peeled Shrimp","Frozen Roti"]),
}
PRODUCTS=[]; pid=0
for cat,c in CAT_DEF.items():
    for k in range(16):
        pid+=1; base=c["names"][k%len(c["names"])]
        g=random.choice(["","","Grade A","Premium","Local"]); name=base if g=="" else f"{base} ({g})"
        cost=round(random.uniform(*c["cost"])); price=round(cost/(1-random.uniform(*c["margin"])))
        PRODUCTS.append(dict(sku_id=f"SKU-{pid:04d}",product_name=name,product_category=cat,
            unit=c["unit"],cost=cost,price=price,qty=c["qty"],pop=c["pop"]))
PW=[p["pop"] for p in PRODUCTS]

custs=[]; used=set()
for i in range(1,141):
    ct=wc(HORECA); prov=wc(PROV_PAIRS); w,zone,areas,sf,st=PROV[prov]; city=random.choice(areas)
    chain=random.random()<CHAIN_P[ct]
    while True:
        nm=f"{random.choice(A)} {random.choice(SUF[ct])}"
        if chain and random.random()<0.5: nm+=" Group"
        if chain and random.random()<0.35: nm=f"{nm} ({city} Branch)"
        if nm not in used: used.add(nm); break
    since=rdate(sf,st)
    key= chain or ct=="Hotel" or (ct in ("Catering","Canteen / Institutional") and random.random()<0.5) or random.random()<0.05
    terms=(wc([("Net 30",0.55),("Net 15",0.35),("Net 7",0.10)]) if key else wc([("COD",0.34),("Prepaid",0.20),("Net 7",0.30),("Net 15",0.16)]))
    am=random.choice(AMS) if key or random.random()<0.5 else "Self-serve / Inside Sales"
    custs.append(dict(customer_id=f"CUST-{i:04d}",customer_name=nm,customer_type=ct,
        is_chain=("TRUE" if chain else "FALSE"),is_key_account=("Yes" if key else "No"),
        province=prov,region_zone=zone,city_area=city,customer_since=since.strftime("%Y-%m"),
        is_new_customer=("TRUE" if since>=NEW_CUTOFF else "FALSE"),account_manager=am,payment_terms=terms,
        w=(1.8 if key else 1.0)*random.uniform(0.5,1.6)))
CW=[c["w"] for c in custs]

TARGET=978; rows=[]; oid=0; total=0
while total<TARGET:
    c=random.choices(custs,weights=CW,k=1)[0]
    dow=random.choices(range(7),weights=DOW_W,k=1)[0]; d=WEEK[dow]
    odt=datetime.datetime(d.year,d.month,d.day,random.choices(range(24),weights=HOUR_W,k=1)[0],random.randint(0,59))
    chan=wc([("Mobile App",0.44),("Web",0.20),("Sales Rep",0.20),("LINE",0.16)])
    deliv=wc([("Delivered",0.90),("Cancelled",0.05),("Returned",0.05)])
    terms=c["payment_terms"]
    if deliv=="Cancelled": pay="Cancelled"
    elif deliv=="Returned": pay="Refunded"
    elif terms in ("COD","Prepaid"): pay="Paid"
    else: pay=wc([("Pending",0.82),("Paid",0.18)])
    oid+=1; order_id=f"ORD-{oid:04d}"
    basket=random.choices([1,2,3,4,5,6,7,8,9,10,11,12],weights=[14,16,15,13,11,9,7,6,4,2,2,1],k=1)[0]
    for ln in range(1,basket+1):
        if total>=TARGET: break
        total+=1; p=random.choices(PRODUCTS,weights=PW,k=1)[0]
        q=random.randint(*p["qty"]); up=p["price"]
        if random.random()<0.09: up=round(up*random.uniform(0.88,0.95))
        gross=q*up; disc=round(gross*random.uniform(0.05,0.12)) if random.random()<0.12 else 0
        promo="PROMO"+str(random.choice([5,8,10,12]))+"OFF" if disc else ""
        cogs=q*p["cost"]; net=gross-disc; m=net-cogs
        rows.append(dict(order_id=order_id,line_no=ln,order_datetime=odt.strftime("%Y-%m-%d %H:%M"),
            order_date=d.isoformat(),day_of_week=DOW[dow],customer_id=c["customer_id"],
            customer_name=c["customer_name"],customer_type=c["customer_type"],is_chain=c["is_chain"],
            is_key_account=c["is_key_account"],province=c["province"],region_zone=c["region_zone"],
            city_area=c["city_area"],customer_since=c["customer_since"],is_new_customer=c["is_new_customer"],
            account_manager=c["account_manager"],channel=chan,sku_id=p["sku_id"],product_name=p["product_name"],
            product_category=p["product_category"],unit=p["unit"],quantity=q,unit_price_thb=up,
            gross_revenue_thb=gross,discount_thb=disc,promo_code=promo,cogs_thb=cogs,
            gross_margin_thb=m,gross_margin_pct=round(m/net*100,1) if net else 0,
            payment_terms=terms,payment_status=pay,delivery_status=deliv,
            delivery_date=(d+datetime.timedelta(days=1)).isoformat()))

fields=["order_id","line_no","order_datetime","order_date","day_of_week","customer_id","customer_name",
 "customer_type","is_chain","is_key_account","province","region_zone","city_area","customer_since",
 "is_new_customer","account_manager","channel","sku_id","product_name","product_category","unit",
 "quantity","unit_price_thb","gross_revenue_thb","discount_thb","promo_code","cogs_thb",
 "gross_margin_thb","gross_margin_pct","payment_terms","payment_status","delivery_status","delivery_date"]
with open(f"{OUT}/freshketdanny.csv","w",newline="",encoding="utf-8") as f:
    w=csv.DictWriter(f,fieldnames=fields,lineterminator="\n"); w.writeheader(); [w.writerow(r) for r in rows]

from collections import Counter
oc=Counter(r["order_id"] for r in rows)
once=sum(1 for k,v in oc.items() if v==1); multi=sum(1 for k,v in oc.items() if v>1)
print("line rows:",len(rows),"| distinct orders:",len(oc))
print("orders with 1 line (order_id unique):",once,"| with 2+ lines (order_id repeats):",multi)
print("max lines in one order:",max(oc.values()))
keys=set((r["order_id"],r["line_no"]) for r in rows)
print("(order_id,line_no) unique key:",len(keys)==len(rows))

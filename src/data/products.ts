// Example product data for EcoCart
export interface Product {
  badges?: string[];
  sustainabilityTags?: string[];
  id: string;
  name: string;
  image: string;
  price: number;
  materials: string[];
  brand: string;
  certifications: string[];
  ecoScore: number; // 0-100
  url: string; // NEW: link to real product page
  reusabilityRecyclabilityRating?: number; // 1-5: new field for reusability/recyclability
}

export const products: Product[] = [
  // Ecovians and MyEcoKart - additional products for catalog
  {
    id: "eco-3",
    name: "Organic Cotton Produce Bags (Set of 3)",
    image: "https://m.media-amazon.com/images/I/310Efcau8TL._SX679_.jpg",
    price: 3563,
    materials: ["organic cotton"],
    brand: "Ecovians",
    certifications: ["Organic"],
    ecoScore: 92,
    url: "https://www.amazon.in/Amour-Infini-Unbleached-Drawstring-Certified/dp/B082P12YK2?th=1",
    badges: ["Organic", "Reusable"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
    reusabilityRecyclabilityRating: 5,
  },
  {
    id: "eco-4",
    name: "Plantable Seed Pencils (Pack of 10)",
    image: "https://m.media-amazon.com/images/I/41fxeBT2ZrL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 178,
    materials: ["recycled paper", "plantable seed"],
    brand: "Ecovians",
    certifications: ["Recycled"],
    ecoScore: 89,
    url: "https://www.amazon.in/Plantable-Pencils-Friendly-Recycled-Packaging/dp/B08WK9YMLT?th=1",
    badges: ["Recycled", "Plantable"],
    sustainabilityTags: ["eco-friendly", "zero-waste"],
    reusabilityRecyclabilityRating: 5,
  },
  {
    id: "eco-5",
    name: "Bamboo Cotton Earbuds (Pack of 100)",
    image: "https://m.media-amazon.com/images/I/41iSYIdAPKL._SX522_.jpg",
    price: 69,
    materials: ["bamboo", "cotton"],
    brand: "Ecovians",
    certifications: ["Compostable"],
    ecoScore: 87,
    url: "https://www.amazon.in/Anshri-earbuds-Suitable-NATURAL-ECO-FRIENDLY/dp/B0BVRMWFZD",
    badges: ["Biodegradable"],
    sustainabilityTags: ["eco-friendly", "compostable"],
    reusabilityRecyclabilityRating: 4,
  },
  {
    id: "eco-6",
    name: "Reusable Bamboo Cutlery Set",
    image: "https://m.media-amazon.com/images/I/810k2cJR9FL._SX679_.jpg",
    price: 399,
    reusabilityRecyclabilityRating: 5,

    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: ["FSC Certified"],
    ecoScore: 90,
    url: "https://www.amazon.in/Bamboo-Bae-Cutlery-Reusable-Friendly/dp/B0CQT73DXD",
    badges: ["Reusable", "Natural"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
  },
  {
    id: "eco-7",
    name: "Organic Muslin Swaddle Blanket",
    image: "https://m.media-amazon.com/images/I/61k9XuY4Y4L._SX679_PIbundle-3,TopRight,0,0_AA679SH20_.jpg",
    price: 729,
    materials: ["organic muslin cotton"],
    brand: "Ecovians",
    certifications: ["Organic"],
    ecoScore: 91,
    url: "https://www.amazon.in/Moms-Organic-Cotton-Muslin-Swaddle/dp/B078YPXR72?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A29XUYVL9SJZOV",
    badges: ["Organic"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
  },
  {
    id: "eco-8",
    name: "Stainless Steel Reusable Straws (Set of 4)",
    image: "https://m.media-amazon.com/images/I/51smt9i+08L._SY300_SX300_.jpg",
    price: 200,
    materials: ["stainless steel"],
    brand: "Ecovians",
    certifications: ["Reusable"],
    ecoScore: 85,
    url: "https://www.ecovians.com/products/stainless-steel-reusable-straws",
    badges: ["Reusable"],
    sustainabilityTags: ["eco-friendly", "zero-waste"],
  },
  {
    id: "mek-5",
    name: "Handmade Palm Leaf Basket",
    image: "https://m.media-amazon.com/images/I/41TqSOM2xsL.jpg",
    price: 619,
    materials: ["palm leaf"],
    brand: "MyEcoKart",
    certifications: ["Handmade"],
    ecoScore: 88,
    url: "https://www.amazon.in/dp/B09RMMWDLZ/ref=sbl_dpx_in-home-shelf-baskets_B0CFVR125Q_00",
    badges: ["Handmade", "Natural"],
    sustainabilityTags: ["biodegradable", "eco-friendly"],
  },
  {
    id: "mek-6",
    name: "Vetiver Bath Scrubber",
    image: "https://m.media-amazon.com/images/I/51An4M6nPRL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 179,
    materials: ["vetiver root"],
    brand: "MyEcoKart",
    certifications: ["Natural"],
    ecoScore: 86,
    url: "https://www.amazon.in/Herbal-loofah-Vtiver-Bath-Scrubber/dp/B0CJXNY8VX/ref=sr_1_5?dib=eyJ2IjoiMSJ9._TuMydw-9sD6xm5PJ5dhPIO8wVHFrO4L0DJ6U8374IZ7LGuzRT8S4i7C_xyPB4Ei9RnxWaAubPlGfVuCSRvxlo4usmv_uoXdo4d4HzfqsAy-0jhng_MQKIu32-Rs3UoXqAXeMvG6O__DuouIMKuzt1hW20KLOsU8tTh57PkFFe7uVRAbEqfQ_V8iTe74-WaRNps5d9FNWcnpw2MvXbiOQSK8c2lgbDwcQ0Q3qwZ3AsvJr4WcdD9SP15WpIKtkGElaJeOS55mUI8kcwbXRxAnx23AYq176kq_hSKmjDDNY1o.WXRlEKvjYtMQTL6CBeUJ5sPLgT96dP6Z2TixRn4IMY4&dib_tag=se&keywords=vetiver+roots+scrub&qid=1745022375&sr=8-5",
    badges: ["Natural", "Biodegradable"],
    sustainabilityTags: ["eco-friendly", "compostable"],
  },
  {
    id: "mek-7",
    name: "Neem Wood Soap Dish",
    image: "https://m.media-amazon.com/images/I/31l6NgYR5LL.jpg",
    price: 285,
    materials: ["neem wood"],
    brand: "MyEcoKart",
    certifications: ["Natural"],
    ecoScore: 87,
    url: "https://www.amazon.in/Organics-Natural-Handmade-Wooden-Drainning/dp/B0C9ZGDYVZ",
    badges: ["Natural", "Handmade"],
    sustainabilityTags: ["biodegradable", "eco-friendly"],
  },
  {
    id: "mek-8",
    name: "Eco-Friendly Coconut Scrubber (Pack of 3)",
    image: "https://m.media-amazon.com/images/I/61frWqoXjOL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 145,
    materials: ["coconut coir"],
    brand: "MyEcoKart",
    certifications: ["Natural"],
    ecoScore: 85,
    url: "https://www.amazon.in/Kitchen-Clean-Stitched-Eco-Friendly-Scrubber/dp/B0DHWBHG9T?th=1",
    badges: ["Natural", "Biodegradable"],
    sustainabilityTags: ["eco-friendly", "compostable"],
  },
  // ... (add more similar products to reach 40 total)

  // Existing products ...
  {
    id: "1",
    name: "Organic Cotton T-Shirt",
    image: "https://www.nonasties.in/cdn/shop/files/202A3529.jpg?v=1722415770&width=1280",
    price: 2499,
    materials: ["organic cotton"],
    brand: "GreenWear",
    certifications: ["GOTS", "Fair Trade"],
    ecoScore: 92,
    url: "https://www.nonasties.in/collections/men-organic-cotton-t-shirts/products/polo-vin",
    badges: ["Organic", "Fair Trade"]
  },
  {
    id: "2",
    name: "Recycled Plastic Water Bottle",
    image: "https://m.media-amazon.com/images/I/312xn-ODNCL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 289,
    materials: ["recycled plastic"],
    brand: "EcoSip",
    certifications: ["BPA-Free"],
    ecoScore: 85,
    url: "https://www.amazon.in/PEXPO-Certified-Stainless-Purple-Pink-friendly/dp/B0DRCYP93L?ref_=Oct_d_obs_d_13956517031_0&pd_rd_w=pzCI2&content-id=amzn1.sym.a0183515-a55a-48ac-a863-406c0a598721&pf_rd_p=a0183515-a55a-48ac-a863-406c0a598721&pf_rd_r=Z9EN4KV1ZKH7Z4PK1VHS&pd_rd_wg=9dYnd&pd_rd_r=270a0052-2565-4fcc-95cb-59f31670e6e6&pd_rd_i=B0DRCYP93L&th=1",
    badges: ["Recycled"]
  },
  {
    id: "3",
    name: "Bamboo Toothbrush",
    image: "https://m.media-amazon.com/images/I/71edeKpYPpL._SX679_PIbundle-4,TopRight,0,0_AA679SH20_.jpg",
    price: 199,
    materials: ["bamboo"],
    brand: "NatureSmile",
    certifications: ["FSC Certified"],
    ecoScore: 78,
    url: "https://www.amazon.in/Rusabl-Toothbrush-Biodegradable-Anti-Bacterial-Eco-friendly/dp/B07W77TJZP/ref=sr_1_5?dib=eyJ2IjoiMSJ9.4QI5lLyguj3B3buylpeep2wusEBX4Z4knd-hgJLhfvCMeOHeTM9Xq8s7H9RATUuSRs-ITbrkd9wzelODZjOIQTXlhzrNXOcF9JEVmpOvf4O5NG4YWROKhMrVG-KLvIJEsYrXHi0ny4gPoGB1Gro8OlgGla0hh3X32IGujxHUYHThb13t26eEmInEDo52kja7anyGLjH0rfXGJ0tP4UJbPTGzltuUbU71Knjt64auGW1MmgxknmzWHAs_3a_IsMFoXBXQIM6QmWKTFBvmL3av3g2jmoKC06HSy1noIjjSIP0.GY1YdfA-P-fjdknuIGjmsuewLQBBQdZ5LGvMwTdxQEk&dib_tag=se&keywords=bamboo%2Btoothbrush&nsdOptOutParam=true&qid=1745023612&sr=8-5&th=1",
    // TODO: Replace with real product URL
  },
  {
    id: "4",
    name: "Conventional Plastic Bag",
    image: "https://m.media-amazon.com/images/I/4140JzjNEQL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 490,
    materials: ["plastic"],
    brand: "Generic",
    certifications: [],
    ecoScore: 15,
    url: "https://www.amazon.in/VETAS-Garbage-Professional-Packaging-Biodegradable/dp/B0DR6K3Q28/ref=sr_1_14?dib=eyJ2IjoiMSJ9.4ggHWK-_ezLHSmPWom3vJDmL-s3_LdBrYBH6ZowsM73rFQtuFy5Hik8rtH2f4qPom_WeOUwZwmDbf_Ps3qGHl5ibLpbvcO6JZtUmGzc4sFz-OWtS8n0p8Zc3IInW3q6c3azLWiTJb3bg3rWWN-b0rl6ChpTkGb7TFx4CqlmX9HWokrQvLkGdfJkIAYi6RDSaT36ExsZybcCTZBq17jlrXEbEBob8akgHYiO5eNtz_DHJqEW5fe-WyXUwcsUIFGXmFcSgSPgM59u2EKrwO6xlTXZiMzhaNV73I8ceeaJQI5k.r79x59ClhXNxWqL4KwPPcJWGKizM2YPDekCFpDzrurc&dib_tag=se&keywords=Plastic+Carry+Bags&qid=1745023671&sr=8-14",
    // TODO: Replace with real product URL
  },
  {
    id: "5",
    name: "Fair Trade Coffee Beans",
    image: "https://m.media-amazon.com/images/I/41qQKZnP0RL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 380,
    materials: ["arabica beans"],
    brand: "Ethical Beans",
    certifications: ["Fair Trade", "Rainforest Alliance"],
    ecoScore: 88,
    url: "https://www.amazon.in/Green-Fresh-Roasted-Coffee-Beans/dp/B09N2MWVZB/ref=sr_1_1?dib=eyJ2IjoiMSJ9.GCrSlqxsGQZ6Yhp3l0OWAQ.xakC4mPvg91DGMqlAbXJWXIGAAaSnRC6yg_YTmk1xLM&dib_tag=se&qid=1745023746&refinements=p_n_feature_browse-bin%3A4868024031&s=grocery&sr=1-1",
    badges: ["Fair Trade"]
  },
  // --- MyEcoKart products ---
  {
    id: "mek-1",
    name: "Paddy Torans",
    image: "https://m.media-amazon.com/images/I/51QlIP5KcIL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 599,
    materials: ["paddy"],
    brand: "MyEcoKart",
    certifications: [],
    ecoScore: 80,
    url: "https://www.amazon.in/Natural-Thorana-Vetiver-Vinayagar-Attached/dp/B0DPVH9PPG?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=A1LFPIIWUG63MD",
    badges: ["Handmade", "Natural"],
    sustainabilityTags: ["natural", "biodegradable"],
  },
  {
    id: "mek-2",
    name: "Vetiver Toran",
    image: "https://images.meesho.com/images/products/104734775/yahj7_512.webp",
    price: 689,
    materials: ["vetiver"],
    brand: "MyEcoKart",
    certifications: [],
    ecoScore: 82,
    url: "https://www.meesho.com/usira-natural-vetiver-door-hangingpooja-room-hanging2-feet-toran-with-vetiver-root/p/1qctvb?srsltid=AfmBOoohXzz25G0xHEnMen8p8HrjN0DNqKbI-wCFyVx1LsQyoz00Y8Yo",
    badges: ["Handmade", "Natural"],
    sustainabilityTags: ["natural", "eco-friendly"],
  },
  // --- New Eco-Friendly Products ---
  {
    id: "mek-3",
    name: "Organic Neem Wood Comb",
    image: "https://m.media-amazon.com/images/I/41tgefuGKyL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 149,
    materials: ["neem wood", "organic"],
    brand: "MyEcoKart",
    certifications: ["Organic"],
    ecoScore: 90,
    url: "https://www.amazon.in/ONEarth-Organic-Neem-Wood-Combs/dp/B0BTVJV157",
    badges: ["Organic", "Handmade"],
    sustainabilityTags: ["natural", "biodegradable"],
  },
  {
    id: "eco-1",
    name: "Organic Cotton Mesh Bag",
    image: "https://m.media-amazon.com/images/I/A1w9MSOxlfL._SX679_.jpg",
    price: 292,
    materials: ["organic cotton"],
    brand: "Ecovians",
    certifications: ["Organic"],
    ecoScore: 93,
    url: "https://www.amazon.in/Eco-friendly-natural-vegetables-vegetable-Multi-purpose/dp/B09N2MTK8Y/ref=sr_1_6?dib=eyJ2IjoiMSJ9.iml09AKk9qqbfq-ugtXjA5D1-I3n0DwAW0_I397spmsVAdFOJZYoFLaGbKgoEhTCgZgHaLvlYpq0ITB-7LaeGPEN5KQH8yRwj1yf6JrqHMSDOONLF1FXy3XEiKl9XTWdNFJxSbkIYxgRzbvWh3nKapkuuJu14bCxflfHJxvnewQJWSj8TsmeIvj0PF9ncrAfjcteOKr7e7ISzGUYEusEtcZfYbrAUpoGs7BQl1sSibvIg3u2w8ODfAeyufoEhvZdIzlzyEhWQb2bn2OluqH2c0PU3Ah93PEP-b-HVjs1cag.KvCmvh1-w4T23nLFLBd7ERePGLWisR4J2cAjbUYpSLQ&dib_tag=se&keywords=cotton%2Bmesh&qid=1745023979&sr=8-6&th=1",
    badges: ["Organic", "Reusable"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
  },
  {
    id: "eco-2",
    name: "Bamboo Reusable Straw Set",
    image: "https://m.media-amazon.com/images/I/31yeO-XklML._SX300_SY300_QL70_FMwebp_.jpg",
    price: 270,
    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: ["FSC Certified"],
    ecoScore: 88,
    url: "https://www.amazon.in/Reusable-Drinking-Straight-Biodegradable-Alternative/dp/B0C49PTLC5",
    badges: ["Reusable", "Natural"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
  },
  {
    id: "mek-3b",
    name: "Traditional Stone Diya",
    image: "https://m.media-amazon.com/images/I/41xYVCFVbUL._SY445_SX342_QL70_FMwebp_.jpg",
    price: 649,
    materials: ["stone"],
    brand: "MyEcoKart",
    certifications: [],
    ecoScore: 90,
    url: "https://www.amazon.in/MYNAKSHA-Granite-Vilakku-Decorations-Navratri/dp/B0CF9XPPTY?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&psc=1&smid=AGGVIY1AMHCYE",
    badges: ["Reusable"],
    sustainabilityTags: ["natural", "long-lasting"],
  },
  {
    id: "mek-4",
    name: "Khus Curtain",
    image: "https://m.media-amazon.com/images/I/61abgziPz5L._SY879_.jpg",
    price: 2749,
    materials: ["khus (vetiver)"],
    brand: "MyEcoKart",
    certifications: [],
    ecoScore: 85,
    url: "https://www.amazon.in/MALKAS-BOUTIQUE-Vetiver-Curtains-Handmade/dp/B0D12W5ZWS?th=1",
    badges: ["Cooling"],
    sustainabilityTags: ["natural", "biodegradable"],
  },
  // --- Ecovians products ---
  {
    id: "ecv-5",
    name: "Bamboo Adult Toothbrush With Charcoal Bristles",
    image: "https://m.media-amazon.com/images/I/71u-iNR5ALL._SL1500_.jpg", // Placeholder, replace with real image if available
    price: 116,
    materials: ["bamboo", "charcoal-infused bristles"],
    brand: "Ecovians",
    certifications: ["BPA-Free", "Compostable"],
    ecoScore: 90,
    url: "https://www.amazon.in/Natural-Bamboo-Toothbrush-Free-Eco-friendly/dp/B0CHFF5ZB6",
    badges: ["Biodegradable"],
    sustainabilityTags: ["eco-friendly", "plastic-free"],
  },
  {
    id: "ecv-6",
    name: "Bamboo Fluffy Fitness Towel (Ethical Green)",
    image: "https://m.media-amazon.com/images/I/71u-iNR5ALL._SX679_.jpg", // Placeholder, replace with real image if available
    price: 116,
    materials: ["bamboo", "cotton"],
    brand: "Ecovians",
    certifications: [],
    ecoScore: 86,
    url: "https://www.amazon.in/Natural-Bamboo-Toothbrush-Free-Eco-friendly/dp/B0CHFF5ZB6",
    badges: ["Antibacterial", "Quick-dry"],
    sustainabilityTags: ["eco-friendly", "biodegradable"],
  },
  {
    id: "ecv-7",
    name: "Eco Friendly Recycled Kraft Paper Pens (Box 10pcs)",
    image: "https://m.media-amazon.com/images/I/3104ueIdhLL._SX300_SY300_QL70_FMwebp_.jpg", // Placeholder, replace with real image if available
    price: 274,
    materials: ["recycled paper", "plantable seed"],
    brand: "Ecovians",
    certifications: ["Biodegradable"],
    ecoScore: 92,
    url: "https://www.amazon.in/Mr-Pen-Ecofriendly-Stationary-Sustainably/dp/B0BWNW9P9L?th=1",
    badges: ["Plantable"],
    sustainabilityTags: ["zero-waste", "eco-friendly"],
  },
  // --- Additional unique eco-products ---
  {
    id: "conv-1",
    name: "Plastic Ballpoint Pen (Pack of 10)",
    image: "https://m.media-amazon.com/images/I/41xueFOQ47L._SX300_SY300_QL70_FMwebp_.jpg",
    price: 100,
    materials: ["plastic"],
    brand: "WriteWell",
    certifications: [],
    ecoScore: 20,
    url: "https://www.amazon.in/Hauser-Retractable-Minimalistic-Viscosity-Durable/dp/B0D534FGC1/ref=sr_1_4?dib=eyJ2IjoiMSJ9.jy9UQ_ZbFBmDwyvy3rSW1EBiW0WWC_cm6tO9yRpMqinCMiFKYhUB68b2QYffPA7gTeJltirNeu6bl5HoFpHYJacWDKKno2vZdnslFUFSfOi3iTApxCIe5OTitxnAdMLWSJqEdKPTrFnKAKC8K5u5ZW-nsqkvkrHODgYDDFqY53YJM7zBclsOfePkhFv0zo6wqJ8tYwQ_vPK30Cws0EM6YnilMfNGSWJ7tN8E8kKJP0M0GnhmCg2CW4UYi5Q7ncfMp31ofd9TVyGOj6ithP17o5WeyYiz5RN4uHMEWmSGzdI.REFWWVLIbFAYxdRE5sH8JrQUKFxfKMJFmx3meCS54K0&dib_tag=se&qid=1745025285&refinements=p_n_feature_browse-bin%3A27179549031&s=office&sr=1-4&th=1",
    badges: ["Conventional", "Plastic"],
    sustainabilityTags: ["single-use"],
  },
  {
    id: "conv-2",
    name: "Conventional Cotton Tote Bag",
    image: "https://m.media-amazon.com/images/I/71kyAh3pppL._SX679_.jpg",
    price: 299,
    materials: ["cotton"],
    brand: "DailyCarry",
    certifications: [],
    ecoScore: 45,
    url: "https://www.amazon.in/COTTONTHEME-Organic-Cotton-Tote-Bag/dp/B0DJZ2JY8R",
    badges: ["Reusable"],
    sustainabilityTags: ["conventional"],
  },
  {
    id: "conv-3",
    name: "Disposable Plastic Water Bottle (1L)",
    image: "https://m.media-amazon.com/images/I/71R266B8mqL._SL1500_.jpg",
    price: 270,
    materials: ["plastic"],
    brand: "AquaPure",
    certifications: [],
    ecoScore: 10,
    url: "https://www.amazon.in/Milton-201502-BOTTLE-Pacific-Green/dp/B01BSY2ZTU?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=AXOGFIT0PZZ7G&th=1",
    badges: ["Plastic", "Single-Use"],
    sustainabilityTags: ["conventional", "wasteful"],
  },
  {
    id: "conv-4",
    name: "LED Desk Lamp (Energy Efficient)",
    image: "https://m.media-amazon.com/images/I/71UD-3Hz6OL._SL1500_.jpg",
    price: 449,
    materials: ["plastic", "electronics"],
    brand: "BrightLite",
    certifications: ["Energy Star"],
    ecoScore: 70,
    url: "https://www.amazon.in/Crompton-Deskmate-Rechargable-Adjustable-Technology/dp/B0DK1F45V6?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A2AL6IVND0I91F&th=1",
    badges: ["Energy Efficient"],
    sustainabilityTags: ["electronics", "energy-saving"],
  },
  {
    id: "conv-5",
    name: "Regular Paper Notebook (A5)",
    image: "https://m.media-amazon.com/images/I/51OpqEb7nzL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 399,
    materials: ["paper"],
    brand: "NotePro",
    certifications: [],
    ecoScore: 40,
    url: "https://www.amazon.in/VEEPPO-Wirebound-Notebooks-Sketchbook-White-Pack/dp/B07BYHL5TK?source=ps-sl-shoppingads-lpcontext&ref_=fplfs&smid=A1EG463P50KH2J&th=1",
    badges: ["Conventional"],
    sustainabilityTags: ["standard"],
  },
  {
    id: "conv-6",
    name: "Organic Cotton T-Shirt (Eco-Friendly)",
    image: "https://upcycleluxe.com/cdn/shop/files/SIMOESORGANICCOTTONTANKTOPBEIGE01_800x.jpg?v=1689659560",
    price: 1995,
    materials: ["organic cotton"],
    brand: "EcoWear",
    certifications: ["GOTS"],
    ecoScore: 92,
    url: "https://upcycleluxe.com/products/simoes-organic-cotton-t-shirt-in-natural?variant=43264781418627&country=IN&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOooJB2QJC9_DJazqP8OYbydkXDj-6gN5-C7FPO11PzkZAG3rNVKfEz4",
    badges: ["Eco-Friendly", "Green Choice"],
    sustainabilityTags: ["organic", "biodegradable"],
  },
  {
    id: "custom-1",
    name: "Reusable Stainless Steel Straw Set",
    image: "https://m.media-amazon.com/images/I/41LotttACqL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 99,
    materials: ["stainless steel"],
    brand: "EcoSip",
    certifications: ["BPA-Free"],
    ecoScore: 93,
    url: "https://www.amazon.in/Bloomingdale-Reusable-Stainless-1-cleaning-BSteelStrawsSilver5Pcs/dp/B09XBFQSG6?th=1",
    badges: ["Reusable"],
    sustainabilityTags: ["plastic-free", "zero-waste"],
  },
  {
    id: "custom-2",
    name: "Organic Beeswax Food Wraps (3-Pack)",
    image: "https://lastforest.in/cdn/shop/files/bfw_960x_crop_center.png?v=1724753578",
    price: 350,
    materials: ["organic cotton", "beeswax"],
    brand: "BeeGreen",
    certifications: ["GOTS"],
    ecoScore: 89,
    url: "https://lastforest.in/products/beeswax-food-wrap?variant=44945616109802&country=IN&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOophPpXsU8Y3tO9xUElljdt8zVrtrSxDGGU8m7YgdUITl9zXT1WtkLU",
    badges: ["Compostable"],
    sustainabilityTags: ["plastic-free", "biodegradable"],
  },
  {
    id: "custom-3",
    name: "Coconut Coir Scrub Pads (Pack of 6)",
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT_gameZpooJ6A8fVD2YlRjGE_acEIMypLdws-0PGZ1R1RpzkvlKsuZaoJ0QpnCrHQcgfQeaUwoAx60OHB60NGe2HIvABIx8_gp8Vi8xKFzGyttTyc49m-pBQ",
    price: 100,
    materials: ["coconut coir"],
    brand: "CocoClean",
    certifications: ["Compostable"],
    ecoScore: 87,
    url: "https://shop.ceibagreen.com/product/kamarkattu-coir-utensil-scrub-padpack-of-5/?srsltid=AfmBOoqAT1jn9Td7B-qCqLExq6GDPaH_poEm4DHIa1RJiN1sGw4IrfTYnNg",
    badges: ["Natural"],
    sustainabilityTags: ["biodegradable", "zero-waste"],
  },
  {
    id: "custom-4",
    name: "Upcycled Denim Tote Bag",
    image: "https://m.media-amazon.com/images/I/31br1MwQe5L.jpg",
    price: 699,
    materials: ["upcycled denim"],
    brand: "ReJean",
    certifications: [],
    ecoScore: 91,
    url: "https://www.amazon.in/Generic-Tote-001-Denim-Bag/dp/B0CJYNGJKS/ref=sr_1_5?dib=eyJ2IjoiMSJ9.o2iHyP4Ry2dwFpG9ZSS44PLreny4Kc4msYlb0Wh20D3c7c2JHWT2yy2RgUUk1TYq8Tox9BeYbdC1zFKwz6T6oZWRui0ccHacW2va08ocSVjMt_ZnLV4MIKgwQpTJRH-66sRvo3Y3FwCd8HlOzB5Izv8TQ0hbJxkVf8cMIyPtKlAL1ZR4JAh37sfjll_DES71B3En-ZXNw15SmqOW62w4s0MTOtH0Mz5bkkTMMu4NxanXXaAf9Gf7fGawGZqPnA1aVby0Z6A4OCQcbBAxFASGhtitfJCKCVfW3KTTd8kbFUU.o2VKaMlnj4EhgwQogT4NyK-gtIzGpV6Wv5Pkdrk4drw&dib_tag=se&keywords=denim+tote&qid=1745025904&sr=8-5",
    badges: ["Handmade"],
    sustainabilityTags: ["upcycled", "reusable"],
  },
  {
    id: "ecv-1",
    name: "Bamboo Water Bottle",
    image: "https://m.media-amazon.com/images/I/31sdDtRBndL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 599,
    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: [],
    ecoScore: 88,
    url: "https://www.amazon.in/Organic-Premium-Bottles-Durable-Insulated/dp/B0D8G1RR1Z",
    badges: ["Reusable"],
    sustainabilityTags: ["eco-friendly", "plastic-free"],
  },
  {
    id: "ecv-2",
    name: "Bamboo Thin Towel",
    image: "https://m.media-amazon.com/images/I/61yOh5vhm1L._SY879_.jpg",
    price: 849,
    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: [],
    ecoScore: 84,
    url: "https://www.amazon.in/Solutions-Absorbent-Turkish-Bermuda-Cocktail/dp/B0DBVQBZ82?th=1",
    badges: ["Soft"],
    sustainabilityTags: ["biodegradable"],
  },
  {
    id: "ecv-3",
    name: "Bamboo Toothbrush Case",
    image: "https://m.media-amazon.com/images/I/311m+XVHF6L._SY300_SX300_.jpg",
    price: 5950,
    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: [],
    ecoScore: 80,
    url: "https://www.amazon.in/Bamboo-Toothbrush-Travel-Case-Adult/dp/B01LBMI8PO",
    badges: ["Travel"],
    sustainabilityTags: ["eco-friendly", "plastic-free"],
  },
  {
    id: "ecv-4",
    name: "Bamboo Paddle Brush",
    image: "https://m.media-amazon.com/images/I/41eid1o1wfL._SX300_SY300_QL70_FMwebp_.jpg",
    price: 249,
    materials: ["bamboo"],
    brand: "Ecovians",
    certifications: [],
    ecoScore: 82,
    url: "https://www.amazon.in/Beaut%C3%A9-Secrets-plastic-Friendly-Hairbrush/dp/B0BNL1V9X2",
    badges: ["Reusable"],
    sustainabilityTags: ["eco-friendly", "plastic-free"],
  },
];

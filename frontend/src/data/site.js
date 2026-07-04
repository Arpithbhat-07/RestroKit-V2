// Central config — change values here to update the whole site.
export const site = {
  name: "VANAS",
  tagline: "Authentic Coastal Cuisine",
  logo: "/images/logo.jpg",
  hero: {
    kicker: "Est. 2019 — Mangalore",
    title: "Taste the Tradition of Mangalorean Cuisine",
    titleAlt: "Savor the Flavors of Coastal India",
    subtitle:
      "Serving Mangalore’s finest Authentic delicacies",
    image:
      "/images/hero.jpg",
  },
  about: {
    heading: "Bringing Mangalore's Culinary Heritage to Your Table",
    paragraph:
      "Experience the true taste of the coast with recipes inspired by generations of Mangalorean tradition. From freshly caught seafood to signature vegetarian delicacies, every meal celebrates the authentic flavours of our heritage.",
    bullets: ["Fresh Food", "Family Friendly", "Affordable", "Hygienic Kitchen"],
    stats: [
      { value: 15, suffix: "+", label: "Years" },
      { value: 50, suffix: "+", label: "Dishes" },
      { value: 10, suffix: "k+", label: "Happy Guests" },
    ],
    images: [
      "/images/interior.jpg",
      "/images/exterior.jpg",
    ],
  },

  chef: {
    name: "Chef Arjun Malhotra",
    experience: "22 years of culinary craft",
    story:
      "Trained across Delhi, London and Copenhagen, Chef Arjun brings the memory of his grandmother's kitchen into every dish — smoky, generous, precise.",
    image:
      "https://images.unsplash.com/photo-1759521296144-fe6f2d2dc769?crop=entropy&cs=srgb&fm=jpg&q=85&w=900",
  },
  offer: {
    title: "20% OFF",
    subtitle: "Every Friday Night",
    description:
      "Bring your circle. Weekend feasts, live tabla, and a curated tasting menu — 6PM to 11PM.",
  },

  whyChoose: [
    { icon: "Fish", title: "Authentic Coastal Cuisine", desc: "Traditional Mangalorean recipes prepared with regional spices."},
    { icon: "Flame", title: "Traditional Flavours", desc: "Classic Mangalorean recipes rich in spices and coastal heritage."},
    { icon: "BadgeIndianRupee", title: "Affordable Prices", desc: "Enjoy authentic coastal dishes without stretching your budget."},
    { icon: "ShieldCheck", title: "Quality & Hygiene", desc: "Maintaining cleanliness and quality in every meal we serve."},
    { icon: "Clock3", title: "Freshly Prepared", desc: "Every dish is cooked fresh after you order."},
    { icon: "Users", title: "Family Atmosphere", desc: "Perfect for family meals, celebrations, and casual dining."},
  ],
  menuCategories: ["Starters", "Seafood", "Thali", "Biryani", "Currys", "Rice & Noodles"],
  menu: [
    { cat: "Starters", diet: "veg", name: "Tandoori", core: "Broccoli/Baby corn", desc: "Chargrilled broccoli, hung curd, black salt.", price: 340, img: "/images/menu/veg/tandoori.jpg" },
    { cat: "Starters", diet: "veg", name: "Sizzlling Chilli", core: "Paneer/Mushroom/Babycorn/Gobi", desc: "Sizzled paneer tossed with peppers, scallions, and sticky chili glaze.", price: 380, img: "/images/menu/veg/sizzlingchilli.jpg" },
    { cat: "Starters", diet: "veg", name: "Ghee Roast", core: "Paneer/Mushroom/Babycorn", desc: "A South Indian classic roasted in aromatic ghee with a rich, spicy, and flavorful masala.", price: 360, img: "/images/menu/veg/gheeroast.jpg" },
    { cat: "Starters", diet: "veg", name: "Green Roast", core: "Paneer/Mushroom/Babycorn", desc: "Roasted in a vibrant green herb masala with fresh coriander, mint, and aromatic spices.", price: 340, img: "/images/menu/veg/greenroast.jpg" },
    { cat: "Starters", diet: "nonveg", name: "Ghee Roast", core: "Chicken/Mutton", desc: "A South Indian classic roasted in aromatic ghee with a rich, spicy, and flavorful masala.", price: 380, img: "/images/menu/nonveg/gheeroast.jpg" },
    { cat: "Starters", diet: "nonveg", name: "Sukka", core: "Chicken/Mutton", desc: "A delightfully wholesome and delectable chicken starter braised in spiced coconut.", price: 398, img: "/images/menu/nonveg/sukka.jpg" },
    { cat: "Starters", diet: "nonveg", name: "Andhra Chilly Chicken", core: "Chicken/Mutton", desc: "A flavorful and tantalizing chicken starter from Andhra Pradesh, known for its bold, fiery spices.", price: 391, img: "/images/menu/nonveg/andhrachilly.jpg" },
    { cat: "Starters", diet: "nonveg", name: "Chicken Urwal", core: "Chicken/Mutton", desc: "Fiery red, tangy and spicy chicken dry roasted in ground paste of dried red chilies and other spices.", price: 403, img: "/images/menu/nonveg/urwal.jpg" },

    { cat: "Seafood", diet: "nonveg", name: "Tawa Fry", core: "Anjal/Mackerel/Prawns", desc: "Crispy fried mackerel marinated in a blend of spices, perfect for seafood lovers.", price: 299, img: "/images/menu/nonveg/tawa.jpg" },
    { cat: "Seafood", diet: "nonveg", name: "Rawa Fry", core: "Anjal/Prawns/Mackerel", desc: "Tender kingfish fillets fried to perfection with a crispy coating and aromatic spices.", price: 499, img: "/images/menu/nonveg/rawa.jpg" },
    { cat: "Seafood", diet: "nonveg", name: "Masala Fry", core: "Anjal/Prawns/Mackerel", desc: "Succulent prawns cooked in a rich and flavorful masala sauce, perfect for seafood enthusiasts.", price: 599, img: "/images/menu/nonveg/masala.jpg" },
    { cat: "Seafood", diet: "nonveg", name: "Ghee Roast", core: "Anjal/Prawns/Crab/Squid", desc: "Fresh crab cooked in a spicy and tangy curry, a coastal delicacy that will tantalize your taste buds.", price: 699, img: "/images/menu/nonveg/fgheeroast.jpg" },
    
    { cat: "Thali", diet: "veg", name: "Vegetarian Thali", core: "Veg", desc: "A wholesome and satisfying meal featuring a variety of traditional vegetarian dishes.", price: 499, img: "/images/menu/veg/fullthali.jpg" },
    { cat: "Thali", diet: "veg", name: "Mini Vegetarian Thali", core: "Veg", desc: "A wholesome and satisfying meal featuring a variety of traditional vegetarian dishes.", price: 299, img: "/images/menu/veg/minithali.jpg" },
    { cat: "Thali", diet: "nonveg", name: "Non-Vegetarian Thali", core: "Chicken/Mutton", desc: "A hearty and flavorful meal featuring a selection of traditional non-vegetarian dishes.", price: 699, img: "/images/menu/nonveg/thali.jpg" },
    { cat: "Thali", diet: "nonveg", name: "Seafood Thali", core: "Anjal/Prawns/Crab/Mackerel", desc: "A hearty and flavorful meal featuring a selection of traditional non-vegetarian dishes.", price: 499, img: "/images/menu/nonveg/fthali.jpg" },

    { cat: "Biryani", diet: "veg", name: "Dum Biryani", core: "Mix Veg/Paneer/Mushroom", desc: "Flavorful rice with mixed vegetables and aromatic spices.", price: 420, img: "/images/menu/veg/dumbiryani.jpg" },
    { cat: "Biryani", diet: "veg", name: "Hyderabadi Biryani", core: "Mix Veg/Paneer/Mushroom", desc: "Flavorful rice with mixed vegetables and aromatic spices.", price: 420, img: "/images/menu/veg/hydbiryani.jpg" },
    { cat: "Biryani", diet: "veg", name: "Malwani Biryani", core: "Mix Veg/Paneer/Mushroom", desc: "Flavorful rice with mixed vegetables and aromatic spices.", price: 420, img: "/images/menu/veg/malbiryani.jpg" },
    { cat: "Biryani", diet: "nonveg", name: "Dum Biryani", core: "Egg/Chicken/Mutton", desc: "Fragrant basmati rice, slow-cooked meat, saffron.", price: 580, img: "/images/menu/nonveg/dumbiryani.jpg" },
    { cat: "Biryani", diet: "nonveg", name: "Hyderabadi Biryani", core: "Egg/Chicken/Mutton", desc: "Flavorful rice with mixed vegetables and aromatic spices.", price: 420, img: "/images/menu/nonveg/hydbiryani.jpg" },
    { cat: "Biryani", diet: "nonveg", name: "Malwani Biryani", core: "Egg/Chicken/Mutton", desc: "Flavorful rice with mixed vegetables and aromatic spices.", price: 420, img: "/images/menu/nonveg/malbiryani.jpg" },
   
    { cat: "Currys", diet: "nonveg", name: "Egg Curry", core: "Egg", desc: "A flavorsome and aromatic blend of ingredients that creates a delectable egg curry.", price: 127, img: "/images/menu/nonveg/eggcurry.jpg" },
    { cat: "Currys", diet: "nonveg", name: "Bangude Curry", core: "Mackerel", desc: "Mackerel fish curry cooked with bold tamarind and creamy coconut flavors.", price: 219, img: "/images/menu/nonveg/bangudecurry.jpg" },
    { cat: "Currys", diet: "nonveg", name: "Anjal Curry", core: "Kingfish", desc: "A delectable curry made with tender Anjal fish, bursting with rich flavors and a tantalizing aroma.", price: 529, img: "/images/menu/nonveg/anjalcurry.jpg" },
    { cat: "Currys", diet: "nonveg", name: "Chicken Curry", core: "Chicken", desc: "Chicken pieces marinated and simmered in coconut-based gravy for a fragrant seafood-inspired delicacy.", price: 207, img: "/images/menu/nonveg/chickencurry.jpg" },

    { cat: "Rice & Noodles", diet: "veg", name: "Classic Fried Rice", core: "Mix Veg/Paneer/Mushroom", desc: "A classic fried rice dish with a medley of fresh vegetables and aromatic spices.", price: 199, img: "/images/menu/veg/classicfriedrice.jpg" },
    { cat: "Rice & Noodles", diet: "veg", name: "Shezwan Fried Rice", core: "Mix Veg/Paneer/Mushroom", desc: "A classic fried rice dish with a medley of fresh vegetables and aromatic spices.", price: 199, img: "/images/menu/veg/schezwanfriedrice.jpg" },
    { cat: "Rice & Noodles", diet: "veg", name: "Hakka Noodles", core: "Mix Veg/Paneer", desc: "A classic fried rice dish with a medley of fresh vegetables and aromatic spices.", price: 199, img: "/images/menu/veg/hakkanoodles.jpg" },
    { cat: "Rice & Noodles", diet: "nonveg", name: "Classic Fried Rice", core: "Egg/Chicken", desc: "A classic fried rice dish with a medley of fresh vegetables and aromatic spices.", price: 199, img: "/images/menu/nonveg/classicfriedrice.jpg" },
    { cat: "Rice & Noodles", diet: "nonveg", name: "Shezwan Fried Rice", core: "Egg/Chicken", desc: "A flavorful fried rice dish with tender chicken pieces and a blend of spices.", price: 249, img: "/images/menu/nonveg/schezwanfriedrice.jpg" },
    { cat: "Rice & Noodles", diet: "nonveg", name: "Hakka Noodles", core: "Egg/Chicken", desc: "A classic Hakka noodle dish with tender chicken pieces and a medley of fresh vegetables.", price: 249, img: "/images/menu/nonveg/hakkanoodles.jpg" },
  ],
  gallery: [
    "/images/gallery/image1.jpg",
    "/images/gallery/image2.jpg",
    "/images/gallery/image3.jpg",
    "/images/gallery/image4.jpg",
    "/images/gallery/image5.jpg",
    "/images/gallery/image6.jpg",
    "/images/gallery/image7.jpg",
    "/images/gallery/image8.jpg",
    "/images/gallery/image9.jpg",
  ],
  Reviews: [
    { name: "The Powerhouse", rating: 5, review: "The Lemon Chicken was the standout dish during my visit. If you're here, it's definitely something you shouldn't miss.", img: "/images/Reviews/powerhouse.jpg" },
    { name: "Anvitha Acharya", rating: 5, review: "Loved the Seafood Thali experience, especially being able to taste a variety of authentic coastal dishes served together.", img: "/images/Reviews/anvitha.jpg" },
    { name: "Saheer Hejmadi", rating: 5, review: "A wonderful experience with authentic coastal cuisine. Every dish was full of flavour, making it a memorable meal from start to finish.", img: "/images/Reviews/saheer.jpg" },
    { name: "Padmini V Shenoy", rating: 5, review: "The Fish Tawa Fry was absolutely delicious—fresh, perfectly spiced, and cooked just right. One of the highlights of our meal!.", img: "/images/Reviews/padmini.jpg" },
  ],
  contact: {
    address: "Next to Tejaswini Hospital, Kadri, Mangaluru, Karnataka 575003",
    phone: "+91 96867 60009",
    /*email: "vanasmng@gmail.com",*/
    whatsapp: "+919686760009",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.622708946022!2d74.85175853958039!3d12.881228193582968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35be519332b91%3A0x5d4f4e6b9beb29fd!2sVanas!5e0!3m2!1sen!2sin!4v1782934059877!5m2!1sen!2sin",
    hours: [
      { day: "Monday – Friday", time: "12:00 PM – 03:00 PM , 07:00 PM – 10:30 PM" },
      { day: "Saturday – Sunday", time: "12:00 PM – 03:30 PM , 07:00 PM – 11:00 PM" },
    ],
    social: {
      instagram: "https://www.instagram.com/vanas_mangaluru/?hl=en",
      facebook: "https://www.facebook.com/vanas.mangalore/",
      whatsapp: "https://wa.me/919686760009",
    },
  },
};

export default site;

// Choco.olicious26 Data Configuration & Seed Storage

const CHOCO_CONFIG = {
  brandName: "Choco.olicious26",
  tagline: "Handcrafted Pure Cocoa Delights • Made with Love",
  whatsappNumber: "9754881990",
  whatsappFormatted: "+91 97548 81990",
  instagramHandle: "choc.olicious26",
  instagramUrl: "https://www.instagram.com/choc.olicious26/",
  currency: "₹",
  location: "Homemade with Care in India",
  adminPin: "2026" // Simple pin to open Owner Dashboard
};

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Luxury Hazelnut Rocher Truffles (Box of 12)",
    category: "truffles",
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 38,
    badge: "Bestseller",
    eggless: true,
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600",
    description: "Rich dark chocolate shell filled with roasted whole hazelnuts and creamy hazelnut ganache, finished with gold shimmer."
  },
  {
    id: "prod-2",
    name: "Signature Dark Almond Crunch Bar (100g)",
    category: "bars",
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviewsCount: 29,
    badge: "Pure 70% Cocoa",
    eggless: true,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=600",
    description: "Single-origin 70% dark chocolate bar studded with slow-roasted caramel almonds and sea salt flakes."
  },
  {
    id: "prod-3",
    name: "Royale Grand Gift Hamper Box",
    category: "hampers",
    price: 1199,
    originalPrice: 1499,
    rating: 5.0,
    reviewsCount: 52,
    badge: "Trending Gift",
    eggless: true,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=600",
    description: "An opulent gift hamper box containing 16 handcrafted truffles, 2 artisan bars, and a customized greeting message card."
  },
  {
    id: "prod-4",
    name: "Artisan Belgian Dark & Milk Assortment",
    category: "truffles",
    price: 399,
    originalPrice: 499,
    rating: 4.7,
    reviewsCount: 22,
    badge: "Must Try",
    eggless: true,
    image: "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?auto=format&fit=crop&q=80&w=600",
    description: "Assorted melt-in-mouth milk chocolate and dark chocolate bonbons with assorted berry and caramel fillings."
  },
  {
    id: "prod-5",
    name: "Keto Sugar-Free Dark Cocoa Cubes (150g)",
    category: "sugarfree",
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewsCount: 17,
    badge: "Zero Guilt",
    eggless: true,
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600",
    description: "100% sugar-free dark chocolate bites sweetened naturally with Stevia. Perfect for health conscious chocolate lovers."
  },
  {
    id: "prod-6",
    name: "Custom Birthday & Anniversary Box",
    category: "hampers",
    price: 799,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 44,
    badge: "Custom Name",
    eggless: true,
    image: "https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=600",
    description: "Personalized chocolate box with chocolate letters spelling out recipient's name or wishes, surrounded by delicious truffles."
  }
];

const INITIAL_ACTIVITIES = [
  {
    id: "act-1",
    date: "Today",
    time: "10:30 AM",
    title: "✨ Today's Fresh Batch of Hazelnut Rochers Ready!",
    description: "Melted Belgian cocoa infused with freshly roasted hazelnuts. Packed fresh for today's orders!",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600",
    likes: 42,
    tag: "Fresh Batch"
  },
  {
    id: "act-2",
    date: "Yesterday",
    time: "4:15 PM",
    title: "🎁 Custom Birthday Hamper Dispatch for Neha!",
    description: "Gold foiled box filled with dark pralines and personalized chocolate letters. Packed with lots of warmth!",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=600",
    likes: 68,
    tag: "Customer Dispatch"
  },
  {
    id: "act-3",
    date: "2 Days Ago",
    time: "11:00 AM",
    title: "🍫 Tempering 70% Single Origin Cocoa",
    description: "Achieving the perfect snap and glossy finish for our signature dark chocolate almond bars.",
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=600",
    likes: 55,
    tag: "Behind The Scenes"
  }
];

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Priya Sharma",
    location: "Bhopal",
    stars: 5,
    date: "Yesterday",
    comment: "Choco.olicious26 ke chocolates sachme bhut amazing hain! Mene hazelnut truffles order kiye the, taste is pure Belgian bakery level! Highly recommended.",
    verified: true
  },
  {
    id: "rev-2",
    name: "Rohan Verma",
    location: "Indore",
    stars: 5,
    date: "3 days ago",
    comment: "Ordered a customized gift hamper for my sister's birthday via WhatsApp. Packaging bohot luxury thi aur WhatsApp par owner ka response bohot quick tha!",
    verified: true
  },
  {
    id: "rev-3",
    name: "Ananya Patel",
    location: "Mumbai",
    stars: 5,
    date: "1 week ago",
    comment: "Zero sugar chocolate bites are a lifesaver for my diet. Pure cocoa flavor without any weird artificial taste. Loved it!",
    verified: true
  }
];

const INITIAL_SHOWCASE_CATEGORIES = [
  // Cake Categories
  { id: "birthday-cakes", group: "Cakes", name: "Birthday Cakes" },
  { id: "anniversary-cakes", group: "Cakes", name: "Anniversary Cakes" },
  { id: "wedding-cakes", group: "Cakes", name: "Wedding Cakes" },
  { id: "theme-cakes", group: "Cakes", name: "Theme Cakes" },
  { id: "kids-cakes", group: "Cakes", name: "Kids Cakes" },
  { id: "photo-cakes", group: "Cakes", name: "Photo Cakes" },
  { id: "chocolate-cakes", group: "Cakes", name: "Chocolate Cakes" },
  { id: "eggless-cakes", group: "Cakes", name: "Eggless Cakes" },
  // Chocolate Boutique Categories
  { id: "gulkand-chocolates", group: "Boutique Chocolates", name: "Gulkand Chocolates" },
  { id: "dry-fruit-chocolates", group: "Boutique Chocolates", name: "Dry Fruit Chocolates" },
  { id: "almond-chocolates", group: "Boutique Chocolates", name: "Almond Chocolates" },
  { id: "cashew-chocolates", group: "Boutique Chocolates", name: "Cashew Chocolates" },
  { id: "pistachio-chocolates", group: "Boutique Chocolates", name: "Pistachio Chocolates" },
  { id: "tutti-frutti-chocolates", group: "Boutique Chocolates", name: "Tutti Frutti Chocolates" },
  { id: "truffle-chocolates", group: "Boutique Chocolates", name: "Truffle Chocolates" },
  { id: "gift-boxes", group: "Boutique Chocolates", name: "Customized Gift Boxes" }
];

const INITIAL_SHOWCASE_GALLERY = [
  {
    id: "showcase-1",
    title: "🍰 Two-Tier Princess Birthday Cake",
    category: "kids-cakes",
    description: "A gorgeous pink designer princess birthday cake with handcrafted crown topper.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600",
    isVideo: false,
    date: "Today"
  },
  {
    id: "showcase-2",
    title: "🍫 Royal Gulkand Chocolate Bites",
    category: "gulkand-chocolates",
    description: "Rich white chocolate cups filled with pure organic sweet gulkand.",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=600",
    isVideo: false,
    date: "Today"
  },
  {
    id: "showcase-3",
    title: "🎂 Gold Pearl Anniversary Cake",
    category: "anniversary-cakes",
    description: "Moist chocolate truffle cake decorated with gold dust and edible pearls.",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600",
    isVideo: false,
    date: "Yesterday"
  },
  {
    id: "showcase-4",
    title: "🎁 Premium Wedding Gift Hamper",
    category: "gift-boxes",
    description: "A premium luxury wooden hamper containing an assortment of nuts and dry fruit chocolates.",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=600",
    isVideo: false,
    date: "Yesterday"
  }
];

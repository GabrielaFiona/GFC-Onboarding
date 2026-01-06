// ======================================================
// --- 1. DATA & CONFIGURATION ---
// ======================================================

const BASE_BRAND_KIT_PRICE = 500;

// VISUAL ICONS MAPPING
const BLOCK_TYPES = {
  "Hero Section": { icon: "🖼️", type: "hero" },
  "Hero: Full Screen Visual": { icon: "🖼️", type: "hero" },
  "Hero: Brand Story": { icon: "📖", type: "hero" },
  "Hero: Retail": { icon: "🛍️", type: "hero" },
  "Hero: Search": { icon: "🔍", type: "hero" },
  "Text Content": { icon: "📝", type: "text" },
  "Intro Blurb": { icon: "📝", type: "text" },
  "Image/Gallery": { icon: "📷", type: "image" },
  "Visual Gallery Grid": { icon: "📷", type: "image" },
  "Product Grid": { icon: "🛍️", type: "image" },
  "Button / CTA": { icon: "🖱️", type: "button" },
  "Contact Form": { icon: "✉️", type: "form" },
  "Testimonials": { icon: "💬", type: "quote" },
  "Map/Location": { icon: "📍", type: "map" },
  "Footer": { icon: "🔻", type: "footer" },
  "Header/Nav": { icon: "🧭", type: "header" },
  "Video Player": { icon: "▶️", type: "video" },
  "Icon Grid": { icon: "💠", type: "grid" },
  "Menu List": { icon: "📋", type: "text" },
  "Calendar/Events": { icon: "📅", type: "text" },
  "Booking Embed": { icon: "📅", type: "form" },
  "Team/Bios": { icon: "👥", type: "image" },
  "FAQ": { icon: "❓", type: "text" }
};

// --- LAYOUT DEFINITIONS (Mapped to IDs provided in spreadsheet) ---
const LAYOUT_DEFINITIONS = {
  "L-01": [ // Visual Heavy / Home
    { name: "Hero: Full Screen Visual", x: 1, y: 1, w: 12, h: 5 },
    { name: "Intro Blurb", x: 2, y: 6, w: 10, h: 2 },
    { name: "Visual Gallery Grid", x: 1, y: 8, w: 12, h: 4 },
    { name: "Button / CTA", x: 4, y: 12, w: 6, h: 1 },
    { name: "Footer", x: 1, y: 13, w: 12, h: 2 }
  ],
  "L-02": [ // Story / Brand
    { name: "Hero: Brand Story", x: 1, y: 1, w: 12, h: 4 },
    { name: "About the Founder", x: 1, y: 5, w: 6, h: 4 },
    { name: "Our Values", x: 7, y: 5, w: 6, h: 4 },
    { name: "Timeline/History", x: 1, y: 9, w: 12, h: 3 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "L-03": [ // Pricing / Service / Sub
    { name: "Hero Section", x: 1, y: 1, w: 12, h: 3 },
    { name: "Service/Pricing Tier 1", x: 1, y: 4, w: 4, h: 4 },
    { name: "Service/Pricing Tier 2", x: 5, y: 4, w: 4, h: 4 },
    { name: "Service/Pricing Tier 3", x: 9, y: 4, w: 4, h: 4 },
    { name: "Testimonials", x: 1, y: 8, w: 12, h: 2 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-04": [ // Service Detail
    { name: "Service Overview", x: 1, y: 1, w: 12, h: 3 },
    { name: "Step 1: Consult", x: 1, y: 4, w: 6, h: 2 },
    { name: "Step 1 Image", x: 7, y: 4, w: 6, h: 2 },
    { name: "Step 2: Build", x: 7, y: 6, w: 6, h: 2 },
    { name: "Step 2 Image", x: 1, y: 6, w: 6, h: 2 },
    { name: "Footer", x: 1, y: 8, w: 12, h: 2 }
  ],
  "L-05": [ // Contact / Location
    { name: "Map/Location", x: 1, y: 1, w: 8, h: 6 },
    { name: "Address & Hours", x: 9, y: 1, w: 4, h: 3 },
    { name: "Social Media Links", x: 9, y: 4, w: 4, h: 3 },
    { name: "Contact Form", x: 1, y: 7, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "L-06": [ // Menu List
    { name: "Hero Section", x: 1, y: 1, w: 12, h: 3 },
    { name: "Menu Category 1", x: 1, y: 4, w: 6, h: 4 },
    { name: "Menu Category 2", x: 7, y: 4, w: 6, h: 4 },
    { name: "Dietary Info", x: 1, y: 8, w: 12, h: 1 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ],
  "L-07": [ // Team / Bios
    { name: "Hero: Our Team", x: 1, y: 1, w: 12, h: 3 },
    { name: "Team Member 1", x: 1, y: 4, w: 4, h: 4 },
    { name: "Team Member 2", x: 5, y: 4, w: 4, h: 4 },
    { name: "Team Member 3", x: 9, y: 4, w: 4, h: 4 },
    { name: "Join the Team CTA", x: 1, y: 8, w: 12, h: 2 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-08": [ // Info + Map
    { name: "Information Hero", x: 1, y: 1, w: 8, h: 4 },
    { name: "Key Details Box", x: 9, y: 1, w: 4, h: 4 },
    { name: "Large Map View", x: 1, y: 5, w: 12, h: 5 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-09": [ // Map Focus
    { name: "Full Screen Map", x: 1, y: 1, w: 12, h: 6 },
    { name: "Location List", x: 1, y: 7, w: 4, h: 4 },
    { name: "Selected Location Detail", x: 5, y: 7, w: 8, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "L-10": [ // Product Grid
    { name: "Hero: Shop", x: 1, y: 1, w: 12, h: 3 },
    { name: "Filters / Categories", x: 1, y: 4, w: 3, h: 6 },
    { name: "Product Grid", x: 4, y: 4, w: 9, h: 6 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-11": [ // Blog / Content
    { name: "Hero: Blog", x: 1, y: 1, w: 12, h: 3 },
    { name: "Featured Article", x: 1, y: 4, w: 8, h: 4 },
    { name: "Sidebar / Recent", x: 9, y: 4, w: 4, h: 4 },
    { name: "Article Grid", x: 1, y: 8, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "L-12": [ // Calendar / Events
    { name: "Hero: Events", x: 1, y: 1, w: 12, h: 3 },
    { name: "Calendar View", x: 1, y: 4, w: 8, h: 6 },
    { name: "Upcoming List", x: 9, y: 4, w: 4, h: 6 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-13": [ // Gallery
    { name: "Hero: Gallery", x: 1, y: 1, w: 12, h: 3 },
    { name: "Masonry Grid", x: 1, y: 4, w: 12, h: 8 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "L-14": [ // Booking Embed
    { name: "Hero: Book Now", x: 1, y: 1, w: 12, h: 3 },
    { name: "Booking Widget/Calendar", x: 2, y: 4, w: 10, h: 6 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-15": [ // Form + Info
    { name: "Hero: Contact/Inquiry", x: 1, y: 1, w: 12, h: 3 },
    { name: "Detailed Form", x: 1, y: 4, w: 7, h: 6 },
    { name: "Contact Info / FAQ", x: 8, y: 4, w: 5, h: 6 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-16": [ // External Link / CTA
    { name: "Hero: App/Portal", x: 1, y: 1, w: 12, h: 4 },
    { name: "Feature Highlights", x: 1, y: 5, w: 12, h: 3 },
    { name: "Big CTA Button", x: 4, y: 8, w: 6, h: 2 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "L-17": [ // Legal / FAQ
    { name: "Hero: Policy/FAQ", x: 1, y: 1, w: 12, h: 2 },
    { name: "Table of Contents", x: 1, y: 3, w: 4, h: 6 },
    { name: "Content Area", x: 5, y: 3, w: 8, h: 6 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ],
  "L-18": [ // Job Listing
    { name: "Hero: Careers", x: 1, y: 1, w: 12, h: 3 },
    { name: "Culture/Benefits", x: 1, y: 4, w: 12, h: 3 },
    { name: "Open Positions Grid", x: 1, y: 7, w: 12, h: 5 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "L-19": [ // Minimal Portfolio
    { name: "Hero: Artist Name", x: 1, y: 1, w: 12, h: 3 },
    { name: "Large Single Image", x: 2, y: 4, w: 10, h: 6 },
    { name: "Gallery Grid", x: 1, y: 10, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 14, w: 12, h: 2 }
  ],
  "L-20": [ // Retail Hero
    { name: "Hero: Retail", x: 1, y: 1, w: 12, h: 5 },
    { name: "Featured Categories", x: 1, y: 6, w: 12, h: 3 },
    { name: "New Arrivals", x: 1, y: 9, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 13, w: 12, h: 2 }
  ],
  "L-21": [ // Trust / Service
    { name: "Hero: Trust", x: 1, y: 1, w: 12, h: 4 },
    { name: "Trust Badges/Icons", x: 1, y: 5, w: 12, h: 2 },
    { name: "Service List", x: 1, y: 7, w: 8, h: 4 },
    { name: "Testimonial Sidebar", x: 9, y: 7, w: 4, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "L-22": [ // Reviews
    { name: "Hero: Reviews", x: 1, y: 1, w: 12, h: 3 },
    { name: "Review Grid", x: 1, y: 4, w: 12, h: 6 },
    { name: "Submit Review CTA", x: 4, y: 10, w: 6, h: 2 },
    { name: "Footer", x: 1, y: 12, w: 12, h: 2 }
  ],
  "L-23": [ // Corporate
    { name: "Hero: Corporate", x: 1, y: 1, w: 12, h: 4 },
    { name: "Mission Statement", x: 2, y: 5, w: 10, h: 2 },
    { name: "Divisions/Services", x: 1, y: 7, w: 12, h: 4 },
    { name: "News Ticker", x: 1, y: 11, w: 12, h: 2 },
    { name: "Footer", x: 1, y: 13, w: 12, h: 2 }
  ],
  "L-24": [ // Search Hero
    { name: "Hero: Search", x: 1, y: 1, w: 12, h: 4 },
    { name: "Popular Categories", x: 1, y: 5, w: 12, h: 2 },
    { name: "Recent Listings", x: 1, y: 7, w: 12, h: 4 },
    { name: "Footer", x: 1, y: 11, w: 12, h: 2 }
  ],
  "L-25": [ // Icon Grid
    { name: "Hero: Features", x: 1, y: 1, w: 12, h: 3 },
    { name: "Icon Grid 3x3", x: 2, y: 4, w: 10, h: 6 },
    { name: "Footer", x: 1, y: 10, w: 12, h: 2 }
  ],
  "default": [ // Basic Fallback
    { name: "Header/Nav", x: 1, y: 1, w: 12, h: 1 },
    { name: "Hero Section", x: 1, y: 2, w: 12, h: 4 },
    { name: "Text Content", x: 1, y: 6, w: 8, h: 3 },
    { name: "Image", x: 9, y: 6, w: 4, h: 3 },
    { name: "Footer", x: 1, y: 9, w: 12, h: 2 }
  ]
};

// --- MASSIVE INDUSTRY DATABASE (From Spreadsheet) ---
const INDUSTRY_DB = {
  // Food & Bev
  "Bakery / Donut Shop": { pages: ["Home", "Menu", "Pre-Order", "About", "Location"], layouts: { "Home": "L-01", "Menu": "L-06", "Pre-Order": "L-15", "About": "L-02", "Location": "L-05" }},
  "Brewery / Distillery / Winery": { pages: ["Home", "Tap List", "Visit", "Events", "Club", "Shop"], layouts: { "Home": "L-01", "Tap List": "L-06", "Visit": "L-08", "Events": "L-12", "Club": "L-03", "Shop": "L-10" }},
  "Coffee Shop / Café": { pages: ["Home", "Menu", "Order Online", "Our Source", "Careers"], layouts: { "Home": "L-01", "Menu": "L-06", "Order Online": "L-16", "Our Source": "L-02", "Careers": "L-18" }},
  "Food Truck": { pages: ["Home (Tracker)", "Menu", "Catering", "Calendar"], layouts: { "Home (Tracker)": "L-09", "Menu": "L-06", "Catering": "L-15", "Calendar": "L-12" }},
  "Restaurant (Pizza/Seafood)": { pages: ["Home", "Menu", "Reservations", "Private Dining", "Gallery", "Contact"], layouts: { "Home": "L-01", "Menu": "L-06", "Reservations": "L-14", "Private Dining": "L-04", "Gallery": "L-13", "Contact": "L-05" }},
  "Ice Cream / Candy Shop": { pages: ["Home", "Flavors", "Parties", "Locations", "Gift Cards"], layouts: { "Home": "L-01", "Flavors": "L-06", "Parties": "L-15", "Locations": "L-09", "Gift Cards": "L-03" }},
  "Specialty Foods Shop": { pages: ["Home", "Shop Online", "Recipes", "Gift Baskets", "Wholesale"], layouts: { "Home": "L-20", "Shop Online": "L-10", "Recipes": "L-11", "Gift Baskets": "L-03", "Wholesale": "L-15" }},

  // Retail
  "Art Gallery": { pages: ["Home", "Exhibitions", "Artists", "Visit", "Shop"], layouts: { "Home": "L-19", "Exhibitions": "L-12", "Artists": "L-07", "Visit": "L-05", "Shop": "L-10" }},
  "Bookstore / Toy Store": { pages: ["Home", "Staff Picks", "Events", "Shop", "Membership"], layouts: { "Home": "L-20", "Staff Picks": "L-11", "Events": "L-12", "Shop": "L-10", "Membership": "L-03" }},
  "Boutique / Jewelry": { pages: ["Home", "Shop All", "New Arrivals", "About", "Returns"], layouts: { "Home": "L-20", "Shop All": "L-10", "New Arrivals": "L-10", "About": "L-02", "Returns": "L-17" }},
  "Farmers Market Vendor": { pages: ["Home", "Products", "Schedule", "Contact"], layouts: { "Home": "L-02", "Products": "L-13", "Schedule": "L-12", "Contact": "L-05" }},
  "Florist": { pages: ["Home", "Shop Bouquets", "Weddings", "Care Tips", "Delivery"], layouts: { "Home": "L-01", "Shop Bouquets": "L-10", "Weddings": "L-13", "Care Tips": "L-11", "Delivery": "L-08" }},
  "Artisan Market / Maker": { pages: ["Home", "Vendors", "Apply", "Markets", "About"], layouts: { "Home": "L-20", "Vendors": "L-10", "Apply": "L-15", "Markets": "L-12", "About": "L-02" }},
  "Home Décor": { pages: ["Home", "Shop", "Design Services", "Inspiration", "Shipping"], layouts: { "Home": "L-20", "Shop": "L-10", "Design Services": "L-04", "Inspiration": "L-13", "Shipping": "L-17" }},
  "Wellness Shop": { pages: ["Home", "Shop", "Workshops", "Practitioners", "Sourcing"], layouts: { "Home": "L-19", "Shop": "L-10", "Workshops": "L-12", "Practitioners": "L-07", "Sourcing": "L-02" }},

  // Services
  "Automotive": { pages: ["Home", "Services", "Schedule", "Inventory", "About"], layouts: { "Home": "L-21", "Services": "L-04", "Schedule": "L-14", "Inventory": "L-10", "About": "L-02" }},
  "Beauty / Salon / Spa": { pages: ["Home", "Menu", "Book", "Portfolio", "Team"], layouts: { "Home": "L-01", "Menu": "L-06", "Book": "L-14", "Portfolio": "L-13", "Team": "L-07" }},
  "Construction / Home": { pages: ["Home", "Services", "Portfolio", "Quote", "Reviews"], layouts: { "Home": "L-21", "Services": "L-04", "Portfolio": "L-13", "Quote": "L-15", "Reviews": "L-22" }},
  "Fitness / Gym / Yoga": { pages: ["Home", "Schedule", "Instructors", "Membership", "New Student"], layouts: { "Home": "L-01", "Schedule": "L-12", "Instructors": "L-07", "Membership": "L-03", "New Student": "L-17" }},
  "Law / Financial": { pages: ["Home", "Practice Areas", "Team", "Resources", "Contact"], layouts: { "Home": "L-23", "Practice Areas": "L-04", "Team": "L-07", "Resources": "L-11", "Contact": "L-15" }},
  "Real Estate": { pages: ["Home", "Listings", "Buyers/Sellers", "Agents", "Market Reports"], layouts: { "Home": "L-24", "Listings": "L-10", "Buyers/Sellers": "L-08", "Agents": "L-07", "Market Reports": "L-11" }},
  "Insurance": { pages: ["Home", "Personal", "Business", "Claims", "Quote"], layouts: { "Home": "L-21", "Personal": "L-04", "Business": "L-04", "Claims": "L-15", "Quote": "L-15" }},
  "Property Services": { pages: ["Home", "Services", "Pricing", "Service Area", "Request"], layouts: { "Home": "L-21", "Services": "L-04", "Pricing": "L-03", "Service Area": "L-08", "Request": "L-15" }},

  // Hospitality & Events
  "Hotel / B&B": { pages: ["Home", "Rooms", "Amenities", "Nearby", "Book"], layouts: { "Home": "L-01", "Rooms": "L-04", "Amenities": "L-25", "Nearby": "L-11", "Book": "L-14" }},
  "Event Venue": { pages: ["Home", "Spaces", "Packages", "Vendors", "Inquiry"], layouts: { "Home": "L-01", "Spaces": "L-13", "Packages": "L-03", "Vendors": "L-25", "Inquiry": "L-15" }},
  "Tours": { pages: ["Home", "Tours", "FAQ", "Guides", "Book"], layouts: { "Home": "L-01", "Tours": "L-03", "FAQ": "L-17", "Guides": "L-07", "Book": "L-14" }},
  "Museum": { pages: ["Home", "Exhibits", "Visit", "Membership", "Education"], layouts: { "Home": "L-23", "Exhibits": "L-04", "Visit": "L-08", "Membership": "L-15", "Education": "L-04" }},
  
  // Ag / Pets
  "Agriculture / Farm": { pages: ["Home", "CSA", "Harvest", "Wholesale", "Visit"], layouts: { "Home": "L-01", "CSA": "L-03", "Harvest": "L-12", "Wholesale": "L-15", "Visit": "L-08" }},
  "Pet Services": { pages: ["Home", "Services", "Requirements", "Gallery", "Book"], layouts: { "Home": "L-01", "Services": "L-06", "Requirements": "L-17", "Gallery": "L-13", "Book": "L-14" }},
  "Fishing Charter": { pages: ["Home", "Packages", "Crew", "Reports", "Book"], layouts: { "Home": "L-01", "Packages": "L-03", "Crew": "L-07", "Reports": "L-11", "Book": "L-14" }},

  // B2B / Tech
  "Logistics": { pages: ["Home", "Services", "Track", "Fleet", "Quote"], layouts: { "Home": "L-23", "Services": "L-04", "Track": "L-16", "Fleet": "L-25", "Quote": "L-15" }},
  "Manufacturing": { pages: ["Home", "Capabilities", "Certifications", "Industries", "RFQ"], layouts: { "Home": "L-23", "Capabilities": "L-25", "Certifications": "L-21", "Industries": "L-04", "RFQ": "L-15" }},
  "Recruiting": { pages: ["Home", "Jobs", "Employers", "Submit Resume", "Team"], layouts: { "Home": "L-23", "Jobs": "L-18", "Employers": "L-04", "Submit Resume": "L-15", "Team": "L-07" }},
  "Tech Startup": { pages: ["Home", "Features", "Pricing", "Download", "Docs"], layouts: { "Home": "L-24", "Features": "L-25", "Pricing": "L-03", "Download": "L-16", "Docs": "L-17" }},
  "SaaS": { pages: ["Home", "Solutions", "Case Studies", "Pricing", "Demo"], layouts: { "Home": "L-24", "Solutions": "L-04", "Case Studies": "L-11", "Pricing": "L-03", "Demo": "L-14" }},

  // Arts & Ent
  "Tattoo Studio": { pages: ["Home", "Artists", "Aftercare", "Policy", "FAQ"], layouts: { "Home": "L-01", "Artists": "L-13", "Aftercare": "L-17", "Policy": "L-15", "FAQ": "L-17" }},
  "Gaming / Esports": { pages: ["Home", "Events", "Team", "Discord", "Merch"], layouts: { "Home": "L-01", "Events": "L-12", "Team": "L-07", "Discord": "L-16", "Merch": "L-10" }},
  "Art Studio / Classes": { pages: ["Home", "Schedule", "Workshops", "Student Gallery", "Events"], layouts: { "Home": "L-01", "Schedule": "L-12", "Workshops": "L-03", "Student Gallery": "L-13", "Events": "L-15" }},
  "Theater / Music": { pages: ["Home", "Shows", "Tickets", "Info", "Rentals"], layouts: { "Home": "L-01", "Shows": "L-12", "Tickets": "L-16", "Info": "L-08", "Rentals": "L-15" }},
  "Photography": { pages: ["Home", "Portfolio", "Investment", "About", "Contact"], layouts: { "Home": "L-19", "Portfolio": "L-13", "Investment": "L-03", "About": "L-02", "Contact": "L-05" }},
  
  // Travel
  "Rentals (Bike/Kayak)": { pages: ["Home", "Rates", "Routes", "Waiver", "Reserve"], layouts: { "Home": "L-01", "Rates": "L-03", "Routes": "L-08", "Waiver": "L-17", "Reserve": "L-14" }},
  "Surf / Lessons": { pages: ["Home", "Packages", "Report", "Instructors", "Book"], layouts: { "Home": "L-01", "Packages": "L-03", "Report": "L-09", "Instructors": "L-07", "Book": "L-14" }},
  "Attractions": { pages: ["Home", "Courses", "Rules", "Parties", "Book"], layouts: { "Home": "L-01", "Courses": "L-13", "Rules": "L-17", "Parties": "L-15", "Book": "L-14" }},
  "Vacation Rentals": { pages: ["Home", "Photos", "Amenities", "Local Guide", "Book"], layouts: { "Home": "L-01", "Photos": "L-13", "Amenities": "L-25", "Local Guide": "L-11", "Book": "L-16" }},
  "Visitor Center": { pages: ["Home", "Things to Do", "Events", "Map", "Guide"], layouts: { "Home": "L-24", "Things to Do": "L-11", "Events": "L-12", "Map": "L-09", "Guide": "L-16" }},
  "Travel Agency": { pages: ["Home", "Destinations", "Packages", "Blog", "Plan"], layouts: { "Home": "L-01", "Destinations": "L-13", "Packages": "L-03", "Blog": "L-11", "Plan": "L-15" }},
  "Transportation": { pages: ["Home", "Services", "Rates", "Map", "Book"], layouts: { "Home": "L-24", "Services": "L-25", "Rates": "L-06", "Map": "L-09", "Book": "L-14" }},

  // Public/Edu/Nonprofit
  "Local Govt": { pages: ["Home", "Departments", "Agendas", "Pay Bills", "Contact"], layouts: { "Home": "L-23", "Departments": "L-25", "Agendas": "L-11", "Pay Bills": "L-16", "Contact": "L-05" }},
  "Education": { pages: ["Home", "Courses", "Admissions", "Calendar", "Portal"], layouts: { "Home": "L-23", "Courses": "L-06", "Admissions": "L-15", "Calendar": "L-12", "Portal": "L-16" }},
  "Nonprofit": { pages: ["Home", "Mission", "Programs", "Donate", "Volunteer"], layouts: { "Home": "L-02", "Mission": "L-02", "Programs": "L-04", "Donate": "L-03", "Volunteer": "L-15" }}
};

const BLOCK_LIBRARY = Object.keys(BLOCK_TYPES);

// ======================================================
// --- 2. STATE MANAGEMENT ---
// ======================================================
const state = {
  package: null,
  brandKit: false,
  industry: "",
  pages: [],
  addons: [],
  pagePlans: {}, 
  brandingProvided: null,
  customBranding: { active: false, name: "", price: 0 },
  customService: { active: false, name: "", price: 0 }, // Step 4 Custom
  selectedAddons: [], // Step 4 Addons
  advancedNotes: "",
  viewMode: {}, 
  clientName: "",
  businessName: "",
  clientEmail: "",
  clientPhone: "",
  billingAddress: "",
  adminEmail: "" // Added for Step 4
};

const pageAttachments = {}; 

function saveState() {
  const cName = document.getElementById('clientName');
  if(cName) state.clientName = cName.value;
  const bName = document.getElementById('businessName');
  if(bName) state.businessName = bName.value;
  
  localStorage.setItem('onboardingState', JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem('onboardingState');
  if (raw) Object.assign(state, JSON.parse(raw));
  
  if(document.getElementById('clientName')) document.getElementById('clientName').value = state.clientName || "";
  if(document.getElementById('businessName')) document.getElementById('businessName').value = state.businessName || "";
}

function nextStep(stepNumber) {
  saveState();
  window.location.href = `step${stepNumber}.html`;
}

// ======================================================
// --- 3. STEP 2 LOGIC ---
// ======================================================

function selectPackage(id, name, price, limit, brandKitBundlePrice, extraPageCost, element) {
  document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
  if (element) element.classList.add('selected');

  state.package = { id, name, price, limit, brandKitBundlePrice, extraPageCost };
  if (state.pages.length === 0) state.pages = ['Home', 'Contact'];
  
  handlePackageSelected();
  calculateTotal();
  updateBrandKitDisplay();
  updatePageBuilderUI(); 
  saveState();
}

function handlePackageSelected(isRestore) {
  const notice = document.getElementById('brandingLockedNotice');
  const unlocked = document.getElementById('brandingUnlocked');
  const pageBuilder = document.getElementById('pageBuilderSection');
  
  if (notice) notice.classList.add('hidden');
  if (unlocked) unlocked.classList.remove('hidden');
  if (pageBuilder) pageBuilder.classList.remove('hidden');

  const branding = document.getElementById('brandingSection');
  if (branding && !isRestore) branding.classList.remove('collapsed'); 
  
  if (window.initCollapsibles) window.initCollapsibles(); 
}

function toggleBrandingPanels(value) {
  state.brandingProvided = value;
  const yesPanel = document.getElementById('brandingProvidedPanel');
  const noPanel = document.getElementById('brandingNotProvidedPanel');
  if (yesPanel) yesPanel.classList.toggle('hidden', value !== 'yes');
  if (noPanel) noPanel.classList.toggle('hidden', value !== 'no');
  saveState();
}

let uploadedFiles = []; 
function handleFileUpload(e) {
  const files = e.target.files;
  const box = document.getElementById('file-staging-box');
  const list = document.getElementById('file-list-content');
  
  if (!files || !files.length) {
    box.classList.add('hidden');
    return;
  }
  
  box.classList.remove('hidden');
  list.innerHTML = ''; 
  uploadedFiles = Array.from(files); 

  uploadedFiles.forEach(file => {
    const row = document.createElement('div');
    row.className = 'file-list-item';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.className = 'btn-download-mini';
    link.textContent = 'Download';
    row.appendChild(nameSpan);
    row.appendChild(link);
    list.appendChild(row);
  });
}

function downloadAllFiles() {
  uploadedFiles.forEach(file => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
  
  const notesArea = document.getElementById('brandingProvidedNotes');
  if (notesArea && notesArea.value.trim() !== "") {
    const blob = new Blob([notesArea.value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "branding-notes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (uploadedFiles.length === 0) {
    alert("No files or notes to download.");
  }
}

function toggleCustomBrandingUI(panelId) {
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.toggle('hidden');
}

function updateCustomBrandingState() {
  const names = document.querySelectorAll('.custom-brand-name');
  const prices = document.querySelectorAll('.custom-brand-price');
  
  let activeName = "";
  let activePrice = 0;

  if (document.activeElement && document.activeElement.classList.contains('custom-brand-name')) {
    activeName = document.activeElement.value;
  } else {
    names.forEach(input => { if (input.value) activeName = input.value; });
  }

  if (document.activeElement && document.activeElement.classList.contains('custom-brand-price')) {
    activePrice = Number(document.activeElement.value);
  } else {
    prices.forEach(input => { if (input.value) activePrice = Number(input.value); });
  }

  names.forEach(input => { if (input !== document.activeElement) input.value = activeName; });
  prices.forEach(input => { if (input !== document.activeElement) input.value = activePrice || ""; });

  state.customBranding = { 
    active: (activePrice > 0), 
    name: activeName || "Custom Branding", 
    price: activePrice || 0
  };

  calculateTotal();
  saveState();
}

function initPageBuilder() {
  const input = document.getElementById('industryInput');
  const fileInput = document.getElementById('brandingUploads');
  if (fileInput) fileInput.addEventListener('change', handleFileUpload);

  // --- RE-APPLY HIGHLIGHT ON LOAD (UPDATE 1) ---
  if (state.package && state.package.id) {
     const savedCard = document.querySelector(`.package-card[data-package-id="${state.package.id}"]`);
     if(savedCard) {
        document.querySelectorAll('.package-card').forEach(el => el.classList.remove('selected'));
        savedCard.classList.add('selected');
     }
  }

  if (state.brandingProvided) {
    const radio = document.querySelector(`input[name="brandingProvided"][value="${state.brandingProvided}"]`);
    if (radio) { radio.checked = true; toggleBrandingPanels(state.brandingProvided); }
  }
  if (state.customBranding && state.customBranding.price > 0) {
     const names = document.querySelectorAll('.custom-brand-name');
     const prices = document.querySelectorAll('.custom-brand-price');
     names.forEach(i => i.value = state.customBranding.name);
     prices.forEach(i => i.value = state.customBranding.price);
     document.querySelectorAll('.custom-panel').forEach(p => p.classList.remove('hidden'));
  }
  
  if(input) {
      let list = document.getElementById('industry-suggestions');
      if(!list) {
          list = document.createElement('ul');
          list.id = 'industry-suggestions';
          list.className = 'autocomplete-list hidden';
          input.parentNode.style.position = 'relative';
          input.parentNode.appendChild(list);
      }
      input.addEventListener('input', (e) => handleIndustrySearch(e.target.value));
      document.addEventListener('click', (e) => {
          if (e.target !== input && e.target !== list) list.classList.add('hidden');
      });
  }
  if (state.industry && input) {
    input.value = state.industry;
    renderChips(getIndustryPages(state.industry));
  }
  renderActivePages();
}

// GENEROUS SEARCH LOGIC
function handleIndustrySearch(query) {
  const list = document.getElementById('industry-suggestions');
  if (!query) { list.classList.add('hidden'); return; }
  
  const terms = query.toLowerCase().split(' ').filter(t => t.length > 0);
  
  const matches = Object.keys(INDUSTRY_DB).filter(key => {
      const lowerKey = key.toLowerCase();
      return terms.some(term => lowerKey.includes(term));
  });

  list.innerHTML = '';
  if (matches.length > 0) {
    list.classList.remove('hidden');
    matches.forEach(match => {
      const li = document.createElement('li');
      li.textContent = match;
      li.onclick = () => selectIndustry(match);
      list.appendChild(li);
    });
  } else { list.classList.add('hidden'); }
}

window.generateSuggestions = handleIndustrySearch;

function selectIndustry(industryName) {
  document.getElementById('industryInput').value = industryName;
  state.industry = industryName;
  document.getElementById('industry-suggestions').classList.add('hidden');
  renderChips(getIndustryPages(industryName));
  saveState();
}

function getIndustryPages(industryName) {
  return (INDUSTRY_DB[industryName]) ? INDUSTRY_DB[industryName].pages : [];
}

function renderChips(pages) {
  const container = document.getElementById('suggestionChips');
  if (!container) return;
  container.innerHTML = '';
  if(pages.length === 0) {
      container.innerHTML = '<span style="opacity:0.5; font-style:italic;">Type an industry...</span>';
      return;
  }
  pages.forEach(page => {
    const chip = document.createElement('div');
    chip.className = 'suggestion-chip';
    if (state.pages.includes(page)) chip.classList.add('added');
    chip.textContent = `+ ${page}`;
    chip.onclick = () => addPage(page);
    container.appendChild(chip);
  });
}

function addPage(nameRaw) {
  const input = document.getElementById('customPageInput');
  const name = nameRaw || (input ? input.value.trim() : '');
  if (!name) return;
  if (!state.pages.includes(name)) {
    state.pages.push(name);
    if (!state.pagePlans[name]) state.pagePlans[name] = {};
    state.pagePlans[name].grid = convertListToGrid(getDefaultLayoutForPage(name));
    
    if (input) input.value = '';
    renderActivePages();
    if (state.industry) renderChips(getIndustryPages(state.industry));
    calculateTotal();
    saveState();
  }
}

function removePage(name) {
  state.pages = state.pages.filter(p => p !== name);
  renderActivePages();
  if (state.industry) renderChips(getIndustryPages(state.industry));
  calculateTotal();
  saveState();
}

function renderActivePages() {
  const list = document.getElementById('activePagesList');
  const countEl = document.getElementById('pageCountDisplay');
  const warning = document.getElementById('pageLimitWarning');
  if (!list || !state.package) return;
  list.innerHTML = '';
  state.pages.forEach((page, index) => {
    const tag = document.createElement('div');
    tag.className = 'page-tag';
    tag.draggable = true;
    tag.innerHTML = `<span class="drag-handle">::</span> ${page} <span class="page-tag-remove" onclick="removePage('${page}')">&times;</span>`;
    
    tag.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
      tag.classList.add('dragging');
    });
    tag.addEventListener('dragend', () => tag.classList.remove('dragging'));
    tag.addEventListener('dragover', (e) => e.preventDefault());
    tag.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const toIndex = index;
      if (fromIndex !== toIndex) {
        const item = state.pages.splice(fromIndex, 1)[0];
        state.pages.splice(toIndex, 0, item);
        renderActivePages();
        saveState();
      }
    });

    list.appendChild(tag);
  });
  
  const limit = state.package.limit;
  const current = state.pages.length;
  if (countEl) countEl.textContent = `${current}/${limit}`;
  if (current > limit) {
    const extra = current - limit;
    const cost = extra * state.package.extraPageCost;
    warning.innerHTML = `You are ${extra} page(s) over your limit. Added cost: <strong>$${cost}</strong>`;
    warning.classList.add('visible');
  } else { warning.classList.remove('visible'); }
}

function updatePageBuilderUI() { renderActivePages(); }

function calculateTotal() {
  // Select Widget Elements
  const widgetItems = document.getElementById('fw-items');
  const widgetTotal = document.getElementById('fw-full-total');
  const widgetDeposit = document.getElementById('fw-deposit');
  const widgetHeader = document.getElementById('fw-header-total');

  // Select Step 4 Invoice Elements
  const invoiceItems = document.getElementById('final-invoice-items');
  const invoiceTotal = document.getElementById('final-invoice-total');
  const invoiceDeposit = document.getElementById('final-invoice-deposit');
  
  let html = '';
  let total = 0;
  
  // Package
  if (state.package) {
    html += `<div class="fw-item"><span>${state.package.name}</span><span>$${state.package.price.toLocaleString()}</span></div>`;
    total += state.package.price;
    if (state.pages.length > state.package.limit) {
      const extra = state.pages.length - state.package.limit;
      const extraCost = extra * state.package.extraPageCost;
      html += `<div class="fw-item"><span style="color:#ff6b6b">${extra} Extra Pages</span><span>$${extraCost.toLocaleString()}</span></div>`;
      total += extraCost;
    }
  }
  
  // Brand Kit
  if (state.brandKit) {
    let kitPrice = BASE_BRAND_KIT_PRICE;
    let label = 'Brand Kit';
    if (state.package && state.package.brandKitBundlePrice) { kitPrice = Number(state.package.brandKitBundlePrice); label += ' (Bundled)'; }
    html += `<div class="fw-item"><span>+ ${label}</span><span>$${kitPrice.toLocaleString()}</span></div>`;
    total += kitPrice;
  }
  
  // Step 2 Custom Branding
  if (state.customBranding && state.customBranding.price > 0) {
    html += `<div class="fw-item"><span>+ ${state.customBranding.name}</span><span>$${state.customBranding.price.toLocaleString()}</span></div>`;
    total += state.customBranding.price;
  }

  // Step 4 Addons
  if (state.selectedAddons && state.selectedAddons.length > 0) {
    state.selectedAddons.forEach(addon => {
        html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${addon.price.toLocaleString()}</span></div>`;
        total += addon.price;
    });
  }

  // Step 4 Custom Service
  if (state.customService && state.customService.price > 0) {
    html += `<div class="fw-item"><span>+ ${state.customService.name}</span><span>$${state.customService.price.toLocaleString()}</span></div>`;
    total += state.customService.price;
  }

  state.addons.forEach(addon => {
    html += `<div class="fw-item"><span>+ ${addon.name}</span><span>$${Number(addon.price).toLocaleString()}</span></div>`;
    total += Number(addon.price) || 0;
  });

  if (!html) html = '<p class="empty-state">Select a package to start...</p>';
  
  // Update Widget (if exists)
  if (widgetItems) widgetItems.innerHTML = html;
  if (widgetTotal) widgetTotal.textContent = `$${total.toLocaleString()}`;
  if (widgetDeposit) widgetDeposit.textContent = `$${(total / 2).toLocaleString()}`;
  if (widgetHeader) widgetHeader.textContent = `$${total.toLocaleString()}`;

  // Update Invoice Box (Step 4)
  if (invoiceItems) invoiceItems.innerHTML = html;
  if (invoiceTotal) invoiceTotal.textContent = `$${total.toLocaleString()}`;
  if (invoiceDeposit) invoiceDeposit.textContent = `$${(total / 2).toLocaleString()}`;
}

// ======================================================
// --- 4. STEP 3: VISUAL LAYOUT BUILDER ---
// ======================================================

function initStep3() {
  if (!document.body.classList.contains('step3')) return;
  const container = document.getElementById('planContainer');
  const pkgId = state.package ? state.package.id : 'basic';
  container.innerHTML = ''; 
  
  if (pkgId === 'basic') {
    const sortableList = document.createElement('div');
    sortableList.id = 'sortable-list';
    container.appendChild(sortableList);
    renderBasicPlan(sortableList);
  } 
  else {
    renderVisualLayoutBuilder(container); 
  }
  
  // Inject the Print-To-PDF Button
  injectDownloadButton();
}

function renderVisualLayoutBuilder(container) {
  const intro = `<div style="text-align:center; margin-bottom:30px;"><p>Drag & Drop Wireframe Tool. Drag elements to swap positions. Click Mobile to toggle views.</p></div>`;
  container.insertAdjacentHTML('beforebegin', intro);

  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    if (!state.pagePlans[page].grid || state.pagePlans[page].grid.length === 0) {
      state.pagePlans[page].grid = convertListToGrid(getDefaultLayoutForPage(page));
    }
    
    // Set default view mode to desktop
    if(!state.viewMode) state.viewMode = {};
    if(!state.viewMode[page]) state.viewMode[page] = 'desktop';

    const gridId = `grid-canvas-${index}`;
    const previewId = `preview-area-${index}`;
    const fileListId = `file-list-${index}`;
    const titleId = `editor-title-${index}`;
    const layoutSelectorHtml = generateLayoutSelector(page);

    const html = `
      <div class="plan-card collapsed" data-page="${page}">
        <div class="plan-card-header">
            <div class="plan-card-title-group" onclick="togglePlanCard(this)">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
            <div class="layout-selector-wrapper">
                <select class="layout-select" onchange="switchPageLayout('${page}', this.value)">
                    <option value="" disabled selected>Load Layout...</option>
                    ${layoutSelectorHtml}
                </select>
            </div>
        </div>
        
        <div class="plan-card-body">
          <div class="builder-layout-container">
            <div class="editor-pane">
               <div class="editor-header">
                 <span id="${titleId}">Desktop Wireframe</span>
                 <button class="btn-dashed" style="width:auto; margin:0; padding:5px 10px;" onclick="openBlockLibrary('${page}', '${gridId}')">+ Add Element</button>
               </div>
               <div class="grid-canvas" id="${gridId}"></div>
            </div>
            
            <div class="preview-pane" id="${previewId}" onclick="toggleViewMode('${page}', ${index})">
              </div>

          </div>
          <div style="margin-top:30px; border-top:1px solid var(--border-light); padding-top:20px;">
              <label>Content Notes</label>
              <textarea rows="3" oninput="savePageNote('${page}', this.value)">${state.pagePlans[page].notes || ''}</textarea>
          </div>
          <div style="margin-top:20px;">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload"><span>📂 Upload Assets</span></label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              <div id="${fileListId}" class="mini-file-list"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => {
        refreshPageBuilderUI(page, index);
        renderPageFileList(page, fileListId);
    }, 100);
  });
}

function toggleViewMode(page, index) {
    if(!state.viewMode) state.viewMode = {};
    const current = state.viewMode[page] || 'desktop';
    state.viewMode[page] = (current === 'desktop') ? 'mobile' : 'desktop';
    refreshPageBuilderUI(page, index);
    saveState();
}

function getDefaultLayoutForPage(pageName) {
  if (state.industry && INDUSTRY_DB[state.industry] && INDUSTRY_DB[state.industry].layouts[pageName]) {
    const layoutID = INDUSTRY_DB[state.industry].layouts[pageName];
    if (LAYOUT_DEFINITIONS[layoutID]) return [...LAYOUT_DEFINITIONS[layoutID]];
  }
  return [...LAYOUT_DEFINITIONS["default"]];
}

function convertListToGrid(listItems) {
    return listItems.map((item, index) => ({
        id: `block-${Date.now()}-${index}`,
        name: item.name || item, 
        x: item.x || 1, 
        y: item.y || (1 + (index * 2)), 
        w: item.w || 12, 
        h: item.h || 2
    }));
}

function generateLayoutSelector(currentPageName) {
    let options = `<optgroup label="Generic"><option value="default">Default Basic</option></optgroup>`;
    options += `<option disabled>────────────────</option>`;

    const matches = [];
    Object.entries(INDUSTRY_DB).forEach(([indName, data]) => {
        if (data.pages.includes(currentPageName)) {
            matches.push({ industry: indName, layoutId: data.layouts[currentPageName] });
        }
    });
    if (matches.length > 0) {
        options += `<optgroup label="Suggested for ${currentPageName}">`;
        matches.forEach(m => { options += `<option value="${m.layoutId}">${m.industry} / ${currentPageName}</option>`; });
        options += `</optgroup>`;
        options += `<option disabled>────────────────</option>`;
    }
    options += `<optgroup label="All Layouts">`;
    Object.entries(LAYOUT_DEFINITIONS).forEach(([lid, blocks]) => {
        if (lid !== 'default') {
            options += `<option value="${lid}">${lid} (${blocks.length} blocks)</option>`;
        }
    });
    options += `</optgroup>`;
    return options;
}

function switchPageLayout(pageName, layoutId) {
    if(!layoutId) return;
    const choice = confirm("Replace current layout?");
    let newBlocksRaw = LAYOUT_DEFINITIONS[layoutId] || LAYOUT_DEFINITIONS['default'];
    let newGridBlocks = convertListToGrid(newBlocksRaw);

    if (choice) {
        state.pagePlans[pageName].grid = newGridBlocks;
    } else {
        const currentBlocks = state.pagePlans[pageName].grid;
        const maxY = currentBlocks.length > 0 ? Math.max(...currentBlocks.map(b => b.y + b.h)) : 1;
        newGridBlocks = newGridBlocks.map(b => ({ ...b, y: b.y + maxY })); 
        state.pagePlans[pageName].grid = [...currentBlocks, ...newGridBlocks];
    }
    
    const index = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, index);
    saveState();
}

// --- RENDER FUNCTIONS ---
function refreshPageBuilderUI(pageName, index) {
    const gridId = `grid-canvas-${index}`;
    const previewId = `preview-area-${index}`;
    const titleId = `editor-title-${index}`;
    
    const gridContainer = document.getElementById(gridId);
    const previewContainer = document.getElementById(previewId);
    const titleEl = document.getElementById(titleId);
    
    if(!gridContainer || !previewContainer) return;

    gridContainer.innerHTML = '';
    const mode = (state.viewMode && state.viewMode[pageName]) ? state.viewMode[pageName] : 'desktop';

    if(titleEl) titleEl.textContent = mode === 'desktop' ? "Desktop Wireframe" : "Mobile Wireframe";

    const blocks = state.pagePlans[pageName].grid || [];
    const sortedBlocks = [...blocks].sort((a,b) => a.y - b.y);

    // --- Render Grid Items ---
    blocks.forEach((block, idx) => {
        const info = BLOCK_TYPES[block.name] || { icon: "📦", type: "generic" };
        const el = document.createElement('div');
        el.className = `grid-item block-type-${info.type}`;
        el.id = block.id;
        el.style.gridColumnStart = block.x;
        el.style.gridColumnEnd = `span ${block.w}`;
        el.style.gridRowStart = block.y;
        el.style.gridRowEnd = `span ${block.h}`;
        
        el.innerHTML = `
          <div class="grid-remove" onclick="removeBlock('${pageName}', '${block.id}')">&times;</div>
          <div class="grid-item-content">
             <div class="grid-visual-icon">${info.icon}</div>
             <div class="grid-label">${block.name}</div>
          </div>
          <div class="grid-resize-handle"></div>
        `;
        setupFreeInteraction(el, pageName, idx, index);
        gridContainer.appendChild(el);
    });

    // --- Render Preview ---
    if(mode === 'desktop') {
        // Render Mobile Preview
        let previewHtml = `
          <div class="mobile-frame">
             <div class="mobile-notch"></div>
             <div class="mobile-screen">`;
        
        sortedBlocks.forEach(block => {
            const info = BLOCK_TYPES[block.name] || { icon: "📦" };
            previewHtml += `<div class="mobile-block ${info.type === 'button' ? 'mobile-block-button' : ''}">
               <span class="mobile-block-icon">${info.icon}</span> <span>${block.name}</span>
            </div>`;
        });
        
        previewHtml += `</div></div>`;
        previewContainer.innerHTML = previewHtml;
    } else {
        // Render Desktop Preview (VISUAL BLOCKS)
        let desktopContent = '';
        sortedBlocks.forEach(block => {
            const info = BLOCK_TYPES[block.name] || { icon: "📦" };
            const widthPct = (block.w / 12) * 100;
            desktopContent += `<div style="width:${widthPct}%; float:left; font-size:0.5rem; padding:2px; height:20px; overflow:hidden; border:1px solid #ddd; background:#f9f9f9; color:#333; box-sizing:border-box; text-align:center;">
                ${info.icon}
            </div>`;
        });

        previewContainer.innerHTML = `
          <div class="desktop-frame">
              <div class="desktop-screen" style="padding:5px; overflow:hidden; background:#fff; display:block;">
                  ${desktopContent}
                  <div style="clear:both;"></div>
              </div>
              <div class="desktop-stand"></div>
          </div>
        `;
    }
}

// --- INTERACTION ---
function findOverlappingBlock(pageName, movingId, x, y, w, h) {
    const blocks = state.pagePlans[pageName].grid;
    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.id === movingId) continue; 
        if (x < b.x + b.w && x + w > b.x && y < b.y + b.h && y + h > b.y) {
            return i; 
        }
    }
    return -1;
}

function setupFreeInteraction(element, pageName, index, pageIndex) {
    const container = document.getElementById(`grid-canvas-${pageIndex}`);
    let startX, startY, startGridX, startGridY;
    let originalGridX, originalGridY; 
    
    element.addEventListener('mousedown', (e) => {
        if(e.target.classList.contains('grid-resize-handle') || e.target.classList.contains('grid-remove')) return;
        e.preventDefault();
        element.classList.add('interacting');
        
        const rect = container.getBoundingClientRect();
        const colWidth = rect.width / 12; 
        const rowHeight = 60; 

        startX = e.clientX;
        startY = e.clientY;
        const blockData = state.pagePlans[pageName].grid[index];
        startGridX = blockData.x;
        startGridY = blockData.y;
        originalGridX = blockData.x;
        originalGridY = blockData.y;

        const onMove = (moveEvent) => {
            const diffX = moveEvent.clientX - startX;
            const diffY = moveEvent.clientY - startY;
            const colsMoved = Math.round(diffX / colWidth);
            const rowsMoved = Math.round(diffY / rowHeight);
            let newX = startGridX + colsMoved;
            let newY = startGridY + rowsMoved;

            if(newX < 1) newX = 1;
            if(newX + blockData.w > 13) newX = 13 - blockData.w;
            if(newY < 1) newY = 1;

            element.style.gridColumnStart = newX;
            element.style.gridRowStart = newY;
        };

        const onUp = (upEvent) => {
            element.classList.remove('interacting');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            
            const finalStyle = window.getComputedStyle(element);
            const potentialX = parseInt(finalStyle.gridColumnStart);
            const potentialY = parseInt(finalStyle.gridRowStart);
            
            let overlappedIdx = findOverlappingBlock(pageName, blockData.id, potentialX, potentialY, blockData.w, blockData.h);
            
            if (overlappedIdx !== -1) {
                state.pagePlans[pageName].grid[overlappedIdx].x = originalGridX;
                state.pagePlans[pageName].grid[overlappedIdx].y = originalGridY;
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;
            } else {
                state.pagePlans[pageName].grid[index].x = potentialX;
                state.pagePlans[pageName].grid[index].y = potentialY;
            }

            saveState();
            refreshPageBuilderUI(pageName, pageIndex);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    });

    const resizeHandle = element.querySelector('.grid-resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const colWidth = rect.width / 12;
        const rowHeight = 60;
        
        startX = e.clientX;
        startY = e.clientY;
        const blockData = state.pagePlans[pageName].grid[index];
        const startW = blockData.w;
        const startH = blockData.h;

        const onResize = (moveEvent) => {
            const diffX = moveEvent.clientX - startX;
            const diffY = moveEvent.clientY - startY;
            let newW = startW + Math.round(diffX / colWidth);
            let newH = startH + Math.round(diffY / rowHeight);

            if(newW < 2) newW = 2; if(newW + blockData.x > 13) newW = 13 - blockData.x;
            if(newH < 1) newH = 1;

            element.style.gridColumnEnd = `span ${newW}`;
            element.style.gridRowEnd = `span ${newH}`;
        };

        const onEndResize = () => {
             const spanW = parseInt(element.style.gridColumnEnd.replace('span ',''));
             const spanH = parseInt(element.style.gridRowEnd.replace('span ',''));
             
             state.pagePlans[pageName].grid[index].w = spanW;
             state.pagePlans[pageName].grid[index].h = spanH;
             saveState();
             refreshPageBuilderUI(pageName, pageIndex);
             window.removeEventListener('mousemove', onResize);
             window.removeEventListener('mouseup', onEndResize);
        };

        window.addEventListener('mousemove', onResize);
        window.addEventListener('mouseup', onEndResize);
    });
}

function openBlockLibrary(pageName, gridId) {
    const pageIndex = gridId.split('-')[2];
    const existing = document.getElementById('lib-modal');
    if(existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'lib-modal';
    overlay.className = 'block-library-overlay';
    
    const items = BLOCK_LIBRARY.map(name => {
        const info = BLOCK_TYPES[name];
        return `<div class="library-option" onclick="addBlock('${pageName}', '${name}', '${pageIndex}')">
            <span class="library-icon">${info.icon}</span><span>${name}</span>
        </div>`;
    }).join('');

    overlay.innerHTML = `<div class="block-library-modal"><h3>Add Element</h3><div class="library-grid">${items}</div><button class="btn-close-modal" onclick="this.closest('.block-library-overlay').remove()">Cancel</button></div>`;
    document.body.appendChild(overlay);
}

function addBlock(pageName, blockName, pageIndex) {
    const grid = state.pagePlans[pageName].grid;
    const maxY = grid.length > 0 ? Math.max(...grid.map(b => b.y + b.h)) : 1;
    grid.push({
        id: `block-${Date.now()}`,
        name: blockName,
        x: 1, y: maxY, w: 12, h: 2
    });
    document.getElementById('lib-modal').remove();
    refreshPageBuilderUI(pageName, pageIndex);
    saveState();
}

function removeBlock(pageName, id) {
    state.pagePlans[pageName].grid = state.pagePlans[pageName].grid.filter(b => b.id !== id);
    const idx = state.pages.indexOf(pageName);
    refreshPageBuilderUI(pageName, idx);
    saveState();
}

// --- BASIC PLAN LOGIC ---
function renderBasicPlan(container) {
  state.pages.forEach((page, index) => {
    if(!state.pagePlans[page]) state.pagePlans[page] = {};
    const noteVal = state.pagePlans[page].notes || '';
    const fileListId = `file-list-${index}`;
    
    const html = `
      <div class="plan-card collapsed" draggable="true" data-page-name="${page}">
        <div class="plan-card-header" onclick="togglePlanCard(this)">
            <div class="plan-card-title-group">
                <span class="plan-card-chevron">▼</span>
                <span>${index + 1}. ${page}</span>
            </div>
            <div class="drag-handle">☰</div>
        </div>
        <div class="plan-card-body">
          <label>Page Goals & Content Notes</label>
          <textarea rows="5" oninput="savePageNote('${page}', this.value)" placeholder="What should be on this page?">${noteVal}</textarea>
          
          <div style="margin-top:20px;">
              <label>Page Assets</label>
              <div class="file-upload-wrapper">
                 <label for="file-input-${index}" class="custom-file-upload">
                   <span>📂 Upload Assets</span>
                 </label>
                 <input id="file-input-${index}" type="file" multiple onchange="handlePageFileUpload('${page}', this, '${fileListId}')" />
              </div>
              <div id="${fileListId}" class="mini-file-list"></div>
          </div>
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    setTimeout(() => renderPageFileList(page, fileListId), 50);
  });
}

function handlePageFileUpload(pageName, input, listId) {
  if (input.files && input.files.length > 0) {
    if (!pageAttachments[pageName]) pageAttachments[pageName] = [];
    Array.from(input.files).forEach(f => pageAttachments[pageName].push(f));
    renderPageFileList(pageName, listId);
  }
}

function renderPageFileList(pageName, listId) {
  const container = document.getElementById(listId);
  if (!container) return;
  container.innerHTML = '';
  const files = pageAttachments[pageName] || [];
  if (files.length === 0) {
    container.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); text-align:center;">No files attached</div>';
    return;
  }
  files.forEach((file, i) => {
    const div = document.createElement('div');
    div.className = 'page-file-item';
    div.innerHTML = `<span>📎 ${file.name}</span>`;
    const delBtn = document.createElement('span');
    delBtn.innerHTML = '&times;';
    delBtn.className = 'delete-file-btn';
    delBtn.onclick = () => {
        pageAttachments[pageName].splice(i, 1);
        renderPageFileList(pageName, listId);
    };
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

function togglePlanCard(header) {
  const card = header.closest('.plan-card');
  card.classList.toggle('collapsed');
}

function savePageNote(pageName, text) {
  if(!state.pagePlans[pageName]) state.pagePlans[pageName] = {};
  state.pagePlans[pageName].notes = text;
  saveState();
}

function toggleBrandKit(element) {
  state.brandKit = !state.brandKit;
  document.querySelectorAll('.brand-kit-ref').forEach(el => { el.classList.toggle('selected', state.brandKit); });
  calculateTotal(); updateBrandKitDisplay(); saveState();
}

function updateBrandKitDisplay() {
  document.querySelectorAll('.brand-kit-ref').forEach(bar => {
    const finalPriceEl = bar.querySelector('.bk-final-price');
    if (!finalPriceEl) return;
    const hasBundle = !!(state.package && state.package.brandKitBundlePrice);
    const displayPrice = hasBundle ? Number(state.package.brandKitBundlePrice) : BASE_BRAND_KIT_PRICE;
    finalPriceEl.textContent = `$${displayPrice.toLocaleString()}`;
    bar.classList.toggle('selected', !!state.brandKit);
  });
}

function toggleWidget() {
  const widget = document.getElementById('floating-widget');
  if (widget) widget.classList.toggle('collapsed');
}

function togglePackageDetails(buttonEl) {
  const card = buttonEl.closest('.package-card');
  if (card) {
    const expanded = card.classList.toggle('expanded');
    buttonEl.textContent = expanded ? 'Close Details' : 'View Details';
  }
}

function initCollapsibles() {
  const sections = document.querySelectorAll('[data-collapsible]');
  sections.forEach(section => {
    const header = section.querySelector('[data-collapsible-header]');
    if (!header || header.hasAttribute('data-has-listener')) return;
    header.setAttribute('data-has-listener', 'true');
    header.addEventListener('click', (e) => {
      e.preventDefault();
      section.classList.toggle('collapsed');
    });
  });
}

function injectDownloadButton() {
  const existingBtn = document.getElementById('globalDownloadBtn');
  if(existingBtn) existingBtn.remove();
  const navContainer = document.querySelector('.step-nav-buttons');
  if(navContainer) {
    const btn = document.createElement('button');
    btn.id = 'globalDownloadBtn';
    btn.className = 'btn-download-all';
    btn.textContent = 'Printable Project Outline'; // UPDATE 2 (Label)
    btn.onclick = generatePrintableInvoice; // UPDATE 2 (Action)
    navContainer.insertBefore(btn, navContainer.lastElementChild);
  }
}

// ======================================================
// --- 5. FINALIZATION & STEP 4 LOGIC ---
// ======================================================

function initStep4() {
  if (!document.body.classList.contains('step4')) return;

  // 1. Inject Steps Header if missing
  const headerContainer = document.querySelector('.progress-header');
  if (headerContainer && !headerContainer.innerHTML.trim().includes('step-indicator')) {
      headerContainer.innerHTML = `
        <div class="progress-bar">
          <div class="progress-line-bg"></div>
          <div class="progress-line-fill" style="width:100%;"></div>
          <div class="step-indicator completed">1 <div class="step-label">Goals</div></div>
          <div class="step-indicator completed">2 <div class="step-label">Structure</div></div>
          <div class="step-indicator completed">3 <div class="step-label">Plan</div></div>
          <div class="step-indicator active">4 <div class="step-label">Finalize</div></div>
        </div>
      `;
  }

  // 2. Styling Fix
  const invoiceBox = document.querySelector('.invoice-box');
  if (invoiceBox) {
      invoiceBox.style.background = 'var(--surface-base)';
      invoiceBox.style.border = '1px solid var(--border-light)';
      invoiceBox.style.borderRadius = '12px';
      invoiceBox.style.padding = '30px';
      invoiceBox.style.marginTop = '20px';
      invoiceBox.style.marginBottom = '30px';
  }
  
  // 3. Auto-Fill Form from Step 1 State
  if (document.getElementById('billingName')) document.getElementById('billingName').value = state.clientName || "";
  if (document.getElementById('billingBusiness')) document.getElementById('billingBusiness').value = state.businessName || "";
  if (document.getElementById('billingEmail')) document.getElementById('billingEmail').value = state.clientEmail || "";
  if (document.getElementById('billingPhone')) document.getElementById('billingPhone').value = state.clientPhone || "";
  if (document.getElementById('billingAddress')) document.getElementById('billingAddress').value = state.billingAddress || "";
  
  // UPDATE 3: Admin Email fill
  if (document.getElementById('adminEmail')) document.getElementById('adminEmail').value = state.adminEmail || "";

  // 4. Restore Addons Selection
  if (state.selectedAddons) {
    document.querySelectorAll('.addon-card').forEach(card => {
        const name = card.querySelector('.package-name').innerText;
        if (state.selectedAddons.find(a => a.name === name)) {
            card.classList.add('selected');
        }
    });
  }

  // 5. Restore Custom Service
  if (state.customService && state.customService.active) {
      document.querySelectorAll('.custom-panel').forEach(p => p.classList.remove('hidden'));
      document.getElementById('customServiceName').value = state.customService.name;
      document.getElementById('customServicePrice').value = state.customService.price;
  }

  calculateTotal(); 
}

// Step 4 Helper Functions
function toggleAddon(name, price, element) {
    if (!state.selectedAddons) state.selectedAddons = [];
    
    const existingIndex = state.selectedAddons.findIndex(a => a.name === name);
    if (existingIndex > -1) {
        state.selectedAddons.splice(existingIndex, 1);
        element.classList.remove('selected');
    } else {
        state.selectedAddons.push({ name, price });
        element.classList.add('selected');
    }
    calculateTotal();
    saveState();
}

function updateCustomServiceState() {
    const name = document.getElementById('customServiceName').value;
    const price = Number(document.getElementById('customServicePrice').value);
    
    state.customService = {
        active: (price > 0),
        name: name || "Custom Service",
        price: price || 0
    };
    calculateTotal();
    saveState();
}

// --- UPDATE 2: PRINTABLE INVOICE / PDF FUNCTION ---
function generatePrintableInvoice(event) {
    if(event) event.preventDefault();
    
    // Save current form state
    const cName = document.getElementById('billingName') ? document.getElementById('billingName').value : state.clientName;
    const bName = document.getElementById('billingBusiness') ? document.getElementById('billingBusiness').value : state.businessName;
    
    const items = [];
    if (state.package) items.push(`Package: ${state.package.name} ($${state.package.price})`);
    if (state.brandKit) items.push(`Brand Kit ($${state.package && state.package.brandKitBundlePrice ? state.package.brandKitBundlePrice : BASE_BRAND_KIT_PRICE})`);
    if (state.customBranding.active) items.push(`${state.customBranding.name} ($${state.customBranding.price})`);
    state.selectedAddons.forEach(a => items.push(`${a.name} ($${a.price})`));
    if (state.customService.active) items.push(`${state.customService.name} ($${state.customService.price})`);
    
    const pagesHtml = state.pages.map(p => `<li>${p} ${(state.pagePlans[p] && state.pagePlans[p].notes) ? '<br><small>'+state.pagePlans[p].notes+'</small>' : ''}</li>`).join('');

    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <html>
      <head>
        <title>Project Invoice & Plan</title>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; padding: 40px; color: #333; }
          h1 { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          ul { line-height: 1.6; }
          .total-box { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 1.2rem; font-weight: bold; text-align: right; }
          @media print { .no-print { display: none; } }
          .btn-print { background: #000; color: #fff; padding: 10px 20px; border: none; cursor: pointer; border-radius: 4px; font-size: 16px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <button class="no-print btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
        <h1>Project Scope</h1>
        <div class="meta">
           <div>
             <strong>Client:</strong> ${cName}<br>
             <strong>Business:</strong> ${bName}
           </div>
           <div style="text-align:right;">
             <strong>Date:</strong> ${new Date().toLocaleDateString()}
           </div>
        </div>

        <div class="section">
           <h3>Selected Items</h3>
           <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>

        <div class="section">
           <h3>Sitemap & Notes</h3>
           <ul>${pagesHtml}</ul>
        </div>

        <div class="total-box">
           Total Estimated: ${document.getElementById('final-invoice-total') ? document.getElementById('final-invoice-total').innerText : 'Calculating...'}
        </div>
      </body>
      </html>
    `);
    invoiceWindow.document.close();
}

// --- UPDATE 3: EMAIL LOGIC ---
function handleFinalize(event) {
    event.preventDefault();
    
    state.billing = {
        name: document.getElementById('billingName').value,
        business: document.getElementById('billingBusiness').value,
        email: document.getElementById('billingEmail').value,
        phone: document.getElementById('billingPhone').value,
        address: document.getElementById('billingAddress').value
    };
    state.adminEmail = document.getElementById('adminEmail').value;
    
    saveState();

    // 1. Generate Invoice (Opens in new tab)
    generatePrintableInvoice();

    // 2. Prepare Mailto Link (Emails YOU + Client)
    const totalDisplay = document.getElementById('final-invoice-total') ? document.getElementById('final-invoice-total').innerText : '0';
    const subject = `Project Kickoff: ${state.businessName}`;
    const body = `Hi! I'm ready to start.
    
CLIENT DETAILS:
Name: ${state.billing.name}
Business: ${state.billing.business}
Phone: ${state.billing.phone}

PROJECT SUMMARY:
Package: ${state.package ? state.package.name : 'None'}
Pages: ${state.pages.length} (${state.pages.join(', ')})
Total Estimate: ${totalDisplay}

(Please see attached PDF if generated)
`;
    
    // Construct Mailto
    // TO: Admin Email, CC: Client Email
    const mailtoLink = `mailto:${state.adminEmail}?cc=${state.billing.email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 1000); // Wait 1s so the PDF pop-up isn't blocked by the navigation
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initCollapsibles();
  if (window.location.pathname.includes('step2')) {
    initPageBuilder();
    // No extra call needed here, initPageBuilder now handles highlighting
  }
  if (window.location.pathname.includes('step3')) initStep3();
  if (window.location.pathname.includes('step4')) initStep4();

  calculateTotal();
  updateBrandKitDisplay();
});

// --- CSS STYLES FOR GRID SYSTEM (Injected) ---
const style = document.createElement('style');
style.innerHTML = `
  /* Autocomplete */
  .autocomplete-list { position: absolute; top: 100%; left: 0; right: 0; background: #0f1322; border: 1px solid var(--border-light); max-height: 200px; overflow-y: auto; list-style: none; padding: 0; z-index:1000; }
  .autocomplete-list li { padding: 10px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .autocomplete-list li:hover { background: var(--surface-hover); color: var(--accent-blue); }

  /* Grid Canvas */
  .grid-canvas {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: 50px;
    gap: 10px;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 100% 50px, 8.33% 100%;
    background-color: rgba(0,0,0,0.1); 
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 10px;
    min-height: 300px;
    position: relative;
    user-select: none;
  }
  
  .grid-item {
    background: var(--surface-base);
    border: 1px solid var(--border-light);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    touch-action: none; 
    transition: box-shadow 0.2s, opacity 0.2s;
  }
  
  .grid-item.interacting {
    z-index: 100;
    box-shadow: 0 0 15px rgba(44,166,224,0.5);
    border-color: var(--accent-blue);
    opacity: 0.9;
  }

  .grid-item-content {
    width: 100%; height: 100%;
    display: flex; align-items: center; padding: 0 10px;
  }

  .grid-drag-handle { cursor: grab; margin-right: 8px; color: var(--text-muted); padding: 10px 5px; }
  .grid-label { flex-grow: 1; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none;}
  .grid-remove { cursor: pointer; color: #ff6b6b; padding: 5px; z-index: 10; }
  
  .grid-resize-handle {
    position: absolute; bottom: 0; right: 0;
    width: 15px; height: 15px;
    background: linear-gradient(135deg, transparent 50%, var(--text-muted) 50%);
    cursor: se-resize;
    z-index: 5;
  }

  /* Layout Selector */
  .layout-selector-wrapper { margin-left: auto; padding-left: 10px; }
  .layout-select {
    background: #050508; color: #fff; border: 1px solid var(--border-light);
    padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; max-width: 150px;
  }

  /* Modal */
  .block-library-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; justify-content: center; align-items: center; }
  .block-library-modal { background: #0f1322; padding: 30px; border-radius: 12px; width: 90%; max-width: 600px; border: 1px solid var(--accent-blue); }
  .library-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; max-height: 400px; overflow-y: auto; }
  .library-option { padding: 15px; background: var(--surface-base); border: 1px solid var(--border-light); border-radius: 6px; cursor: pointer; text-align: center; }
  .library-option:hover { background: var(--accent-blue); color: white; }
  .btn-close-modal { background: transparent; border: 1px solid var(--border-light); color: var(--text-muted); padding: 8px 16px; cursor: pointer; float: right; border-radius: 4px; }
`;
document.head.appendChild(style);

/**
 * eClear Super App - Unified Database Service
 * Handles: User Profile, Event Discovery, and Mobility (Fleet)
 */

const fleet = [
    // --- THE FLAGSHIP / LUXURY (6 Vehicles) ---
    { id: 1, name: "Bentley Continental GT", price: 320000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "W12 Engine • Mulliner Interior", secure: true, img: "bentley black car.png" },
    { id: 2, name: "Mercedes-Benz S580", price: 245000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "V8 Bi-Turbo • Chauffeur Package", secure: true, img: "lexus car.png" },
    { id: 16, name: "Rolls-Royce Ghost", price: 450000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "V12 • Starlight Headliner", secure: true, img: "bentley black car.png" },
    { id: 21, name: "BMW i7 M70", price: 210000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "Electric • Executive Lounge", secure: true, img: "lexus car.png" },
    { id: 22, name: "Audi A8 L Horch", price: 195000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "Quattro AWD • Diamond Stitch", secure: true, img: "lexus car.png" },
    { id: 23, name: "Maybach S680", price: 380000000, buyCat: "The Flagship", rentCat: "Luxury/Premium", specs: "V12 Bi-Turbo • Two-Tone Paint", secure: true, img: "bentley black car.png" },

    // --- OFF-ROAD LEGEND / DIPLOMATIC CONVOY (6 Vehicles) ---
    { id: 3, name: "Toyota Prado (Black Edition)", price: 145000000, buyCat: "Off-Road Legend", rentCat: "Diplomatic Convoy", specs: "V6 Diesel • Armored B6 Available", secure: true, img: "prado white car.png" },
    { id: 4, name: "Land Cruiser 300 Series", price: 195000000, buyCat: "Off-Road Legend", rentCat: "Diplomatic Convoy", specs: "Twin Turbo • High Clearance", secure: true, img: "prado white car.png" },
    { id: 8, name: "Toyota LandCruiser V8", price: 120000000, buyCat: "Off-Road Legend", rentCat: "Diplomatic Convoy", specs: "V8 Armored • Security Ready", secure: true, img: "prado white car.png" },
    { id: 7, name: "Land Rover Defender 130", price: 180000000, buyCat: "Off-Road Legend", rentCat: "SUV/Crossover", specs: "D300 AWD • 8 Seater", secure: false, img: "prado white car.png" },
    { id: 24, name: "Lexus LX600 Ultra", price: 230000000, buyCat: "Off-Road Legend", rentCat: "Diplomatic Convoy", specs: "V6 Twin Turbo • VIP Seating", secure: true, img: "prado white car.png" },
    { id: 25, name: "G-Wagon G63 AMG", price: 295000000, buyCat: "Off-Road Legend", rentCat: "Diplomatic Convoy", specs: "V8 Handcrafted • B6 Armored", secure: true, img: "bentley black car.png" },

    // --- URBAN EXPLORER / ELECTRIC (6 Vehicles) ---
    { id: 6, name: "Tesla Model 3", price: 65000000, buyCat: "Urban Explorer", rentCat: "Electric/Hybrid", specs: "Electric • 500km Range", secure: false, img: "lexus car.png" },
    { id: 17, name: "Tesla Model Y", price: 75000000, buyCat: "Urban Explorer", rentCat: "Electric/Hybrid", specs: "Dual Motor • AWD", secure: false, img: "lexus car.png" },
    { id: 9, name: "Range Rover Evoque", price: 95000000, buyCat: "Urban Explorer", rentCat: "SUV/Crossover", specs: "P250 • Panoramic Roof", secure: false, img: "bentley black car.png" },
    { id: 14, name: "Kia Picanto GT-Line", price: 18000000, buyCat: "Urban Explorer", rentCat: "Mini/Economy", specs: "1.2L • Tech Package", secure: false, img: "lexus car.png" },
    { id: 18, name: "Fiat 500e", price: 28000000, buyCat: "Urban Explorer", rentCat: "Mini/Economy", specs: "Pure Electric City Car", secure: false, img: "lexus car.png" },
    { id: 26, name: "Mini Cooper SE", price: 32000000, buyCat: "Urban Explorer", rentCat: "Electric/Hybrid", specs: "Electric • Quick Charge", secure: false, img: "lexus car.png" },

    // --- DAILY DRIVER / COMPACT & STANDARD (6 Vehicles) ---
    { id: 27, name: "Toyota Corolla Hybrid", price: 45000000, buyCat: "Daily Driver", rentCat: "Compact/Intermediate", specs: "1.8L Hybrid • Ultra Efficient", secure: false, img: "lexus car.png" },
    { id: 15, name: "Hyundai Elantra", price: 38000000, buyCat: "Daily Driver", rentCat: "Compact/Intermediate", specs: "SmartStream Engine • Modern Tech", secure: false, img: "lexus car.png" },
    { id: 10, name: "Honda Civic RS", price: 42000000, buyCat: "Daily Driver", rentCat: "Standard/Full-Size", specs: "1.5L Turbo • Sport Tuned", secure: false, img: "lexus car.png" },
    { id: 11, name: "Toyota Camry V6", price: 55000000, buyCat: "Daily Driver", rentCat: "Standard/Full-Size", specs: "3.5L V6 • Reliable Executive", secure: false, img: "lexus car.png" },
    { id: 28, name: "Nissan Altima", price: 39500000, buyCat: "Daily Driver", rentCat: "Standard/Full-Size", specs: "VC-Turbo • ProPILOT Assist", secure: false, img: "lexus car.png" },
    { id: 29, name: "Volkswagen Jetta GLI", price: 48000000, buyCat: "Daily Driver", rentCat: "Compact/Intermediate", specs: "Turbocharged • Performance Brakes", secure: false, img: "lexus car.png" },

    // --- THE MOVER / VAN (6 Vehicles) ---
    { id: 12, name: "Ford Transit High Roof", price: 85000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "15 Seater • Diesel Manual", secure: false, img: "prado white car.png" },
    { id: 13, name: "Toyota Hiace (New Model)", price: 78000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "12 Seater • Luxury Commuter", secure: false, img: "prado white car.png" },
    { id: 19, name: "Mercedes Sprinter VIP", price: 110000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "Executive Shuttle • Armored", secure: true, img: "prado white car.png" },
    { id: 30, name: "Volkswagen Transporter", price: 62000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "T6.1 • 4Motion AWD", secure: false, img: "prado white car.png" },
    { id: 31, name: "Hyundai Staria", price: 68000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "Futuristic Design • 11 Seater", secure: false, img: "prado white car.png" },
    { id: 32, name: "Sienna Platinum Hybrid", price: 92000000, buyCat: "The Mover", rentCat: "Minivan/Passenger Van", specs: "AWD Hybrid • Ottoman Seats", secure: false, img: "lexus car.png" }
];

const databaseService = {
    _user: {
        profile: {
            name: "Alex eClear",
            location: "Abuja, Nigeria",
            walletBalance: "₦45,000.50",
            creditScore: 720,
            creditStatus: "STABLE",
            avatar: "assets/profiles/alex.png"
        }
    },

    _events: [
        {
            id: "ev_001",
            title: "Valentine's Secret Rooftop",
            date_raw: "2026-02-14",
            time_display: "08:00 PM",
            location: "Gwarinpa, Abuja",
            description: "An exclusive rooftop experience under the stars.",
            poster_url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800",
            status: "Selling Fast",
            price: "₦15,000",
            attending_count: 142,
            is_personal: false,
            is_live: false,
            views: 1200
        },
        {
            id: "ev_002",
            title: "My Birthday Dinner",
            date_raw: "2026-02-11",
            time_display: "07:00 PM",
            location: "Maitama, Abuja",
            description: "Celebrating another year!",
            poster_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800",
            status: "Private",
            price: "Free",
            attending_count: 12,
            is_personal: true,
            is_live: true,
            views: 45
        }
    ],

    // --- METHODS ---
    async getFleet() { return fleet; },
    getCarsByBuyCategory(cat) { return fleet.filter(c => c.buyCat === cat); },
    getCarsByRentCategory(cat) { return fleet.filter(c => c.rentCat === cat); },
    getCarById(id) { return fleet.find(c => c.id === id); },
    async getUserData() { return this._user; },
    async getAllEvents() { return this._events; }
};

// Global Exposure
window.databaseService = databaseService;
window.fleet = fleet;
window.mockEvents = databaseService._events;
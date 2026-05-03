// ============================================================
//  BMG BIG BIKE RENTALS — Fleet Data
//  To add a new bike: copy one object, fill in the fields,
//  and drop the photo in images/bikes/
// ============================================================

const FACEBOOK_URL = "https://www.facebook.com/BMGbigbikes";
const PHONE        = "0991 482 7609";

const bikes = [
  {
    id:           "cfmoto-450sr",
    name:         "CFMOTO 450SR",
    type:         "sportbike",          // "sportbike" | "naked"
    cc:           449,
    color:        "Black / Red",
    year:         2024,
    mileage:      "4,200 km",
    pricePerDay:  1800,
    image:        "images/bikes/cfmoto-450sr.jpg",
    status:       "available",          // "available" | "booked"
    availableFrom: null,               // e.g. "May 10, 2026" if booked
    description:  "The CFMOTO 450SR is a sharp, full-fairing sportbike featuring aggressive styling and a smooth 449cc parallel-twin engine. Perfect for riders craving the sportbike experience with refined everyday usability.",
    specs: {
      engine:       "449cc, Parallel Twin",
      power:        "47 HP @ 9,500 rpm",
      torque:       "43 Nm @ 7,500 rpm",
      transmission: "6-speed",
      weight:       "193 kg",
      seatHeight:   "790 mm"
    }
  },
  {
    id:           "suzuki-gsxr-750",
    name:         "Suzuki GSX-R 750",
    type:         "sportbike",
    cc:           750,
    color:        "Black",
    year:         2009,
    mileage:      "22,000 km",
    pricePerDay:  2500,
    image:        "images/bikes/suzuki-gsxr.jpg",
    status:       "available",
    availableFrom: null,
    description:  "The legendary Suzuki GSX-R 750 — the benchmark of sportbikes. A perfect harmony of power, handling, and track-bred performance. The Gixxer delivers an electrifying ride on open highways and twisty mountain roads alike.",
    specs: {
      engine:       "749cc, Inline-4",
      power:        "150 HP @ 13,200 rpm",
      torque:       "85 Nm @ 10,800 rpm",
      transmission: "6-speed",
      weight:       "163 kg",
      seatHeight:   "810 mm"
    }
  },
  {
    id:           "suzuki-gsxs-750",
    name:         "Suzuki GSX-S 750",
    type:         "naked",
    cc:           749,
    color:        "Black / Blue",
    year:         2020,
    mileage:      "12,500 km",
    pricePerDay:  2000,
    image:        "images/bikes/suzuki-gsxs.jpg",
    status:       "available",
    availableFrom: null,
    description:  "Built on GSX-R DNA, the Suzuki GSX-S 750 is a naked street fighter that packs punchy inline-4 performance into an upright, commanding riding position. Versatile enough for daily rides, thrilling enough for weekend escapes.",
    specs: {
      engine:       "749cc, Inline-4",
      power:        "114 HP @ 10,500 rpm",
      torque:       "81 Nm @ 9,000 rpm",
      transmission: "6-speed",
      weight:       "213 kg",
      seatHeight:   "815 mm"
    }
  },
  {
    id:           "cfmoto-nk400",
    name:         "CFMOTO NK400",
    type:         "naked",
    cc:           400,
    color:        "TBA",
    year:         2024,
    mileage:      "TBA",
    pricePerDay:  1800,
    image:        "images/bikes/cfmoto-nk400.jpg",
    status:       "available",
    availableFrom: null,
    description:  "The CFMOTO NK400 is a sleek, mid-sized naked bike built for the streets. Its punchy 400cc parallel-twin engine delivers smooth, confident power — whether you're commuting through the city or carving open roads.",
    specs: {
      engine:       "400cc, Parallel Twin",
      power:        "42 HP @ 9,500 rpm",
      torque:       "37 Nm @ 7,500 rpm",
      transmission: "6-speed",
      weight:       "175 kg",
      seatHeight:   "780 mm"
    }
  },
  {
    id:           "kawasaki-z1",
    name:         "Kawasaki Z1",
    type:         "naked",
    cc:           900,
    color:        "TBA",
    year:         2024,
    mileage:      "TBA",
    pricePerDay:  2500,
    image:        "images/bikes/kawasaki-z1.jpg",
    status:       "available",
    availableFrom: null,
    description:  "The Kawasaki Z1 is an icon — raw, upright, and unmistakably aggressive. With its powerful engine and streetfighter stance, it commands every road and turns heads wherever it goes.",
    specs: {
      engine:       "900cc, Inline-4",
      power:        "125 HP @ 10,000 rpm",
      torque:       "98 Nm @ 7,700 rpm",
      transmission: "6-speed",
      weight:       "210 kg",
      seatHeight:   "820 mm"
    }
  },
  {
    id:           "kawasaki-zx10r",
    name:         "Kawasaki ZX-10R",
    type:         "sportbike",
    cc:           998,
    color:        "TBA",
    year:         2024,
    mileage:      "TBA",
    pricePerDay:  3500,
    image:        "images/bikes/kawasaki-zx10r.jpg",
    status:       "available",
    availableFrom: null,
    description:  "The Kawasaki ZX-10R is a World Superbike Championship-derived liter-class beast. Ferocious power, world-class electronics, and track-ready performance make this the ultimate ride for experienced riders chasing the limit.",
    specs: {
      engine:       "998cc, Inline-4",
      power:        "203 HP @ 13,200 rpm",
      torque:       "114 Nm @ 11,400 rpm",
      transmission: "6-speed",
      weight:       "207 kg",
      seatHeight:   "835 mm"
    }
  },
  {
    id:           "kawasaki-ninja1000",
    name:         "Kawasaki Ninja 1000",
    type:         "sportbike",
    cc:           1043,
    color:        "TBA",
    year:         2024,
    mileage:      "TBA",
    pricePerDay:  3000,
    image:        "images/bikes/kawasaki-ninja1000.jpg",
    status:       "available",
    availableFrom: null,
    description:  "The Kawasaki Ninja 1000 is a sport-touring powerhouse — combining aggressive inline-4 performance with long-ride comfort. Whether you're carving mountain passes or cruising long stretches of highway, the Ninja 1000 handles it all with confidence.",
    specs: {
      engine:       "1,043cc, Inline-4",
      power:        "142 HP @ 10,000 rpm",
      torque:       "111 Nm @ 7,300 rpm",
      transmission: "6-speed",
      weight:       "235 kg",
      seatHeight:   "820 mm"
    }
  }
];

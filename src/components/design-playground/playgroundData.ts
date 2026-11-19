export interface SpkSubScores {
  price: number;
  location: number;
  facilities: number;
  rating: number;
}

export interface SpkWeights {
  price: number;
  location: number;
  facilities: number;
  rating: number;
}

export interface PlaygroundKos {
  id: number;
  name: string;
  district: "Tlogosari" | "Tembalang" | "Pleburan" | "Pedurungan";
  address: string;
  landmark: string;
  distanceKm: number;
  monthlyPrice: number;
  rating: number;
  reviewCount: number;
  availableRooms: number;
  totalRooms: number;
  roomSize: string;
  genderPolicy: "Women" | "Co-Living" | "Men";
  image: string;
  gallery: string[];
  mapPosition: { x: number; y: number };
  subScores: SpkSubScores;
  facilities: string[];
  includedUtilities: string[];
  vibeTags: string[];
  description: string;
}

export interface VibePreset {
  id: string;
  label: string;
  query: string;
  tagMatch: string;
  maxPrice?: number;
}

export const DEFAULT_SPK_WEIGHTS: SpkWeights = {
  price: 30,
  location: 25,
  facilities: 25,
  rating: 20,
};

export const VIBE_PRESETS: VibePreset[] = [
  {
    id: "near-usm",
    label: "Near USM under Rp 1.5M",
    query: "Quiet boarding room near USM under Rp 1.5M with en-suite bathroom",
    tagMatch: "near-usm",
    maxPrice: 1500000,
  },
  {
    id: "wfh-wifi",
    label: "Quiet room with fast WiFi for WFH",
    query: "Calm workspace desk with 100 Mbps fiber WiFi for remote study",
    tagMatch: "wfh-ready",
  },
  {
    id: "ensuite-ac",
    label: "En-suite bath & AC",
    query: "Private en-suite bathroom with air conditioning and natural light",
    tagMatch: "ensuite",
  },
  {
    id: "best-budget",
    label: "Best budget near campus",
    query: "Affordable clean single room walking distance to campus corridor",
    tagMatch: "budget",
  },
];

export const PLAYGROUND_KOS_LIST: PlaygroundKos[] = [
  {
    id: 101,
    name: "Saphira Living Tlogosari",
    district: "Tlogosari",
    address: "Jl. Soekarno Hatta No. 18, Tlogosari",
    landmark: "USM Campus",
    distanceKm: 0.6,
    monthlyPrice: 1450000,
    rating: 4.9,
    reviewCount: 28,
    availableRooms: 3,
    totalRooms: 14,
    roomSize: "3.5 x 4.0 m",
    genderPolicy: "Women",
    image: "/images/playground/kos-tlogosari.jpg",
    gallery: [
      "/images/playground/kos-tlogosari.jpg",
      "/images/playground/detail-study.jpg",
      "/images/playground/detail-courtyard.jpg",
    ],
    mapPosition: { x: 64, y: 39 },
    subScores: {
      price: 92,
      location: 98,
      facilities: 90,
      rating: 96,
    },
    facilities: [
      "En-suite Bathroom",
      "100 Mbps Fiber WiFi",
      "AC",
      "Oak Study Desk",
      "Shared Kitchen",
      "24/7 Smart Lock",
    ],
    includedUtilities: [
      "100 Mbps Fiber WiFi",
      "Water & Trash Collection",
      "Weekly Room Cleaning",
      "Motorbike Roof Parking",
    ],
    vibeTags: ["near-usm", "fast-wifi", "ensuite", "quiet"],
    description:
      "Sunlit private rooms three minutes by bike from USM. Designed around an airy courtyard with quiet study corners, solid oak desks, and transparent all-in monthly billing.",
  },
  {
    id: 102,
    name: "Teras Kayu Studio Tembalang",
    district: "Tembalang",
    address: "Jl. Sirojudin No. 42, Tembalang",
    landmark: "Undip Tembalang",
    distanceKm: 0.9,
    monthlyPrice: 1750000,
    rating: 4.8,
    reviewCount: 41,
    availableRooms: 2,
    totalRooms: 18,
    roomSize: "4.0 x 4.5 m",
    genderPolicy: "Co-Living",
    image: "/images/playground/kos-tembalang.jpg",
    gallery: [
      "/images/playground/kos-tembalang.jpg",
      "/images/playground/detail-study.jpg",
      "/images/playground/detail-courtyard.jpg",
    ],
    mapPosition: { x: 62, y: 72 },
    subScores: {
      price: 78,
      location: 91,
      facilities: 95,
      rating: 94,
    },
    facilities: [
      "En-suite Bathroom",
      "Dual-Band Mesh WiFi",
      "AC",
      "Ergonomic Study Nook",
      "Laundry Pantry",
      "CCTV & Keycard",
    ],
    includedUtilities: [
      "Dual-Band Mesh WiFi",
      "Water & High-Pressure Heater",
      "Bi-Weekly Linen Refresh",
      "Co-Working Lounge Access",
    ],
    vibeTags: ["wfh-ready", "fast-wifi", "ensuite", "ac"],
    description:
      "Scandinavian-tropical studio rooms tucked on a calm side street near Undip. Built for thesis writers and hybrid interns needing reliable mesh internet and daylight ventilation.",
  },
  {
    id: 103,
    name: "Pavilion Pleburan Co-Living",
    district: "Pleburan",
    address: "Jl. Kusumawardani No. 9, Pleburan",
    landmark: "Simpang Lima",
    distanceKm: 1.8,
    monthlyPrice: 2150000,
    rating: 4.9,
    reviewCount: 19,
    availableRooms: 1,
    totalRooms: 10,
    roomSize: "4.2 x 5.0 m",
    genderPolicy: "Co-Living",
    image: "/images/playground/kos-pleburan.jpg",
    gallery: [
      "/images/playground/kos-pleburan.jpg",
      "/images/playground/detail-courtyard.jpg",
      "/images/playground/detail-study.jpg",
    ],
    mapPosition: { x: 26, y: 52 },
    subScores: {
      price: 66,
      location: 84,
      facilities: 98,
      rating: 97,
    },
    facilities: [
      "Private Balcony",
      "En-suite Bathroom",
      "150 Mbps Fiber WiFi",
      "AC",
      "Courtyard Lounge",
      "Mini Fridge",
    ],
    includedUtilities: [
      "150 Mbps Dedicated Fiber",
      "Weekly Housekeeping",
      "Mineral Water Refill",
      "Secured Car & Bike Bay",
    ],
    vibeTags: ["wfh-ready", "quiet", "ensuite", "ac"],
    description:
      "Boutique co-living house in central Semarang featuring private glass-door balconies, lush greenery, and acoustic window framing for uninterrupted deep work.",
  },
  {
    id: 104,
    name: "Loka Residence Pedurungan",
    district: "Pedurungan",
    address: "Jl. Majapahit Gang Melati 4, Pedurungan",
    landmark: "USM Campus",
    distanceKm: 1.1,
    monthlyPrice: 1050000,
    rating: 4.6,
    reviewCount: 34,
    availableRooms: 5,
    totalRooms: 20,
    roomSize: "3.0 x 3.5 m",
    genderPolicy: "Men",
    image: "/images/playground/kos-pedurungan.jpg",
    gallery: [
      "/images/playground/kos-pedurungan.jpg",
      "/images/playground/detail-study.jpg",
      "/images/playground/detail-courtyard.jpg",
    ],
    mapPosition: { x: 77, y: 56 },
    subScores: {
      price: 98,
      location: 86,
      facilities: 78,
      rating: 85,
    },
    facilities: [
      "En-suite Bathroom",
      "WiFi 50 Mbps",
      "AC",
      "Teak Desk & Wardrobe",
      "Motorbike Shelter",
    ],
    includedUtilities: [
      "50 Mbps Shared Fiber",
      "Water & Waste Service",
      "Common Pantry Gas",
    ],
    vibeTags: ["near-usm", "budget", "ensuite"],
    description:
      "Straightforward, cleanly maintained rooms along the Majapahit corridor with crisp white linens, louvered breeze windows, and the strongest monthly value near USM.",
  },
];

export function computeWeightedMatchScore(
  kos: PlaygroundKos,
  weights: SpkWeights
): number {
  const totalWeight =
    weights.price + weights.location + weights.facilities + weights.rating;
  if (totalWeight <= 0) return 0;

  const weightedSum =
    kos.subScores.price * weights.price +
    kos.subScores.location * weights.location +
    kos.subScores.facilities * weights.facilities +
    kos.subScores.rating * weights.rating;

  return Math.round(weightedSum / totalWeight);
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

import {
  UtensilsCrossed,
  Wrench,
  Scissors,
  HeartPulse,
  Scale,
  Home,
  Hammer,
  ShoppingBag,
  Briefcase,
  ShoppingCart,
  Dumbbell,
  GraduationCap,
  Car,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  slug: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "restaurants",
    name: "Restaurants",
    icon: UtensilsCrossed,
    description: "Restaurants, cafés, taquerías, and food spots in 90255",
  },
  {
    slug: "auto-repair",
    name: "Auto Repair",
    icon: Wrench,
    description: "Auto repair shops, mechanics, and car services in 90255",
  },
  {
    slug: "beauty-barber",
    name: "Beauty & Barber",
    icon: Scissors,
    description: "Salons, barbershops, and beauty services in 90255",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: HeartPulse,
    description: "Doctors, clinics, dentists, and healthcare providers in 90255",
  },
  {
    slug: "legal",
    name: "Legal",
    icon: Scale,
    description: "Attorneys, law firms, and legal services in 90255",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: Home,
    description: "Real estate agents, brokers, and property services in 90255",
  },
  {
    slug: "home-services",
    name: "Home Services",
    icon: Hammer,
    description: "Plumbers, electricians, cleaners, and home services in 90255",
  },
  {
    slug: "retail",
    name: "Retail",
    icon: ShoppingBag,
    description: "Retail stores and shops in 90255",
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: Briefcase,
    description: "Accountants, consultants, and professional services in 90255",
  },
  {
    slug: "grocery",
    name: "Grocery",
    icon: ShoppingCart,
    description: "Grocery stores, markets, and food shops in 90255",
  },
  {
    slug: "fitness",
    name: "Fitness",
    icon: Dumbbell,
    description: "Gyms, fitness studios, and wellness centers in 90255",
  },
  {
    slug: "education",
    name: "Education",
    icon: GraduationCap,
    description: "Schools, tutoring, and educational services in 90255",
  },
  {
    slug: "automotive",
    name: "Automotive",
    icon: Car,
    description: "Car dealers, auto parts, and automotive services in 90255",
  },
  {
    slug: "other",
    name: "Other",
    icon: MoreHorizontal,
    description: "Other businesses and services in 90255",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

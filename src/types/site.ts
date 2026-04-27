export interface SiteConfig {
  projectId: string;
  niche: string;
  city: string;
  services: string[];
  zones: string[];
  avatar: string;
  factoryApi: string;
  slug: string;
  domain: string;
  gmbPlaceId: string | null;
  ga4MeasurementId: string | null;
  businessName: string | null;
  phone: string | null;
  address: Record<string, string> | null;
  geo: { latitude: number; longitude: number } | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageContent {
  id: string;
  projectId: string;
  slug: string;
  type: 'homepage' | 'service' | 'zone' | 'service_zone' | 'blog';
  title: string;
  body: string;
  faq: FaqItem[];
  meta: { description: string; canonical: string };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

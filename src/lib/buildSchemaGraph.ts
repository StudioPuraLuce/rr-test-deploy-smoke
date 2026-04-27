import type { SiteConfig, FaqItem, BreadcrumbItem } from '../types/site';

export interface SchemaProps {
  pageType: 'homepage' | 'service' | 'zone' | 'service_zone' | 'blog' | 'blog_post';
  serviceSlug?: string;
  zoneSlug?: string;
  faqs?: FaqItem[];
  breadcrumbs: BreadcrumbItem[];
}

export interface SchemaOutput {
  '@context': string;
  '@graph': Record<string, unknown>[];
}

const nicheTypeMap: Record<string, string> = {
  ristrutturazioni: 'HomeAndConstructionBusiness',
  idraulico: 'Plumber',
  elettricista: 'Electrician',
  pulizie: 'HousePainter',
  giardinaggio: 'LandscapeService',
};

export function buildSchemaGraph(config: SiteConfig, props: SchemaProps): SchemaOutput {
  const { pageType, serviceSlug, zoneSlug, faqs = [], breadcrumbs } = props;
  const siteUrl = `https://${config.domain}`;
  const graph: Record<string, unknown>[] = [];

  // 1. LocalBusiness — omette campi null (D-11)
  const localBusinessType = nicheTypeMap[config.niche] ?? 'LocalBusiness';
  const localBusiness: Record<string, unknown> = {
    '@type': localBusinessType,
    '@id': `${siteUrl}/#organization`,
    url: siteUrl,
    areaServed: config.zones.map(zone => ({ '@type': 'City', name: zone })),
  };
  if (config.businessName) localBusiness.name = config.businessName;
  if (config.phone) localBusiness.telephone = config.phone;
  if (config.address) {
    localBusiness.address = { '@type': 'PostalAddress', ...config.address, addressCountry: 'IT' };
  }
  if (config.geo) {
    localBusiness.geo = { '@type': 'GeoCoordinates', ...config.geo };
  }
  graph.push(localBusiness);

  // 2. Service node (D-13) — su service e service_zone
  if (serviceSlug && (pageType === 'service' || pageType === 'service_zone')) {
    graph.push({
      '@type': 'Service',
      serviceType: serviceSlug.replace(/-/g, ' '),
      provider: { '@id': `${siteUrl}/#organization` },
      areaServed: zoneSlug
        ? { '@type': 'City', name: zoneSlug }
        : config.zones.map(z => ({ '@type': 'City', name: z })),
    });
  }

  // 3. FAQPage (D-14) — su homepage e service con faqs non vuoti
  if (faqs.length > 0 && (pageType === 'homepage' || pageType === 'service')) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  // 4. BreadcrumbList (D-15) — tutte le pagine
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

import type { PageContent } from './fetchPages';

export interface StaticPath {
  params: { service: string; zone: string };
  props: { content: PageContent };
}

export function buildServiceZonePaths(
  services: string[],
  zones: string[],
  pages: PageContent[]
): StaticPath[] {
  const paths: StaticPath[] = [];
  for (const service of services) {
    for (const zone of zones) {
      const slug = `${service}/${zone}`;
      const content = pages.find(p => p.slug === slug);
      if (!content) {
        throw new Error(
          `[build] Contenuto D1 mancante per slug "${slug}" — eseguire Phase 3 prima della build`
        );
      }
      paths.push({
        params: { service: String(service), zone: String(zone) },
        props: { content }
      });
    }
  }
  return paths;
}

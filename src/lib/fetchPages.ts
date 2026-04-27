import siteConfig from '../data/site.config.json';

export interface PageContent {
  id: string;
  projectId: string;
  slug: string;
  type: 'homepage' | 'service' | 'zone' | 'service_zone' | 'blog';
  title: string;
  body: string;
  // ATTENZIONE: body è HTML raw — Phase 3 è responsabile della sanitizzazione prima della scrittura su D1.
  // Non usare set:html su contenuto da input utente.
  faq: Array<{ question: string; answer: string }>;
  meta: { description: string; canonical: string };
}

export async function fetchAllPages(): Promise<PageContent[]> {
  const url = `${siteConfig.factoryApi}/api/sites/${siteConfig.projectId}/pages`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `[build] factory-core ${url} returned ${res.status} — aborting build`
    );
  }
  const data = await res.json() as { pages: PageContent[] };
  return data.pages;
}

export function requirePage(pages: PageContent[], slug: string): PageContent {
  const page = pages.find(p => p.slug === slug);
  if (!page) {
    throw new Error(
      `[build] Contenuto D1 mancante per slug "${slug}" — eseguire Phase 3 prima della build`
    );
  }
  return page;
}

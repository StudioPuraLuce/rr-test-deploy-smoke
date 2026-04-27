import { describe, it, expect } from 'vitest';
import siteConfigFixture from './fixtures/site.config.json';

// @ts-expect-error — file non ancora creato (Piano 03)
import { buildSchemaGraph } from '../src/lib/buildSchemaGraph';

describe('buildSchemaGraph — ghost mode (tutti i campi null)', () => {
  const config = siteConfigFixture; // businessName, phone, address, geo sono null

  it('produce un oggetto con @context e @graph array', () => {
    const schema = buildSchemaGraph(config, { pageType: 'homepage', breadcrumbs: [{ name: 'Home', url: 'https://ristrutturazioniformia.it/' }], faqs: [] });
    expect(schema['@context']).toBe('https://schema.org');
    expect(Array.isArray(schema['@graph'])).toBe(true);
  });

  it('omette "name" dal nodo LocalBusiness quando businessName è null', () => {
    const schema = buildSchemaGraph(config, { pageType: 'homepage', breadcrumbs: [], faqs: [] });
    const lb = schema['@graph'].find((n: any) => n['@type'] === 'LocalBusiness' || n['@type'] === 'HomeAndConstructionBusiness');
    expect(lb).toBeDefined();
    expect(lb.name).toBeUndefined();
  });

  it('omette "telephone" quando phone è null', () => {
    const schema = buildSchemaGraph(config, { pageType: 'homepage', breadcrumbs: [], faqs: [] });
    const lb = schema['@graph'].find((n: any) => n.url);
    expect(lb.telephone).toBeUndefined();
  });

  it('contiene BreadcrumbList su ogni pageType', () => {
    const schema = buildSchemaGraph(config, {
      pageType: 'service_zone',
      serviceSlug: 'ristrutturazioni-interni',
      zoneSlug: 'formia',
      breadcrumbs: [{ name: 'Home', url: 'https://ristrutturazioniformia.it/' }],
      faqs: []
    });
    const bc = schema['@graph'].find((n: any) => n['@type'] === 'BreadcrumbList');
    expect(bc).toBeDefined();
    expect(bc.itemListElement).toHaveLength(1);
  });

  it('contiene nodo Service su pageType service_zone', () => {
    const schema = buildSchemaGraph(config, {
      pageType: 'service_zone',
      serviceSlug: 'ristrutturazioni-interni',
      zoneSlug: 'formia',
      breadcrumbs: [],
      faqs: []
    });
    const service = schema['@graph'].find((n: any) => n['@type'] === 'Service');
    expect(service).toBeDefined();
    expect(service.areaServed).toMatchObject({ '@type': 'City', name: 'formia' });
  });

  it('contiene FAQPage su homepage quando faqs non è vuoto', () => {
    const schema = buildSchemaGraph(config, {
      pageType: 'homepage',
      breadcrumbs: [],
      faqs: [{ question: 'Domanda?', answer: 'Risposta.' }]
    });
    const faq = schema['@graph'].find((n: any) => n['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    expect(faq.mainEntity).toHaveLength(1);
  });

  it('NON include FAQPage su homepage quando faqs è vuoto', () => {
    const schema = buildSchemaGraph(config, { pageType: 'homepage', breadcrumbs: [], faqs: [] });
    const faq = schema['@graph'].find((n: any) => n['@type'] === 'FAQPage');
    expect(faq).toBeUndefined();
  });
});

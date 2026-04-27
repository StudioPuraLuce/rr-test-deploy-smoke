import { describe, it, expect } from 'vitest';
import siteConfigFixture from './fixtures/site.config.json';

// @ts-expect-error — file non ancora creato (Piano 03)
import { buildServiceZonePaths } from '../src/lib/buildPaths';

// Genera mockPages con tutte le combinazioni service × zone necessarie per i test
const mockPagesAll = siteConfigFixture.services.flatMap(s =>
  siteConfigFixture.zones.map(z => ({
    id: `${s}-${z}`, projectId: 'test', slug: `${s}/${z}`,
    type: 'service_zone' as const, title: '', body: '', faq: [],
    meta: { description: '', canonical: '' }
  }))
);

describe('buildServiceZonePaths', () => {
  it('produce services.length × zones.length paths', () => {
    const paths = buildServiceZonePaths(siteConfigFixture.services, siteConfigFixture.zones, mockPagesAll);
    expect(paths).toHaveLength(siteConfigFixture.services.length * siteConfigFixture.zones.length);
  });

  it('ogni path ha params.service e params.zone come stringhe', () => {
    const mockPages = siteConfigFixture.services.flatMap(s =>
      siteConfigFixture.zones.map(z => ({
        id: `${s}-${z}`, projectId: 'test', slug: `${s}/${z}`,
        type: 'service_zone' as const, title: '', body: '', faq: [],
        meta: { description: '', canonical: '' }
      }))
    );
    const paths = buildServiceZonePaths(siteConfigFixture.services, siteConfigFixture.zones, mockPages);
    paths.forEach(p => {
      expect(typeof p.params.service).toBe('string');
      expect(typeof p.params.zone).toBe('string');
    });
  });

  it('lancia Error quando il contenuto per uno slug è mancante', () => {
    expect(() => buildServiceZonePaths(siteConfigFixture.services, siteConfigFixture.zones, [])).toThrow();
  });
});

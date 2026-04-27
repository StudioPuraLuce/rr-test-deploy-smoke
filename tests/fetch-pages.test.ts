import { describe, it, expect, vi, beforeEach } from 'vitest';

// Questi import falliranno finché Piano 03 non crea i file — comportamento atteso (RED)
// @ts-expect-error — file non ancora creato
import { fetchAllPages, requirePage, type PageContent } from '../src/lib/fetchPages';

const mockPages: PageContent[] = [
  {
    id: '1', projectId: 'test-project-001', slug: 'homepage', type: 'homepage',
    title: 'Ristrutturazioni Formia', body: '<p>Test</p>',
    faq: [{ question: 'Q?', answer: 'A.' }],
    meta: { description: 'Meta test', canonical: 'https://ristrutturazioniformia.it/' }
  },
  {
    id: '2', projectId: 'test-project-001', slug: 'ristrutturazioni-interni/formia',
    type: 'service_zone', title: 'Ristrutturazioni Formia Interni', body: '<p>Test</p>',
    faq: [], meta: { description: 'Meta', canonical: 'https://ristrutturazioniformia.it/ristrutturazioni-interni/formia/' }
  }
];

describe('fetchAllPages', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('chiama fetch con URL corretto (factoryApi + projectId)', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ pages: mockPages })
    });
    vi.stubGlobal('fetch', fetchMock);

    await fetchAllPages();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/sites/test-project-001/pages')
    );
  });

  it('lancia Error con status code se risposta non ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    await expect(fetchAllPages()).rejects.toThrow('503');
  });
});

describe('requirePage', () => {
  it('restituisce la pagina quando lo slug esiste', () => {
    const page = requirePage(mockPages, 'homepage');
    expect(page.slug).toBe('homepage');
  });

  it('lancia Error con messaggio che include lo slug mancante', () => {
    expect(() => requirePage(mockPages, 'slug-inesistente')).toThrow('slug-inesistente');
  });

  it('il messaggio di errore include "Phase 3" come hint diagnostico', () => {
    expect(() => requirePage(mockPages, 'slug-inesistente')).toThrow('Phase 3');
  });
});

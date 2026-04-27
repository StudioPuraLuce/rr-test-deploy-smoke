const http = require('http');

const MOCK_PAGES = [
  { id: '1', projectId: 'dev-ristrutturazioni-formia', slug: 'homepage', type: 'homepage',
    title: 'Ristrutturazioni Formia — Preventivi Gratuiti', body: '<h1>Ristrutturazioni a Formia</h1><p>Il tuo esperto locale.</p>',
    faq: [{ question: 'Quanto costa?', answer: 'Dipende dal progetto.' }],
    meta: { description: 'Ristrutturazioni Formia, prezzi onesti.', canonical: 'https://ristrutturazioniformia.it/' } },
];

// Genera pagine service, zone, service_zone per i valori della fixture
const services = ['ristrutturazioni-interni', 'rifacimento-bagno', 'ristrutturazioni-esterni'];
const zones = ['formia', 'gaeta', 'minturno', 'fondi', 'terracina', 'sperlonga', 'itri', 'cassino', 'frosinone'];

services.forEach(s => {
  MOCK_PAGES.push({ id: `s-${s}`, projectId: 'dev-ristrutturazioni-formia', slug: s, type: 'service',
    title: `${s.replace(/-/g, ' ')} a Formia`, body: `<h1>${s.replace(/-/g, ' ')}</h1>`,
    faq: [], meta: { description: `${s} Formia`, canonical: `https://ristrutturazioniformia.it/${s}/` } });
});

zones.forEach(z => {
  MOCK_PAGES.push({ id: `z-${z}`, projectId: 'dev-ristrutturazioni-formia', slug: `zone/${z}`, type: 'zone',
    title: `Ristrutturazioni a ${z}`, body: `<h1>Ristrutturazioni ${z}</h1>`,
    faq: [], meta: { description: `Ristrutturazioni ${z}`, canonical: `https://ristrutturazioniformia.it/zone/${z}/` } });
});

services.forEach(s => {
  zones.forEach(z => {
    MOCK_PAGES.push({ id: `sz-${s}-${z}`, projectId: 'dev-ristrutturazioni-formia', slug: `${s}/${z}`, type: 'service_zone',
      title: `${s.replace(/-/g, ' ')} a ${z}`, body: `<h1>${s.replace(/-/g, ' ')} a ${z}</h1>`,
      faq: [{ question: `Come scegliere un esperto di ${s} a ${z}?`, answer: 'Verifica esperienza e preventivi.' }],
      meta: { description: `${s} ${z}`, canonical: `https://ristrutturazioniformia.it/${s}/${z}/` } });
  });
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  if (req.url && req.url.includes('/api/sites/') && req.url.endsWith('/pages')) {
    res.writeHead(200);
    res.end(JSON.stringify({ pages: MOCK_PAGES }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3001, () => console.log('Mock factory-core running on http://localhost:3001'));

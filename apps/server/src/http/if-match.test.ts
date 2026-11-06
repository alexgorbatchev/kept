import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { type TestApp, testApp } from '../../test/app.js';
import { testDb } from '../../test/db.js';
import { OPENAPI_PATH } from './app.js';
import { IF_MATCH_ROUTES } from './if-match.js';

// The concurrency column of the route catalogue: every entry names a real write route, and the
// OpenAPI document declares If-Match on exactly those routes, required or not as listed.
// requireIfMatch() refusing an unlisted route (conventions.test.ts) keeps the table complete.

const db = await testDb();

type Parameter = { name: string; in: string; required?: boolean };
type OpenApi = { paths: Record<string, Record<string, { parameters?: Parameter[] }>> };

/** `/api/v1/places/:id` as the OpenAPI document writes it: `/api/v1/places/{id}`. */
function openApiPath(url: string): string {
  return url.replace(/:(\w+)/g, '{$1}');
}

describe('If-Match routes', () => {
  let t: TestApp;
  let doc: OpenApi;
  const routes = new Set<string>();

  beforeAll(async () => {
    t = await testApp(db, {
      onRoute: (route) => {
        const methods = Array.isArray(route.method) ? route.method : [route.method];
        for (const m of methods) routes.add(`${m} ${route.url}`);
      },
    });
    const res = await t.app.inject({ method: 'GET', url: OPENAPI_PATH });
    expect(res.statusCode, res.body).toBe(200);
    doc = res.json() as OpenApi;
  });
  afterAll(() => t.app.close());

  it('lists only write routes that exist', () => {
    const listed = Object.keys(IF_MATCH_ROUTES);
    expect(listed.filter((r) => !routes.has(r))).toEqual([]);
    expect(listed.filter((r) => r.startsWith('GET '))).toEqual([]);
  });

  it('declares If-Match in the OpenAPI document, required or optional as listed', () => {
    const declared = Object.keys(IF_MATCH_ROUTES).map((route) => {
      const [method, url] = route.split(' ') as [string, string];
      const operation = doc.paths[openApiPath(url)]?.[method.toLowerCase()];
      const header = operation?.parameters?.find((p) => p.in === 'header' && p.name === 'if-match');
      if (!header) return [route, 'undeclared'];
      return [route, header.required ? 'required' : 'optional'];
    });
    expect(Object.fromEntries(declared)).toEqual(IF_MATCH_ROUTES);
  });

  it('declares it on no other route', () => {
    const extra = Object.entries(doc.paths).flatMap(([path, operations]) =>
      Object.entries(operations)
        .filter(([, op]) => op.parameters?.some((p) => p.in === 'header' && p.name === 'if-match'))
        .map(([method]) => `${method.toUpperCase()} ${path}`),
    );
    const listed = Object.keys(IF_MATCH_ROUTES).map((r) => {
      const [method, url] = r.split(' ') as [string, string];
      return `${method} ${openApiPath(url)}`;
    });
    expect(extra.filter((r) => !listed.includes(r))).toEqual([]);
  });
});

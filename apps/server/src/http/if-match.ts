import type { SwaggerTransform } from '@fastify/swagger';

// Which routes read `If-Match` (D156): the concurrency column of the route catalogue. A route
// that calls requireIfMatch() is listed here, as `'required'` (a write without it is 428) or
// `'optional'` (the version is checked only when the client sends one). The OpenAPI document
// declares the header from this table, so a client generated from it sends the version;
// requireIfMatch() refuses to run for a route missing from it, so the table can't fall behind
// the routes without a test failing.

export type IfMatchUse = 'required' | 'optional';

/** `METHOD url` → whether the route requires `If-Match`. `url` is the pattern Fastify registers. */
export const IF_MATCH_ROUTES: Readonly<Record<string, IfMatchUse>> = Object.freeze({
  // Locations and their members.
  'PATCH /api/v1/locations/:id': 'required',
  'POST /api/v1/locations/:id/modules': 'optional',
  'PATCH /api/v1/locations/:id/members/:membershipId': 'required',
  // Things. A move, a split and "not here" take a version when the client has one; the web
  // sends none for them.
  'PATCH /api/v1/things/:id': 'required',
  'POST /api/v1/things/:id/lifecycle': 'required',
  'POST /api/v1/things/:id/retype': 'required',
  'POST /api/v1/things/:id/convert-to-place': 'required',
  'POST /api/v1/things/:id/not-here': 'optional',
  'POST /api/v1/things/:id/split': 'optional',
  'POST /api/v1/things/move': 'optional',
  'PUT /api/v1/things/:id/kit': 'required',
  // Consumables: replacing a stock rule needs its version; a new rule has none yet.
  'PUT /api/v1/things/:id/stock-rule': 'optional',
  'DELETE /api/v1/things/:id/stock-rule': 'required',
  'POST /api/v1/things/:id/adjust': 'required',
  // Places. Trash and convert take a version when the client has one.
  'PATCH /api/v1/places/:id': 'required',
  'POST /api/v1/places/:id/merge-into': 'required',
  'POST /api/v1/places/:id/trash': 'optional',
  'POST /api/v1/places/:id/convert-to-container': 'optional',
  // Types, their fields and place kinds; thing and place templates.
  'PATCH /api/v1/types/:id': 'required',
  'PATCH /api/v1/type-fields/:id': 'required',
  'POST /api/v1/type-fields/:id/convert': 'required',
  'PATCH /api/v1/place-kinds/:id': 'required',
  'PATCH /api/v1/templates/:id': 'required',
  'PATCH /api/v1/place-templates/:id': 'required',
  // The registries.
  'PATCH /api/v1/brands/:id': 'required',
  'PATCH /api/v1/vendors/:id': 'required',
  'PATCH /api/v1/people/:id': 'required',
  'PATCH /api/v1/tags/:id': 'required',
  // Codes, files, saved views.
  'PUT /api/v1/locations/:locationId/own-codes': 'required',
  'PATCH /api/v1/attachments/:id': 'required',
  'PATCH /api/v1/saved-views/:id': 'required',
  // The inbox: every action on an item.
  'POST /api/v1/inbox/:id/accept': 'required',
  'POST /api/v1/inbox/:id/receipt': 'required',
  'POST /api/v1/inbox/:id/currency': 'required',
  'POST /api/v1/inbox/:id/merge': 'required',
  'POST /api/v1/inbox/:id/not-duplicate': 'required',
  'POST /api/v1/inbox/:id/reading': 'required',
  'POST /api/v1/inbox/:id/restore': 'required',
  'POST /api/v1/inbox/:id/dismiss': 'required',
  'POST /api/v1/inbox/:id/discard': 'required',
  'POST /api/v1/inbox/:id/room/places': 'required',
  'POST /api/v1/inbox/:id/room/seen': 'required',
  'POST /api/v1/inbox/:id/room/done': 'required',
  'POST /api/v1/inbox/:id/room/discard': 'required',
  'POST /api/v1/inbox/:id/room/retry': 'required',
  'POST /api/v1/imports/:id/choices': 'required',
  // Meters and readings: the web sends no version for a reading or a replacement.
  'PATCH /api/v1/meters/:id': 'required',
  'POST /api/v1/meters/:id/replaced': 'optional',
  'PATCH /api/v1/readings/:id': 'optional',
  'PATCH /api/v1/fuel/:id': 'required',
  'DELETE /api/v1/fuel/:id': 'required',
  // Schedules and service records.
  'PATCH /api/v1/schedules/:id': 'required',
  'DELETE /api/v1/schedules/:id': 'required',
  'POST /api/v1/schedules/:id/complete': 'required',
  'POST /api/v1/schedules/:id/snooze': 'required',
  'POST /api/v1/schedules/:id/skip': 'required',
  'POST /api/v1/schedules/:id/unsnooze': 'required',
  'PATCH /api/v1/service-records/:id': 'required',
  'DELETE /api/v1/service-records/:id': 'required',
  'POST /api/v1/service-records/:id/confirm': 'required',
  // Lending.
  'PATCH /api/v1/loans/:id': 'required',
  'DELETE /api/v1/loans/:id': 'required',
  'POST /api/v1/loans/:id/return': 'required',
  'POST /api/v1/loans/:id/lost': 'required',
  'PATCH /api/v1/handovers/:id': 'required',
  // Money: replacing a rate needs its version; a new rate has none yet.
  'PUT /api/v1/accounts/:accountId/fx-rates': 'optional',
  'DELETE /api/v1/accounts/:accountId/fx-rates/:from/:to/:validFrom': 'required',
  'PATCH /api/v1/valuations/:id': 'required',
  'DELETE /api/v1/valuations/:id': 'required',
  'PATCH /api/v1/purchases/:id': 'required',
  'POST /api/v1/purchase-lines/:id/link': 'optional',
  // Paperwork, warranties and claims, incidents, condition reports, moves.
  'PATCH /api/v1/documents/:id': 'required',
  'DELETE /api/v1/documents/:id': 'required',
  'POST /api/v1/documents/:id/renew': 'required',
  'PATCH /api/v1/warranties/:id': 'required',
  'DELETE /api/v1/warranties/:id': 'required',
  'PATCH /api/v1/claims/:id': 'required',
  'DELETE /api/v1/claims/:id': 'required',
  'PATCH /api/v1/incidents/:id': 'required',
  'DELETE /api/v1/incidents/:id': 'required',
  'POST /api/v1/incidents/:id/things': 'required',
  'PATCH /api/v1/condition-reports/:id': 'required',
  'DELETE /api/v1/condition-reports/:id': 'required',
  'POST /api/v1/condition-reports/:id/finish': 'required',
  'PATCH /api/v1/condition-rooms/:id': 'required',
  'DELETE /api/v1/condition-rooms/:id': 'required',
  'PATCH /api/v1/moves/:id': 'required',
  'DELETE /api/v1/moves/:id': 'required',
  // Integrations and the person's own settings.
  'PATCH /api/v1/paperless-links/:id': 'required',
  'PATCH /api/v1/webhooks/:id': 'required',
  'PATCH /api/v1/tokens/:id': 'required',
  // AI providers and caps: replacing one needs its version; a new one has none yet.
  'PUT /api/v1/ai/providers/:ref': 'optional',
  'PUT /api/v1/ai/caps': 'optional',
  // Admin.
  'PUT /api/v1/admin/backup': 'required',
});

/** Whether a route reads `If-Match`, or `null` when it doesn't. */
export function ifMatchOf(method: string, url: string): IfMatchUse | null {
  return IF_MATCH_ROUTES[`${method} ${url}`] ?? null;
}

const IF_MATCH_HEADER = {
  type: 'string',
  description:
    'The `rowVersion` the change started from (`3`, `"3"` or `W/"3"`). A stale one is 412.',
} as const;

/** Wraps the zod transform: declares `If-Match` on the routes that read it. */
export function ifMatchTransform(inner: SwaggerTransform): SwaggerTransform {
  return (args) => {
    const out = inner(args);
    const methods = Array.isArray(args.route.method) ? args.route.method : [args.route.method];
    const use = methods.map((m) => ifMatchOf(m, args.url)).find((u) => u !== null) ?? null;
    if (use === null) return out;
    const headers = (out.schema.headers ?? {}) as {
      properties?: Record<string, unknown>;
      required?: string[];
    };
    return {
      ...out,
      schema: {
        ...out.schema,
        headers: {
          type: 'object',
          ...headers,
          properties: { ...headers.properties, 'if-match': IF_MATCH_HEADER },
          ...(use === 'required' ? { required: [...(headers.required ?? []), 'if-match'] } : {}),
        },
      },
    };
  };
}

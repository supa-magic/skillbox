# MSW — Network Mocking Examples

Mock Service Worker (MSW) intercepts real network requests at the service worker level. The component, hook, and fetch work for real — only the server response is replaced.

## Why MSW, Not Module Mocking

Module-level mocking (`jest.mock`) replaces entire modules — the test no longer verifies that parts work together. Each `jest.mock()` is a hole in integration.

```typescript
// ❌ Module mocking — test verifies nothing real
jest.mock('./locationApi')
jest.mock('./hooks/useGeolocation')
jest.mock('./utils/formatDistance')
(getNearbyCafes as jest.Mock).mockResolvedValue([...])

// ✅ Network mocking — everything except the server is real
server.use(
  http.get('/api/cafes/nearby', () => HttpResponse.json([
    { id: 1, name: 'Blue Bottle', distance: 0.3 },
    { id: 2, name: 'Stumptown', distance: 0.7 },
  ]))
)
render(<NearbyCafes userLocation={{ lat: 37.7, lng: -122.4 }} />)
expect(await screen.findByText('Blue Bottle')).toBeInTheDocument()
expect(screen.getByText('0.3 km')).toBeInTheDocument()
```

## What to Mock

```
✅ Mock:     Network requests (MSW), email/payment services, animations
❌ Don't mock: Business logic, child components, hooks, store
```

## Contract Safety with Codegen

When the API has a schema (GraphQL, OpenAPI, tRPC), generate typed MSW handlers from it. TypeScript catches schema desync at compile time.

```typescript
// GraphQL — auto-generated from SDL schema
// When backend changes schema → regeneration → TS errors
import { graphql } from './generated/msw-handlers'

server.use(
  graphql.query('GetBooking', ({ variables }) => ({
    data: {
      booking: {
        id: variables.id,
        startDate: '2024-03-01',  // TS errors if field renamed
        status: 'confirmed',
      }
    }
  }))
)
```

```
Works for:  GraphQL ✅  tRPC ✅  REST + OpenAPI ✅  gRPC + Protobuf ✅
Not for:    Unspecified REST without schema ❌
```

## Bug Coverage Example

```typescript
// Test describes expected behavior, not bug details
it('free plan user sees list of unavailable features', async () => {
  server.use(http.get('/api/me', () =>
    HttpResponse.json({ plan: 'free', name: 'Alex' })
  ))
  render(<Dashboard />)
  await screen.findByText('Alex')
  expect(screen.getByText('Export to PDF')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /export/i }))
    .not.toBeInTheDocument()
})
```

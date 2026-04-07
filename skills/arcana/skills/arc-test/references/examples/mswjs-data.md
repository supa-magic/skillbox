# @mswjs/data — In-Memory Database Examples

Official MSW extension. Instead of hardcoded response data — a typed schema with a relational in-memory database. Use for unspecified REST APIs without a schema, or when tests need realistic CRUD state changes.

## Basic Setup

```typescript
import { factory, primaryKey } from '@mswjs/data'

const db = factory({
  booking: {
    id: primaryKey(String),
    startDate: String,
    endDate: String,
    status: String,
    guestCount: Number,
  }
})

db.booking.create({ id: '1', startDate: '2024-03-01', status: 'confirmed', guestCount: 2 })

server.use(
  http.get('/api/bookings/:id', ({ params }) => {
    const booking = db.booking.findFirst({
      where: { id: { equals: params.id as string } }
    })
    return booking
      ? HttpResponse.json(booking)
      : new HttpResponse(null, { status: 404 })
  })
)
```

## When to Use

```
GraphQL / tRPC / gRPC         → Codegen from schema (not @mswjs/data)
REST + OpenAPI                 → Codegen, or both together
Unspecified REST               → @mswjs/data
Complex CRUD scenarios         → @mswjs/data (state changes between actions)
Relational data in tests       → @mswjs/data
```

## Trade-offs

```
Pros:
  + Relational data — model relationships (booking → user → hotel)
  + State changes between actions — CRUD works realistically
  + Fast — all in memory, no Docker
  + Works for any protocol

Cons:
  − Factory schema duplicates backend schema — must keep in sync manually
  − Doesn't catch runtime differences in backend business logic
```

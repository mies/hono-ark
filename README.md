# Hono + Drizzle + ArkType Example API

This project demonstrates a modern TypeScript API architecture using:
- [Hono](https://hono.dev) - Ultrafast web framework for edge computing
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM for SQL databases
- [ArkType](https://arktype.io) - Runtime type checking and validation
- [Neon](https://neon.tech) - Serverless Postgres database

## Architecture Decisions

### Database Layer (Drizzle + Neon)
- Using Drizzle ORM with Neon's HTTP connection for edge compatibility
- Schema defined in `src/db/schema.ts`
- Migrations handled via Drizzle Kit
- Connection pooling via Neon's connection pooler

### Validation Layer (ArkType)
We intentionally keep ArkType validation separate from Drizzle schema for:
1. Type system compatibility
2. Separation of concerns
3. Better maintainability
4. Flexible validation rules

See `src/db/schema.ts` for detailed explanation of this decision.

### API Layer (Hono)
- Route handlers in `src/routes/`
- Direct database operations in route handlers
- Validation using ArkType schemas
- Consistent error handling and response format

## Project Structure
```
src/
├── db/
│   ├── index.ts     # Database connection
│   └── schema.ts    # Database schema + validation
├── routes/
│   └── photos.ts    # Route handlers
├── types/
│   └── photo.ts     # Shared types
└── index.ts         # App entry point
```

## Getting Started

1. Setup environment:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run migrations:
   ```bash
   pnpm drizzle-kit push:pg
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

- `DATABASE_URL`: Neon database connection string
- Additional variables can be set in `.dev.vars` for local development

## Development

### Database Migrations
```bash
# Generate migration
pnpm drizzle-kit generate:pg

# Push migration
pnpm drizzle-kit push:pg
```

### Type Safety
- Database types are inferred from Drizzle schema
- API input validation using ArkType
- TypeScript strict mode enabled

## Deployment

This API is designed to run on Cloudflare Workers or similar edge platforms.

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy to Cloudflare Workers:
   ```bash
   pnpm deploy
   ```

## License

MIT
```
npm run deploy
```

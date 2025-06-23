# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Next.js dev server on port 3000)
- **Build**: `npm run build` (creates production build)
- **Production start**: `npm start` (runs production server)
- **Linting**: `npm run lint` (runs ESLint) or `npm run lint:fix` (auto-fixes issues)
- **Formatting**: `npm run format` (formats with Prettier) or `npm run format:check` (checks formatting)

## Code Architecture

This is a Next.js 15 e-commerce demo application ("Hello Socks") built with TypeScript, featuring Stytch authentication and MCP (Model Context Protocol) integration.

### Key Architecture Components

- **App Router Structure**: Using Next.js App Router with server components in `app/` directory
- **Authentication Layer**: Stytch-based auth with adaptive MFA and device fingerprinting
  - Server-side auth utilities in `lib/auth-server.ts`
  - Device trust tracking via `markSessionDeviceAsTrusted()` and `isKnownDevice()`
  - Adaptive MFA flow: known devices skip 2FA, unknown devices require SMS enrollment
- **Order Management**: `OrderService` class handles order placement, confirmation, and tracking
  - Orders stored in Stytch user metadata
  - Email confirmation flow via magic links
- **MCP Integration**: Exposes order management tools and resources via MCP server
  - Server implementation in `lib/sock-mcp.ts`
  - Authenticated MCP handler at `/mcp` endpoint
  - Tools: `whoami`, `userinfo`, `placeSockOrder`
  - Resources: Orders accessible via `shophellosocks://orders/{id}` URIs

### Path Aliases (configured in tsconfig.json)
- `~lib/*` → `lib/*`
- `~components/*` → `components/*`
- `~styles/*` → `styles/*`

### Code Style
- ESLint config extends Next.js core web vitals and Prettier
- Prettier config: single quotes, semicolons, 80 char width, 2-space tabs
- **Import restriction**: Relative imports from parent directories (`../*`) are forbidden

### Key Authentication Flows
1. **Login**: Magic links, OAuth, or SMS OTP via Stytch
2. **Adaptive MFA**: Device fingerprinting determines if 2FA is required
3. **Device Trust**: Up to 5 most recent devices stored per user
4. **Session Management**: Server-side session validation with `getAuthUser()` and `requireAuth()`

### Environment Dependencies
- Stytch project credentials (`STYTCH_PROJECT_ID`, `STYTCH_PROJECT_SECRET`, `STYTCH_DOMAIN`)
- Next.js environment variables in `.env.local`
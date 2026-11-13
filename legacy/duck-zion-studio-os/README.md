# Duck Zion Studio OS

> Unified Duck ecosystem platform with Next.js 16, Prisma, shadcn/ui, real-time features, and multi-service architecture.

## Overview

Duck Zion Studio OS is the central platform for the Duck ecosystem — a modular, multi-service architecture built with Next.js 16, Prisma ORM, and shadcn/ui components. It provides real-time features via Socket.IO, database management with Prisma, and a modern component system using Radix UI and Tailwind CSS v4.

## Features

- **Next.js 16** with App Router and standalone output
- **Prisma ORM** with PostgreSQL database
- **shadcn/ui + Radix UI** component library
- **Tailwind CSS v4** with custom design tokens
- **Socket.IO** real-time communication
- **NextAuth.js** authentication
- **Internationalization** with next-intl
- **Real-time features** via Socket.IO
- **Prisma** database management with migrations
- **Bun** as package manager and runtime

## Architecture

```
duck-zion-studio-os/
├── src/                    # Main application source
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities and shared code
│   └── hooks/             # Custom React hooks
├── prisma/                # Prisma schema and migrations
├── scripts/               # Build and utility scripts
├── tests/                 # Test files
├── public/                # Static assets
├── mini-services/         # Micro-services
├── examples/              # Example applications
└── .zscripts/             # ZShell scripts
```

## Getting Started

### Prerequisites

- **Bun** >= 1.1.0 (recommended) or Node.js >= 20
- **PostgreSQL** database

### Installation

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Run database migrations
bun run db:migrate

# Seed database (optional)
bun run seed

# Start development server
bun run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Build for production with postbuild copy |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push schema to database |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:migrate` | Run migrations |
| `bun run db:reset` | Reset database |
| `bun run seed` | Seed database |

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/duck_zion
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
SOCKET_IO_URL=http://localhost:3001
```

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Add environment variables
3. Deploy

### Docker

```dockerfile
FROM oven/bun:1.1
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
CMD ["bun", "run", "start"]
```

## Design System

This project uses the **CANON** design system (WCAG AAA verified):

- **Void**: `#050505` — Primary background
- **Neon Red**: `#FF7777` — Primary accent
- **Gold**: `#FDE047` — Secondary accent
- **Violet**: `#D8B4FE` → `#E9D5FF` — Gradient accents

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [duck-zion-studio](https://github.com/belentani7/duck-zion-studio) — GitHub variant
- [duck-ecosystem](https://github.com/belentani7/duck-ecosystem) — Core ecosystem
- [duck-studio-unified](https://github.com/belentani7/duck-studio-unified) — Unified platform

---

**Part of the Duck Ecosystem** — Built by [Pedro Belentani](https://github.com/belentani7)


## Producto
Véase `plataforma/OFERTA.md`.

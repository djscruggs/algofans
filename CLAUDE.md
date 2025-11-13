# Claude.md

**Project Overview:**

This app is a tongue-in-check replica of OnlyFans, but it shows off features of the Algorand Blockchain. It is called AlgoFans.

**Project Goals:**

The goal is swap out the payment and auth infrastructure of web2 for web3.

**Technology Stack**

## Technology Stack

### Frontend

- **React 19** - UI library
- **TypeScript 5.9** - Type-safe JavaScript
- **TanStack Start 1.120** - Full-stack React framework (SSR/SSG)
- **TanStack Router 1.135** - Type-safe routing with file-based routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Backend

- **Vinxi 0.5** - JavaScript server and bundler
- **Node.js** - JavaScript runtime
- **TanStack Start SSR** - Server-side rendering

### Database

- **PostgreSQL** - Relational database
- **Prisma 6.19** - TypeScript ORM
- **Prisma Client** - Type-safe database client

### Blockchain & Web3

- **Algorand** - Layer 1 blockchain
- **AlgoSDK 3.5** - Algorand JavaScript SDK
- **Pera Wallet Connect 1.4** - Algorand wallet integration
- **Liquid Auth** - Passwordless authentication via Algorand signatures

### Build Tools

- **Vinxi** - Universal JavaScript server
- **Vite** - Build tool and dev server
- **vite-tsconfig-paths** - TypeScript path mapping

### Development

- **TypeScript** - Static type checking
- **ESLint** - Code linting (configured via TanStack)
- **Prettier** - Code formatting

## Architecture Patterns

- **File-based routing** - Routes defined in `app/routes/` directory
- **Server-side rendering (SSR)** - Pages rendered on server
- **Component-based architecture** - React components in `app/components/`
- **Type-safe API** - End-to-end TypeScript types
- **Passwordless auth** - Blockchain signature-based authentication

**Documentation Search with blz**

This project uses `blz` - a fast CLI tool for searching llms.txt documentation files. Use it to quickly find documentation for the tech stack and this project.

Available documentation sources (add if not already indexed):

```bash



# React Router v7 (community-maintained)
blz add react-router https://gist.githubusercontent.com/luiisca/14eb031a892163502e66adb687ba6728/raw/27437452506bec6764d3bf9391a80eed94a53826/ReactRouter_LLMs.txt


Check https://llmstxthub.com for more documentation sources



Common blz commands:

- Search documentation: `blz "search term"`
- Get specific lines: `blz get source:line-range` (e.g., `blz get cardlessid:100-150`)
- List indexed sources: `blz list`

**When encountering questions about this project or the tech stack, ALWAYS use blz to search relevant documentation before making assumptions.**

**Coding Conventions**

Route files are named in lower case, but their components inside the file are capitalize - e.g. Home, Contact. Components are named in CamelCase with the first word capitalized

**Scratchpad**
When creating test scripts and working documents, always put them in /@scratchpad unless otherwise specified

When importing functions do them at the top of the file instead of inline

**DO**

```

import { saveVerification, updateCredentialIssued } from "~/utils/firebase.server"
import { getPeraExplorerUrl } from "~/utils/algorand";

```

**DON'T**

```

const { saveVerification, updateCredentialIssued } = await import(
"~/utils/firebase.server"
);
const { getPeraExplorerUrl } = await import("~/utils/algorand");

```

```

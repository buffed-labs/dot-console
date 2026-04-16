# Dot-Console: Agent Instructions

## Project Overview

**dot-console** is a Substrate development console for the Polkadot ecosystem. It's an interactive web application that allows developers to:

- Explore on-chain data (blocks, extrinsics, events, storage)
- Query runtime constants, storage entries, and runtime APIs
- Interact with multiple Substrate-based networks (Polkadot, Kusama, Paseo, Westend, and their parachains)
- Manage accounts and wallets with support for multiple wallet providers (Ledger, Vault, WalletConnect, Mimir)
- View decoded codec data with a rich UI

## Tech Stack

| Layer                | Technology                                       |
| -------------------- | ------------------------------------------------ |
| **UI Framework**     | React 19.2.5 (Strict Mode enabled)               |
| **Routing**          | TanStack Router 1.168.22 (file-based, type-safe) |
| **State Management** | Jotai 2.19.1 (primitive atoms)                   |
| **Blockchain Data**  | @reactive-dot/core + @polkadot-api/view-builder  |
| **Styling**          | PandaCSS 1.9.1 + Park UI 0.43.1 (utility CSS)    |
| **UI Components**    | Ark UI 5.34.1 (headless components)              |
| **Build Tool**       | Vite 8.0.8 with React Compiler                   |
| **Language**         | TypeScript 6.0.2 (strict config)                 |
| **Code Quality**     | ESLint (React-specific rules), Prettier          |

## Architecture

```
src/
├── routes/           → File-based TanStack Router (auto code-splitting)
│   ├── __root.tsx    (providers, root layout, BlockTracker setup)
│   ├── _layout.tsx   (app chrome: top bar, navigation, chain selector)
│   └── _layout/      (feature routes)
│
├── features/         → Domain-driven feature modules (explorer, governance, staking, etc.)
│   └── {feature}/
│       ├── components/
│       ├── stores/    (Jotai atoms scoped to feature)
│       └── types.ts
│
├── components/       → Reusable UI layer
│   ├── ui/           (40+ generated styled-system components)
│   ├── param/        (codec renderers for blockchain types)
│   ├── *-form.tsx    (query builders with Zod validation)
│   └── query-result.tsx (async query execution template)
│
├── hooks/            → Custom React hooks
│   ├── chain.ts      (chain navigation: relay, people chains)
│   ├── metadata.ts   (metadata loading with v14/v15/v16 fallback)
│   ├── view-builder.ts (query building helpers)
│   └── use-*.ts      (routing, state helpers)
│
├── config.ts         → Reactive-Dot config (chains, providers, wallets)
├── types.ts          → Query type definitions
└── utils.ts          → Byte conversion, memoization, etc.
```

## Development Workflow

### Start Development

```bash
yarn dev     # Vite dev server with HMR on port 5173
```

### Build & Production

```bash
yarn build   # Production build
yarn preview # Preview built app
```

### Quality Checks

```bash
yarn lint    # ESLint check
```

### Post-Install

```bash
yarn postinstall  # Auto-runs: papi (generates API types) + panda codegen (CSS)
```

## Key Conventions

### Naming

- **Files**: kebab-case (e.g., `account-select.tsx`, `metadata.ts`)
- **Components**: PascalCase (e.g., `AccountSelect`, `QueryResult`)
- **Hooks**: `use*` prefix (e.g., `useChainId()`, `useLazyLoadQuery()`)
- **Jotai Atoms**: `*Atom` suffix (e.g., `blockMapAtom`, `selectedAccountAtom`)
- **Callbacks**: `on*` prefix (e.g., `onChangeAccount`)
- **Type Imports**: Always use `import type { ... }` (ESLint enforced)
- **Unused Variables**: Prefix with `_` (e.g., `_unused`, `_error`)

### Component Patterns

**Controlled + Uncontrolled Pattern**: Many components support both modes using discriminated unions:

```typescript
export type MyComponentProps =
  | ControlledProps // value + onChange (parent manages state)
  | UnControlledProps; // defaultValue (component manages state)
```

### Query Building Pattern

1. Define query structure in [src/types.ts](src/types.ts)
2. Create form builder component with Zod validation
3. Execute query with `useLazyLoadQuery()` inside Suspense
4. Wrap with `ErrorBoundary` for error handling

See [src/components/query-result.tsx](src/components/query-result.tsx) for the standard template.

### State Management

- Use Jotai atoms for global or feature-scoped state
- Define atoms in feature `stores/` directories
- Import atoms for derived state and custom read/write functions
- See [src/features/explorer/stores/blocks.ts](src/features/explorer/stores/blocks.ts) for garbage collection pattern

### Styling

```typescript
import { css } from "styled-system/css"
import { box, flex, grid } from "styled-system/jsx"

// Utility classes via css()
<div className={css({ color: 'red.500', padding: '2' })}>

// JSX factory components (preferred)
<Flex direction="column" gap="4">
```

All colors and tokens defined in [panda.config.ts](panda.config.ts).

### Chain Navigation

```typescript
import {
  getRelayChainId,
  usePeopleChainId,
  useRelayChainId,
} from "~/hooks/chain";

// Derive relay chain from parachain
getRelayChainId("kusama_asset_hub"); // → 'kusama'

// Get people chain for current relay
const peopleChainId = usePeopleChainId();
```

## Critical Files & Patterns

| File                                                                             | Purpose                 | Pattern                                                       |
| -------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------- |
| [src/routes/\_\_root.tsx](src/routes/__root.tsx)                                 | Providers setup         | ReactiveDotProvider, ChainProvider, BlockTracker subscription |
| [src/routes/\_layout.tsx](src/routes/_layout.tsx)                                | App shell               | Top bar, chain selector, account picker, wallet connection    |
| [src/config.ts](src/config.ts)                                                   | Reactive-Dot config     | Chain definitions, asset hub configs, wallet providers        |
| [src/types.ts](src/types.ts)                                                     | Query types             | ConstantQuery, StorageQuery, RuntimeApiQuery union            |
| [src/components/query-result.tsx](src/components/query-result.tsx)               | Query template          | ErrorBoundary + Suspense + useLazyLoadQuery pattern           |
| [src/components/account-select.tsx](src/components/account-select.tsx)           | Controlled/Uncontrolled | Discriminated union pattern example                           |
| [src/hooks/chain.ts](src/hooks/chain.ts)                                         | Chain helpers           | getRelayChainId(), usePeopleChainId()                         |
| [src/hooks/metadata.ts](src/hooks/metadata.ts)                                   | Metadata loading        | v14/v15/v16 version fallback pattern                          |
| [src/features/explorer/stores/blocks.ts](src/features/explorer/stores/blocks.ts) | State pattern           | Jotai with derived state and memory limits                    |

## Common Pitfalls to Avoid

### 1. Chain ID Confusion

**Issue**: Parachains have different IDs than relay chains

- `kusama_asset_hub` ≠ `kusama`
- `polkadot_collectives` ≠ `polkadot`

**Solution**: Always use `getRelayChainId()`, `usePeopleChainId()` when chain relationships matter

### 2. Suspense + Error Handling

**Issue**: Unhandled async errors or missing error boundaries
**Solution**: Always wrap `useLazyLoadQuery()` with:

```typescript
<ErrorBoundary>
  <Suspense fallback={<Loading />}>
    <YourComponent />
  </Suspense>
</ErrorBoundary>
```

### 3. Jotai Atom Scope Leaks

**Issue**: Atoms defined globally can collide across features
**Solution**: Define atoms in feature `stores/` directories, not at root

### 4. Metadata Version Mismatches

**Issue**: Not all networks support v16 metadata; metadata loading fails
**Solution**: Check [src/hooks/metadata.ts](src/hooks/metadata.ts) for v14/v15/v16 fallback logic

### 5. Type Imports Not Enforced

**Issue**: Non-type imports conflict with ESLint rules
**Solution**: Always use `import type { ... }` for types (ESLint enforces this)

### 6. UI Component Conflicts

**Issue**: Confusion between Park UI generated components vs. custom components
**Solution**:

- `styled-system/jsx` components = generated (box, flex, grid, etc.)
- `components/ui/` = custom wrappers around Ark UI

### 7. Router Search Params Without Validation

**Issue**: Unvalidated URL params break route navigation
**Solution**: Always validate with Zod before using search params

### 8. Unbounded Block Storage

**Issue**: Block atoms grow infinitely, causing memory issues
**Solution**: Use garbage collection pattern (max 25 blocks) from [src/features/explorer/stores/blocks.ts](src/features/explorer/stores/blocks.ts)

## For New Features

When adding a new feature:

1. **Create feature module**: Add directory in `src/features/{feature_name}/`
2. **Add routing**: Create route file in `src/routes/_layout/` with file-based TanStack Router
3. **Define types**: Create `src/features/{feature_name}/types.ts` for query structures
4. **Create atoms**: Define Jotai atoms in `src/features/{feature_name}/stores/`
5. **Build UI**: Create components in `src/features/{feature_name}/components/`
6. **Use query pattern**: Follow [src/components/query-result.tsx](src/components/query-result.tsx) template
7. **Add styling**: Use PandaCSS utilities via `styled-system/css` and JSX factories

## Debugging Tips

- **Check chain ID**: Use `getRelayChainId()` to verify chain relationships
- **Verify metadata**: Ensure network supports the metadata version being queried
- **Test Suspense errors**: Wrap with ErrorBoundary to catch async errors
- **Check type validation**: Ensure Zod validators match runtime data
- **Review Jotai scoping**: Verify atoms aren't defined globally
- **Monitor network**: Check browser DevTools Network tab for failed RPC calls

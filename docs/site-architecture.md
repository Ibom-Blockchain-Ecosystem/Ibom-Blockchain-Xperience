# IBX Platform Architecture

This repository is evolving from an IBX Tour prototype into the unified Ibom
Blockchain Xperience platform.

## Public route plan

```text
/
├── about/
├── ibx27/
├── summit/
├── tour/
│   └── [slug]/
├── build/
├── den-of-rogues/
├── ambassadors/
├── speakers/
├── schedule/
├── partners/
├── news/
├── gallery/
├── contact/
├── privacy/
└── terms/
```

Only routes containing a `page.tsx` are currently public. The new directories
contain planning notes until their content and design are approved.

## Application layers

```text
app/          Next.js routes, layouts, metadata and route-level loading/error UI
components/   Reusable presentation and interaction components
content/      Typed editorial content before the CMS is connected
data/         Existing prototype data; migrate into content/ progressively
lib/          CMS, analytics, SEO and general application services
types/        Shared TypeScript contracts
public/       Web-ready assets served to visitors
assets/       Original source media, brand masters and production files
```

## Feature component boundaries

```text
components/
├── layout/       Site shell, footer and persistent page furniture
├── navigation/   Desktop navigation, mobile menu and programme navigation
├── home/         IBX27 landing-page sections
├── summit/       Summit-specific sections
├── tour/         Continent selector, country showcase and tour navigation
├── build/        IBX Build and Den of Rogues sections
├── ambassadors/  Ambassador information and application interfaces
├── partners/     Tangem, sponsors and partner displays
├── media/        Galleries, video and editorial media
├── forms/        Waitlist, contact and partner application forms
└── ui/           Small brand-aware primitives shared across features
```

## Data flow

```text
Content team / CMS
        ↓
Typed content adapters
        ↓
Server-rendered route
        ↓
Feature sections
        ↓
Small client components only where interaction is required
```

This keeps content and SEO server-rendered while isolating animation, menus,
carousels and forms inside focused client components.

## Current migration rule

The existing homepage, `components/tour-experience.tsx`,
`components/site-header.tsx` and `data/stops.ts` remain operational until the
new IBX landing page is approved. Refactor them incrementally; do not duplicate
their logic in the new feature directories.

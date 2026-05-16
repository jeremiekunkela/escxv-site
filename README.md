# ESC XV Website

Frontend-only initialization for the ESC XV omnisports website.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- ESLint flat config
- Lucide React icons
- Local JSON data source

## Package Manager

This project uses `npm`, documented in `package.json` with `packageManager`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

Development server:

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Routes

- `/`
- `/sections/athletisme`
- `/sections/football`

## Data

Temporary content lives in `src/data/*.json`. Items with uncertain details use `status: "tbc"` or notes that clearly mark the information as to be confirmed.

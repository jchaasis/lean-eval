# LeanEval

AI-powered tool that helps founders and builders rapidly validate early-stage startup ideas using Lean Startup principles.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **AI:** Anthropic Claude 3.5
- **Validation:** Zod
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your `ANTHROPIC_API_KEY`.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Code Quality

This project enforces:
- **TypeScript strict mode** - No `any` types, strict null checks
- **ESLint** - Code quality and best practices
- **Prettier** - Consistent code formatting
- **Husky + lint-staged** - Pre-commit hooks for quality checks

### Project Structure

```
lean-eval/
├── app/              # Next.js App Router pages and layouts
├── components/       # React components
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
├── .cursor/         # Cursor IDE rules
├── sow/             # Project documentation (PRD, plan)
└── team/            # Team member personas
```

## Environment Variables

See `.env.example` for required environment variables.

## License

See [LICENSE](LICENSE) file.


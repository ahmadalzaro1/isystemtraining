# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3e73da9e-5911-4d82-8b3d-d6023d24fe88

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3e73da9e-5911-4d82-8b3d-d6023d24fe88) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3e73da9e-5911-4d82-8b3d-d6023d24fe88) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Hardening Pass (Security & Reliability)
This repo has been hardened for production. The pass includes: env-based Supabase config (where applicable), corrected RLS, schema FK alignment, CSP/CORS tightening, PII logging hygiene, basic abuse protection (captcha verifier edge function), email function wiring (provider-agnostic), CI workflow, and docs. See Verification section below for checks.

### Local Setup
1. Copy .env.example to .env and fill values as needed.
2. npm ci
3. npm run dev
4. Configure Supabase project URL/keys in the app or via Lovable integration.

### Security Verification
- RLS: anonymous users cannot list guest registrations; users only see their own.
- Env: search repo for supabase.co or JWT-like strings; none beyond allowed public anon key remain.
- CSP: open DevTools; confirm no CSP errors.
- CORS: test a disallowed origin; edge functions block it (no wildcard).
- Abuse: registration may be gated behind captcha once secrets are set.

### Migrations
Run via Lovable/Supabase: the new SQL has been applied to secure workshop_registrations and align FK. Use Supabase SQL Editor if rerunning is needed.

## Visual Refresh: Apple-Elegant + Unicorn Accents
- Additive only: no breaking API changes.
- New tokens, Tailwind extensions, utilities, and safe component variants.
- Respects prefers-reduced-motion and maintains WCAG AA contrast.
- Rollback: remove the added CSS tokens/utilities and variant usages.

## Style Guide (Apple + Unicorn Accents)
- Use gradient strokes and gradient headlines; avoid large solid gradient fills.
- Body text remains solid for readability.
- Primary CTAs use variant="primaryPill"; secondary actions use variant="ghostGlass".
- Cards can opt into "glass grad-stroke" for premium sections.
- Respect prefers-reduced-motion; keep hover motion under 2px.


# CalorAI Test Task Submission

Monorepo for the CalorAI assignment with:

- Telegram health chatbot (log, list, edit, delete meals)
- A/B onboarding flow in n8n using Statsig for assignment
- Expo mobile app synced to the same meal data
- Next.js analytics dashboard for activity, split, and onboarding funnel

## Repo Structure

- `calorai-bot` — Telegram bot (Telegraf + Supabase)
- `calorai-app` — Expo React Native app (Supabase + realtime + notifications)
- `calorai-dashboard` — Next.js dashboard (Supabase + Recharts)
- `n8n-workflows` — A/B onboarding workflows JSON exports
- `docker-compose.yml` — one-command local boot for bot + app + dashboard

## What Is Implemented

### Primary Task: A/B Test Chatbot (n8n + Statsig)

- `n8n-workflows/ab-test-start-handler.json`
  - Handles `/start` from Telegram.
  - Checks if user already has an assigned group in `user_groups`.
  - New users are assigned through Statsig (`onboarding_ab_test`) via `get_config`.
  - Stores assignment in Supabase `user_groups`.
  - Logs assignment event in Supabase `events` with `event_name: group_assigned`.
  - Routes by group:
    - `control` -> generic welcome
    - `test` -> onboarding step 1 and sets `user_state.current_step = 1`
- `n8n-workflows/ab-test-onboarding-steps.json`
  - Handles onboarding replies for test users (steps 1 -> 3).
  - Persists onboarding state in `user_state`.
  - Logs events:
    - `onboarding_step_1_complete`
    - `onboarding_step_2_complete`
    - `onboarding_complete`

### Secondary Task: Health Chatbot

- `calorai-bot/src/index.ts` registers:
  - `/start`
  - `/log`
  - `/list`
  - `/edit`
  - `/delete`
- CRUD behavior is implemented in:
  - `calorai-bot/src/commands/log.ts`
  - `calorai-bot/src/commands/list.ts`
  - `calorai-bot/src/commands/edit.ts`
  - `calorai-bot/src/commands/delete.ts`
- Data persistence uses Supabase table `meals` via:
  - `calorai-bot/src/services/meals.ts`

### Bonus Task 1: Expo Go Mobile App

- `calorai-app/App.tsx` gates app by Telegram username login.
- `calorai-app/src/screens/TelegramLoginScreen.tsx`
  - Looks up user in `user_groups` by `telegram_username`.
- `calorai-app/src/screens/HomeScreen.tsx`
  - Lists meals with timestamps/calories UI.
  - Add, edit, and delete meal actions.
- Shared data source is Supabase `meals` table, so bot/app operate on same records.

### Bonus Task 2: Real-time Sync + Push Notifications

- Realtime sync:
  - `calorai-app/src/hooks/useMeals.ts` subscribes to Supabase realtime (`postgres_changes`) on `meals` filtered by `user_id`.
  - Handles `INSERT`, `UPDATE`, and `DELETE` events.
- Push notifications:
  - `calorai-app/src/services/notificationService.ts`
  - Schedules daily reminder at 8:00 PM.
  - Schedules daily summary at 9:00 PM.

### Bonus Task 3: Analytics Dashboard

- `calorai-dashboard/src/app/page.tsx` renders KPI cards + charts.
- `calorai-dashboard/src/lib/analytics.ts` computes:
  - total users (`user_groups`)
  - meals logged today (`meals`)
  - average calories today (`meals`)
  - daily meal activity (last 7 days)
  - A/B group split (`user_groups`)
  - onboarding funnel completion (`events` for test group)
- Charts:
  - `MealActivityChart` (bar)
  - `GroupSplitChart` (pie)
  - `OnboardingFunnel` (funnel bars)

## Setup Instructions

### 1) Clone and install dependencies

```bash
git clone <your-public-repo-url>
cd calorai

npm install --prefix calorai-bot
npm install --prefix calorai-app
npm install --prefix calorai-dashboard
```

### 2) Environment variables

Create `.env` at repo root using `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
TELEGRAM_BOT_TOKEN=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Also verify project-local examples:

- `calorai-bot/.env.example`
  - `TELEGRAM_BOT_TOKEN`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- `calorai-app/.env.example`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `calorai-dashboard/.env.example`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Note: runtime code currently reads Expo and Next variables directly from root env names shown above.

### 3) Run locally

#### Option A (recommended): Docker Compose

```bash
docker compose up --build
```

Services:

- Dashboard: `http://localhost:3000`
- Expo Metro: `http://localhost:8081` (QR shown in logs)
- Bot: runs polling with `TELEGRAM_BOT_TOKEN`

If testing Expo Go on a physical device, set `EXPO_PACKAGER_HOST` in `.env` to your machine LAN IP.

#### Option B: Run each project manually

```bash
npm run dev --prefix calorai-bot
npm run start --prefix calorai-app
npm run dev --prefix calorai-dashboard
```

### 4) Import n8n workflows

Import both files from `n8n-workflows` into n8n:

- `ab-test-start-handler.json`
- `ab-test-onboarding-steps.json`

Then configure n8n credentials for Telegram, Statsig, and Supabase headers in your environment.

## Evaluation Framework (Pre-committed)

### Primary metric (leading indicator)

- **Test-group onboarding completion rate**  
  Definition: `onboarding_complete / group_assigned` for users in `group_name = test`.

Reason: this is available immediately and is directly tied to early user activation, which is a strong leading indicator for retention in guided onboarding funnels.

### Guardrail metrics

- **Drop-off after assignment**  
  Users assigned to a group but no further onboarding/meal activity events.
- **Command-level friction signals**  
  Error replies from bot command handlers and invalid edit/delete attempts.
- **A/B balance sanity check**  
  Group split should remain close to expected allocation (visible in dashboard).

### Secondary metrics

- Meal logs per user per day (`meals` activity)
- Day-7 return proxy (user records with activity on non-day-0 windows)
- Step-wise onboarding conversion:
  - step 1 complete
  - step 2 complete
  - onboarding complete

### Decision framework

- Ship onboarding flow if:
  - onboarding completion is meaningfully above baseline/control behavior, and
  - guardrails do not regress.
- Iterate onboarding copy/steps if:
  - completion is weak at a specific funnel step.
- Roll back onboarding if:
  - severe guardrail issues appear (major drop in engagement or unstable assignment quality).

## Architecture Overview

- **Telegram + n8n path (A/B onboarding)**
  - Telegram `/start` -> n8n trigger -> Statsig assignment -> Supabase persistence/events -> control/test message path.
- **Telegram bot path (health commands)**
  - Telegraf command handlers -> Supabase `meals` CRUD.
- **Mobile app path**
  - Telegram username login lookup -> Supabase `user_groups` -> meal CRUD + realtime subscription.
- **Dashboard path**
  - Next.js server-side data reads from Supabase -> chart components.

Shared backend is Supabase, used by bot, app, n8n workflows, and dashboard.

## Tools and Services Used

- **n8n** — fast visual orchestration for Telegram onboarding flow and event logging.
- **Statsig** — A/B assignment provider for deterministic control/test routing.
- **Supabase** — shared Postgres + realtime backbone for all surfaces.
- **Telegraf** — lightweight Telegram bot framework for command routing.
- **Expo (React Native)** — quick mobile delivery and device testing via Expo Go.
- **expo-notifications** — scheduled daily reminders and summary notifications.
- **Next.js + Recharts** — simple analytics dashboard with SSR data fetches.
- **Docker Compose** — single command local environment for all apps.

## Assumptions and Trade-offs

- Assignment and onboarding logic are implemented in n8n workflow JSON, not in app code.
- Supabase schema is expected to already contain the required tables (`meals`, `user_groups`, `user_state`, `events`).
- Current setup prioritizes speed and readability over strict production hardening.
- Some workflow credentials/URLs are configured in n8n and should be environment-managed.

## Time Breakdown

Recorded separately while building each section:

- Primary Task (A/B test + event logging + evaluation plan): 6 hrs
- Secondary Task (health chatbot): 1 hr
- Bonus Task 1 (Expo app): 3 hrs
- Bonus Task 2 (realtime + notifications): 30 mins
- Bonus Task 3 (analytics dashboard): 1 hr

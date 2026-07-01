# CutLog — Agent Context & Operating Rules

> **This file is auto-loaded by Claude Code at the start of every session in this repo.**
> It is the single source of truth for *how we work together* and *where everything lives*.
> Read it first, then the two context docs linked below. Keep it current — it acts as memory.

---

## What CutLog is

A mobile-first PWA (Next.js 14 App Router / Supabase / TypeScript / Tailwind) that gives laser
operators a **trusted starting point** for cut/engrave parameters so they run **fewer test
squares** — not a magic per-machine number. Industrial thick-metal fiber **cutting** is the
PRIMARY segment; galvo/MOPA **engraving** is secondary; hobbyist CO2/diode is a funnel asset.
Live app: https://cutlog-two.vercel.app

## Read these next (the real context)

1. **`project_docs/4.8_research/00_SYNTHESIS_AND_VERDICT.md`** — the current, fresh (Opus 4.8)
   verdict and strategy. This SUPERSEDES the older thesis. Start here.
2. **`project_docs/project_summary.md`** — full project history (older model's work; see trust
   rule below). Useful background, not gospel.
3. **`project_docs/records/PROJECT_STATE.md`** — the living log: Action Items, Learnings,
   Decisions, Long-term Plans. **This is what we actually did**, vs. the research/plans.

## Where things live (so anyone can navigate)

- `project_docs/4.8_research/` — current trusted **research, plans, and specs** (competitive
  analysis, WTP plan, SEO plan, IMPL_*.md build notes, marketing). Reference material.
- `project_docs/records/` — **what actually happened.** `PROJECT_STATE.md` is the master log;
  per-topic running logs (e.g. `reddit.md`, `facebook.md`, `wtp.md`) hold execution detail.
- `project_docs/*.md` (top level) — **legacy** docs from the older model. Treat as untrusted
  history; some (e.g. the several facebook/outreach files) are scattered for legacy reasons and
  may be consolidated over time.
- `src/` — the app. `data/*.sql` — numbered Supabase migrations (apply manually in SQL editor).

---

## OPERATING RULES (always follow these)

### 0. Ground truth
Work done by **previous/other agents is NOT to be trusted** until independently verified (run the
build/tests, read the code). Documented **human feedback** (Facebook / Reddit / YouTube operators)
**is** ground truth. When the two conflict, the humans win.

### 1. Keep diligent, human-readable records
Maintain `project_docs/records/PROJECT_STATE.md` with four standing sections:
**Action Items · Learnings · Decisions · Long-term Plans.** After every working conversation,
check whether any of these need updating, and update them. **If you are unsure whether Hooman
actually acted on advice, how exactly he did something, or whether he agreed to a plan/change —
ASK. Do not record assumptions as fact.** Date entries (today's date is provided each session).

### 2. Organize records by topic, not by event
One running file per topic of work (one `reddit.md`, one `facebook.md`, etc.) — **never** a new
file per post/DM/experiment. Keep the number of files small. Use folders/filenames so someone with
no context can find their way and narrow a search by name alone. Don't be over-prescriptive; use
judgment. Consolidate legacy sprawl (e.g. multiple outreach files) when it makes sense. Create a
topic file only when we actually start executing that topic — no empty placeholders.

### 3. Fan out subagents; keep the main session free
When given multiple pieces of work, **default to running them as background subagents in parallel**
so the main session stays free for Hooman to assign more. BUT distribute work correctly:
parallelize only what's independent; **run dependent steps in serial** so later steps can use
earlier learnings. Don't over-parallelize for its own sake. **The priority is background execution
+ a free main session, not subagent count.** When unsure how to split serial vs. parallel, ASK.

---

## Current position (one-liner — update as it changes)

The product is **more complete than the market**; the one missing thing is **a dollar of revenue**.
Next gate = **willingness-to-pay validation** (3–4 wk). See `PROJECT_STATE.md` for live status.

---

## 🆘 COLD-START / RECOVERY (if this machine dies or a fresh agent picks up)

If you are a new agent with no prior context, **this is your standing prompt — do it without being
asked again:**

1. **Read, in order:** this file → `project_docs/4.8_research/00_SYNTHESIS_AND_VERDICT.md`
   → `project_docs/project_summary.md` → `project_docs/records/PROJECT_STATE.md` →
   the relevant per-topic logs in `project_docs/records/`.
2. **See where we are:** from `PROJECT_STATE.md` (Action Items / Decisions) figure out the current
   gate and what's in flight.
3. **Verify the last agent's work — do NOT trust it.** Check git log/branches; run the build
   (`npm run build`) and tests (`npx vitest run`); confirm claimed features actually exist and pass.
   Record what's real vs. only claimed.
4. **Suggest the next steps** of the plan to Hooman, then proceed per his direction following the
   operating rules above (records up to date, fan out background subagents, keep the main session
   free, ask when unsure).

Environment notes for builds/tests: Node lives at `/opt/conda/bin` (v18 in sandbox; Vercel/CI use
Node 20+). `npm run build` fails at module-load in a bare sandbox with **"supabaseUrl is required"**
on `/api/admin/*` routes — that is a missing-env-var artifact, **not** a code defect; it builds with
Supabase env vars present. The Supabase migrations in `data/*.sql` must be applied manually in the
Supabase SQL editor.

### 🔁 Resuming a prior Claude Code session after a restart

This repo lives on `/mnt/localssd` (scratch — **does NOT survive a machine restart**). To keep our
session history resumable, the Claude Code session store for this project is **relocated to the
backed-up + git-pushed** `~/hs_scripts` tree and symlinked back:

- **Real location (durable):** `/home/colligo/hs_scripts/claude/cutlog_claud_resume/`
  — holds the session `*.jsonl` transcripts, subagent logs, and `memory/`.
- **Symlink Claude Code reads:** `~/.claude/projects/-mnt-localssd-laser-log-cutlog` → that dir.

**After a restart the symlink is gone** (home is restored, but the symlink pointed from `~/.claude`
which may reset). To restore resumability, run:

```bash
bash /home/colligo/hs_scripts/claude/cutlog_claud_resume/RESTORE.sh
```

Then in this repo run `claude -c` (continue most recent) or `claude --resume` (pick a session).
If a fresh Claude run already created a real dir at the symlink path, `RESTORE.sh` merges it in
before re-linking, so it's safe to run either way.

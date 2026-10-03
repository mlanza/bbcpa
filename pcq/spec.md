# pcq CLI Spec (Current)

## Purpose
`pcq` is a **read-only** Deno CLI for Planning Center query workflows.

It gathers scheduling intelligence to support human decisions about staffing gaps, especially for Facility Watch and Greeters.

## Non-negotiable constraint
- **No writes/mutations to Planning Center.**
- Commands only query and report.
- This phase is strictly for visibility and decision support.

## Primary use case
1. Identify upcoming services/events (starting point for selecting a target date/plan).
2. Assess staffing status for a selected plan.
3. Detect likely risk/gap areas.
4. Suggest candidate people who may help fill gaps (heuristic only).

## Initial team focus
- Facility Watch (first)
- Greeters (next)

## Command set (current)

### 1) `upcoming`
Shows upcoming plans (default next 6 days).

- Includes service type name + ID, plan ID/date, open needed count (plan-level), assigned count.
- Supports `--days` and `--include-empty`.

### 2) `staffing-status`
Shows staffing status for one plan.

Inputs:
- `--service-type`
- `--plan`
- optional `--team` filter
- optional `--members` for contact details

Behavior:
- Always expands names where possible (service type + member names).
- Team-level totals by status (confirmed/unconfirmed/declined).
- With `--members`, includes email and phone per member.

### 3) `gap-report`
Shows likely at-risk positions for one plan.

- Uses unconfirmed/declined by position as risk indicators.
- Shows plan-level open needed count.

### 4) `team-candidates`
Provides heuristic candidate list from nearby plans.

- Looks at confirmed service in same service type/team/position over a lookahead window.
- Excludes people already assigned on target plan.
- Supports team/position filters.

## Data semantics (important)
- Team `total` in `staffing-status` = number of scheduled people on that plan/team.
  - It is **not** full roster size.
  - It is **not** guaranteed to equal required headcount for that team.
- `confirmed_pct` style calculations (if used downstream) mean confirmed/scheduled, not confirmed/required.

## Known limitation
Current token permissions block:
- `services/v2/.../needed_positions`

Impact:
- True team-scoped **required vs open** cannot currently be computed from API truth.
- We can report plan-level needed/open and team scheduled/response status, but not exact per-team required gaps.

## Permission needed to unlock team-required gap math
In Planning Center Services, elevate access on relevant service type(s) from Viewer to Scheduler+ (or equivalent) so `needed_positions` is readable.

## Output philosophy
- Human-readable by default.
- JSON available via `--json` for scripting.
- Keep reports concise, practical, and decision-oriented.

## Future phase (not implemented)
- Controlled automation that notifies team leads (not direct member outreach), preserving human touch.
- Candidate recommendation packets with contact details for lead follow-up.

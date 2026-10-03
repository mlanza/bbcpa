#!/usr/bin/env -S deno run --allow-net --allow-read --allow-env

import { Command } from "jsr:@cliffy/command@1.0.0-rc.8";

const PCO_BASE = "https://api.planningcenteronline.com";
const STATUS_LABELS = {
  C: "confirmed",
  U: "unconfirmed",
  D: "declined",
  B: "blocked",
};

const resolverCache = {
  serviceTypeById: null,
};

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

function normalizeName(name) {
  return String(name ?? "").trim().replace(/\s+/g, " ");
}

async function loadEnvFile(path = ".env") {
  try {
    const text = await Deno.readTextFile(path);
    const result = {};

    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const cleaned = line.startsWith("export ") ? line.slice(7).trim() : line;
      const match = cleaned.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;

      const [, key, valueRaw] = match;
      const value = valueRaw.replace(/^['\"]|['\"]$/g, "").trim();
      result[key] = value;
    }

    return result;
  } catch {
    return {};
  }
}

async function getCredentials() {
  const envFile = await loadEnvFile();

  const pat =
    Deno.env.get("PAT") ??
    Deno.env.get("PCO_PAT") ??
    envFile.PAT ??
    envFile.PCO_PAT;

  const secret =
    Deno.env.get("Secret") ??
    Deno.env.get("SECRET") ??
    Deno.env.get("PCO_SECRET") ??
    envFile.Secret ??
    envFile.SECRET ??
    envFile.PCO_SECRET;

  if (!pat || !secret) {
    throw new Error(
      "Missing credentials. Set PAT + Secret in environment or .env.",
    );
  }

  return { pat, secret };
}

function authHeader(pat, secret) {
  return `Basic ${btoa(`${pat}:${secret}`)}`;
}

function buildUrl(path, query = {}) {
  const url = new URL(path, PCO_BASE);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function apiGet(path, { pat, secret }, query = {}) {
  const url = buildUrl(path, query);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: authHeader(pat, secret),
      Accept: "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok) {
    const msg = body?.errors?.[0]?.detail ?? response.statusText;
    throw new Error(`PCO API ${response.status}: ${msg}`);
  }

  return body;
}

async function apiGetAll(path, creds, query = {}) {
  const first = await apiGet(path, creds, query);
  const data = [...(first.data ?? [])];

  let nextUrl = first?.links?.next;
  while (nextUrl) {
    const response = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader(creds.pat, creds.secret),
        Accept: "application/json",
      },
    });

    const body = await response.json();
    if (!response.ok) {
      const msg = body?.errors?.[0]?.detail ?? response.statusText;
      throw new Error(`PCO API ${response.status}: ${msg}`);
    }

    data.push(...(body.data ?? []));
    nextUrl = body?.links?.next;
  }

  return data;
}

function statusLabel(code) {
  return STATUS_LABELS[code] ?? `other(${code ?? "?"})`;
}

function compactDate(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return `${toISODate(d)} ${d.toISOString().slice(11, 16)}Z`;
}

function printList(rows) {
  for (const row of rows) console.log(row);
}

function formatServiceTypeLabel(id, name) {
  if (name) return `${name} [${id}]`;
  return String(id);
}

async function getServiceTypes(creds) {
  return await apiGetAll("/services/v2/service_types", creds, { per_page: 100 });
}

async function getServiceTypeMap(creds) {
  if (resolverCache.serviceTypeById) return resolverCache.serviceTypeById;

  const map = new Map();
  const serviceTypes = await getServiceTypes(creds);
  for (const st of serviceTypes) {
    map.set(String(st.id), normalizeName(st.attributes?.name));
  }

  resolverCache.serviceTypeById = map;
  return map;
}

async function getFuturePlansForType(serviceTypeId, creds) {
  return await apiGetAll(
    `/services/v2/service_types/${serviceTypeId}/plans`,
    creds,
    { filter: "future", per_page: 100 },
  );
}

async function getPlan(serviceTypeId, planId, creds) {
  return await apiGet(
    `/services/v2/service_types/${serviceTypeId}/plans/${planId}`,
    creds,
  );
}

async function getPlanMembers(serviceTypeId, planId, creds) {
  return await apiGetAll(
    `/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
    creds,
    { per_page: 100 },
  );
}

async function getTeamsById(serviceTypeId, creds) {
  const teams = await apiGetAll(
    `/services/v2/service_types/${serviceTypeId}/teams`,
    creds,
    { per_page: 100 },
  );

  const map = new Map();
  for (const t of teams) map.set(String(t.id), normalizeName(t.attributes?.name));
  return map;
}

async function getGroups(creds) {
  return await apiGetAll("/groups/v2/groups", creds, { per_page: 100 });
}

async function getGroupEvents(groupId, creds) {
  return await apiGetAll(`/groups/v2/groups/${groupId}/events`, creds, { per_page: 100 });
}

async function getSignups(creds) {
  return await apiGet("/registrations/v2/signups", creds, {
    include: "categories,signup_times",
    per_page: 100,
  });
}

async function getSignupRegistrationCount(signupId, creds) {
  const body = await apiGet(`/registrations/v2/signups/${signupId}/registrations`, creds, {
    per_page: 1,
  });
  return Number(body?.meta?.total_count ?? 0);
}

async function getPeople(creds) {
  return await apiGetAll("/people/v2/people", creds, { per_page: 100 });
}

function chunk(values, size) {
  const out = [];
  for (let i = 0; i < values.length; i += size) out.push(values.slice(i, i + size));
  return out;
}

async function getPeopleContacts(personIds, creds) {
  const ids = [...new Set(personIds.map(String).filter(Boolean))];
  const contacts = new Map();
  if (!ids.length) return contacts;

  for (const group of chunk(ids, 50)) {
    const res = await apiGet("/people/v2/people", creds, {
      "where[id]": group.join(","),
      include: "emails,phone_numbers",
      per_page: 100,
    });

    const byPerson = new Map();
    for (const inc of res.included ?? []) {
      const personId = String(inc?.relationships?.person?.data?.id ?? "");
      if (!personId) continue;
      if (!byPerson.has(personId)) byPerson.set(personId, { emails: [], phones: [] });
      const slot = byPerson.get(personId);
      if (inc.type === "Email") slot.emails.push(inc.attributes ?? {});
      if (inc.type === "PhoneNumber") slot.phones.push(inc.attributes ?? {});
    }

    for (const pid of group) {
      const slot = byPerson.get(String(pid)) ?? { emails: [], phones: [] };
      const primaryEmail = slot.emails.find((e) => e.primary)?.address ?? slot.emails[0]?.address ?? null;
      const primaryPhone = slot.phones.find((p) => p.primary)?.national ??
        slot.phones.find((p) => p.primary)?.e164 ??
        slot.phones[0]?.national ??
        slot.phones[0]?.e164 ?? null;
      contacts.set(String(pid), { email: primaryEmail, phone: primaryPhone });
    }
  }

  return contacts;
}

const program = new Command()
  .name("pcq")
  .version("0.1.0")
  .description("Planning Center query CLI for scheduling intelligence (read-only)")
  .globalOption("--json", "Output JSON")
  .globalOption("-e, --env <path:string>", "Path to env file", {
    default: ".env",
  });

program
  .command("people")
  .description("List people visible to this token")
  .option("-m, --match <text:string>", "Case-insensitive filter on name")
  .option("-l, --limit <n:number>", "Max rows to print", { default: 50 })
  .option("--all-statuses", "Include inactive/status != active")
  .action(async (opts) => {
    const creds = await getCredentials();
    const match = opts.match ? normalizeName(opts.match).toLowerCase() : null;

    const people = await getPeople(creds);
    let rows = people
      .map((p) => ({
        id: String(p.id),
        name: normalizeName(p.attributes?.name),
        status: p.attributes?.status ?? null,
        membership: p.attributes?.membership ?? null,
        updated_at: p.attributes?.updated_at ?? null,
      }))
      .filter((p) => p.name);

    if (!opts.allStatuses) rows = rows.filter((p) => p.status === "active");
    if (match) rows = rows.filter((p) => p.name.toLowerCase().includes(match));

    rows.sort((a, b) => a.name.localeCompare(b.name));

    const limited = rows.slice(0, Number(opts.limit));

    if (opts.json) {
      console.log(JSON.stringify({ total: rows.length, shown: limited.length, data: limited }, null, 2));
      return;
    }

    if (!limited.length) {
      console.log(match ? `No people matched "${opts.match}".` : "No people found.");
      return;
    }

    printList([
      `People visible: total=${rows.length}, showing=${limited.length}`,
      ...limited.map((p) =>
        `${p.name} [${p.id}] | status=${p.status ?? "-"} membership=${p.membership ?? "-"}`
      ),
    ]);
  });

program
  .command("service-types")
  .description("List Services service types (optionally filter by name)")
  .option("-m, --match <text:string>", "Case-insensitive name filter")
  .action(async (opts) => {
    const creds = await getCredentials();
    const serviceTypes = await getServiceTypes(creds);
    const match = opts.match ? normalizeName(opts.match).toLowerCase() : null;

    const rows = serviceTypes
      .map((st) => ({
        id: String(st.id),
        name: normalizeName(st.attributes?.name),
      }))
      .filter((r) => !match || r.name.toLowerCase().includes(match))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (opts.json) {
      console.log(JSON.stringify(rows, null, 2));
      return;
    }

    if (!rows.length) {
      console.log(match
        ? `No service types matched "${opts.match}".`
        : "No service types found.");
      return;
    }

    printList(rows.map((r) => `${r.name} [${r.id}]`));
  });

program
  .command("upcoming")
  .description("Query upcoming services/plans (default: next 6 days)")
  .option("-d, --days <days:number>", "Days ahead", { default: 6 })
  .option("--include-empty", "Include service types with no plans in range")
  .action(async (opts) => {
    const creds = await getCredentials();
    const now = new Date();
    const until = new Date(now);
    until.setUTCDate(until.getUTCDate() + Number(opts.days));

    const serviceTypes = await getServiceTypes(creds);
    const rows = [];

    for (const st of serviceTypes) {
      const stName = normalizeName(st.attributes?.name);
      const plans = await getFuturePlansForType(st.id, creds);

      const inRange = plans
        .map((p) => ({
          service_type_id: String(st.id),
          service_type: stName,
          plan_id: String(p.id),
          date: p.attributes?.sort_date,
          dates_label: p.attributes?.dates,
          title: p.attributes?.title,
          needed_positions_open: p.attributes?.needed_positions_count ?? 0,
          assigned_people: p.attributes?.plan_people_count ?? 0,
          service_times: p.attributes?.service_time_count ?? 0,
          url: p.attributes?.planning_center_url,
        }))
        .filter((p) => {
          const when = p.date ? new Date(p.date) : null;
          return when && when >= now && when <= until;
        });

      if (inRange.length === 0 && opts.includeEmpty) {
        rows.push({
          service_type_id: String(st.id),
          service_type: stName,
          plan_id: null,
          date: null,
          dates_label: null,
          title: null,
          needed_positions_open: 0,
          assigned_people: 0,
          service_times: 0,
          url: null,
        });
        continue;
      }

      rows.push(...inRange);
    }

    rows.sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

    if (opts.json) {
      console.log(JSON.stringify(rows, null, 2));
      return;
    }

    if (rows.length === 0) {
      console.log(`No plans found between ${toISODate(now)} and ${toISODate(until)}.`);
      return;
    }

    printList([
      `Upcoming plans: ${toISODate(now)} -> ${toISODate(until)}`,
      "",
      ...rows.map((r) =>
        [
          `${compactDate(r.date)} | ${r.service_type} [${r.service_type_id}] (service_type=${r.service_type_id}, plan=${r.plan_id})`,
          `  open_needed=${r.needed_positions_open} assigned=${r.assigned_people} service_times=${r.service_times}`,
          `  ${r.dates_label ?? ""}${r.title ? ` — ${r.title}` : ""}`,
          `  ${r.url ?? ""}`,
        ].join("\n")
      ),
    ]);
  });

program
  .command("staffing-status")
  .description("Query staffing status for one plan")
  .option("-s, --service-type <id:string>", "Service type ID", { required: true })
  .option("-p, --plan <id:string>", "Plan ID", { required: true })
  .option("-t, --team <name:string>", "Filter to one team (case-insensitive contains)")
  .option("--members", "Include member contact details (email/phone); implies member names")
  .action(async (opts) => {
    const creds = await getCredentials();
    const plan = await getPlan(opts.serviceType, opts.plan, creds);
    const members = await getPlanMembers(opts.serviceType, opts.plan, creds);
    const teamsById = await getTeamsById(opts.serviceType, creds);
    const serviceTypeName = (await getServiceTypeMap(creds)).get(String(opts.serviceType)) ?? null;

    const showMemberNames = true;
    const includeMemberDetails = Boolean(opts.members);

    const personIds = members
      .map((m) => String(m.relationships?.person?.data?.id ?? ""))
      .filter(Boolean);
    const contactByPersonId = includeMemberDetails
      ? await getPeopleContacts(personIds, creds)
      : new Map();

    const statusCounts = new Map();
    const byTeam = new Map();

    for (const m of members) {
      const code = m.attributes?.status ?? "?";
      statusCounts.set(code, (statusCounts.get(code) ?? 0) + 1);

      const teamId = String(m.relationships?.team?.data?.id ?? "unknown");
      const teamName = teamsById.get(teamId) ?? `Team ${teamId}`;
      if (!byTeam.has(teamName)) {
        byTeam.set(teamName, {
          total: 0,
          C: 0,
          U: 0,
          D: 0,
          members: { C: [], U: [], D: [], other: [] },
        });
      }

      const t = byTeam.get(teamName);
      t.total += 1;
      t[code] = (t[code] ?? 0) + 1;

      if (showMemberNames) {
        const personId = String(m.relationships?.person?.data?.id ?? "");
        const personName = normalizeName(m.attributes?.name) || "(unknown)";
        const position = normalizeName(m.attributes?.team_position_name);
        const contact = contactByPersonId.get(personId) ?? { email: null, phone: null };

        const memberRow = {
          person_id: personId || null,
          name: personName,
          position: position || null,
          email: includeMemberDetails ? contact.email : null,
          phone: includeMemberDetails ? contact.phone : null,
        };

        if (code === "C" || code === "U" || code === "D") t.members[code].push(memberRow);
        else t.members.other.push(memberRow);
      }
    }

    const neededOpen = plan.data?.attributes?.needed_positions_count ?? 0;
    const totalAssigned = members.length;
    const totalNeededEstimate = totalAssigned + neededOpen;

    const teamFilter = opts.team ? normalizeName(opts.team).toLowerCase() : null;
    const teamRows = [...byTeam.entries()]
      .map(([team, counts]) => ({ team, ...counts }))
      .filter((t) => !teamFilter || t.team.toLowerCase().includes(teamFilter))
      .sort((a, b) => a.team.localeCompare(b.team));

    const payload = {
      service_type_id: String(opts.serviceType),
      service_type_name: serviceTypeName,
      plan_id: String(opts.plan),
      plan_date: plan.data?.attributes?.sort_date,
      dates_label: plan.data?.attributes?.dates,
      open_needed_positions: neededOpen,
      assigned_people_total: totalAssigned,
      total_needed_estimate: totalNeededEstimate,
      status_counts: Object.fromEntries(statusCounts),
      teams: teamRows,
      notes: [
        "total_needed_estimate = assigned_people_total + open_needed_positions",
        "open_needed_positions comes from plan.needed_positions_count",
      ],
    };

    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }

    const renderMember = (m) => {
      const base = m.position ? `${m.name} (${m.position})` : m.name;
      if (!includeMemberDetails) return base;
      return `${base} <${m.email ?? "no-email"}> ${m.phone ?? "no-phone"}`;
    };

    const teamLines = payload.teams.flatMap((t) => {
      const lines = [
        `  ${t.team}: total=${t.total} confirmed=${t.C ?? 0} unconfirmed=${t.U ?? 0} declined=${t.D ?? 0}`,
      ];
      if (showMemberNames) {
        if (t.members.C.length) lines.push(...t.members.C.map((m) => `    C: ${renderMember(m)}`));
        if (t.members.U.length) lines.push(...t.members.U.map((m) => `    U: ${renderMember(m)}`));
        if (t.members.D.length) lines.push(...t.members.D.map((m) => `    D: ${renderMember(m)}`));
        if (t.members.other.length) lines.push(...t.members.other.map((m) => `    ?: ${renderMember(m)}`));
      }
      return lines;
    });

    printList([
      `${payload.dates_label ?? compactDate(payload.plan_date)} | service_type=${formatServiceTypeLabel(payload.service_type_id, payload.service_type_name)} plan=${payload.plan_id}`,
      `Needed(est): ${payload.total_needed_estimate} | Assigned: ${payload.assigned_people_total} | Open gaps: ${payload.open_needed_positions}`,
      "Status counts:",
      ...Object.entries(payload.status_counts).map(([k, v]) =>
        `  ${statusLabel(k)} (${k}): ${v}`
      ),
      "By team:",
      ...teamLines,
    ]);
  });

program
  .command("gap-report")
  .description("Query likely staffing gaps for one plan")
  .option("-s, --service-type <id:string>", "Service type ID", { required: true })
  .option("-p, --plan <id:string>", "Plan ID", { required: true })
  .action(async (opts) => {
    const creds = await getCredentials();
    const plan = await getPlan(opts.serviceType, opts.plan, creds);
    const members = await getPlanMembers(opts.serviceType, opts.plan, creds);
    const serviceTypeName = (await getServiceTypeMap(creds)).get(String(opts.serviceType)) ?? null;

    const byPosition = new Map();

    for (const m of members) {
      const position = normalizeName(m.attributes?.team_position_name || "(no position)");
      const status = m.attributes?.status ?? "?";

      if (!byPosition.has(position)) {
        byPosition.set(position, { position, total: 0, confirmed: 0, unconfirmed: 0, declined: 0 });
      }
      const row = byPosition.get(position);
      row.total += 1;
      if (status === "C") row.confirmed += 1;
      else if (status === "U") row.unconfirmed += 1;
      else if (status === "D") row.declined += 1;
    }

    const openNeeded = plan.data?.attributes?.needed_positions_count ?? 0;
    const atRisk = [...byPosition.values()]
      .filter((r) => r.unconfirmed > 0 || r.declined > 0)
      .sort((a, b) => (b.unconfirmed + b.declined) - (a.unconfirmed + a.declined));

    const payload = {
      service_type_id: String(opts.serviceType),
      service_type_name: serviceTypeName,
      plan_id: String(opts.plan),
      plan_date: plan.data?.attributes?.sort_date,
      dates_label: plan.data?.attributes?.dates,
      open_needed_positions: openNeeded,
      at_risk_positions: atRisk,
      caveat:
        "Planning Center permissions for this token do not expose needed_positions detail; open_needed_positions is plan-level, not per-position.",
    };

    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }

    printList([
      `${payload.dates_label ?? compactDate(payload.plan_date)} | service_type=${formatServiceTypeLabel(payload.service_type_id, payload.service_type_name)} plan=${payload.plan_id}`,
      `Open unassigned positions (plan-level): ${payload.open_needed_positions}`,
      "At-risk positions (declined/unconfirmed):",
      ...(payload.at_risk_positions.length
        ? payload.at_risk_positions.map((r) =>
          `  ${r.position}: unconfirmed=${r.unconfirmed} declined=${r.declined} confirmed=${r.confirmed}`
        )
        : ["  none"]),
      `Note: ${payload.caveat}`,
    ]);
  });

program
  .command("team-candidates")
  .description("Query likely fill-in candidates from nearby plans (heuristic)")
  .option("-s, --service-type <id:string>", "Service type ID", { required: true })
  .option("-p, --plan <id:string>", "Target plan ID", { required: true })
  .option("-t, --team <name:string>", "Team name filter (exact, case-insensitive)")
  .option("--position <name:string>", "Team position filter (exact, case-insensitive)")
  .option("--days <days:number>", "How far after target date to inspect", {
    default: 42,
  })
  .option("--max <n:number>", "Max candidates to print", { default: 20 })
  .action(async (opts) => {
    const creds = await getCredentials();
    const targetPlan = await getPlan(opts.serviceType, opts.plan, creds);
    const targetMembers = await getPlanMembers(opts.serviceType, opts.plan, creds);
    const teamsById = await getTeamsById(opts.serviceType, creds);
    const futurePlans = await getFuturePlansForType(opts.serviceType, creds);
    const serviceTypeName = (await getServiceTypeMap(creds)).get(String(opts.serviceType)) ?? null;

    const targetDate = new Date(targetPlan.data?.attributes?.sort_date);
    const until = new Date(targetDate);
    until.setUTCDate(until.getUTCDate() + Number(opts.days));

    const targetAssigned = new Set(
      targetMembers.map((m) => normalizeName(m.attributes?.name).toLowerCase()),
    );

    const teamFilter = opts.team ? normalizeName(opts.team).toLowerCase() : null;
    const positionFilter = opts.position
      ? normalizeName(opts.position).toLowerCase()
      : null;

    const candidateStats = new Map();

    for (const p of futurePlans) {
      const planId = String(p.id);
      if (planId === String(opts.plan)) continue;

      const when = new Date(p.attributes?.sort_date);
      if (Number.isNaN(when.getTime())) continue;
      if (when < targetDate || when > until) continue;

      const members = await getPlanMembers(opts.serviceType, planId, creds);
      for (const m of members) {
        if (m.attributes?.status !== "C") continue;

        const person = normalizeName(m.attributes?.name);
        const personKey = person.toLowerCase();
        if (!person || targetAssigned.has(personKey)) continue;

        const teamId = String(m.relationships?.team?.data?.id ?? "unknown");
        const teamName = teamsById.get(teamId) ?? `Team ${teamId}`;
        const position = normalizeName(m.attributes?.team_position_name);

        if (teamFilter && teamName.toLowerCase() !== teamFilter) continue;
        if (positionFilter && position.toLowerCase() !== positionFilter) continue;

        const key = `${personKey}::${teamName}::${position}`;
        if (!candidateStats.has(key)) {
          candidateStats.set(key, {
            name: person,
            team: teamName,
            position,
            served_count: 0,
            seen_plan_ids: new Set(),
          });
        }

        const entry = candidateStats.get(key);
        if (!entry.seen_plan_ids.has(planId)) {
          entry.seen_plan_ids.add(planId);
          entry.served_count += 1;
        }
      }
    }

    const candidates = [...candidateStats.values()]
      .map((c) => ({ ...c, seen_plan_ids: [...c.seen_plan_ids] }))
      .sort((a, b) => b.served_count - a.served_count || a.name.localeCompare(b.name))
      .slice(0, Number(opts.max));

    const payload = {
      service_type_id: String(opts.serviceType),
      service_type_name: serviceTypeName,
      target_plan_id: String(opts.plan),
      target_plan_date: targetPlan.data?.attributes?.sort_date,
      lookahead_days: Number(opts.days),
      team_filter: opts.team ?? null,
      position_filter: opts.position ?? null,
      candidates,
      caveat:
        "Candidate availability is inferred from recent confirmed service in the same team/position and excludes people already on the target plan.",
    };

    if (opts.json) {
      console.log(JSON.stringify(payload, null, 2));
      return;
    }

    printList([
      `${targetPlan.data?.attributes?.dates ?? compactDate(payload.target_plan_date)} | service_type=${formatServiceTypeLabel(payload.service_type_id, payload.service_type_name)} plan=${payload.target_plan_id}`,
      `Likely candidates (next ${payload.lookahead_days} days):`,
      ...(payload.candidates.length
        ? payload.candidates.map((c) =>
          `  ${c.name} | ${c.team} | ${c.position} | served_in_${payload.lookahead_days}d=${c.served_count}`
        )
        : ["  none"]),
      `Note: ${payload.caveat}`,
    ]);
  });

await program.parse(Deno.args);

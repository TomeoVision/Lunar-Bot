export interface ViewLog {
  firstViewedAt: number;
  lastViewedAt: number;
  count: number;
}

function key(proposalId: string): string {
  return `muraldeck:viewlog:${proposalId}`;
}

/** Records a view of a shared proposal in *this browser only* — there is no
 * backend, so this cannot be reported back to the proposal's owner. It's a
 * courtesy note for whoever is viewing the link (e.g. "you've seen this before"). */
export function recordView(proposalId: string): ViewLog {
  const now = Date.now();
  let log: ViewLog;
  try {
    const raw = localStorage.getItem(key(proposalId));
    if (raw) {
      const prev = JSON.parse(raw) as ViewLog;
      log = { firstViewedAt: prev.firstViewedAt, lastViewedAt: now, count: prev.count + 1 };
    } else {
      log = { firstViewedAt: now, lastViewedAt: now, count: 1 };
    }
  } catch {
    log = { firstViewedAt: now, lastViewedAt: now, count: 1 };
  }
  try {
    localStorage.setItem(key(proposalId), JSON.stringify(log));
  } catch {
    // ignore storage failures (private browsing, quota, etc.)
  }
  return log;
}

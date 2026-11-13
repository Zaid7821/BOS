import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

type Entry = { id: number; user_id: number | null; user_name: string; action: string; details: string | null; created_at: string };

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

/** Principal only: who changed what on the website, newest first (last 500 changes). */
const ActivityLog = ({ token, onError }: { token: string; onError: (message: string) => void }) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<Entry[]>("/api/admin/activity", {}, token);
    setLoading(false);
    if (res.success) setEntries(res.data ?? []);
    else onError(res.message ?? "Could not load the activity log.");
  }, [token, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const people = [...new Set(entries.map((e) => e.user_name))].sort();
  const q = search.trim().toLowerCase();
  const shown = entries.filter(
    (e) => (person === "all" || e.user_name === person) && (!q || `${e.action} ${e.details ?? ""}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input aria-label="Search activity" placeholder="Search, e.g. notice or fee" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background" />
        </div>
        <label className="sr-only" htmlFor="activity-person">Person</label>
        <select id="activity-person" value={person} onChange={(e) => setPerson(e.target.value)} className="h-10 rounded-md border bg-background px-3 text-base sm:w-56">
          <option value="all">Everyone</option>
          {people.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <Button variant="outline" size="sm" className="shrink-0" onClick={load} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" /> Refresh
        </Button>
      </div>

      {loading && !entries.length ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : shown.length === 0 ? (
        <p className="text-muted-foreground">{entries.length ? "Nothing matches this search." : "No changes recorded yet. Every change made in the admin panel appears here."}</p>
      ) : (
        <ol className="divide-y rounded-lg border bg-card">
          {shown.map((e) => (
            <li key={e.id} className="p-3 sm:flex sm:items-baseline sm:gap-4">
              <span className="block shrink-0 text-xs text-muted-foreground sm:w-40">{when(e.created_at)}</span>
              <p className="min-w-0 text-sm">
                <span className="font-semibold">{e.user_name}</span> · {e.action}
                {e.details && <span className="break-words text-muted-foreground">: {e.details}</span>}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ActivityLog;

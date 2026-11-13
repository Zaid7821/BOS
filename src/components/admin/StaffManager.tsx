import { useCallback, useEffect, useState } from "react";
import { Copy, KeyRound, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { ROLE_LABEL, type AdminUser, type Role } from "./staff";

const ROLE_HINT: Record<Role, string> = {
  principal: "Everything, including enquiries, fees, staff logins and the activity log.",
  teacher: "Notices, gallery photos and upcoming events only.",
};

const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

// No look-alike characters (0/O, 1/l/I) so it's easy to read out or type from WhatsApp.
const makePassword = () => {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(crypto.getRandomValues(new Uint32Array(10)), (n) => chars[n % chars.length]).join("");
};

const RoleSelect = ({ id, value, onChange }: { id: string; value: Role; onChange: (role: Role) => void }) => (
  <select id={id} value={value} onChange={(e) => onChange(e.target.value as Role)} className="h-11 w-full rounded-md border bg-background px-3 text-base">
    {(Object.keys(ROLE_LABEL) as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
  </select>
);

/** Login details shown once after creating a login or resetting a password, ready to send on WhatsApp. */
const NewPasswordNotice = ({ name, username, password, onClose }: { name: string; username: string; password: string; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const message = `${name}, your login for the school website admin panel:\n${window.location.origin}/admin\nUsername: ${username}\nPassword: ${password}\nYou will be asked to choose your own password when you log in.`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div role="status" className="rounded-lg border-2 border-green-600 bg-green-50 p-4 text-green-950">
      <p className="font-semibold">Login details for {name}</p>
      <p className="mt-1 text-sm">Send these to {name} now. The password is shown only once; if it's lost, use “Reset password”.</p>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-green-800">Username</dt>
        <dd className="font-mono font-semibold break-all">{username}</dd>
        <dt className="text-green-800">Password</dt>
        <dd className="font-mono font-semibold break-all">{password}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" className="bg-[#25D366] text-white hover:bg-[#1ebe5b]" asChild>
          <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
        </Button>
        <Button size="sm" variant="outline" onClick={copy}>
          <Copy className="h-4 w-4 mr-1.5" aria-hidden="true" /> {copied ? "Copied" : "Copy"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onClose}>Done</Button>
      </div>
    </div>
  );
};

const emptyDraft = { name: "", username: "", role: "teacher" as Role, password: "" };

/** Principal only: add, edit, switch off and delete staff logins. */
const StaffManager = ({ token, currentUserId, onError }: { token: string; currentUserId: number; onError: (message: string) => void }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<{ id: number; name: string; role: Role } | null>(null);
  const [shown, setShown] = useState<{ name: string; username: string; password: string } | null>(null);

  const load = useCallback(async () => {
    const res = await api<AdminUser[]>("/api/admin/users", {}, token);
    setLoading(false);
    if (res.success) setUsers(res.data ?? []);
    else onError(res.message ?? "Could not load staff logins.");
  }, [token, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const send = async (path: string, method: string, body?: unknown) => {
    const res = await api<AdminUser>(path, { method, body: body ? JSON.stringify(body) : undefined }, token);
    if (!res.success) onError(res.message ?? "Action failed.");
    await load();
    return res;
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await send("/api/admin/users", "POST", draft);
    setBusy(false);
    if (res.success && res.data) {
      setShown({ name: res.data.name, username: res.data.username ?? draft.username, password: draft.password });
      setDraft(emptyDraft);
    }
  };

  const resetPassword = async (u: AdminUser) => {
    if (!window.confirm(`Make a new password for ${u.name}? Their old password will stop working.`)) return;
    const password = makePassword();
    const res = await send(`/api/admin/users/${u.id}`, "PATCH", { password });
    if (res.success) setShown({ name: u.name, username: u.username ?? "", password });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const { id, ...changes } = editing;
    if ((await send(`/api/admin/users/${id}`, "PATCH", changes)).success) setEditing(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Add staff member</CardTitle>
          <CardDescription>Each person gets their own login, so you can see who changed what and switch off a login when someone leaves.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={add} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="u-name">Full name *</Label>
              <Input id="u-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required maxLength={120} placeholder="e.g. Mrs. Anjali Sharma" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-username">Username *</Label>
              <Input
                id="u-username"
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                required
                minLength={3}
                maxLength={30}
                pattern="[a-z0-9._\-]+"
                autoCapitalize="none"
                autoCorrect="off"
                placeholder="e.g. sharma"
              />
              <p className="text-xs text-muted-foreground">Small letters and numbers, no spaces. They type this to log in.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-role">What can they change?</Label>
              <RoleSelect id="u-role" value={draft.role} onChange={(role) => setDraft({ ...draft, role })} />
              <p className="text-xs text-muted-foreground">{ROLE_HINT[draft.role]}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="u-password">First password *</Label>
              <div className="flex gap-2">
                <Input id="u-password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} required minLength={8} maxLength={200} autoComplete="off" className="font-mono" />
                <Button type="button" variant="outline" className="shrink-0" onClick={() => setDraft({ ...draft, password: makePassword() })}>
                  Make one
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">At least 8 characters. They must change it the first time they log in.</p>
            </div>
            <Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create login"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {shown && <NewPasswordNotice {...shown} onClose={() => setShown(null)} />}
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">
            No staff logins yet. You're using the master password. Add a login for yourself first (role “Principal / office”), then one for each teacher.
          </p>
        ) : (
          users.map((u) => {
            const self = u.id === currentUserId;
            return (
              <div key={u.id} className={`rounded-lg border bg-card p-4 ${u.isActive ? "" : "opacity-60"}`}>
                {editing?.id === u.id ? (
                  <form onSubmit={saveEdit} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor={`edit-name-${u.id}`}>Full name</Label>
                      <Input id={`edit-name-${u.id}`} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required maxLength={120} />
                    </div>
                    {!self && (
                      <div className="space-y-1">
                        <Label htmlFor={`edit-role-${u.id}`}>What can they change?</Label>
                        <RoleSelect id={`edit-role-${u.id}`} value={editing.role} onChange={(role) => setEditing({ ...editing, role })} />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button type="submit" size="sm">Save changes</Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{u.name}</p>
                      {self && <Badge variant="secondary">You</Badge>}
                      <Badge variant={u.role === "principal" ? "default" : "outline"}>{ROLE_LABEL[u.role]}</Badge>
                      {!u.isActive && <Badge variant="outline">Switched off</Badge>}
                      {u.isActive && u.mustChangePassword && <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">Hasn't set own password yet</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Username: <span className="font-mono">{u.username}</span> · {u.lastLoginAt ? `Last login ${when(u.lastLoginAt)}` : "Never logged in"}
                    </p>
                  </>
                )}
                {editing?.id !== u.id && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing({ id: u.id, name: u.name, role: u.role })}>
                      <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" /> Edit
                    </Button>
                    {/* Your own password is changed in the "My password" tab. */}
                    {!self && (
                      <Button size="sm" variant="outline" onClick={() => resetPassword(u)}>
                        <KeyRound className="h-4 w-4 mr-1.5" aria-hidden="true" /> Reset password
                      </Button>
                    )}
                    {!self && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (u.isActive ? window.confirm(`Switch off ${u.name}'s login? They will be logged out straight away.`) : true) &&
                          send(`/api/admin/users/${u.id}`, "PATCH", { isActive: !u.isActive })
                        }
                      >
                        {u.isActive ? "Switch off" : "Switch on"}
                      </Button>
                    )}
                    {!self && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() =>
                          window.confirm(`Delete ${u.name}'s login? Their past changes stay in the activity log.`) && send(`/api/admin/users/${u.id}`, "DELETE")
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" /> Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StaffManager;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

const MIN_PASSWORD = 8;

/** Lets a logged-in staff member choose their own password (also shown on first login). */
const ChangePassword = ({ token, onDone }: { token: string; onDone?: () => void }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (next.length < MIN_PASSWORD) return setError(`New password must be at least ${MIN_PASSWORD} characters.`);
    if (next !== repeat) return setError("The two new passwords don't match.");
    setBusy(true);
    const res = await api("/api/admin/password", { method: "POST", body: JSON.stringify({ currentPassword: current, newPassword: next }) }, token);
    setBusy(false);
    if (!res.success) return setError(res.message ?? "Could not change the password.");
    setCurrent("");
    setNext("");
    setRepeat("");
    setStatus("Password changed. Use the new password next time you log in.");
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pw-current">Current password</Label>
        <Input id="pw-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pw-new">New password (at least {MIN_PASSWORD} characters)</Label>
        <Input id="pw-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={MIN_PASSWORD} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pw-repeat">Type the new password again</Label>
        <Input id="pw-repeat" type="password" autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} required />
      </div>
      <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Change password"}</Button>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {status && <p role="status" className="text-sm font-medium text-green-700">{status}</p>}
    </form>
  );
};

export default ChangePassword;

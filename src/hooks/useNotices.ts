import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export type Notice = {
  id: number;
  title: string;
  body?: string | null;
  link?: string | null;
  is_important: boolean;
  created_at: string;
};

/** Loads active notices from the backend. Returns [] if the API is unreachable. */
export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    api<Notice[]>("/api/notices").then((res) => {
      setNotices(res.success && Array.isArray(res.data) ? res.data : []);
      setLoaded(true);
    });
  }, []);
  return { notices, loaded };
};

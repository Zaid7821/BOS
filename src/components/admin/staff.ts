export type Role = "principal" | "teacher";

/** A staff login as the server returns it (never includes the password). */
export type AdminUser = {
  id: number;
  name: string;
  username?: string;
  role: Role;
  isActive?: boolean;
  mustChangePassword: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
};

export const ROLE_LABEL: Record<Role, string> = { principal: "Principal / office", teacher: "Teacher" };

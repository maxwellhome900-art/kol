"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  nebulaRoleCopy,
  type NebulaRole,
} from "@/lib/work/nebula";

type NebulaValue = {
  role: NebulaRole;
  setRole: (role: NebulaRole) => void;
  canTraffic: boolean;
  canTeam: boolean;
  canAck: boolean;
};

const NebulaContext = createContext<NebulaValue | null>(null);

export function NebulaProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<NebulaRole>("operator");

  const value = useMemo<NebulaValue>(
    () => ({
      role,
      setRole,
      canTraffic: role === "operator" || role === "admin",
      canTeam: role === "admin",
      canAck: role === "operator" || role === "admin",
    }),
    [role],
  );

  return (
    <NebulaContext.Provider value={value}>{children}</NebulaContext.Provider>
  );
}

export function useNebula() {
  const ctx = useContext(NebulaContext);
  if (!ctx) throw new Error("useNebula must be used inside NebulaProvider");
  return ctx;
}

export function nebulaRoleLabel(role: NebulaRole) {
  return nebulaRoleCopy[role].label;
}

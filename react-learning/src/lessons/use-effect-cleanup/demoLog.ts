import { useCallback, useState } from "react";
import type { Person } from "./people.ts";

export type DemoLogKind =
  | "effect-start"
  | "cleanup"
  | "apply"
  | "ignore"
  | "abort"
  | "error";

export type DemoLog = {
  id: number;
  at: number;
  kind: DemoLogKind;
  person: Person;
  detail: string;
};

let nextLogId = 0;

export function useDemoLog() {
  const [logs, setLogs] = useState<DemoLog[]>([]);

  const appendLog = useCallback(
    (kind: DemoLogKind, person: Person, detail: string) => {
      nextLogId += 1;
      const entry: DemoLog = {
        id: nextLogId,
        at: Date.now(),
        kind,
        person,
        detail,
      };
      setLogs((current) => [...current, entry]);
    },
    [],
  );

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, appendLog, clearLogs };
}

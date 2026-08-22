import { useEffect, useState } from "react";
import { DemoPanel } from "./DemoPanel.tsx";
import { useDemoLog } from "./demoLog.ts";
import { fetchBio } from "./fetchBio.ts";
import { delayFor, type Person } from "./people.ts";

/**
 * 公式ドキュメントの改善例です。cleanup で ignore = true にします。
 * https://react.dev/reference/react/useEffect#fetching-data-with-effects
 */
export function GoodFetchIgnore() {
  const [person, setPerson] = useState<Person>("Alice");
  const [bio, setBio] = useState<string | null>(null);
  const { logs, appendLog, clearLogs } = useDemoLog();

  useEffect(() => {
    let ignore = false;
    // 公式例と同じく、新しい fetch の前に Loading... を出す。
    // https://react.dev/reference/react/useEffect#fetching-data-with-effects
    // oxlint-disable-next-line react/set-state-in-effect
    setBio(null);
    appendLog(
      "effect-start",
      person,
      `fetchBio('${person}') を開始（${delayFor(person)}ms）`,
    );

    fetchBio(person).then((result) => {
      if (ignore) {
        appendLog(
          "ignore",
          person,
          `ignore === true のため setBio しない: ${result}`,
        );
        return;
      }
      appendLog("apply", person, `setBio('${result}')`);
      setBio(result);
    });

    return () => {
      ignore = true;
      appendLog("cleanup", person, "ignore = true");
    };
  }, [person, appendLog]);

  return (
    <DemoPanel
      title="改善例: ignore フラグ"
      person={person}
      bio={bio}
      logs={logs}
      onSelectPerson={setPerson}
      onClearLogs={clearLogs}
    />
  );
}

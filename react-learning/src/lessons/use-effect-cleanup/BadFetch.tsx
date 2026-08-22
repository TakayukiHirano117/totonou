import { useEffect, useState } from "react";
import { DemoPanel } from "./DemoPanel.tsx";
import { useDemoLog } from "./demoLog.ts";
import { fetchBio } from "./fetchBio.ts";
import { delayFor, type Person } from "./people.ts";

/**
 * 公式ドキュメントの「よくない例」です。cleanup がありません。
 * https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect
 */
export function BadFetch() {
  const [person, setPerson] = useState<Person>("Alice");
  const [bio, setBio] = useState<string | null>(null);
  const { logs, appendLog, clearLogs } = useDemoLog();

  useEffect(() => {
    // 公式例と同じく、新しい fetch の前に Loading... を出す。
    // https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect
    // oxlint-disable-next-line react/set-state-in-effect
    setBio(null);
    appendLog(
      "effect-start",
      person,
      `fetchBio('${person}') を開始（${delayFor(person)}ms）`,
    );

    fetchBio(person).then((result) => {
      appendLog("apply", person, `setBio('${result}')`);
      setBio(result);
    });
  }, [person, appendLog]);

  return (
    <DemoPanel
      title="よくない例: cleanup なし"
      person={person}
      bio={bio}
      logs={logs}
      onSelectPerson={setPerson}
      onClearLogs={clearLogs}
    />
  );
}

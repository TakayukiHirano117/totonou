import { useEffect, useState } from "react";
import { DemoPanel } from "./DemoPanel.tsx";
import { useDemoLog } from "./demoLog.ts";
import { fetchBio, isAbortError } from "./fetchBio.ts";
import { delayFor, type Person } from "./people.ts";

/**
 * 公式ドキュメントは AbortController も使えると書いています。
 * ただし abort だけでは不十分で、ignore フラグがより確実です。
 * https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect
 * https://developer.mozilla.org/en-US/docs/Web/API/AbortController
 */
export function GoodFetchAbort() {
  const [person, setPerson] = useState<Person>("Alice");
  const [bio, setBio] = useState<string | null>(null);
  const { logs, appendLog, clearLogs } = useDemoLog();

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function startFetching() {
      setBio(null);
      appendLog(
        "effect-start",
        person,
        `fetchBio('${person}') を開始（${delayFor(person)}ms）`,
      );

      try {
        const result = await fetchBio(person, {
          signal: controller.signal,
        });
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
      } catch (error) {
        if (isAbortError(error)) {
          appendLog("abort", person, "AbortError を受け取り、表示は更新しない");
          return;
        }
        const message = error instanceof Error ? error.message : "不明なエラー";
        appendLog("error", person, message);
      }
    }

    startFetching();

    return () => {
      ignore = true;
      controller.abort();
      appendLog("cleanup", person, "ignore = true と controller.abort()");
    };
  }, [person, appendLog]);

  return (
    <DemoPanel
      title="改善例: AbortController + ignore"
      person={person}
      bio={bio}
      logs={logs}
      onSelectPerson={setPerson}
      onClearLogs={clearLogs}
    />
  );
}

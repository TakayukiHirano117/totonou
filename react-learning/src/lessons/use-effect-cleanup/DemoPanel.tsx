import { useEffect, useRef } from "react";
import { delayFor, isPerson, PEOPLE, personFromBio, type Person } from "./people.ts";
import type { DemoLog } from "./demoLog.ts";

type DemoPanelProps = {
  title: string;
  person: Person;
  bio: string | null;
  logs: DemoLog[];
  onSelectPerson: (person: Person) => void;
  onClearLogs: () => void;
};

const LOG_LABEL: Record<DemoLog["kind"], string> = {
  "effect-start": "開始",
  cleanup: "cleanup",
  apply: "setBio",
  ignore: "無視",
  abort: "abort",
  error: "error",
};

export function DemoPanel({
  title,
  person,
  bio,
  logs,
  onSelectPerson,
  onClearLogs,
}: DemoPanelProps) {
  const timersRef = useRef<number[]>([]);
  const appliedPerson = bio === null ? null : personFromBio(bio);
  const isMismatch = appliedPerson !== null && appliedPerson !== person;

  useEffect(() => {
    return () => {
      for (const timerId of timersRef.current) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  function clearQueuedTimers() {
    for (const timerId of timersRef.current) {
      window.clearTimeout(timerId);
    }
    timersRef.current = [];
  }

  function queueOfficialRace() {
    onSelectPerson("Bob");
    const timerId = window.setTimeout(() => {
      onSelectPerson("Taylor");
    }, 50);
    timersRef.current.push(timerId);
  }

  function reproduceOfficialRace() {
    clearQueuedTimers();
    onClearLogs();

    if (person === "Alice") {
      queueOfficialRace();
      return;
    }

    onSelectPerson("Alice");
    const timerId = window.setTimeout(() => {
      queueOfficialRace();
    }, 250);
    timersRef.current.push(timerId);
  }

  return (
    <section className="demo-panel">
      <div className="demo-panel__header">
        <h3>{title}</h3>
        <p className="demo-panel__hint">
          Bob は {delayFor("Bob")}ms、Alice / Taylor は {delayFor("Alice")}ms
          で返ります。公式と同じ手順にするなら、Alice の表示が出てからボタンを押してください。
        </p>
      </div>

      <label className="field">
        <span>人物</span>
        <select
          value={person}
          onChange={(event) => {
            const value = event.target.value;
            if (isPerson(value)) {
              onSelectPerson(value);
            }
          }}
        >
          {PEOPLE.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <div className="demo-actions">
        <button type="button" onClick={reproduceOfficialRace}>
          Bob → すぐ Taylor（公式の再現手順）
        </button>
        <button type="button" className="button-quiet" onClick={onClearLogs}>
          ログを消す
        </button>
      </div>

      <p className="bio" data-mismatch={isMismatch ? "true" : "false"}>
        {bio ?? "Loading..."}
      </p>
      {isMismatch ? (
        <p className="mismatch" role="status">
          選択中は {person} なのに、表示は {appliedPerson}{" "}
          のままです。古い fetch が後から setBio
          したレースコンディションです。
        </p>
      ) : null}

      <ol className="event-log" aria-label={`${title} のイベントログ`}>
        {logs.length === 0 ? (
          <li className="event-log__empty">まだログはありません。</li>
        ) : (
          logs.map((entry) => (
            <li key={entry.id} data-kind={entry.kind}>
              <span className="event-log__kind">{LOG_LABEL[entry.kind]}</span>
              <span className="event-log__person">{entry.person}</span>
              <span>{entry.detail}</span>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

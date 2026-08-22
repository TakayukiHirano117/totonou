import { useState, type ReactNode } from "react";
import { BadFetch } from "./BadFetch.tsx";
import { GoodFetchAbort } from "./GoodFetchAbort.tsx";
import { GoodFetchIgnore } from "./GoodFetchIgnore.tsx";
import {
  badFetchSnippet,
  goodAbortSnippet,
  goodIgnoreSnippet,
} from "./snippets.ts";

const TABS = [
  { id: "bad", label: "1. よくない fetch" },
  { id: "ignore", label: "2. ignore で改善" },
  { id: "abort", label: "3. AbortController" },
  { id: "compare", label: "比較" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Lesson() {
  const [tab, setTab] = useState<TabId>("bad");

  return (
    <main className="lesson">
      <header className="lesson__intro">
        <p className="eyebrow">React 学習 / useEffect</p>
        <h1>fetch のクリーンアップ関数</h1>
        <p>
          React 公式ドキュメントの「Fix fetching inside an Effect」と同じ題材で、
          よくない <code>useEffect</code> fetch を改善しながらクリーンアップを学びます。
        </p>
        <ul className="sources">
          <li>
            <a
              href="https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect"
              target="_blank"
              rel="noreferrer"
            >
              Synchronizing with Effects / Fix fetching inside an Effect
            </a>
          </li>
          <li>
            <a
              href="https://react.dev/reference/react/useEffect#fetching-data-with-effects"
              target="_blank"
              rel="noreferrer"
            >
              useEffect / Fetching data with Effects
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
              target="_blank"
              rel="noreferrer"
            >
              MDN: AbortController
            </a>
          </li>
        </ul>
      </header>

      <ol className="steps">
        <li>
          公式のよくない例は、依存配列が変わっても古い fetch
          の結果で <code>setBio</code> してしまいます。
        </li>
        <li>
          Bob（2秒）を選んですぐ Taylor（0.2秒）を選ぶと、Taylor
          の表示があとから Bob に上書きされます。これがレースコンディションです。
        </li>
        <li>
          クリーンアップで <code>ignore = true</code>{" "}
          にすると、もう関係ない応答では <code>setBio</code> しません。
        </li>
      </ol>

      <div className="tabs" role="tablist" aria-label="学習ステップ">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "bad" ? (
        <LessonSection
          heading="よくない例"
          explanation={
            <>
              <p>
                公式の出発点です。Effect が fetch したあと、クリーンアップ関数を返していません。
              </p>
              <p>
                <code>person</code> が変わると新しい fetch
                が始まりますが、前の fetch
                が後から完了すると、その結果で表示が上書きされます。
              </p>
            </>
          }
          snippet={badFetchSnippet}
        >
          <BadFetch />
        </LessonSection>
      ) : null}

      {tab === "ignore" ? (
        <LessonSection
          heading="ignore フラグで改善"
          explanation={
            <>
              <p>
                公式の修正です。各 Effect 実行が自分の <code>ignore</code>{" "}
                変数を持ちます。
              </p>
              <p>
                依存が変わるかアンマウントすると、React
                は次の setup の前にクリーンアップを呼びます。そこで{" "}
                <code>ignore = true</code>{" "}
                にすると、古い応答は <code>setBio</code> しません。
              </p>
              <p>
                開発時は Strict Mode が setup → cleanup → setup
                をもう一度行います。これは欠落したクリーンアップを見つけるための動作です。
              </p>
            </>
          }
          snippet={goodIgnoreSnippet}
        >
          <GoodFetchIgnore />
        </LessonSection>
      ) : null}

      {tab === "abort" ? (
        <LessonSection
          heading="AbortController と ignore"
          explanation={
            <>
              <p>
                公式ドキュメントは、古い fetch を{" "}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/AbortController"
                  target="_blank"
                  rel="noreferrer"
                >
                  AbortController
                </a>{" "}
                で中断できるとも書いています。
              </p>
              <p>
                同時に「abort だけではレースコンディションを防ぎきれない。fetch
                の後に別の非同期処理が続くかもしれないので、
                <code>ignore</code> フラグの方が確実」とも書いています。
              </p>
              <p>
                この例では cleanup で <code>abort()</code> と{" "}
                <code>ignore = true</code> の両方を行います。
              </p>
            </>
          }
          snippet={goodAbortSnippet}
        >
          <GoodFetchAbort />
        </LessonSection>
      ) : null}

      {tab === "compare" ? (
        <section className="lesson-section">
          <div className="compare-copy">
            <h2>並べて再現する</h2>
            <p>
              左右で同じ手順を実行してください。左は古い Bob
              の応答で上書きされ、右は cleanup 後の応答を無視します。
            </p>
          </div>
          <div className="compare-grid">
            <BadFetch />
            <GoodFetchIgnore />
          </div>
        </section>
      ) : null}

      <aside className="note">
        <h2>このあと公式が勧めていること</h2>
        <p>
          Effect 内の手書き fetch
          は、キャッシュやサーバー描画と組み合わせにくく、ウォーターフォールにもなりやすい、と公式は書いています。
          本番ではフレームワーク標準の data fetching か、クライアントキャッシュを検討してください。
        </p>
        <p>
          この学習プロジェクトは公式の「最初から作る」案内に従い、Vite の{" "}
          <code>react-ts</code> テンプレートで作っています。
        </p>
      </aside>
    </main>
  );
}

function LessonSection({
  heading,
  explanation,
  snippet,
  children,
}: {
  heading: string;
  explanation: ReactNode;
  snippet: string;
  children: ReactNode;
}) {
  return (
    <section className="lesson-section">
      <div className="lesson-section__copy">
        <h2>{heading}</h2>
        {explanation}
        <pre>
          <code>{snippet}</code>
        </pre>
      </div>
      {children}
    </section>
  );
}

import { bioText, delayFor, type Person } from "./people.ts";

export type FetchBioOptions = {
  signal?: AbortSignal;
};

/**
 * React 公式ドキュメントの fetchBio を、AbortSignal 対応にして再現します。
 * 遅延時間は公式と同じです。Abort の受け方は MDN の abortable API の型に合わせています。
 *
 * https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect
 * https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal#implementing_an_abortable_api
 */
export function fetchBio(
  person: Person,
  options: FetchBioOptions = {},
): Promise<string> {
  const { signal } = options;
  const delayMs = delayFor(person);

  return new Promise((resolve, reject) => {
    if (signal) {
      try {
        signal.throwIfAborted();
      } catch (error) {
        reject(error);
        return;
      }
    }

    const timeoutId = window.setTimeout(() => {
      resolve(bioText(person));
    }, delayMs);

    const onAbort = () => {
      window.clearTimeout(timeoutId);
      reject(signal?.reason);
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

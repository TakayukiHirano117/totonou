export const PEOPLE = ["Alice", "Bob", "Taylor"] as const;

export type Person = (typeof PEOPLE)[number];

export function isPerson(value: string): value is Person {
  return PEOPLE.some((person) => person === value);
}

/**
 * React 公式ドキュメントの fetchBio と同じ遅延です。
 * Bob だけ 2000ms、それ以外は 200ms。
 * https://react.dev/learn/synchronizing-with-effects#fix-fetching-inside-an-effect
 */
export function delayFor(person: Person): number {
  return person === "Bob" ? 2000 : 200;
}

export function bioText(person: Person): string {
  return `This is ${person}’s bio.`;
}

export function personFromBio(bio: string): Person | null {
  const found = PEOPLE.find((person) => bio.includes(person));
  return found ?? null;
}

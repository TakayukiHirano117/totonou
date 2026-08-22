import assert from "node:assert/strict";
import { test } from "node:test";
import { delayFor, isPerson, personFromBio } from "./people.ts";

test("delayFor は公式ドキュメントと同じ遅延を返す", () => {
  assert.equal(delayFor("Bob"), 2000);
  assert.equal(delayFor("Alice"), 200);
  assert.equal(delayFor("Taylor"), 200);
});

test("isPerson は Alice / Bob / Taylor だけを受け入れる", () => {
  assert.equal(isPerson("Alice"), true);
  assert.equal(isPerson("alice"), false);
  assert.equal(isPerson("Carol"), false);
});

test("personFromBio は公式の bio 文面から人物を取り出す", () => {
  assert.equal(personFromBio("This is Taylor’s bio."), "Taylor");
  assert.equal(personFromBio("no person"), null);
});

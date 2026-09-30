// Unit test for scripts/mint-contract-id.mjs, the tool contract-markdown.md
// names for minting and repairing `id:` frontmatter.
//
// RUN: npx vitest run tests/open-prose/contract-markdown
import { describe, expect, it } from "vitest";
import { ensureId } from "../../../scripts/mint-contract-id.mjs";

const withId = (id: string) => `---\nname: watcher\nkind: responsibility\nid: ${id}\n---\n`;

describe("mint-contract-id --ensure", () => {
  it("keeps the largest 16-byte id", () => {
    // 2^128 - 1: three bits in the first character, 125 in the other 25.
    expect(ensureId(withId("7ZZZZZZZZZZZZZZZZZZZZZZZZZ")).status).toBe("ok");
  });

  it("re-mints a 26-character id that does not fit in 16 bytes", () => {
    // 26 base32 characters carry 130 bits, so a 16-byte value always renders
    // with a first character of 0 to 7. Anything higher is not a valid id.
    const { status, source } = ensureId(withId("8ZZZZZZZZZZZZZZZZZZZZZZZZZ"));
    expect(status).toBe("reminted");
    expect(source).toMatch(/^id: [0-7][0-9A-HJKMNP-TV-Z]{25}$/m);
  });
});

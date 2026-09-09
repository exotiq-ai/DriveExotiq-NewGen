import { register } from "node:module";
import test from "node:test";
import assert from "node:assert/strict";
register("./preview-loader.mjs", import.meta.url);

const { selectMediaSource } = await import("../lib/media.ts");

test("desktop defaults to the 1080 H.264 delivery", () => {
  assert.equal(
    selectMediaSource("hero", { mobile: false }),
    "/media/v3/hero-landscape-1080.mp4",
  );
});

test("a phone with unknown network stays on the conservative portrait delivery", () => {
  assert.equal(
    selectMediaSource("hero", { mobile: true }),
    "/media/v3/hero-portrait-720.mp4",
  );
});

test("a phone on a normal network gets portrait 1080 without considering DPR", () => {
  assert.equal(
    selectMediaSource("hero", { mobile: true, effectiveType: "4g" }),
    "/media/v3/hero-portrait-1080.mp4",
  );
});

test("Save-Data and slow networks select economical explicit and ambient films", () => {
  assert.equal(
    selectMediaSource("film", { mobile: false, saveData: true }),
    "/media/v2/roadbook-720.mp4",
  );
  assert.equal(
    selectMediaSource("pair", { mobile: false, effectiveType: "3g" }),
    "/media/v2/telluride-720.mp4",
  );
});

#!/usr/bin/env node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const project = resolve(root, "..");
const masters = join(project, "assets/conversion-upgrade/masters");
const output = join(root, "public/media/v3");
const landscape = join(masters, "hero-camera-orbit-4k.mp4");
const portrait = join(masters, "hero-camera-orbit-portrait-4k.mp4");
const landscapePoster = join(masters, "hero-camera-orbit-poster.png");
const portraitPoster = join(masters, "hero-camera-orbit-portrait-poster.png");
const work = mkdtempSync(join(tmpdir(), "driveexotiq-hero-v3-"));

function run(args) {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function makePortraitMaster() {
  // Deterministic reframing of the reviewed landscape motion: no synthesis or
  // frame interpolation. The 4:3 crop retains the full car and open doors.
  const filter = [
    "[0:v]trim=duration=8,setpts=PTS-STARTPTS,crop=2880:2160:960:0,scale=2160:1620:flags=lanczos,format=rgba[fg]",
    "color=c=0x0c090f:s=2160x3840:r=24:d=8[bg]",
    "color=c=white:s=2160x1620:r=24:d=8,format=gray,geq=lum='if(lt(Y,100),255*Y/100,if(gt(Y,H-101),255*(H-1-Y)/100,255))'[mask]",
    "[fg][mask]alphamerge[fade]",
    "[bg][fade]overlay=0:1200:shortest=1,format=yuv420p[out]",
  ].join(";");
  run([
    "-i", landscape, "-filter_complex", filter, "-map", "[out]", "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p",
    "-r", "24", "-g", "48", "-threads", "3", "-movflags", "+faststart", portrait,
  ]);
  run(["-i", landscape, "-frames:v", "1", "-update", "1", landscapePoster]);
  run(["-i", portrait, "-frames:v", "1", "-update", "1", portraitPoster]);
}

function encodeTwoPass(input, width, height, bitrate, destination) {
  const passlog = join(work, destination.replace(/\.mp4$/, ""));
  const common = [
    "-i", input, "-t", "8", "-map", "0:v:0",
    "-vf", `scale=${width}:${height}:flags=lanczos,fps=24,setsar=1`,
    "-c:v", "libx264", "-preset", "slow", "-b:v", bitrate,
    "-pix_fmt", "yuv420p", "-g", "48", "-threads", "3", "-passlogfile", passlog,
  ];
  run([...common, "-an", "-pass", "1", "-f", "null", "/dev/null"]);
  run([...common, "-an", "-pass", "2", "-movflags", "+faststart", join(output, destination)]);
}

function encodeVideos() {
  mkdirSync(output, { recursive: true });
  encodeTwoPass(landscape, 1920, 1080, "2700k", "hero-landscape-1080.mp4");
  encodeTwoPass(portrait, 1080, 1920, "1400k", "hero-portrait-1080.mp4");
  encodeTwoPass(portrait, 720, 1280, "1250k", "hero-portrait-720.mp4");
}

async function encodeWithinBudget(image, format, budget, destination) {
  const qualities = format === "avif" ? [58, 52, 46, 40, 34] : [82, 76, 70, 64, 58, 52];
  for (const quality of qualities) {
    const buffer = await image.clone()[format]({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= budget) {
      writeFileSync(join(output, destination), buffer);
      return;
    }
  }
  throw new Error(`${destination} exceeds its ${budget}-byte budget at the minimum quality`);
}

async function encodePosterSet(source, prefix, widths, ratio, budgets) {
  for (const width of widths) {
    const height = Math.round(width / ratio);
    const image = sharp(source).resize(width, height, { fit: "cover", position: "centre" });
    await encodeWithinBudget(image, "avif", budgets[width], `${prefix}-${width}.avif`);
    await encodeWithinBudget(image, "webp", budgets[width], `${prefix}-${width}.webp`);
  }
}

async function encodePosters() {
  mkdirSync(output, { recursive: true });
  await encodePosterSet(landscapePoster, "hero-landscape", [960, 1440, 1920, 2560, 3200], 16 / 9, {
    960: 180_000, 1440: 350_000, 1920: 350_000, 2560: 500_000, 3200: 500_000,
  });
  await encodePosterSet(portraitPoster, "hero-portrait", [540, 720, 1080], 9 / 16, {
    540: 180_000, 720: 180_000, 1080: 180_000,
  });
}

try {
  const all = process.argv.includes("--all");
  const master = all || process.argv.includes("--portrait-master");
  const videos = all || process.argv.includes("--videos");
  const posters = all || process.argv.includes("--posters");
  if (!master && !videos && !posters) {
    console.error("Usage: node scripts/encode-hero-v3.mjs [--all] [--portrait-master] [--videos] [--posters]");
    process.exitCode = 2;
  } else {
    if (master) makePortraitMaster();
    if (videos) encodeVideos();
    if (posters) await encodePosters();
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

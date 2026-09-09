#!/usr/bin/env node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const project = resolve(root, "..");
const sourceRoot =
  "/Users/g.r./Documents/EXOTIQ/driveexotiqweb/docs/redesign/storyboard/refs/video";
const s8 = join(sourceRoot, "S8 Roller Video.mov");
const telluride = join(sourceRoot, "R8 and 458 drone Telluride Colorado.mp4");
const score = join(project, "assets/generated/roadbook-score-v2.m4a");
const output = join(root, "public/media/v2");
const work = mkdtempSync(join(tmpdir(), "driveexotiq-camera-"));

function run(args) {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    {
      stdio: "inherit",
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function encodeTwoPass({
  input,
  start,
  duration,
  width,
  height,
  bitrate,
  destination,
  audio,
  filter,
}) {
  const passlog = join(work, destination.replace(/\.mp4$/, ""));
  const video = [
    ...(start === undefined ? [] : ["-ss", String(start)]),
    "-i",
    input,
    ...(audio ? ["-i", audio] : []),
    ...(duration === undefined ? [] : ["-t", String(duration)]),
    "-map",
    "0:v:0",
    "-vf",
    filter ?? `scale=${width}:${height}:flags=lanczos,fps=24,setsar=1`,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-b:v",
    bitrate,
    "-pix_fmt",
    "yuv420p",
    "-g",
    "48",
    "-threads",
    "3",
    "-passlogfile",
    passlog,
  ];
  run([...video, "-an", "-pass", "1", "-f", "null", "/dev/null"]);
  run([
    ...video,
    "-pass",
    "2",
    ...(audio
      ? ["-map", "1:a:0", "-c:a", "aac", "-b:a", "160k", "-shortest"]
      : ["-an"]),
    "-movflags",
    "+faststart",
    join(output, destination),
  ]);
}

function makeRoadbookMaster() {
  const shots = [
    [telluride, 0.3, 5],
    [telluride, 11.8, 2.7],
    [telluride, 58, 4.5],
    [s8, 25.1, 2.3],
    [s8, 46.8, 1.5],
    [telluride, 34, 5.5],
    [telluride, 50, 3.2],
    [s8, 52, 5],
    [telluride, 142.4, 6],
    [telluride, 148.8, 4.3],
  ];
  const parts = shots.map(([source, start, duration], index) => {
    const part = join(
      work,
      `roadbook-part-${String(index).padStart(2, "0")}.mp4`,
    );
    run([
      "-ss",
      String(start),
      "-i",
      source,
      "-t",
      String(duration),
      "-an",
      "-sn",
      "-dn",
      "-vf",
      "scale=1920:1080:flags=lanczos,fps=24,setsar=1",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "17",
      "-pix_fmt",
      "yuv420p",
      "-g",
      "48",
      "-threads",
      "3",
      part,
    ]);
    return part;
  });
  const concat = join(work, "roadbook-concat.txt");
  writeFileSync(concat, parts.map((part) => `file '${part}'\n`).join(""));
  const master = join(work, "roadbook-master.mp4");
  run(["-f", "concat", "-safe", "0", "-i", concat, "-c", "copy", master]);
  return master;
}

function encodeCamera() {
  mkdirSync(output, { recursive: true });
  encodeTwoPass({
    input: s8,
    start: 51,
    duration: 8,
    width: 1920,
    height: 1080,
    bitrate: "2700k",
    destination: "s8-1080.mp4",
  });
  encodeTwoPass({
    input: s8,
    start: 51,
    duration: 8,
    width: 1280,
    height: 720,
    bitrate: "1250k",
    destination: "s8-720.mp4",
  });
  encodeTwoPass({
    input: telluride,
    start: 58,
    duration: 4.5,
    width: 1920,
    height: 1080,
    bitrate: "2850k",
    destination: "telluride-1080.mp4",
  });
  encodeTwoPass({
    input: telluride,
    start: 58,
    duration: 4.5,
    width: 1280,
    height: 720,
    bitrate: "1150k",
    destination: "telluride-720.mp4",
  });
  const master = makeRoadbookMaster();
  encodeTwoPass({
    input: master,
    width: 1920,
    height: 1080,
    bitrate: "2350k",
    destination: "roadbook-1080.mp4",
    audio: score,
  });
  encodeTwoPass({
    input: master,
    width: 1280,
    height: 720,
    bitrate: "1250k",
    destination: "roadbook-720.mp4",
    audio: score,
  });
}

function encodeHero() {
  mkdirSync(output, { recursive: true });
  const masters = join(project, "assets/media-upgrade/masters");
  encodeTwoPass({
    input: join(masters, "hero-landscape-4k.mp4"),
    duration: 8,
    width: 1920,
    height: 1080,
    bitrate: "2700k",
    destination: "hero-landscape-1080.mp4",
  });
  encodeTwoPass({
    input: join(masters, "hero-portrait-4k.mp4"),
    duration: 8,
    width: 1080,
    height: 1920,
    bitrate: "1400k",
    destination: "hero-portrait-1080.mp4",
  });
  encodeTwoPass({
    input: join(masters, "hero-portrait-4k.mp4"),
    duration: 8,
    width: 720,
    height: 1280,
    bitrate: "1250k",
    destination: "hero-portrait-720.mp4",
  });
}

// Deterministic portrait reframing of the reviewed landscape sequence. This
// preserves its real motion and does not substitute an independently generated
// portrait take or synthesize/interpolate frames.
function encodePortraitMaster() {
  const masters = join(project, "assets/media-upgrade/masters");
  mkdirSync(masters, { recursive: true });
  const landscape = join(masters, "hero-landscape-4k.mp4");
  const portrait = join(masters, "hero-portrait-4k.mp4");
  const poster = join(masters, "hero-portrait-poster.png");
  const filter = [
    "[0:v]trim=duration=8,setpts=PTS-STARTPTS,crop=2880:2160:960:0,scale=2160:1620:flags=lanczos,format=rgba[fg]",
    "color=c=0x0c090f:s=2160x3840:r=24:d=8[bg]",
    "color=c=white:s=2160x1620:r=24:d=8,format=gray,geq=lum='if(lt(Y,100),255*Y/100,if(gt(Y,H-101),255*(H-1-Y)/100,255))'[mask]",
    "[fg][mask]alphamerge[fade]",
    "[bg][fade]overlay=0:1200:shortest=1,format=yuv420p[out]",
  ].join(";");
  run([
    "-i",
    landscape,
    "-filter_complex",
    filter,
    "-map",
    "[out]",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "16",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "24",
    "-g",
    "48",
    "-threads",
    "3",
    "-movflags",
    "+faststart",
    portrait,
  ]);
  run(["-i", portrait, "-frames:v", "1", "-update", "1", poster]);
}

async function encodeWithinBudget(image, format, budget, destination) {
  const qualities =
    format === "avif" ? [58, 52, 46, 40, 34] : [82, 76, 70, 64, 58, 52];
  for (const quality of qualities) {
    const buffer = await image
      .clone()
      [format]({ quality, effort: 6 })
      .toBuffer();
    if (buffer.length <= budget || quality === qualities.at(-1)) {
      if (buffer.length > budget) {
        throw new Error(
          `${destination} is ${buffer.length} bytes, above its ${budget}-byte budget`,
        );
      }
      writeFileSync(join(output, destination), buffer);
      return;
    }
  }
}

async function encodePosterSet(source, prefix, widths, ratio, budgets) {
  for (const width of widths) {
    const height = Math.round(width / ratio);
    const image = sharp(source).resize(width, height, {
      fit: "cover",
      position: "centre",
    });
    const budget = budgets[width];
    await encodeWithinBudget(image, "avif", budget, `${prefix}-${width}.avif`);
    await encodeWithinBudget(image, "webp", budget, `${prefix}-${width}.webp`);
  }
}

async function encodePosters() {
  mkdirSync(output, { recursive: true });
  const masters = join(project, "assets/media-upgrade/masters");
  const landscape = join(masters, "hero-landscape-poster.png");
  const portrait = join(masters, "hero-portrait-poster.png");
  const identityLandscape = join(masters, "hero-landscape-closed.png");
  await encodePosterSet(
    landscape,
    "hero-landscape",
    [960, 1440, 1920, 2560, 3200],
    16 / 9,
    {
      960: 180_000,
      1440: 350_000,
      1920: 350_000,
      2560: 500_000,
      3200: 500_000,
    },
  );
  await encodePosterSet(portrait, "hero-portrait", [540, 720, 1080], 9 / 16, {
    540: 180_000,
    720: 180_000,
    1080: 180_000,
  });

  const metadata = await sharp(identityLandscape).metadata();
  const sourceWidth = metadata.width;
  const sourceHeight = metadata.height;
  const carCrop = {
    left: Math.round(sourceWidth * (2000 / 5504)),
    top: Math.round(sourceHeight * (1400 / 3072)),
    width: Math.round(sourceWidth * (3150 / 5504)),
    height: Math.round(sourceHeight * (1670 / 3072)),
  };
  const car = sharp(identityLandscape)
    .extract(carCrop)
    .resize(1920, 1080, { fit: "cover", position: "centre" });
  await encodeWithinBudget(car, "webp", 500_000, "mclaren-gulf.webp");

  const og = sharp(landscape).resize(1200, 630, {
    fit: "cover",
    position: "east",
  });
  const ogQualities = [84, 78, 72, 66, 60];
  for (const quality of ogQualities) {
    const buffer = await og.clone().jpeg({ quality, mozjpeg: true }).toBuffer();
    if (buffer.length <= 500_000 || quality === ogQualities.at(-1)) {
      if (buffer.length > 500_000)
        throw new Error(
          `hero-og.jpg is ${buffer.length} bytes, above its 500000-byte budget`,
        );
      writeFileSync(join(output, "hero-og.jpg"), buffer);
      break;
    }
  }
}

try {
  const camera = process.argv.includes("--camera");
  const hero = process.argv.includes("--hero");
  const posters = process.argv.includes("--posters");
  const portraitMaster = process.argv.includes("--portrait-master");
  if (!camera && !hero && !posters && !portraitMaster) {
    console.error(
      "Usage: node scripts/encode-media.mjs [--camera] [--portrait-master] [--hero] [--posters]",
    );
    process.exitCode = 2;
  } else {
    if (camera) encodeCamera();
    if (portraitMaster) encodePortraitMaster();
    if (hero) encodeHero();
    if (posters) await encodePosters();
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

type VideoKind = "hero" | "road" | "pair" | "film";
type Emit = (event: string, props: Record<string, string | number>) => void;

/** One set of milestones per deliberate viewing; automatic loops stay bounded. */
export function createMediaAnalytics(video: VideoKind, emit: Emit) {
  let started = false, done = false, failed = false, previous = 0;
  const milestones = new Set<number>();
  const send = (event: string, extra = {}) => emit(event, { video, ...extra });
  const quartiles = (percent: number) => {
    for (const depth of [25, 50, 75, 100]) {
      if (percent >= depth && !milestones.has(depth)) {
        milestones.add(depth);
        send("Video Progress", { depth });
      }
    }
  };
  const complete = () => {
    if (done || !started) return;
    quartiles(100);
    done = true;
    send("Video Complete");
  };
  const restart = () => {
    if (started) send("Video Replay");
    started = false;
    done = false;
    previous = 0;
    milestones.clear();
  };
  return {
    restart,
    play(replayCompleted = true) {
      if (done && !replayCompleted) return;
      if (done) restart();
      if (started) return;
      started = true;
      send("Video Play");
    },
    progress(time: number, duration: number, looping = false) {
      if (!started || done || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(time)) return;
      if (looping && previous > duration * .9 && time < duration * .15) complete();
      else quartiles(Math.min(99, time / duration * 100));
      previous = time;
    },
    complete,
    failure() {
      if (failed) return;
      failed = true;
      send("Video Failure");
    },
  };
}

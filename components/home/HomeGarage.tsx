"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { track } from "@/lib/analytics";
import { GARAGE_CARS as CARS } from "./garage-data";
import useGarageProgress from "./useGarageProgress";

export default function HomeGarage() {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<number[]>([]);
  const [present, setPresent] = useState<number[]>([0]);
  const root = useRef<HTMLDivElement>(null);
  const restoreAfterFailure = useRef(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectCar = useCallback((index: number) => {
    setSelected(index);
    track("Garage Selection", { car: CARS[index].analyticsCar });
  }, []);
  const { ready, cinematic, near, select } = useGarageProgress(
    root,
    selectCar,
    failed.length > 0,
  );
  const car = CARS[selected];

  useEffect(() => {
    if (cinematic && near) setPresent([0, 1, 2]);
    else
      setPresent((previous) =>
        previous.includes(selected) ? previous : [...previous, selected],
      );
  }, [cinematic, near, selected]);

  useEffect(() => {
    if (!cinematic && restoreAfterFailure.current && root.current) {
      restoreAfterFailure.current = false;
      // Let the compact height settle before scroll anchoring observes the
      // collapsed cinematic chapter, then restore its readable panel.
      const frame = requestAnimationFrame(() => {
        if (!root.current) return;
        window.scrollTo({
          top: root.current.getBoundingClientRect().top + window.scrollY - 88,
          behavior: "instant",
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [cinematic]);

  function imageFailed(index: number) {
    const bounds = root.current?.getBoundingClientRect();
    if (cinematic && bounds && bounds.top <= 88 && bounds.bottom > 88)
      restoreAfterFailure.current = true;
    setFailed((previous) =>
      previous.includes(index) ? previous : [...previous, index],
    );
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % CARS.length;
    else if (event.key === "ArrowLeft")
      next = (index + CARS.length - 1) % CARS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = CARS.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <div
      ref={root}
      className="home-garage-browser garage-study"
      data-cinematic={cinematic}
      data-selected={selected}
    >
      <div className="garage-study-stage">
        <div
          className="home-garage-tabs site-wrap"
          role="tablist"
          aria-label="Explore the garage"
        >
          {CARS.map((item, index) => (
            <button
              key={item.name}
              ref={(node) => {
                tabs.current[index] = node;
              }}
              type="button"
              role="tab"
              disabled={!ready}
              id={`garage-tab-${index}`}
              aria-controls="garage-panel"
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onKeyDown={(event) => navigate(event, index)}
              onClick={() => select(index)}
            >
              <span className="home-tab-number">0{index + 1}</span>
              <span>
                {item.make}
                <span className="home-tab-model"> {item.model}</span>
              </span>
              <span className="home-tab-indicator" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>
        <div
          id="garage-panel"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`garage-tab-${selected}`}
          data-image-failed={failed.includes(selected)}
          className={`home-car-panel home-car-${selected}`}
        >
          <div className="garage-study-images" aria-hidden="true">
            {CARS.map((item, index) => (
              <div
                key={item.name}
                data-car-layer={index}
                data-car={item.analyticsCar}
                className={`garage-study-layer${selected === index ? " is-selected" : ""}${failed.includes(index) ? " has-failed" : ""}`}
              >
                {(present.includes(index) || selected === index) &&
                  !failed.includes(index) && (
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="100vw"
                      unoptimized
                      onError={() => imageFailed(index)}
                    />
                  )}
              </div>
            ))}
          </div>
          <div className="garage-study-light" aria-hidden="true" />
          <div className="garage-study-topline site-wrap">
            <p className="site-eyebrow">{car.study}</p>
            <span className="garage-study-counter">
              <span>0{selected + 1}</span>
              <span aria-hidden="true">/</span>03
            </span>
          </div>
          <div className="home-car-details site-wrap">
            <div className="home-car-title">
              <p className="site-eyebrow">{car.make}</p>
              <h3>{car.model}</h3>
              <p className="home-car-character">{car.character}</p>
            </div>
            <div className="home-car-spec">
              <p>{car.copy}</p>
              <dl>
                <div>
                  <dt>
                    <span className="garage-engine-editorial">
                      At its heart
                    </span>
                    <span className="garage-engine-compact">Engine</span>
                  </dt>
                  <dd>{car.engine}</dd>
                </div>
                <div>
                  <dt>In a word</dt>
                  <dd>{car.spirit}</dd>
                </div>
              </dl>
            </div>
          </div>
          <span className="garage-study-caption">
            Three machines. Three ways to feel alive.
          </span>
          <span className="garage-study-scroll" aria-hidden="true">
            {cinematic ? "Keep scrolling" : "Choose your study"}{" "}
            <span>{cinematic ? "↓" : "↑"}</span>
          </span>
        </div>
        <div className="garage-study-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}

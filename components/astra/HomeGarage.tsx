'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
const CARS = [
  { make: 'McLaren', model: '720S', name: 'McLaren 720S', image: '/astra/car-mclaren.webp', alt: 'Sculpted silver McLaren 720S, front three-quarter view', character: 'Sculpted by the air.', engine: 'Twin-turbo V8', spirit: 'Supercar', copy: 'Every curve has a purpose. Every open road is an invitation.' },
  { make: 'Porsche', model: '911 GT3 RS', name: 'Porsche 911 GT3 RS', image: '/astra/car-porsche.webp', alt: 'Porsche 911 GT3 RS viewed from the rear, its wing outlined by warm light', character: 'Every corner, a conversation.', engine: 'Naturally aspirated flat-six', spirit: 'Precision', copy: 'A singular obsession with the way a car feels in your hands.' },
  { make: 'Ferrari', model: '458 Italia', name: 'Ferrari 458 Italia', image: '/astra/ferrari-badge-detail.webp', alt: 'Detail of the prancing horse badge on the real Ferrari 458 in Telluride', character: 'Some things need no translation.', engine: 'Naturally aspirated V8', spirit: 'Emotion', copy: 'The prancing horse. The unmistakable voice. The reason you take the long way.' },
];
export default function HomeGarage() {
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const car = CARS[selected];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % CARS.length;
    else if (event.key === 'ArrowLeft') next = (index + CARS.length - 1) % CARS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = CARS.length - 1;
    else return;
    event.preventDefault(); setSelected(next); tabs.current[next]?.focus();
  }
  return <div className="home-garage-browser">
    <div className="home-garage-tabs astra-wrap" role="tablist" aria-label="Explore the garage">
      {CARS.map((item, index) => <button key={item.name} ref={node => { tabs.current[index] = node; }} type="button" role="tab" disabled={!ready} id={`garage-tab-${index}`} aria-controls="garage-panel" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onKeyDown={event => navigate(event, index)} onClick={() => setSelected(index)}>
        <span className="home-tab-number">0{index + 1}</span><span>{item.make}<span className="home-tab-model"> {item.model}</span></span><span className="home-tab-indicator" aria-hidden="true">↗</span>
      </button>)}
    </div>
    <div id="garage-panel" role="tabpanel" tabIndex={0} aria-labelledby={`garage-tab-${selected}`} className={`home-car-panel home-car-${selected}`}>
      <div className="home-car-photo" key={car.image}><Image src={car.image} alt={car.alt} fill sizes="100vw" unoptimized /></div>
      <div className="home-car-details astra-wrap">
        <div className="home-car-title"><p className="astra-eyebrow">{car.make}</p><h3>{car.model}</h3><p className="home-car-character">{car.character}</p></div>
        <div className="home-car-spec"><p>{car.copy}</p><dl><div><dt>At its heart</dt><dd>{car.engine}</dd></div><div><dt>In a word</dt><dd>{car.spirit}</dd></div></dl></div>
      </div>
    </div>
  </div>;
}

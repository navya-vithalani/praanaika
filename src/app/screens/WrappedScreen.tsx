import { useState } from 'react';
import { ArrowLeft, ArrowRight, Share2, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { demoDataset } from '../../data/demoDataset';
import { Mascot } from '../../components/mascot/Mascot';

const slides = [
  { title: 'Your week in air', value: 'Praanaika Wrapped', body: 'A small story from Meera’s synthetic demo data.' },
  { title: 'Clean-air share', value: '78%', body: 'Hours in the good PM2.5 reference band.' },
  { title: 'Your loudest hour', value: '11:00', body: 'Construction noise was recorded around this time.' },
  { title: 'Exposure moments', value: '5', body: 'The most common tag was Cooking.' },
  { title: 'Check-ins', value: String(demoDataset.checkins.slice(-10).length), body: 'Your recent check-ins kept the story moving.' },
  { title: 'The Early Air-Out', value: 'That’s your rhythm.', body: 'Observations about your patterns, never a diagnosis.' },
];

export function WrappedScreen() {
  const navigate = useNavigate(); const [index, setIndex] = useState(0); const slide = slides[index];
  return <main className="wrapped-screen"><div className="wrapped-progress">{slides.map((_, item) => <span key={item} className={item <= index ? 'is-active' : ''} />)}</div><button className="wrapped-close" onClick={() => navigate('/today')}>×</button><div className="wrapped-content"><span className="wrapped-kicker"><Wind size={16} /> Demo profile · synthetic</span><Mascot mood={index === slides.length - 1 ? 'happy' : 'curious'} size={96} /><p className="wrapped-step">{index + 1} / {slides.length}</p><h1>{slide.title}</h1><strong>{slide.value}</strong><p>{slide.body}</p></div><div className="wrapped-controls"><button aria-label="Previous slide" onClick={() => setIndex(Math.max(0, index - 1))}><ArrowLeft /></button><button aria-label="Share wrapped" onClick={() => navigator.share?.({ title: 'Praanaika Wrapped', text: `${slide.title}: ${slide.value}` })}><Share2 /></button><button aria-label="Next slide" onClick={() => setIndex(Math.min(slides.length - 1, index + 1))}><ArrowRight /></button></div></main>;
}

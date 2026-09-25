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
  const gradients = [
    'linear-gradient(135deg, #1d1b19 0%, #302621 100%)',
    'linear-gradient(135deg, #2a2228 0%, #161118 100%)',
    'linear-gradient(135deg, #1b262a 0%, #111a1f 100%)',
    'linear-gradient(135deg, #2a1f1b 0%, #181210 100%)',
    'linear-gradient(135deg, #2d302a 0%, #1a1c17 100%)',
    'linear-gradient(135deg, #1d1b19 0%, #201a23 100%)',
  ];
  return <main className="wrapped-screen" style={{ background: gradients[index % gradients.length], transition: 'background 0.8s ease' }}>
    <style>{`
      .wrapped-bg-shapes { position: absolute; inset: 0; overflow: hidden; pointer-events: none; opacity: 0.4; z-index: 0; }
      .shape-blob { position: absolute; filter: blur(40px); opacity: 0.6; border-radius: 50%; animation: float 12s infinite alternate ease-in-out; }
      .shape-1 { width: 300px; height: 300px; background: var(--color-on-primary); top: -100px; left: -100px; animation-delay: 0s; }
      .shape-2 { width: 250px; height: 250px; background: var(--color-primary); bottom: -50px; right: -100px; animation-delay: -4s; }
      .shape-3 { width: 200px; height: 200px; background: var(--color-lavender); top: 40%; left: 60%; animation-delay: -8s; }
      @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(40px, -40px) scale(1.1); } }
      .wrapped-content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; flex: 1; padding: var(--space-6); animation: slideIn 0.5s ease; }
      @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .wrapped-screen h1 { font-size: 2.5rem; line-height: 1.1; margin: var(--space-4) 0 var(--space-2); color: var(--color-on-primary); text-shadow: 0 4px 12px rgba(0,0,0,0.5); }
      .wrapped-screen strong { font-size: 4rem; line-height: 1; display: block; font-family: var(--font-brand); font-weight: normal; margin-bottom: var(--space-4); color: var(--color-primary); }
      .wrapped-screen p { font-size: var(--text-md); color: rgba(255, 251, 246, 0.9); max-width: 280px; margin: 0 auto; line-height: 1.4; }
    `}</style>
    <div className="wrapped-bg-shapes"><div className="shape-blob shape-1" /><div className="shape-blob shape-2" /><div className="shape-blob shape-3" /></div>
    <div className="wrapped-progress" style={{ position: 'relative', zIndex: 2 }}>{slides.map((_, item) => <span key={item} className={item <= index ? 'is-active' : ''} />)}</div>
    <button className="wrapped-close" style={{ position: 'relative', zIndex: 2 }} onClick={() => navigate('/today')}>×</button>
    <div className="wrapped-content" key={index}>
      <span className="wrapped-kicker" style={{ marginBottom: 'auto' }}><Wind size={16} /> Demo profile · synthetic</span>
      <Mascot mood={index === slides.length - 1 ? 'happy' : 'curious'} size={120} />
      <p className="wrapped-step" style={{ marginTop: '24px', opacity: 0.6 }}>{index + 1} / {slides.length}</p>
      <h1>{slide.title}</h1><strong>{slide.value}</strong><p style={{ marginBottom: 'auto' }}>{slide.body}</p>
    </div>
    <div className="wrapped-controls" style={{ position: 'relative', zIndex: 2 }}>
      <button aria-label="Previous slide" onClick={() => setIndex(Math.max(0, index - 1))} style={{ opacity: index === 0 ? 0.3 : 1 }} disabled={index === 0}><ArrowLeft /></button>
      <button aria-label="Share wrapped" onClick={() => navigator.share?.({ title: 'Praanaika Wrapped', text: `${slide.title}: ${slide.value}` })}><Share2 /></button>
      <button aria-label="Next slide" onClick={() => setIndex(Math.min(slides.length - 1, index + 1))} style={{ opacity: index === slides.length - 1 ? 0.3 : 1 }} disabled={index === slides.length - 1}><ArrowRight /></button>
    </div>
  </main>;
}

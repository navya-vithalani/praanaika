import { useState } from 'react';
import { Activity, Check, ChevronDown, Mic, MoreHorizontal, Send, Sparkles, Wind } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Mascot } from '../../components/mascot/Mascot';
import { useActiveData } from '../../data/hooks/useActiveData';

export function InteractiveTalkScreen() {
  const data = useActiveData();
  const [view, setView] = useState<'feed' | 'ask'>('feed');
  const [feel, setFeel] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const latest = data.checkins[data.checkins.length - 1];

  return <main className="screen">
    <header className="page-header"><div><p className="eyebrow">Your day, in your words</p><h1>Talk</h1></div><button className="icon-button" aria-label="Talk options"><MoreHorizontal size={20} /></button></header>
    <div className="segmented"><button className={view === 'feed' ? 'is-active' : ''} onClick={() => setView('feed')}>Feed</button><button className={view === 'ask' ? 'is-active' : ''} onClick={() => setView('ask')}>Ask Pran</button></div>
    {view === 'feed' ? <>
      <div className="filter-row"><button className="filter-chip is-active">All</button><button className="filter-chip">Mine</button><button className="filter-chip">Hub</button><button className="filter-chip">Gem</button></div>
      <Card className="composer-card"><div className="composer-orb" aria-hidden="true" /><div><strong>Tell Pran something…</strong><p>A feeling, a log, or a small note.</p></div><button className="icon-button" aria-label="Start voice note"><Mic size={19} /></button></Card>
      <div className="feed-list"><article className="feed-item feed-item--self"><span className="feed-icon"><Activity size={17} /></span><div><span className="feed-meta">Latest check-in</span><h2>{latest ? `Feel ${latest.feel}/5 · Energy ${latest.energy}/5` : 'No check-ins yet'}</h2><p>{latest?.tags.join(' · ') || 'Choose a point below to start.'}</p></div><ChevronDown size={17} /></article><article className="feed-item feed-item--hub"><span className="feed-icon"><Wind size={17} /></span><div><span className="feed-meta">Demo observation</span><h2>Bedroom air was stuffier overnight</h2><p>Tap to see what I looked at.</p></div><ChevronDown size={17} /></article></div>
      <section className="orb-pad" aria-labelledby="orb-title"><div className="section-heading"><div><span className="card-kicker"><Sparkles size={15} /> Quick check-in</span><h2 id="orb-title">How do you feel right now?</h2></div><span className="chip chip--light">{feel}, {energy}</span></div><div className="orb-pad__labels"><span>Bright & energised</span><span>Tense & wired</span></div><div className="orb-grid" aria-label="Check-in feel and energy">{[5, 4, 3, 2, 1].map((feelValue) => <div key={feelValue} className="orb-grid__row">{[1, 2, 3, 4, 5].map((energyValue) => <button key={energyValue} className={feel === feelValue && energy === energyValue ? 'is-selected' : ''} aria-label={`Feel ${feelValue}, energy ${energyValue}`} onClick={() => { setFeel(feelValue); setEnergy(energyValue); }}><span /></button>)}</div>)}</div><div className="orb-pad__labels"><span>Low & drained</span><span>Calm & content</span></div><button className="button full-button">Save check-in</button></section>
    </> : <Card className="ask-card"><Mascot mood="thinking" size={58} /><h2>What would you like to notice?</h2><p>Start with a suggested question. Answers will only use what your data supports.</p><div className="question-chips"><button>How did I sleep?</button><button>When is my air cleanest?</button><button>What changed today?</button></div><div className="ask-input"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask in your own words" /><button aria-label="Send question" onClick={() => setSent(true)}><Send size={18} /></button></div>{sent && <p className="success-note"><Check size={15} /> I’ll compare this with your available observations.</p>}</Card>}
  </main>;
}

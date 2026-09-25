import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ArrowUpRight, BatteryMedium, Check, ChevronDown, CircleHelp, CloudSun, Droplets, Gauge, Gem, Lightbulb, MapPin, Mic, MoreHorizontal, Moon, RefreshCw, Send, Settings2, ShieldCheck, Sparkles, Thermometer, Volume2, Wind, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mascot } from '../../components/mascot/Mascot';
import { useSessionStore } from '../../store/sessionStore';
import { useActiveData } from '../../data/hooks/useActiveData';
import { fetchEnvironment, type EnvironmentSnapshot } from '../../services/airQuality';

const disclaimer = 'Praanaika shares observations about your own patterns. It is not medical advice or a diagnosis. Your doctor makes every decision.';

function Header({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>{action}</header>;
}

function Stat({ icon: Icon, label, value, detail, tone = '' }: { icon: typeof Wind; label: string; value: string; detail: string; tone?: string }) {
  return <div className={`stat-tile ${tone}`}><Icon size={19} aria-hidden="true" /><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

export function TodayScreen() {
  const mode = useSessionStore((state) => state.mode);
  const demoDay = useSessionStore((state) => state.demoDay);
  const data = useActiveData();
  const navigate = useNavigate();
  const [location, setLocation] = useState('Bengaluru');
  const [expanded, setExpanded] = useState(false);
  const [environment, setEnvironment] = useState<EnvironmentSnapshot | null>(null);
  const [environmentLoading, setEnvironmentLoading] = useState(true);
  const [environmentError, setEnvironmentError] = useState(false);
  const [environmentRefresh, setEnvironmentRefresh] = useState(0);
  const insight = data.insights[0];
  useEffect(() => {
    let active = true;
    setEnvironmentLoading(true);
    setEnvironmentError(false);
    void fetchEnvironment(location).then((snapshot) => {
      if (active) setEnvironment(snapshot);
    }).catch(() => {
      if (active) setEnvironmentError(true);
    }).finally(() => {
      if (active) setEnvironmentLoading(false);
    });
    return () => { active = false; };
  }, [location, environmentRefresh]);
  return <main className="screen">
    <Header eyebrow={mode === 'demo' ? 'Good evening, Meera' : 'Your day, gently noticed'} title="Today" action={<button className="location-chip" onClick={() => setLocation(location === 'Bengaluru' ? 'Choose city' : 'Bengaluru')}><MapPin size={15} aria-hidden="true" />{location}</button>} />
    <Card className={`insight-panel insight-panel--${insight?.tier ?? 'direct'} insight-sources--${insight?.sources.join('-') ?? 'self'}`}>
      <div className="insight-panel__top"><span className="source-label"><Sparkles size={15} aria-hidden="true" /> Pran says</span><span className="chip">Day {mode === 'demo' ? demoDay : data.checkins.length ? '1' : '0'}</span></div>
      <div className="insight-panel__body"><Mascot mood="happy" size={76} /><div><h2>{insight?.headline ?? 'I do not know your rhythm yet.'}</h2><p>{insight?.body ?? 'Share a check-in and I will start learning your own baseline.'}</p></div></div>
      {insight?.tier === 'personal' && <span className="personal-badge">Just for you</span>}<button className="panel-link" onClick={() => setExpanded(!expanded)}>Why I’m saying this <ArrowUpRight size={15} aria-hidden="true" /></button>{expanded && <div className="insight-evidence"><strong>Here’s what I looked at:</strong>{(insight?.evidence ?? ['Your available check-ins and logs']).map((item) => <span key={item}>• {item}</span>)}<small>Observation, not a cause. {disclaimer}</small></div>}
    </Card>
    <section className="section-block"><div className="section-heading"><h2>Outside right now</h2><span className="updated-label">{environmentLoading ? 'Updating…' : environment?.offline ? 'Cached · offline' : 'Updated just now'}</span></div><Card className="aqi-card"><div><span className="card-kicker"><CloudSun size={16} aria-hidden="true" /> India CPCB estimate</span><strong className="aqi-value">{environment?.aqi ?? '—'}</strong><span className="aqi-status">{environment?.band ?? (environmentError ? 'Unavailable' : 'Loading')}</span><p>{environmentError ? 'Try refreshing or another city.' : 'Modelled from Open-Meteo data.'}</p></div><div className="aqi-ring"><span>PM2.5</span><strong>{environment?.pm25 ? Math.round(environment.pm25) : '—'}</strong><small>µg/m³</small></div></Card><div className="stat-grid"><Stat icon={Thermometer} label="Temperature" value={environment?.temperature === null || environment?.temperature === undefined ? '—' : `${Math.round(environment.temperature)}°`} detail={environment?.apparentTemperature === null || environment?.apparentTemperature === undefined ? 'Waiting for data' : `Feels like ${Math.round(environment.apparentTemperature)}°`} /><Stat icon={Droplets} label="Humidity" value={environment?.humidity === null || environment?.humidity === undefined ? '—' : `${Math.round(environment.humidity)}%`} detail={environment?.offline ? 'Cached reading' : 'Current reading'} tone="stat-tile--teal" /></div></section>
    <section className="section-block"><div className="section-heading"><h2>What else is around</h2><button className="icon-button" aria-label="Refresh environment" onClick={() => setEnvironmentRefresh((value) => value + 1)}><RefreshCw size={17} /></button></div><Card className="window-card"><div><span className="card-kicker">Cleanest window</span><h3>{environment?.cleanestWindow ?? 'Calculating…'}</h3><p>Forecast estimate for the next 24 hours.</p></div><div className="mini-bars" aria-label="Air quality forecast"><i /><i /><i /><i /><i /><i /><i /><i /></div></Card></section>
    <section className="section-block"><div className="section-heading"><h2>Keep exploring</h2></div><div className="action-grid"><button className="action-tile" onClick={() => navigate('/talk')}><Mic size={20} /><strong>Tell Pran something</strong><small>Add a check-in or log.</small></button><button className="action-tile" onClick={() => navigate('/wrapped')}><Sparkles size={20} /><strong>Your week in air</strong><small>Open Wrapped.</small></button><button className="action-tile" onClick={() => navigate('/about')}><CircleHelp size={20} /><strong>How this works</strong><small>Body, environment, baseline.</small></button></div></section>
    <p className="disclaimer-line"><ShieldCheck size={15} aria-hidden="true" /> {disclaimer}</p>
  </main>;
}

export function TalkScreen() {
  const [view, setView] = useState<'feed' | 'ask'>('feed');
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [feel, setFeel] = useState(3);
  const [energy, setEnergy] = useState(3);
  const data = useActiveData();
  const latestCheckIn = data.checkins[data.checkins.length - 1];
  return <main className="screen"><Header eyebrow="Your day, in your words" title="Talk" action={<button className="icon-button" aria-label="Talk options"><MoreHorizontal size={20} /></button>} /><div className="segmented"><button className={view === 'feed' ? 'is-active' : ''} onClick={() => setView('feed')}>Feed</button><button className={view === 'ask' ? 'is-active' : ''} onClick={() => setView('ask')}>Ask Pran</button></div>{view === 'feed' ? <><div className="filter-row"><button className="filter-chip is-active">All</button><button className="filter-chip">Mine</button><button className="filter-chip">Hub</button><button className="filter-chip">Gem</button></div><Card className="composer-card"><div className="composer-orb" aria-hidden="true" /><div><strong>Tell Pran something…</strong><p>A feeling, a log, or a small note.</p></div><button className="icon-button" aria-label="Start voice note"><Mic size={19} /></button></Card><div className="feed-list"><article className="feed-item feed-item--self"><span className="feed-icon"><Activity size={17} /></span><div><span className="feed-meta">Today · Your check-in</span><h2>Feeling calm and a little energised</h2><p>Headache · Focused</p></div><ChevronDown size={17} /></article><article className="feed-item feed-item--hub"><span className="feed-icon"><Wind size={17} /></span><div><span className="feed-meta">Yesterday · Hub observation</span><h2>Bedroom air was stuffier overnight</h2><p>Tap to see what I looked at.</p></div><ChevronDown size={17} /></article></div><div className="quick-checkin"><span>Quick check-in</span><div className="orb-row"><button aria-label="Low and drained" /><button aria-label="Calm and content" /><button aria-label="Bright and energised" /><button aria-label="Tense and wired" /></div></div></> : <Card className="ask-card"><Mascot mood="thinking" size={58} /><h2>What would you like to notice?</h2><p>Start with a suggested question. Answers will only use what your data supports.</p><div className="question-chips"><button>How did I sleep?</button><button>When is my air cleanest?</button><button>What changed today?</button></div><div className="ask-input"><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask in your own words" /><button aria-label="Send question" onClick={() => setSaved(true)}><Send size={18} /></button></div>{saved && <p className="success-note"><Check size={15} /> I’ll compare this with your available observations.</p>}</Card>}</main>;
}

export function GemScreen() {
  const [live, setLive] = useState(false);
  const [attachment, setAttachment] = useState<'collar' | 'ear'>('collar');
  return <main className="screen"><Header eyebrow="Wearable signals" title="Gem" action={<button className="icon-button" aria-label="Gem settings"><Settings2 size={19} /></button>} /><Card className="device-card"><div className="device-icon"><Gem size={25} /></div><div><span className="card-kicker">Vayu Gem · simulated</span><h2>Connected via Bluetooth</h2><p>Live link is simulated in this demo.</p></div><BatteryMedium size={22} /></Card><div className="segmented"><button className={attachment === 'collar' ? 'is-active' : ''} onClick={() => setAttachment('collar')}>Collar</button><button className={attachment === 'ear' ? 'is-active' : ''} onClick={() => setAttachment('ear')}>Ear</button></div><Card className="live-card"><div className="section-heading"><div><span className="card-kicker"><span className="live-dot" /> Live reading</span><h2>{live ? 'Streaming gently' : 'Ready when you are'}</h2></div><button className={`toggle ${live ? 'is-on' : ''}`} aria-label="Toggle live simulation" onClick={() => setLive(!live)}><span /></button></div><div className="stat-grid"><Stat icon={Gauge} label="VOC delta" value={live ? '+18' : '—'} detail="relative index" tone="stat-tile--accent" /><Stat icon={Thermometer} label="Skin temp" value={attachment === 'ear' ? '36.4°' : '—'} detail={attachment === 'ear' ? 'reliable at ear' : 'ear attachment only'} /><Stat icon={Volume2} label="Noise" value={live ? '42 dB' : '—'} detail="sound level only" /><Stat icon={Activity} label="Motion" value={live ? 'Low' : '—'} detail="last minute" /></div><p className="note">Your Gem picks the reading that is reliable at this spot automatically.</p></Card><section className="section-block"><div className="section-heading"><h2>Recent sessions</h2><button className="text-button">See all</button></div><article className="session-row"><span className="session-badge"><Sparkles size={16} /></span><div><strong>Evening at home</strong><small>Yesterday · Collar · 2 spikes</small></div><ArrowUpRight size={17} /></article><article className="session-row"><span className="session-badge session-badge--lavender"><Moon size={16} /></span><div><strong>Quiet reading</strong><small>Monday · Ear · No spikes</small></div><ArrowUpRight size={17} /></article></section></main>;
}

export function HubScreen() {
  const [metric, setMetric] = useState('CO₂');
  const metrics = ['CO₂', 'PM2.5', 'VOC', 'Noise'];
  return <main className="screen"><Header eyebrow="The room around you" title="Hub" action={<button className="icon-button" aria-label="Hub settings"><Settings2 size={19} /></button>} /><Card className="hub-status"><div className="status-light" /><div><span className="card-kicker">Bedroom Hub · connected</span><h2>Your room right now</h2><p>Reference bands, not medical thresholds.</p></div><button className="icon-button" aria-label="Refresh Hub"><RefreshCw size={17} /></button></Card><div className="room-grid"><Stat icon={Thermometer} label="Temperature" value="24.8°" detail="within reference" /><Stat icon={Droplets} label="Humidity" value="58%" detail="within reference" tone="stat-tile--teal" /><Stat icon={Wind} label="VOC" value="Low" detail="reference band" tone="stat-tile--lavender" /><Stat icon={Volume2} label="Noise" value="39 dB" detail="sound level only" /></div><Card className="chart-card"><div className="section-heading"><div><span className="card-kicker">History</span><h2>{metric} over time</h2></div><button className="icon-button" aria-label="Chart options"><MoreHorizontal size={18} /></button></div><div className="metric-tabs">{metrics.map((item) => <button key={item} className={metric === item ? 'is-active' : ''} onClick={() => setMetric(item)}>{item}</button>)}</div><div className="fake-chart"><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="chart-axis"><small>24h ago</small><small>Now</small></div></Card><Card className="recalibration-card"><div className="device-icon device-icon--teal"><Lightbulb size={21} /></div><div><h2>Recalibration</h2><p>Last confirmed Sunday · Socket 2</p></div><ArrowUpRight size={17} /></Card><Button className="full-button">Reorder liners</Button></main>;
}

export function YouScreen() {
  const navigate = useNavigate();
  const resetProfile = useSessionStore((state) => state.resetProfile);
  const [open, setOpen] = useState('privacy');
  function startOver() { resetProfile(); navigate('/welcome', { replace: true }); }
  return <main className="screen"><Header eyebrow="Your profile and privacy" title="You" action={<button className="icon-button" aria-label="Profile settings"><Settings2 size={19} /></button>} /><Card className="profile-card"><div className="avatar-placeholder">M</div><div><span className="card-kicker">Demo profile · synthetic</span><h2>Meera, 29</h2><p>Bengaluru · learning your baseline</p></div><button className="icon-button" aria-label="Edit profile"><ArrowUpRight size={17} /></button></Card><section className="settings-list"><button className="settings-row" onClick={() => setOpen(open === 'privacy' ? '' : 'privacy')}><ShieldCheck size={19} /><span><strong>Your data stays here</strong><small>On this device until you delete it.</small></span><ChevronDown className={open === 'privacy' ? 'rotate' : ''} size={18} /></button>{open === 'privacy' && <div className="settings-detail"><p>Export a backup or remove everything saved by Praanaika.</p><button className="text-button">Export my data</button><button className="text-button text-button--danger">Delete my data</button></div>}<button className="settings-row" onClick={() => setOpen(open === 'about' ? '' : 'about')}><CircleHelp size={19} /><span><strong>About Praanaika</strong><small>How the method works and what it does not claim.</small></span><ChevronDown className={open === 'about' ? 'rotate' : ''} size={18} /></button>{open === 'about' && <div className="settings-detail"><p>Body, Environment, Baseline. Honest observations, never a diagnosis.</p><button className="text-button" onClick={() => navigate('/about')}>Read the story</button></div>}<button className="settings-row" onClick={startOver}><RefreshCw size={19} /><span><strong>Start over from Welcome</strong><small>Switch profile or restart this demo.</small></span><ArrowUpRight size={18} /></button></section><p className="disclaimer-line"><ShieldCheck size={15} aria-hidden="true" /> Your doctor makes every medical decision.</p></main>;
}

import { useState } from 'react';
import { ArrowLeft, Check, CircleDashed, Gem, Plus, Save, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';

const hubPresets = ['Sage & Sand', 'Midnight Loom', 'Terracotta Bloom'];
const gemPresets = ['Moon Choker', 'Leaf Drops', 'Rose Lotus'];

export function DesignScreen() {
  const navigate = useNavigate();
  const { kind = 'hub' } = useParams();
  const isHub = kind === 'hub';
  const presets = isHub ? hubPresets : gemPresets;
  const DesignIcon = isHub ? CircleDashed : Gem;
  const [selected, setSelected] = useState(presets[0]);
  const [saved, setSaved] = useState(false);
  const [accent, setAccent] = useState('sage');
  const [sensors, setSensors] = useState<string[]>(['co2', 'pm25']);
  
  function toggleSensor(s: string) {
    if (sensors.includes(s)) setSensors(sensors.filter(x => x !== s));
    else setSensors([...sensors, s]);
  }

  const basePrice = isHub ? 4999 : 6499;
  const presetExtra = selected === 'Midnight Loom' ? 2000 : selected === 'Rose Lotus' ? 500 : 0;
  const sensorsExtra = isHub ? sensors.length * 1000 : 0;
  const totalPrice = basePrice + presetExtra + sensorsExtra;
  const priceString = `₹${totalPrice.toLocaleString()}`;

  const colors: Record<string, string> = { sage: '#879e8e', terracotta: '#c27a69', ochre: '#c69a59', plum: '#8c6b77', sky: '#8a9fac' };
  const hex = colors[accent] || '#879e8e';

  return <main className="screen design-screen"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button><header className="page-header"><div><p className="eyebrow">Design your own</p><h1>{isHub ? 'Your Hub' : 'Your Gem'}</h1></div><span className="design-kind"><DesignIcon size={19} /></span></header>
  <Card className={`product-preview product-preview--${accent}`}>
    <div className="product-preview__art" style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px' }}>
      {/* Base layer PNG: Place your base image in /public/assets/ and reference it here */}
      <img src={`/assets/${isHub ? 'hub' : 'gem'}-base.png`} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'contain', opacity: 0.2 }} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
      {isHub ? (
        <svg viewBox="0 0 200 200" style={{ width: '160px', height: '160px', zIndex: 1 }}>
          <circle cx="100" cy="100" r="90" fill="none" stroke={hex} strokeWidth="8" opacity="0.3" />
          <circle cx="100" cy="100" r="70" fill={hex} opacity="0.8" />
          <path d="M50 100 Q100 50 150 100 T50 100" fill="none" stroke="#fff" strokeWidth="4" opacity="0.5" />
          <circle cx="100" cy="100" r="20" fill="rgba(255,255,255,0.9)" />
        </svg>
      ) : (
        <svg viewBox="0 0 200 200" style={{ width: '120px', height: '120px', zIndex: 1 }}>
          <polygon points="100,20 180,70 180,150 100,190 20,150 20,70" fill={hex} opacity="0.8" />
          <polygon points="100,40 160,80 160,140 100,170 40,140 40,80" fill="none" stroke="#fff" strokeWidth="4" opacity="0.5" />
          <circle cx="100" cy="110" r="25" fill="rgba(255,255,255,0.9)" />
        </svg>
      )}
    </div>
    <span className="card-kicker">Live preview</span><h2>{selected}</h2>
    <p>Base image can be added at <code>/public/assets/{isHub ? 'hub' : 'gem'}-base.png</code>.</p>
  </Card>
  <section className="section-block"><div className="section-heading"><h2>Start with a preset</h2><button className="icon-button" aria-label="Create blank design"><Plus size={18} /></button></div><div className="preset-row">{presets.map((preset) => <button key={preset} className={`preset-card ${selected === preset ? 'is-selected' : ''}`} onClick={() => setSelected(preset)}><span className="preset-swatch" />{preset}</button>)}</div></section><section className="section-block"><div className="section-heading"><h2>Choose a colour</h2></div><div className="swatch-row">{['sage', 'terracotta', 'ochre', 'plum', 'sky'].map((color) => <button key={color} aria-label={color} className={`swatch swatch--${color} ${accent === color ? 'is-selected' : ''}`} onClick={() => setAccent(color)} />)}</div></section>
  {isHub && <section className="section-block"><div className="section-heading"><h2>Select Sensors</h2></div><div className="action-grid">
    <button className={`action-tile ${sensors.includes('co2') ? 'is-selected' : ''}`} onClick={() => toggleSensor('co2')} style={{ border: sensors.includes('co2') ? '2px solid var(--color-primary)' : '' }}><strong>CO₂</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('pm25') ? 'is-selected' : ''}`} onClick={() => toggleSensor('pm25')} style={{ border: sensors.includes('pm25') ? '2px solid var(--color-primary)' : '' }}><strong>PM2.5</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('voc') ? 'is-selected' : ''}`} onClick={() => toggleSensor('voc')} style={{ border: sensors.includes('voc') ? '2px solid var(--color-primary)' : '' }}><strong>VOC</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('noise') ? 'is-selected' : ''}`} onClick={() => toggleSensor('noise')} style={{ border: sensors.includes('noise') ? '2px solid var(--color-primary)' : '' }}><strong>Noise</strong><small>+₹1,000</small></button>
  </div></section>}
  <Card className="design-bottom"><div><span className="card-kicker">Estimated, excl. GST</span><strong>{priceString}</strong></div><div className="design-actions"><button className="icon-button" aria-label="Save design" onClick={() => setSaved(true)}><Save size={19} /></button><button className="button" onClick={() => setSaved(true)}><ShoppingBag size={17} /> Buy this</button></div>{saved && <p className="success-note"><Check size={15} /> Saved locally for the next step.</p>}</Card><p className="note"><Sparkles size={13} /> Product options are simulated in this demo.</p></main>;
}

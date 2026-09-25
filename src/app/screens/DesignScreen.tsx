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

  return <main className="screen design-screen"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button><header className="page-header"><div><p className="eyebrow">Design your own</p><h1>{isHub ? 'Your Hub' : 'Your Gem'}</h1></div><span className="design-kind"><DesignIcon size={19} /></span></header><Card className={`product-preview product-preview--${accent}`}><div className="product-preview__art">{isHub ? <><div className="preview-ring"><span /><span /><span /><span /></div><div className="preview-threads" /></> : <div className="preview-gem"><Gem size={66} /></div>}</div><span className="card-kicker">Live preview</span><h2>{selected}</h2><p>Layered preview placeholder, ready for product SVG art.</p></Card><section className="section-block"><div className="section-heading"><h2>Start with a preset</h2><button className="icon-button" aria-label="Create blank design"><Plus size={18} /></button></div><div className="preset-row">{presets.map((preset) => <button key={preset} className={`preset-card ${selected === preset ? 'is-selected' : ''}`} onClick={() => setSelected(preset)}><span className="preset-swatch" />{preset}</button>)}</div></section><section className="section-block"><div className="section-heading"><h2>Choose a colour</h2></div><div className="swatch-row">{['sage', 'terracotta', 'ochre', 'plum', 'sky'].map((color) => <button key={color} aria-label={color} className={`swatch swatch--${color} ${accent === color ? 'is-selected' : ''}`} onClick={() => setAccent(color)} />)}</div></section>
  {isHub && <section className="section-block"><div className="section-heading"><h2>Select Sensors</h2></div><div className="action-grid">
    <button className={`action-tile ${sensors.includes('co2') ? 'is-selected' : ''}`} onClick={() => toggleSensor('co2')} style={{ border: sensors.includes('co2') ? '2px solid var(--color-primary)' : '' }}><strong>CO₂</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('pm25') ? 'is-selected' : ''}`} onClick={() => toggleSensor('pm25')} style={{ border: sensors.includes('pm25') ? '2px solid var(--color-primary)' : '' }}><strong>PM2.5</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('voc') ? 'is-selected' : ''}`} onClick={() => toggleSensor('voc')} style={{ border: sensors.includes('voc') ? '2px solid var(--color-primary)' : '' }}><strong>VOC</strong><small>+₹1,000</small></button>
    <button className={`action-tile ${sensors.includes('noise') ? 'is-selected' : ''}`} onClick={() => toggleSensor('noise')} style={{ border: sensors.includes('noise') ? '2px solid var(--color-primary)' : '' }}><strong>Noise</strong><small>+₹1,000</small></button>
  </div></section>}
  <Card className="design-bottom"><div><span className="card-kicker">Estimated, excl. GST</span><strong>{priceString}</strong></div><div className="design-actions"><button className="icon-button" aria-label="Save design" onClick={() => setSaved(true)}><Save size={19} /></button><button className="button" onClick={() => setSaved(true)}><ShoppingBag size={17} /> Buy this</button></div>{saved && <p className="success-note"><Check size={15} /> Saved locally for the next step.</p>}</Card><p className="note"><Sparkles size={13} /> Product options are simulated in this demo.</p></main>;
}

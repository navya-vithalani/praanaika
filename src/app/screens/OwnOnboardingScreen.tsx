import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useSessionStore } from '../../store/sessionStore';
import { useOwnProfileStore } from '../../store/ownProfileStore';

const steps = ['Welcome', 'Consent', 'About you', 'Your place'];

export function OwnOnboardingScreen() {
  const navigate = useNavigate();
  const setMode = useSessionStore((state) => state.setMode);
  const saveProfile = useOwnProfileStore((state) => state.saveProfile);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [consent, setConsent] = useState(false);
  const next = () => setStep((current) => Math.min(3, current + 1));
  const finish = () => { saveProfile({ name, age: Number(age), city, consent, createdAt: new Date().toISOString() }); setMode('own'); navigate('/today', { replace: true }); };
  return <main className="onboarding-page"><div className="onboarding-content"><button className="back-link" onClick={() => step ? setStep(step - 1) : navigate('/welcome')}><ArrowLeft size={17} /> Back</button><div className="progress-track"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><p className="eyebrow">Step {step + 1} of {steps.length}</p><h1>{steps[step]}</h1>{step === 0 && <div className="onboarding-copy"><h2>Your space starts empty.</h2><p>Praanaika will only learn from what you choose to share on this device. There is no synthetic data in your own profile.</p><ul><li><Check size={16} /> Personal observations, not diagnoses</li><li><Check size={16} /> Data stored locally until you delete it</li><li><Check size={16} /> You can change your mind anytime</li></ul></div>}{step === 1 && <div className="onboarding-form"><label className="toggle-row"><span><strong>Air and exposure</strong><small>Use local environment readings in your view.</small></span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span><strong>Health logs</strong><small>Keep symptom and medication records on this device.</small></span><input type="checkbox" /></label><label className="check-row"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>I am 18 or older and have read the demo privacy note.</span></label></div>}{step === 2 && <div className="onboarding-form"><label>Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="What should Pran call you?" /></label><label>Age<input type="number" min="18" value={age} onChange={(event) => setAge(event.target.value)} placeholder="18+" /></label></div>}{step === 3 && <div className="onboarding-form"><label>City or pincode<input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Bengaluru or 560001" /></label><p className="note">No location permission is requested. You choose the place yourself.</p></div>}<Button className="onboarding-next" disabled={step === 1 && !consent || step === 2 && (!name || Number(age) < 18)} onClick={step === 3 ? finish : next}>{step === 3 ? 'Create my profile' : 'Continue'}<ArrowRight size={17} /></Button></div></main>;
}

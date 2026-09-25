import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ArrowLeft, Copy, Send } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OrderScreen() {
  const navigate = useNavigate(); const [params] = useSearchParams(); const [qr, setQr] = useState(''); const [sent, setSent] = useState(false); const [code] = useState(() => `PRA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`); const kind = params.get('kind') === 'gem' ? 'Gem' : 'Hub'; const amount = kind === 'Gem' ? 6499 : 6999;
  useEffect(() => { void QRCode.toDataURL(`upi://pay?pa=PLACEHOLDER@upi&pn=Praanaika&am=${amount}&cu=INR&tn=${code}`).then(setQr); }, [amount, code]);
  return <main className="screen order-screen"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back</button><p className="eyebrow">Order flow</p><h1>Your {kind}</h1><section className="order-summary"><div><strong>{kind} · estimated</strong><p>Placeholder pricing under test, excl. GST and shipping.</p></div><strong>₹{amount.toLocaleString('en-IN')}</strong></section><div className="order-qr">{qr && <img src={qr} alt="UPI payment QR code" />}<p>UPI ID is a placeholder until business details are configured.</p></div><div className="order-actions"><button className="button" onClick={() => setSent(true)}><Send size={16} /> Send order</button><button className="icon-button" aria-label="Copy order code" onClick={() => navigator.clipboard?.writeText(code)}><Copy size={18} /></button></div>{sent && <p className="success-note">Order draft {code} is ready to send manually.</p>}</main>;
}

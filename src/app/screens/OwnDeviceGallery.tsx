import { Gem, Palette, Wind } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OwnDeviceGallery({ kind }: { kind: 'gem' | 'hub' }) {
  const navigate = useNavigate();
  const label = kind === 'gem' ? 'Gem' : 'Hub';
  return <main className="screen device-gallery"><p className="eyebrow">Design your own</p><h1>{label}</h1><p className="gallery-intro">Your profile is ready for a device design. Live pairing works in the native app.</p><div className="gallery-create" onClick={() => navigate(`/design/${kind}`)} role="button" tabIndex={0}><span className="gallery-create__icon">{kind === 'gem' ? <Gem /> : <Wind />}</span><div><strong>Create your {label}</strong><small>Choose colours, shapes, and options.</small></div><Palette size={19} /></div><div className="gallery-empty"><Palette size={27} /><h2>My creations</h2><p>Saved designs will appear here after you make your first one.</p><button className="button" onClick={() => navigate(`/design/${kind}`)}>Create new</button></div></main>;
}

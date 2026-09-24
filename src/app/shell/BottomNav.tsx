import { CircleDashed, Gem, MessagesSquare, UserRound, Wind } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BrandMark } from '../../components/brand/BrandMark';

const links = [
  { to: '/talk', label: 'Talk', icon: MessagesSquare },
  { to: '/gem', label: 'Gem', icon: Gem },
  { to: '/today', label: 'Today', icon: Wind, center: true },
  { to: '/hub', label: 'Hub', icon: CircleDashed },
  { to: '/you', label: 'You', icon: UserRound },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      <div className="bottom-nav__brand"><BrandMark compact /></div>
      <div className="bottom-nav__links">
        {links.map(({ to, label, icon: Icon, center }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}${center ? ' nav-link--center' : ''}`}>
            <Icon size={center ? 23 : 20} strokeWidth={center ? 1.8 : 2} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const links = [
  { to: '/', label: 'Galerie' },
  { to: '/rooms', label: 'Salles' },
  { to: '/exhibitions', label: 'Expositions' },
  { to: '/favorites', label: 'Favoris' },
  { to: '/game', label: 'Jeu' },
];

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(5, 5, 20, 0.75)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <Link
        to="/"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--cyan), var(--purple))',
            boxShadow: '0 0 12px var(--cyan)',
          }}
        />
        Le Musée de l'espace
      </Link>
      <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            style={({ isActive }) => ({
              padding: '0.45rem 0.9rem',
              borderRadius: 8,
              fontSize: '0.9rem',
              color: isActive ? 'var(--cyan)' : 'var(--text-dim)',
              background: isActive ? 'rgba(0,240,255,0.08)' : 'transparent',
              border: '1px solid',
              borderColor: isActive ? 'var(--border)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </motion.nav>
  );
}
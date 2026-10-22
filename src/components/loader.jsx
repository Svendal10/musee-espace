import { motion } from 'framer-motion';

export default function Loader({ label = 'Chargement…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', gap: '1rem' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '3px solid rgba(0,240,255,0.15)',
          borderTopColor: 'var(--cyan)',
        }}
      />
      <p style={{ color: 'var(--text-dim)' }}>{label}</p>
    </div>
  );
}
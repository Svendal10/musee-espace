import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROOMS } from '../data/rooms';

export default function RoomsPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.4rem' }}
      >
        Les salles du musée
      </motion.h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
        Des parcours thématiques préparés pour vous.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {ROOMS.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6 }}
          >
            <Link
              to={`/rooms/${room.id}`}
              style={{
                display: 'block',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                color: 'inherit',
              }}
            >
              <div style={{ height: 220, overflow: 'hidden' }}>
                <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{room.name}</h2>
                <p style={{ color: 'var(--cyan)', fontSize: '0.85rem', marginBottom: '0.6rem' }}>{room.tagline}</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: 1.5 }}>{room.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
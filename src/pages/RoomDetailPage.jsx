import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getRoomById } from '../data/rooms';
import { searchMedia } from '../api/nasaApi';
import { extractYear, formatDate } from '../utils/format';
import MediaCard from '../components/Mediacard';
import Loader from '../components/loader';

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const room = getRoomById(roomId);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!room) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(room.queries.map((q) => searchMedia({ ...q, page: 1 }).catch(() => ({ items: [] }))))
      .then((results) => {
        if (cancelled) return;
        const seen = new Set();
        const merged = [];
        results.forEach((r) => r.items.forEach((m) => {
          if (!seen.has(m.id)) {
            seen.add(m.id);
            merged.push(m);
          }
        }));
        setMedias(merged);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [room]);

  if (!room) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Salle introuvable</h1>
        <Link to="/rooms">← Retour aux salles</Link>
      </div>
    );
  }

  const timelineItems = medias
    .map((m) => ({ ...m, year: extractYear(m.date) }))
    .filter((m) => m.year)
    .sort((a, b) => a.year - b.year);

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <Link to="/rooms" style={{ color: 'var(--text-dim)' }}>← Toutes les salles</Link>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', margin: '0.5rem 0' }}
      >
        {room.name}
      </motion.h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', maxWidth: 800 }}>{room.description}</p>

      {loading && <Loader />}
      {error && <p style={{ color: 'var(--pink)' }}>{error}</p>}

      {!loading && !error && (
        <>
          <h2 style={{ marginBottom: '1rem' }}>Frise chronologique</h2>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              marginBottom: '2rem',
            }}
          >
            {timelineItems.map((m) => (
              <Link
                key={m.id}
                to={`/media/${m.id}`}
                style={{
                  flex: '0 0 200px',
                  padding: '1rem',
                  background: 'var(--glass)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  color: 'inherit',
                }}
              >
                <div style={{ fontSize: '1.4rem', color: 'var(--cyan)', fontWeight: 700 }}>{m.year}</div>
                <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', lineHeight: 1.4 }}>{m.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>{formatDate(m.date)}</div>
              </Link>
            ))}
            {timelineItems.length === 0 && (
              <p style={{ color: 'var(--text-dim)' }}>Aucune date disponible pour la frise.</p>
            )}
          </div>

          <h2 style={{ marginBottom: '1rem' }}>Médias de la salle</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.2rem',
            }}
          >
            {medias.map((m, i) => (
              <MediaCard key={m.id} media={m} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';

const typeIcon = { image: '🖼️', video: '🎬', audio: '🔊' };

export default function MediaCard({ media, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(media.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
      whileHover={{ y: -6 }}
      style={{
        position: 'relative',
        borderRadius: 14,
        overflow: 'hidden',
        background: 'var(--glass)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Link to={`/media/${media.id}`} style={{ display: 'block', color: 'inherit' }}>
        <div style={{ height: 200, overflow: 'hidden', background: '#111' }}>
          {media.thumbnail ? (
            <img
              src={media.thumbnail}
              alt={media.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'grid',
                placeItems: 'center',
                background: 'linear-gradient(135deg, #1a1a3a, #0a0a20)',
                fontSize: '3rem',
                color: 'var(--cyan)',
              }}
            >
              {typeIcon[media.mediaType] || '🖼️'}
            </div>
          )}
        </div>
        <div style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', lineHeight: 1.3 }}>
            {media.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {formatDate(media.date)} · {typeIcon[media.mediaType] || ''} {media.mediaType}
          </p>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(media);
        }}
        title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          padding: '0.3rem 0.55rem',
          fontSize: '1rem',
          background: fav ? 'rgba(255,43,214,0.2)' : 'rgba(0,0,0,0.5)',
          borderColor: fav ? 'var(--pink)' : 'var(--border)',
        }}
      >
        {fav ? '★' : '☆'}
      </button>
    </motion.div>
  );
}
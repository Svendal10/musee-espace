import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/format';
import { useFavorites } from '../context/FavoritesContext';
import { useExhibitions } from '../context/ExhibitionsContext';

const typeIcon = { image: '🖼️', video: '🎬', audio: '🔊' };

export default function MediaCard({ media, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { exhibitions, addItem } = useExhibitions();
  const [showExpoMenu, setShowExpoMenu] = useState(false);
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

      {/* Bouton Favori (Étoile) */}
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

      {/* Bouton Ajouter à une exposition (+) */}
      <div style={{ position: 'absolute', top: 50, right: 10 }}>
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowExpoMenu(!showExpoMenu);
          }}
          title="Ajouter à une exposition"
          style={{
            padding: '0.3rem 0.55rem',
            fontSize: '1rem',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          +
        </button>

        {showExpoMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 5,
              background: '#111',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '0.5rem',
              zIndex: 10,
              minWidth: 180,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', marginLeft: '0.2rem' }}>
              Ajouter à :
            </p>
            {exhibitions.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Aucune expo. Créez-en une !
              </p>
            ) : (
              exhibitions.map((ex) => (
                <button
                  key={ex.id}
                  onClick={(e) => {
                    e.preventDefault();
                    addItem(ex.id, media);
                    setShowExpoMenu(false);
                    // Optionnel : feedback visuel
                    alert(`Ajouté à "${ex.name}" !`);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.4rem 0.6rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(0,240,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  {ex.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
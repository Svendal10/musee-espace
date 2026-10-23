import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useExhibitions } from '../context/ExhibitionsContext';
import { getAssetManifest, pickBestImage, pickPlayable } from '../api/nasaApi';

export default function VisitPage() {
  const { id } = useParams();
  const { getExhibition } = useExhibitions();
  const exhibition = getExhibition(id);
  const [index, setIndex] = useState(0);
  const [assets, setAssets] = useState([]);
  const mediaRef = useRef(null);

  const items = exhibition?.items || [];
  const current = items[index];

  // Charger les assets du média courant
  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    setAssets([]); // reset pour éviter d'afficher les anciens assets
    getAssetManifest(current.id)
      .then((a) => !cancelled && setAssets(a))
      .catch(() => !cancelled && setAssets([]));
    return () => { cancelled = true; };
  }, [current?.id]);

  // Arrêter le média quand on change de slide ou qu'on quitte
  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        try { mediaRef.current.pause(); } catch {}
      }
    };
  }, [index]);

  // Navigation clavier : flèches gauche/droite + Échap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        setIndex((i) => Math.min(i + 1, items.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  // Cas d'erreur : expo inexistante ou vide
  if (!exhibition || items.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Exposition vide ou introuvable</h1>
        <Link to="/exhibitions">← Retour</Link>
      </div>
    );
  }

  const bestImage = pickBestImage(assets, current.thumbnail);
  const videoFile = current.mediaType === 'video' ? pickPlayable(assets, 'video') : null;
  const audioFile = current.mediaType === 'audio' ? pickPlayable(assets, 'audio') : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Barre du haut : sortie + progression */}
      <div
        style={{
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(0,0,0,0.6)',
        }}
      >
        <Link to={`/exhibitions/${id}`} style={{ color: 'var(--text-dim)' }}>
          ✕ Quitter
        </Link>
        <div style={{ color: 'var(--cyan)' }}>
          {index + 1} / {items.length}
        </div>
      </div>

      {/* Zone centrale : média + commentaire */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          overflow: 'hidden',
        }}
      >
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {current.mediaType === 'image' && bestImage && (
            <img
              src={bestImage}
              alt={current.title}
              style={{ maxHeight: '65vh', maxWidth: '100%', objectFit: 'contain' }}
            />
          )}

          {current.mediaType === 'video' && videoFile && (
            <video
              key={videoFile}
              ref={mediaRef}
              controls
              autoPlay
              poster={current.thumbnail}
              onEnded={() => setIndex((i) => Math.min(i + 1, items.length - 1))}
              style={{ maxHeight: '65vh', maxWidth: '100%' }}
            >
              <source src={videoFile} type="video/mp4" />
            </video>
          )}

          {current.mediaType === 'video' && !videoFile && (
            <p style={{ color: 'var(--text-dim)' }}>
              Aucun fichier vidéo lisible disponible.
            </p>
          )}

          {current.mediaType === 'audio' && audioFile && (
            <audio
              key={audioFile}
              ref={mediaRef}
              controls
              autoPlay
              style={{ width: '80%' }}
            >
              <source src={audioFile} type="audio/mpeg" />
            </audio>
          )}

          {current.mediaType === 'audio' && !audioFile && (
            <p style={{ color: 'var(--text-dim)' }}>
              Aucun fichier audio lisible disponible.
            </p>
          )}

          <h2 style={{ marginTop: '1.5rem', textAlign: 'center' }}>{current.title}</h2>
          {current.comment && (
            <p
              style={{
                color: 'var(--text-dim)',
                maxWidth: 700,
                textAlign: 'center',
                marginTop: '0.6rem',
              }}
            >
              {current.comment}
            </p>
          )}
        </motion.div>
      </div>

      {/* Barre du bas : navigation */}
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          ← Précédent
        </button>
        <button
          disabled={index === items.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
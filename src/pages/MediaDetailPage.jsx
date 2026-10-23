import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMediaById, getAssetManifest, pickBestImage } from '../api/nasaApi';
import { formatDate } from '../utils/format';
import Loader from '../components/loader';
import ErrorState from '../components/errorState';
import { useFavorites } from '../context/FavoritesContext';

export default function MediaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const m = await getMediaById(id);
        if (cancelled) return;
        setMedia(m);

        let a = [];
        try {
          a = await getAssetManifest(id);
        } catch (assetErr) {
          console.warn("Erreur chargement assets:", assetErr);
          a = [];
        }
        
        if (Array.isArray(a)) {
          setAssets(a.filter(u => typeof u === 'string'));
        } else {
          setAssets([]);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Erreur de chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader label="Chargement du média…" />;
  
  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorState message={error} onRetry={() => navigate(0)} />
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/">← Retour à la galerie</Link>
        </p>
      </div>
    );
  }
  
  if (!media) return <ErrorState message="Média introuvable" />;

  let bestImage = media.thumbnail;
  try {
    const img = pickBestImage(assets, media.thumbnail);
    if (typeof img === 'string' && img.length > 0) bestImage = img;
  } catch (e) {
    console.warn("Erreur pickBestImage:", e);
  }

  const videoFile = media.mediaType === 'video'
    ? assets.find((u) => {
        const lower = u.toLowerCase();
        return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.endsWith('.m4v');
      }) || null
    : null;

  const audioFile = media.mediaType === 'audio'
    ? assets.find((u) => {
        const lower = u.toLowerCase();
        return lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.endsWith('.wav') || lower.endsWith('.ogg');
      }) || null
    : null;

  // ⚠️ CETTE LIGNE DOIT ÊTRE PRÉSENTE ⚠️
  const fav = isFavorite(media.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}
    >
      <Link to="/" style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
        ← Retour à la galerie
      </Link>

      <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', margin: '1rem 0 0.5rem' }}>
        {media.title}
      </h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
        {formatDate(media.date)} · Centre : {media.center || 'N/A'} · Type : {media.mediaType}
      </p>

      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: 'var(--glass)',
          marginBottom: '1.5rem',
        }}
      >
        {media.mediaType === 'image' && bestImage && (
          <img
            src={bestImage}
            alt={media.title}
            style={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain',
              display: 'block',
              background: '#000',
            }}
          />
        )}

        {media.mediaType === 'video' && videoFile && (
          <video
            key={videoFile}
            controls
            poster={media.thumbnail || undefined}
            style={{ width: '100%', display: 'block' }}
          >
            <source src={videoFile} type={videoFile.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        )}
        {media.mediaType === 'video' && !videoFile && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</p>
            <p>Aucune vidéo lisible pour ce média dans les archives de la NASA.</p>
          </div>
        )}

        {media.mediaType === 'audio' && audioFile && (
          <div style={{ padding: '2rem' }}>
            <audio key={audioFile} controls style={{ width: '100%' }}>
              <source src={audioFile} type="audio/mpeg" />
              Votre navigateur ne supporte pas l'audio.
            </audio>
          </div>
        )}
        {media.mediaType === 'audio' && !audioFile && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔊</p>
            <p>Aucun fichier audio disponible pour ce média.</p>
          </div>
        )}
      </div>

      <button
        onClick={() => toggleFavorite(media)}
        style={{ marginBottom: '1.5rem', borderColor: fav ? 'var(--pink)' : undefined }}
      >
        {fav ? '★ Retirer des favoris' : '☆ Ajouter aux favoris'}
      </button>

      <h2 style={{ marginBottom: '0.6rem', fontSize: '1.2rem' }}>Description</h2>
      <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: '1.5rem' }}>
        {media.description || 'Aucune description disponible.'}
      </p>

      {media.keywords && media.keywords.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '0.6rem', fontSize: '1.2rem' }}>Mots-clés</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {media.keywords.map((kw) => (
              <Link
                key={kw}
                to={`/?q=${encodeURIComponent(kw)}`}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 999,
                  background: 'rgba(0,240,255,0.08)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                }}
              >
                #{kw}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
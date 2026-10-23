import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MediaCard from '../components/Mediacard';
import Loader from '../components/loader';
import ErrorState from '../components/errorState';
import { useMediaSearch } from '../hooks/useMediaSearch';

export default function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const page = parseInt(params.get('page') || '1', 10);
  const mediaType = params.get('media_type') || '';
  const yearStart = params.get('year_start') || '';
  const yearEnd = params.get('year_end') || '';

  const { data, loading, error } = useMediaSearch({ query, page, mediaType, yearStart, yearEnd });

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const next = new URLSearchParams();
    ['q', 'media_type', 'year_start', 'year_end'].forEach((k) => {
      const v = form.get(k);
      if (v) next.set(k, v);
    });
    setParams(next);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '0.4rem' }}
      >
        Galerie de l'espace
      </motion.h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
        Explorez la photothèque de la NASA : images, vidéos et sons.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.6rem',
          marginBottom: '2rem',
        }}
      >
        <input name="q" defaultValue={query} placeholder="Rechercher (Apollo, Hubble, Mars…)" />
        <select name="media_type" defaultValue={mediaType}>
          <option value="">Tous types</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="audio">Sons</option>
        </select>
        <input name="year_start" defaultValue={yearStart} placeholder="Année début" type="number" min="1900" max="2030" />
        <input name="year_end" defaultValue={yearEnd} placeholder="Année fin" type="number" min="1900" max="2030" />
        <button type="submit">Rechercher</button>
      </form>

      {loading && <Loader label="Chargement des médias…" />}
      {error && <ErrorState message={error} onRetry={() => setParams(new URLSearchParams(params))} />}
      {!loading && !error && data.items.length === 0 && (
        <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '3rem' }}>
          Aucun résultat pour cette recherche.
        </p>
      )}

      {!loading && !error && data.items.length > 0 && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.2rem',
            }}
          >
            {data.items.map((m, i) => (
              <MediaCard key={m.id} media={m} index={i} />
            ))}
          </div>

          <div
            style={{
              marginTop: '2.5rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))}>
              ← Précédent
            </button>
            <span style={{ color: 'var(--text-dim)' }}>
              Page {page} · {data.totalHits.toLocaleString('fr-FR')} résultats
            </span>
            <button disabled={!data.hasNext} onClick={() => updateParam('page', String(page + 1))}>
              Suivant →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
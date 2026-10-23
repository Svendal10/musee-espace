import { useFavorites } from '../context/FavoritesContext';
import MediaCard from '../components/Mediacard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '1.5rem' }}>Mes favoris</h1>
      {favorites.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>
          Aucun favori pour l'instant. <Link to="/">Explorer la galerie</Link>.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
          {favorites.map((m, i) => <MediaCard key={m.id} media={m} index={i} />)}
        </div>
      )}
    </div>
  );
}
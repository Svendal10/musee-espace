import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--cyan)' }}>404</h1>
      <p style={{ margin: '1rem 0 2rem' }}>Cette page n'existe pas.</p>
      <Link to="/"><button>← Retour à la galerie</button></Link>
    </div>
  );
}
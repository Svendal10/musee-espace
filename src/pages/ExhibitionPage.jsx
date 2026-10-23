import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExhibitions } from '../context/ExhibitionsContext';

export default function ExhibitionsPage() {
  const { exhibitions, createExhibition, deleteExhibition } = useExhibitions();
  const [name, setName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    const finalName = name.trim() || 'Nouvelle exposition';
    createExhibition(finalName);
    setName('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '1.5rem' }}>Mes expositions</h1>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la nouvelle exposition" style={{ flex: 1, minWidth: 200 }} />
        <button type="submit">+ Créer</button>
      </form>

      {exhibitions.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>
          Aucune exposition pour l'instant. Créez-en une ci-dessus.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {exhibitions.map((ex) => (
            <div
              key={ex.id}
              style={{
                padding: '1.2rem',
                background: 'var(--glass)',
                border: '1px solid var(--border)',
                borderRadius: 14,
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>{ex.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {ex.items.length} média{ex.items.length > 1 ? 's' : ''}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={`/exhibitions/${ex.id}`}><button>Ouvrir</button></Link>
                <Link to={`/exhibitions/${ex.id}/visit`}><button>Visiter</button></Link>
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer « ${ex.name} » ?`)) deleteExhibition(ex.id);
                  }}
                  style={{ borderColor: 'var(--pink)' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
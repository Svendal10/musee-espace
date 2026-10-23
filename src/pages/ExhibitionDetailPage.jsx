import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExhibitions } from '../context/ExhibitionsContext';

export default function ExhibitionDetailPage() {
  const { id } = useParams();
  const {
    getExhibition,
    renameExhibition,
    updateDescription,
    updateItemComment,
    removeItem,
    reorderItems,
    encodeExhibition,
  } = useExhibitions();

  const exhibition = getExhibition(id);
  const [name, setName] = useState(exhibition?.name || '');
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (exhibition) setName(exhibition.name);
  }, [exhibition?.id]);

  if (!exhibition) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Exposition introuvable</h1>
        <Link to="/exhibitions">← Retour</Link>
      </div>
    );
  }

  const handleRename = () => {
    if (name.trim()) renameExhibition(id, name.trim());
  };

  const handleShare = () => {
    const encoded = encodeExhibition(exhibition);
    const url = `${window.location.origin}/exhibitions/shared/${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url).catch(() => {});
    alert('Lien copié dans le presse-papier !');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <Link to="/exhibitions" style={{ color: 'var(--text-dim)' }}>← Toutes les expositions</Link>

      <div style={{ display: 'flex', gap: '0.6rem', margin: '1rem 0 2rem', flexWrap: 'wrap' }}>
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1, fontSize: '1.2rem', minWidth: 200 }} />
        <button onClick={handleRename}>Renommer</button>
        <button onClick={handleShare}>Partager</button>
        <Link to={`/exhibitions/${id}/visit`}><button>▶ Visiter</button></Link>
      </div>

      {shareUrl && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem', wordBreak: 'break-all' }}>
          Lien : {shareUrl}
        </p>
      )}

      <h3 style={{ marginBottom: '0.5rem' }}>Texte de l'exposition</h3>
      <textarea
        value={exhibition.description}
        onChange={(e) => updateDescription(id, e.target.value)}
        placeholder="Rédigez la présentation de votre exposition…"
        style={{ width: '100%', minHeight: 120, resize: 'vertical', marginBottom: '2rem' }}
      />

      <h3 style={{ marginBottom: '1rem' }}>Médias ({exhibition.items.length})</h3>
      {exhibition.items.length === 0 && (
        <p style={{ color: 'var(--text-dim)' }}>
          Ajoutez des médias depuis la galerie avec le bouton ★ sur les cartes, puis revenez ici.
        </p>
      )}

      {exhibition.items.map((item, idx) => (
        <div
          key={item.id}
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--glass)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            marginBottom: '0.8rem',
            flexWrap: 'wrap',
          }}
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8, background: '#111' }}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <strong>{item.title}</strong>
            <textarea
              value={item.comment || ''}
              onChange={(e) => updateItemComment(id, item.id, e.target.value)}
              placeholder="Commentaire pour ce média…"
              style={{ width: '100%', minHeight: 60, marginTop: '0.5rem', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <button disabled={idx === 0} onClick={() => reorderItems(id, idx, idx - 1)}>↑</button>
            <button disabled={idx === exhibition.items.length - 1} onClick={() => reorderItems(id, idx, idx + 1)}>↓</button>
            <button onClick={() => removeItem(id, item.id)} style={{ borderColor: 'var(--pink)' }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
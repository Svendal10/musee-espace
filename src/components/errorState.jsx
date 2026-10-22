export default function ErrorState({ message, onRetry }) {
  return (
    <div
      style={{
        padding: '2rem',
        borderRadius: 12,
        border: '1px solid var(--pink)',
        background: 'rgba(255,43,214,0.06)',
        color: 'var(--text)',
        textAlign: 'center',
        margin: '1rem 0',
      }}
    >
      <p style={{ marginBottom: '1rem' }}>⚠️ {message}</p>
      {onRetry && <button onClick={onRetry}>Réessayer</button>}
    </div>
  );
}
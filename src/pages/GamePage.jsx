import { useEffect, useState } from 'react';
import { searchMedia } from '../api/nasaApi';
import { extractYear } from '../utils/format';
import Loader from '../components/loader';

export default function GamePage() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState(2000);
  const [score, setScore] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    searchMedia({ query: 'apollo', mediaType: 'image', page: 1 })
      .then((res) => {
        if (cancelled) return;
        const valid = res.items
          .map((m) => ({ ...m, year: extractYear(m.date) }))
          .filter((m) => m.year && m.thumbnail)
          .slice(0, 10);
        setImages(valid);
        if (valid[0]) setGuess(valid[0].year);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loader label="Préparation de la partie…" />;
  if (images.length === 0) return <p style={{ padding: '2rem' }}>Pas assez d'images pour le jeu.</p>;

  const current = images[index];

  const handleValidate = () => {
    const diff = Math.abs(guess - current.year);
    const points = Math.max(0, 100 - diff * 10);
    setScore((s) => s + points);
    setRoundResult({ actual: current.year, diff, points });
  };

  const handleNext = () => {
    if (index + 1 >= images.length) {
      setIndex(images.length);
      return;
    }
    setIndex((i) => i + 1);
    setGuess(images[index + 1].year);
    setRoundResult(null);
  };

  if (index >= images.length) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Partie terminée !</h1>
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Score : {score} / {images.length * 100}</p>
        <button onClick={() => { setIndex(0); setScore(0); setGuess(images[0].year); setRoundResult(null); }}>
          Rejouer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>En quelle année ?</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '1rem' }}>
        Image {index + 1} / {images.length} · Score : {score}
      </p>
      <img
        src={current.thumbnail}
        alt="À deviner"
        style={{ maxWidth: '100%', maxHeight: '50vh', objectFit: 'contain', borderRadius: 12, border: '1px solid var(--border)' }}
      />
      <div style={{ margin: '2rem 0' }}>
        <input
          type="range"
          min={1950}
          max={2025}
          value={guess}
          onChange={(e) => setGuess(parseInt(e.target.value, 10))}
          disabled={!!roundResult}
          style={{ width: '100%' }}
        />
        <p style={{ fontSize: '1.6rem', color: 'var(--cyan)', marginTop: '0.5rem' }}>{guess}</p>
      </div>
      {!roundResult ? (
        <button onClick={handleValidate}>Valider</button>
      ) : (
        <div>
          <p>Année réelle : <strong>{roundResult.actual}</strong> · Écart : {roundResult.diff} an(s) · +{roundResult.points} pts</p>
          <button onClick={handleNext} style={{ marginTop: '1rem' }}>Suivant</button>
        </div>
      )}
    </div>
  );
}
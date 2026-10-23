import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamePage from './GamePage';

// On "mocke" (simule) l'API NASA pour ne pas faire de vrais appels réseau
vi.mock('../api/nasaApi', () => ({
  searchMedia: vi.fn().mockResolvedValue({
    items: [
      { id: '1', title: 'Test', date: '1969-01-01', thumbnail: 'x.jpg', mediaType: 'image' },
    ],
    totalHits: 1,
    hasNext: false,
  }),
}));

describe('GamePage', () => {
  it('affiche le titre "En quelle année" après le chargement', async () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    // On attend que le texte apparaisse à l'écran
    expect(await screen.findByText(/En quelle année/i)).toBeInTheDocument();
  });
});
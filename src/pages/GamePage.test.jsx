import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamePage from './GamePage';

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
  it('affiche "En quelle année" après chargement', async () => {
    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/En quelle année/i)).toBeInTheDocument();
  });
});
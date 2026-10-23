import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MediaCard from './Mediacard';
import { FavoritesProvider } from '../context/FavoritesContext';

describe('MediaCard', () => {
  it('affiche le titre et l\'année', () => {
    const media = {
      id: '1',
      title: 'Apollo 11',
      date: '1969-07-20T00:00:00Z',
      mediaType: 'image',
      thumbnail: 'x.jpg',
    };
    render(
      <MemoryRouter>
        <FavoritesProvider>
          <MediaCard media={media} />
        </FavoritesProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Apollo 11')).toBeInTheDocument();
    expect(screen.getByText(/1969/)).toBeInTheDocument();
  });
});
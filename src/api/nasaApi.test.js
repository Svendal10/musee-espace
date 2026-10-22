import { describe, it, expect } from 'vitest';
import { transformItem, transformSearchResponse, pickBestImage, pickPlayable } from './nasaApi';

describe('transformItem', () => {
  it('transforme un item brut en objet simple', () => {
    const raw = {
      data: [{
        nasa_id: 'abc',
        title: 'Apollo 11',
        description: 'Mission',
        date_created: '1969-07-20T00:00:00Z',
        center: 'JSC',
        keywords: ['apollo'],
        media_type: 'image',
      }],
      links: [{ href: 'thumb.jpg', rel: 'preview', render: 'image' }],
    };
    const result = transformItem(raw);
    expect(result.id).toBe('abc');
    expect(result.title).toBe('Apollo 11');
    expect(result.thumbnail).toBe('thumb.jpg');
    expect(result.keywords).toEqual(['apollo']);
  });

  it('gère un item incomplet', () => {
    const result = transformItem({ data: [{}] });
    expect(result.title).toBe('Sans titre');
    expect(result.mediaType).toBe('image');
    expect(result.thumbnail).toBeNull();
  });
});

describe('transformSearchResponse', () => {
  it('retourne items, totalHits, hasNext', () => {
    const json = {
      collection: {
        items: [{ data: [{ nasa_id: '1', title: 'X', media_type: 'image' }] }],
        metadata: { total_hits: 42 },
        links: [{ rel: 'next', href: '...' }],
      },
    };
    const r = transformSearchResponse(json);
    expect(r.items).toHaveLength(1);
    expect(r.totalHits).toBe(42);
    expect(r.hasNext).toBe(true);
  });

  it('gère une réponse vide', () => {
    const r = transformSearchResponse({});
    expect(r.items).toEqual([]);
    expect(r.totalHits).toBe(0);
    expect(r.hasNext).toBe(false);
  });
});

describe('pickBestImage', () => {
  it('préfère ~large.jpg', () => {
    const assets = ['a~small.jpg', 'a~large.jpg', 'a~medium.jpg'];
    expect(pickBestImage(assets, 'thumb')).toBe('a~large.jpg');
  });
  it('retombe sur la vignette', () => {
    expect(pickBestImage([], 'thumb')).toBe('thumb');
  });
});

describe('pickPlayable', () => {
  it('préfère ~small.mp4 pour la vidéo', () => {
    const assets = ['v~orig.mp4', 'v~small.mp4', 'v~medium.mp4'];
    expect(pickPlayable(assets, 'video')).toBe('v~small.mp4');
  });
  it('trouve un mp3 pour l\'audio', () => {
    expect(pickPlayable(['a.mp3', 'b.wav'], 'audio')).toBe('a.mp3');
  });
  it('retourne null si rien', () => {
    expect(pickPlayable([], 'audio')).toBeNull();
  });
});
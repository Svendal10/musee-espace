const BASE_URL = 'https://images-api.nasa.gov';

export function transformItem(item) {
  const data = item.data?.[0] || {};
  const previewLink = item.links?.find((link) => link.rel === 'preview');
  return {
    id: data.nasa_id,
    title: data.title || 'Sans titre',
    description: data.description || '',
    date: data.date_created || null,
    center: data.center || null,
    keywords: data.keywords || [],
    mediaType: data.media_type || 'image',
    thumbnail: previewLink ? previewLink.href : null,
  };
}

export function transformSearchResponse(json) {
  const collection = json.collection || {};
  const items = (collection.items || []).map(transformItem);
  const totalHits = collection.metadata?.total_hits || 0;
  const hasNext = (collection.links || []).some((l) => l.rel === 'next');
  return { items, totalHits, hasNext };
}

export async function searchMedia({ query, page = 1, mediaType, yearStart, yearEnd }) {
  const params = new URLSearchParams();
  const hasQuery = query && query.trim();
  const hasFilter = mediaType || yearStart || yearEnd;

  if (hasQuery) params.append('q', query.trim());
  if (mediaType) params.append('media_type', mediaType);
  if (yearStart) params.append('year_start', yearStart);
  if (yearEnd) params.append('year_end', yearEnd);
  params.append('page', String(page));

  if (!hasQuery && !hasFilter) {
    params.append('q', 'space');
  }

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
  if (!response.ok) throw new Error(`Erreur API (${response.status})`);
  const json = await response.json();
  return transformSearchResponse(json);
}

export async function getMediaById(nasaId) {
  const response = await fetch(`${BASE_URL}/search?nasa_id=${encodeURIComponent(nasaId)}`);
  if (!response.ok) throw new Error(`Erreur API (${response.status})`);
  const json = await response.json();
  const items = json.collection?.items || [];
  if (!items.length) throw new Error('Média introuvable');
  return transformItem(items[0]);
}

export async function getAssetManifest(nasaId) {
  const response = await fetch(`${BASE_URL}/asset/${encodeURIComponent(nasaId)}`);
  if (!response.ok) throw new Error('Impossible de récupérer les fichiers');
  const files = await response.json();
  return files.map((url) =>
    url.startsWith('http://') ? url.replace('http://', 'https://') : url
  );
}

export function pickBestImage(assets, fallbackThumb) {
  if (!assets || !assets.length) return fallbackThumb;
  const priorities = ['~large.jpg', '~medium.jpg', '~orig.jpg', '~small.jpg'];
  for (const suffix of priorities) {
    const found = assets.find((url) => url.includes(suffix));
    if (found) return found;
  }
  const anyJpg = assets.find((url) => /\.(jpg|jpeg|png)$/i.test(url));
  return anyJpg || fallbackThumb;
}

export function pickPlayable(assets, kind) {
  if (!assets || !assets.length) return null;
  if (kind === 'video') {
    return (
      assets.find((u) => u.includes('~small.mp4')) ||
      assets.find((u) => u.includes('~medium.mp4')) ||
      assets.find((u) => u.endsWith('.mp4'))
    );
  }
  if (kind === 'audio') {
    return (
      assets.find((u) => u.endsWith('.mp3')) ||
      assets.find((u) => u.endsWith('.m4a')) ||
      assets.find((u) => u.endsWith('.wav'))
    );
  }
  return null;
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FuturisticBackground from './components/FuturisticBackground';
import NavBar from './components/NavBar';
import GalleryPage from './pages/GalleryPage';
import MediaDetailPage from './pages/MediaDetailPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import ExhibitionDetailPage from './pages/ExhibitionDetailPage';
import SharedExhibitionPage from './pages/SharedExhibitionPage';
import VisitPage from './pages/VisitPage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotfoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <FuturisticBackground />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Routes>
          
          <Route path="/exhibitions/:id/visit" element={<VisitPage />} />
          <Route
            path="*"
            element={
              <>
                <NavBar />
                <Routes>
                  <Route path="/" element={<GalleryPage />} />
                  <Route path="/media/:id" element={<MediaDetailPage />} />
                  <Route path="/rooms" element={<RoomsPage />} />
                  <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/exhibitions" element={<ExhibitionsPage />} />
                  <Route path="/exhibitions/shared/:encoded" element={<SharedExhibitionPage />} />
                  <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
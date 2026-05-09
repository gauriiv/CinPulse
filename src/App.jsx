import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Greeting from './components/Greeting';
import { AuthContext } from './contexts/AuthContext';
import { NotificationContext } from './contexts/NotificationContext';
import styles from './styles';

const TREND_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'hollywood', label: 'Hollywood' },
  { key: 'bollywood', label: 'Bollywood' },
  { key: 'korean', label: 'Korean' },
  { key: 'anime', label: 'Anime' },
];

const GENRE_FILTERS = [
  { key: 'all', label: 'All', tmdbId: null },
  { key: 'action', label: 'Action', tmdbId: 28 },
  { key: 'comedy', label: 'Comedy', tmdbId: 35 },
  { key: 'drama', label: 'Drama', tmdbId: 18 },
  { key: 'thriller', label: 'Thriller', tmdbId: 53 },
  { key: 'romance', label: 'Romance', tmdbId: 10749 },
  { key: 'scifi', label: 'Sci-Fi', tmdbId: 878 },
];

const MISSING_API_KEY_MESSAGE = 'Missing TMDB API key. Add VITE_API_KEY in .env and restart dev server.';

const getTrendingEndpoint = (apiKey, trendFilter, genreFilter = 'all', page = 1) => {
  if (trendFilter === 'all' && genreFilter === 'all') {
    return `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`;
  }

  const discoverParams = ['include_adult=false', 'sort_by=popularity.desc', `page=${page}`];

  if (trendFilter === 'hollywood') {
    discoverParams.push('with_original_language=en', 'with_origin_country=US');
  }

  if (trendFilter === 'bollywood') {
    discoverParams.push('with_original_language=hi', 'with_origin_country=IN');
  }

  if (trendFilter === 'korean') {
    discoverParams.push('with_original_language=ko', 'with_origin_country=KR');
  }

  if (trendFilter === 'anime') {
    discoverParams.push('with_original_language=ja', 'with_origin_country=JP');
  }

  if (genreFilter !== 'all') {
    const selectedGenre = GENRE_FILTERS.find((genre) => genre.key === genreFilter);
    if (selectedGenre?.tmdbId) {
      discoverParams.push(`with_genres=${selectedGenre.tmdbId}`);
    }
  }

  return `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${discoverParams.join('&')}`;
};

const App = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [view, setView] = useState('trending');
  const [loading, setLoading] = useState(false);
  const [loadingMoreTrending, setLoadingMoreTrending] = useState(false);
  const [movieError, setMovieError] = useState('');
  const [trendFilter, setTrendFilter] = useState('all');
  const [trendingPage, setTrendingPage] = useState(1);
  const [hasMoreTrending, setHasMoreTrending] = useState(true);
  const [genreFilter, setGenreFilter] = useState('all');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'signin' });
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [showGreeting, setShowGreeting] = useState(true);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const API_KEY = import.meta.env.VITE_API_KEY?.trim();
  const fetchMovies = useCallback(async (
    query,
    filter = 'all',
    selectedGenre = 'all',
    options = {},
  ) => {
    const { page = 1, append = false } = options;
    const isTrendingRequest = !query;
    const isLoadMoreRequest = isTrendingRequest && append;

    if (isLoadMoreRequest) {
      setLoadingMoreTrending(true);
    } else {
      setLoading(true);
    }

    if (!API_KEY) {
      if (!append) {
        setMovies([]);
        setMovieError(MISSING_API_KEY_MESSAGE);
      }
      if (isTrendingRequest) {
        setHasMoreTrending(false);
      }
      if (isLoadMoreRequest) {
        setLoadingMoreTrending(false);
      } else {
        setLoading(false);
      }
      return;
    }

    const endpoint = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
      : getTrendingEndpoint(API_KEY, filter, selectedGenre, page);

    try {
      const res = await fetch(endpoint);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.status_message || 'Could not load movies.');
      }

      const results = data.results || [];

      if (isTrendingRequest) {
        const nextPage = data.page || page;
        const totalPages = data.total_pages || 1;

        setTrendingPage(nextPage);
        setHasMoreTrending(nextPage < totalPages);
        setMovies((prevMovies) => (append ? [...prevMovies, ...results] : results));
      } else {
        setMovies(results);
      }

      setMovieError('');
    } catch (error) {
      if (!append) {
        setMovies([]);
      }
      setMovieError(error instanceof Error ? error.message : 'Could not load movies.');
    } finally {
      if (isLoadMoreRequest) {
        setLoadingMoreTrending(false);
      } else {
        setLoading(false);
      }
    }
  }, [API_KEY]);

  const loadMoreTrending = useCallback(() => {
    if (view !== 'trending' || loading || loadingMoreTrending || !hasMoreTrending) {
      return;
    }

    fetchMovies('', trendFilter, genreFilter, {
      page: trendingPage + 1,
      append: true,
    });
  }, [
    fetchMovies,
    genreFilter,
    hasMoreTrending,
    loading,
    loadingMoreTrending,
    trendFilter,
    trendingPage,
    view,
  ]);

  useEffect(() => {
    if (view === 'trending') {
      fetchMovies('', trendFilter, genreFilter);
    }
  }, [fetchMovies, view, trendFilter, genreFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (view === 'search' && searchQuery) {
        fetchMovies(searchQuery, trendFilter, genreFilter);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, fetchMovies, view, trendFilter, genreFilter]);

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const shouldShowFooter = !location.pathname.startsWith('/movie/');

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NotificationContext.Provider
        value={{
          message: notification,
          clear: () => setNotification(''),
          notify,
        }}
      >
        {showGreeting && <Greeting />}
        <Routes>
          <Route
            path="/"
            element={(
              <MovieList
                view={view}
                setView={setView}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                movies={movies}
                loading={loading}
                movieError={movieError}
                fetchMovies={fetchMovies}
                onLoadMoreTrending={loadMoreTrending}
                hasMoreTrending={hasMoreTrending}
                loadingMoreTrending={loadingMoreTrending}
                trendFilter={trendFilter}
                setTrendFilter={setTrendFilter}
                trendFilters={TREND_FILTERS}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
                genreFilters={GENRE_FILTERS}
                openAuth={(mode) => setAuthModal({ open: true, mode })}
                user={user}
              />
            )}
          />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
        <AuthModal
          open={authModal.open}
          mode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, open: false })}
          onAuth={(signedUser) => setUser(signedUser)}
        />
        <Toast />
        {shouldShowFooter && (
          <footer style={styles.footer}>
            <div style={styles.footerInner}>
              <p style={styles.footerTitle}>CinPulse</p>
              <p style={styles.footerText}>Made with ❤️ for movie lovers.</p>
              <p style={styles.footerText}>
                Movie data powered by{' '}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.footerLink}
                >
                  TMDb
                </a>
              </p>
            </div>
          </footer>
        )}
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;

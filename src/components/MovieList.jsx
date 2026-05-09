import React from 'react';
import MovieCard from './MovieCard';
import styles from '../styles';

const MOBILE_BREAKPOINT = 640;

const MovieList = ({
  view,
  setView,
  searchQuery,
  setSearchQuery,
  movies,
  loading,
  movieError,
  fetchMovies,
  onLoadMoreTrending,
  hasMoreTrending,
  loadingMoreTrending,
  trendFilter,
  setTrendFilter,
  trendFilters,
  genreFilter,
  setGenreFilter,
  genreFilters,
  openAuth,
  user,
}) => {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT,
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.container}>
      <header style={{ ...styles.navbar, ...(isMobile ? styles.navbarMobile : {}) }}>
        <div style={styles.navBrand}>
          <span style={styles.navLogo} aria-label="CinPulse logo">🎬</span>
          <div>
            <div style={styles.navBrandTitleRow}>
              <p style={styles.navBrandTitle}>
                <span style={styles.navBrandTitleCin}>Cin</span>
                <span style={styles.navBrandTitlePulse}>Pulse</span>
              </p>
            </div>
            {!isMobile && <p style={styles.navBrandSub}>Feel the pulse of cinema</p>}
          </div>
        </div>

        <div style={{ ...styles.navControlRow, ...(isMobile ? styles.navControlRowMobile : {}) }}>
          <nav style={{ ...styles.nav, ...(isMobile ? styles.navMobile : {}) }}>
            <button
              onClick={() => {
                setView('trending');
                setSearchQuery('');
                if (view === 'trending') {
                  fetchMovies('', trendFilter, genreFilter);
                }
              }}
              style={{
                ...styles.button,
                ...(isMobile ? styles.buttonMobile : {}),
                ...(view === 'trending' ? styles.activeButton : {}),
              }}
            >
              Trending
            </button>
            <button
              onClick={() => {
                setView('search');
                setSearchQuery('');
              }}
              style={{
                ...styles.button,
                ...(isMobile ? styles.buttonMobile : {}),
                ...(view === 'search' ? styles.activeButton : {}),
              }}
            >
              Search
            </button>
          </nav>

          <div style={{ ...styles.authGroup, ...(isMobile ? styles.authGroupMobile : {}) }}>
            {user ? (
              <span style={styles.userBox}>👤 {user.email.split('@')[0]}</span>
            ) : (
              <>
                <button
                  style={{ ...styles.button, ...styles.authButton, ...(isMobile ? styles.buttonMobile : {}) }}
                  onClick={() => openAuth('signin')}
                >
                  Sign In
                </button>
                <button
                  style={{ ...styles.button, ...styles.authButton, ...(isMobile ? styles.buttonMobile : {}) }}
                  onClick={() => openAuth('signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <section style={{ ...styles.hero, ...(isMobile ? styles.heroMobile : {}) }}>
        <span style={{ ...styles.heroBadge, ...(isMobile ? styles.heroBadgeMobile : {}) }}>
          <span>Now streaming your next favorite</span>
          <span style={styles.heroBadgeDot} aria-hidden="true" />
        </span>
        <h1 style={{ ...styles.title, ...(isMobile ? styles.titleMobile : {}) }}>Discover movies you will love.</h1>
      </section>

      {view === 'trending' && (
        <section style={{ ...styles.filterSection, ...(isMobile ? styles.filterSectionMobile : {}) }}>
          <div style={{ ...styles.filterHeaderRow, ...(isMobile ? styles.filterHeaderRowMobile : {}) }}>
            <p style={styles.filterTitle}>Filters</p>
          </div>
          <div style={{ ...styles.filterControls, ...(isMobile ? styles.filterControlsMobile : {}) }}>
            <label style={{ ...styles.filterSelectGroup, ...(isMobile ? styles.filterSelectGroupMobile : {}) }}>
              <span style={{ ...styles.filterLabel, ...(isMobile ? styles.filterLabelMobile : {}) }}>Region</span>
              <select
                value={trendFilter}
                onChange={(e) => setTrendFilter(e.target.value)}
                style={{ ...styles.filterSelect, ...(isMobile ? styles.filterSelectMobile : {}) }}
              >
                {trendFilters.map((filter) => (
                  <option key={filter.key} value={filter.key} style={styles.filterOption}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ ...styles.filterSelectGroup, ...(isMobile ? styles.filterSelectGroupMobile : {}) }}>
              <span style={{ ...styles.filterLabel, ...(isMobile ? styles.filterLabelMobile : {}) }}>Genre</span>
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                style={{ ...styles.filterSelect, ...(isMobile ? styles.filterSelectMobile : {}) }}
              >
                {genreFilters.map((filter) => (
                  <option key={filter.key} value={filter.key} style={styles.filterOption}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      )}

      {view === 'search' && (
        <input
          style={{ ...styles.input, ...(isMobile ? styles.inputMobile : {}) }}
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
      )}

      <div style={styles.content}>
        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : (
          <>
            <div style={isMobile ? styles.gridMobile : styles.grid}>
              {movieError ? (
                <p style={{ ...styles.noMovies, color: '#fecaca', maxWidth: 640 }}>{movieError}</p>
              ) : movies.length ? (
                movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    compact={isMobile}
                    onClick={() => window.location.assign(`/movie/${movie.id}`)}
                  />
                ))
              ) : (
                <p style={styles.noMovies}>No movies found.</p>
              )}
            </div>

            {view === 'trending' && movies.length > 0 && (
              <div style={styles.loadMoreSection}>
                {hasMoreTrending ? (
                  <button
                    type="button"
                    onClick={onLoadMoreTrending}
                    disabled={loadingMoreTrending}
                    style={{
                      ...styles.button,
                      ...styles.loadMoreButton,
                      ...(isMobile ? styles.buttonMobile : {}),
                      ...(loadingMoreTrending ? styles.loadMoreButtonDisabled : {}),
                    }}
                  >
                    {loadingMoreTrending ? 'Loading more...' : 'Load more trending movies'}
                  </button>
                ) : (
                  <p style={styles.loadMoreDone}>No more trending movies.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovieList;

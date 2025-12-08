// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovies, URLS } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./HomePage.css";

export default function HomePage() {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlistVersion, setWishlistVersion] = useState(0);

    const wishlist = new WishlistManager();

    // 첫 렌더 시 4개의 TMDB API 호출
    useEffect(() => {
        async function load() {
            try {
                await new Promise((res) => setTimeout(res, 1000)); // 로딩 확인용 딜레이

                const [popularData, nowData, topData, upcomingData] =
                    await Promise.all([
                        fetchMovies(URLS.popular()),
                        fetchMovies(URLS.nowPlaying()),
                        fetchMovies(URLS.topRated()),
                        fetchMovies(URLS.upcoming()),
                    ]);

                setPopular(popularData);
                setNowPlaying(nowData);
                setTopRated(topData);
                setUpcoming(upcomingData);
            } catch (e) {
                console.error("영화 불러오기 실패:", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // 공통 카드 렌더링 함수 (상세페이지 Link + 찜 토글)
    const renderMovieGrid = (movies: Movie[]) => (
        <div className="movie-grid">
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className={`movie-card ${
                        wishlist.isWishlisted(movie.id) ? "wish" : ""
                    }`}
                    onClick={() => {
                        // 카드 빈 곳 클릭 → 찜 토글
                        wishlist.toggleWishlist(movie);
                        setWishlistVersion((v) => v + 1);
                    }}
                >
                    <Link
                        to={`/movie/${movie.id}`}
                        className="movie-link"
                        onClick={(e) => e.stopPropagation()} // 링크 클릭 시 찜 토글 막기
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <h3 className="movie-title">{movie.title}</h3>
                    </Link>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return <div className="home-loading">Loading...</div>;
    }

    return (
        <div className="home-page" data-wishlist-version={wishlistVersion}>
            {/* 🎬 넷플릭스 스타일 주토피아 2 배너 */}
            <section className="hero">
                <div className="hero-video-wrapper">
                    <iframe
                        className="hero-video"
                        src="https://www.youtube.com/embed/H9boDm0J67w?autoplay=1&mute=1&loop=1&playlist=H9boDm0J67w&controls=0&rel=0"
                        title="주토피아 2 예고편"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <div className="hero-overlay" />
                </div>

                <div className="hero-content">
                    <div className="hero-badge">새로운 극장 애니메이션</div>
                    <h1 className="hero-title">주토피아 2</h1>
                    <p className="hero-description">
                        주디와 닉이 다시 돌아왔다! 대도시 주토피아에서 펼쳐지는 초특급
                        버디 액션 어드벤처.
                    </p>

                    <div className="hero-buttons">
                        <button className="hero-btn hero-btn-primary">▶ 재생</button>
                        <button className="hero-btn hero-btn-secondary">
                            ℹ 자세히 보기
                        </button>
                    </div>
                </div>
            </section>

            {/* 기존 섹션 */}
            <main className="home-main">
                <h2 className="section-title">🔥 인기 영화</h2>
                {renderMovieGrid(popular)}

                <h2 className="section-title">🎬 현재 상영작</h2>
                {renderMovieGrid(nowPlaying)}

                <h2 className="section-title">⭐ 평점 높은 영화</h2>
                {renderMovieGrid(topRated)}

                <h2 className="section-title">🗓️ 개봉 예정작</h2>
                {renderMovieGrid(upcoming)}
            </main>
        </div>
    );
}

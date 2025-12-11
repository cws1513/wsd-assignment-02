// src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { fetchMovies, URLS } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";

import "swiper/css";
import "swiper/css/navigation";

import "./HomePage.css";

export default function HomePage() {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [upcoming, setUpcoming] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlistVersion, setWishlistVersion] = useState(0);

    const wishlist = new WishlistManager();

    // TMDB 데이터 4종 불러오기
    useEffect(() => {
        async function load() {
            try {
                await new Promise((res) => setTimeout(res, 1000));

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

        void load();
    }, []);

    // ✅ 넷플릭스 스타일 슬라이드 렌더링 함수
    const renderMovieRow = (label: string, movies: Movie[]) => (
        <section className="movie-row" key={label}>
            <div className="movie-row-header">
                <h2 className="section-title">{label}</h2>
            </div>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={10}
                slidesPerView={6}
                slidesPerGroup={6}
                breakpoints={{
                    0: { slidesPerView: 3.2, slidesPerGroup: 3, spaceBetween: 8 },
                    600: { slidesPerView: 4.2, slidesPerGroup: 4, spaceBetween: 10 },
                    1024: { slidesPerView: 6, slidesPerGroup: 6, spaceBetween: 12 },
                }}
                className="movie-swiper"
            >
                {movies.map((movie) => {
                    const isWish = wishlist.isWishlisted(movie.id);

                    return (
                        <SwiperSlide key={movie.id}>
                            <div
                                className={`movie-card ${isWish ? "wish" : ""}`}
                                data-movie-id={movie.id}
                            >
                                <div className="movie-thumb-wrapper">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="movie-thumb"
                                    />

                                    {/* hover 시 나타나는 오버레이 */}
                                    <div className="movie-card-overlay">
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="overlay-btn primary"
                                        >
                                            상세 보기
                                        </Link>

                                        <button
                                            className="overlay-btn secondary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                wishlist.toggleWishlist(movie);
                                                setWishlistVersion((v) => v + 1);
                                            }}
                                        >
                                            {isWish ? "찜 해제" : "찜하기"}
                                        </button>
                                    </div>
                                </div>

                                <h3 className="movie-title">{movie.title}</h3>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </section>
    );

    if (loading) {
        return <div className="home-loading">Loading...</div>;
    }

    return (
        <div
            className="home-page page-transition"
            data-wishlist-version={wishlistVersion}
        >
            {/* 🎬 넷플릭스 스타일 히어로 배너 */}
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

            {/* 🎞 아래 섹션들 – 전부 슬라이드 형태 */}
            <main className="home-main">
                {renderMovieRow("🔥 인기 영화", popular)}
                {renderMovieRow("🎬 현재 상영작", nowPlaying)}
                {renderMovieRow("⭐ 평점 높은 영화", topRated)}
                {renderMovieRow("🗓️ 개봉 예정작", upcoming)}
            </main>
        </div>
    );
}

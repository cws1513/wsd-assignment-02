import { useEffect, useState } from "react";
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
    const [wishlistVersion, setWishlistVersion] = useState(0); // 찜 변경 시 강제 리렌더용

    // 위시리스트 매니저 인스턴스
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

    // 공통 카드 렌더링 함수
    const renderMovieGrid = (movies: Movie[]) => (
        <div className="movie-grid">
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className={`movie-card ${
                        wishlist.isWishlisted(movie.id) ? "wish" : ""
                    }`}
                    onClick={() => {
                        wishlist.toggleWishlist(movie);
                        // 찜 상태 변경 시 전체 섹션을 다시 그리기 위해 버전 증가
                        setWishlistVersion((v) => v + 1);
                    }}
                >
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                    <h3 className="movie-title">{movie.title}</h3>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return <div className="home-loading">Loading...</div>;
    }

    return (
        <div className="home-container" data-wishlist-version={wishlistVersion}>
            {/* 1. 인기 영화 */}
            <h1 className="section-title">🔥 인기 영화</h1>
            {renderMovieGrid(popular)}

            {/* 2. 현재 상영작 */}
            <h2 className="section-title">🎬 현재 상영작</h2>
            {renderMovieGrid(nowPlaying)}

            {/* 3. 평점 높은 영화 */}
            <h2 className="section-title">⭐ 평점 높은 영화</h2>
            {renderMovieGrid(topRated)}

            {/* 4. 개봉 예정작 */}
            <h2 className="section-title">🗓️ 개봉 예정작</h2>
            {renderMovieGrid(upcoming)}
        </div>
    );
}

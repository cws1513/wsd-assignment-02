import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./MovieDetailPage.css";

interface MovieDetail {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    genres: { id: number; name: string }[];
}

export default function MovieDetailPage() {
    const { id } = useParams();
    const wishlist = new WishlistManager();

    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = localStorage.getItem("TMDb-Key");

    useEffect(() => {
        async function load() {
            setLoading(true);

            const detailURL = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ko-KR`;
            const recommendURL = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=ko-KR`;

            try {
                const [detailRes, recRes] = await Promise.all([
                    axios.get(detailURL),
                    axios.get(recommendURL),
                ]);

                setMovie(detailRes.data);
                setRecommendations(recRes.data.results);
            } catch (e) {
                console.error("영화 상세 로드 실패:", e);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id]);

    if (loading || !movie) {
        return <div className="detail-loading">Loading...</div>;
    }

    const isWishlisted = wishlist.isWishlisted(movie.id);

    return (
        <div className="detail-container">

            {/* 🔥 넷플릭스식 배너 */}
            <div
                className="detail-banner"
                style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                }}
            >
                <div className="banner-overlay">

                    {/* 왼쪽 정보 영역 */}
                    <div className="banner-info">
                        <h1 className="banner-title">{movie.title}</h1>
                        <p className="banner-overview">{movie.overview}</p>

                        <div className="banner-meta">
                            <span>⭐ {movie.vote_average}</span>
                            <span>📅 {movie.release_date}</span>
                            <span>
                                🎭 {movie.genres.map((g) => g.name).join(", ")}
                            </span>
                        </div>

                        <button
                            className="wish-btn"
                            onClick={() => alert("이 버튼은 UI만 구현됩니다.")}
                        >
                            ▶ 재생
                        </button>
                        <button
                            className={`wish-toggle-btn ${isWishlisted ? "active" : ""}`}
                            onClick={() => {
                                wishlist.toggleWishlist(movie as any);
                                alert(
                                    isWishlisted
                                        ? "위시리스트에서 제거됨"
                                        : "위시리스트에 추가됨"
                                );
                            }}
                        >
                            {isWishlisted ? "❤️ 찜됨" : "🤍 찜하기"}
                        </button>
                    </div>

                    {/* 오른쪽 포스터 */}
                    <div className="banner-poster">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                    </div>
                </div>
            </div>

            {/* 🔽 추천 영화 */}
            <h2 className="recommend-title">비슷한 콘텐츠</h2>
            <div className="recommend-grid">
                {recommendations.map((m) => (
                    <div key={m.id} className="recommend-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                            alt={m.title}
                        />
                        <p>{m.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

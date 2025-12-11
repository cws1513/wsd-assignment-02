// src/pages/WishlistPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistManager, type Movie } from "../libs/useWishlist";
import "./WishlistPage.css";

export default function WishlistPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const wishlist = new WishlistManager();
    const navigate = useNavigate();

    // 첫 렌더 시 localStorage에서 위시리스트 로드
    useEffect(() => {
        setMovies(wishlist.getWishlist());
    }, []);

    const handleRemove = (movie: Movie) => {
        wishlist.toggleWishlist(movie); // 로컬스토리지에서 제거
        // 화면에서도 즉시 제거
        setMovies((prev) => prev.filter((m) => m.id !== movie.id));
    };

    return (
        <div className="wishlist-page page-transition">
            <h1 className="wishlist-title">💖 내가 찜한 리스트</h1>

            {movies.length === 0 && (
                <div className="wishlist-empty">
                    아직 찜한 영화가 없어요.
                    <br />
                    홈이나 대세 콘텐츠 페이지에서 영화를 클릭해서 추가해보세요!
                </div>
            )}

            {movies.length > 0 && (
                <div className="wishlist-grid">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            className="wishlist-card"
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <div className="wishlist-card-info">
                                <h3>{movie.title}</h3>
                                <span className="wishlist-sub">
                                    클릭 시 상세 페이지로 이동
                                </span>
                            </div>

                            {/* 🔥 위시리스트에서 바로 제거 버튼 */}
                            <button
                                type="button"
                                className="wishlist-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // 상세페이지 이동 막기
                                    handleRemove(movie);
                                }}
                            >
                                찜 해제
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

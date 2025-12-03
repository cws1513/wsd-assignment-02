import { useEffect, useState } from "react";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./WishlistPage.css";

export default function WishlistPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [manager] = useState(() => new WishlistManager());

    useEffect(() => {
        // 첫 로드 시 로컬스토리지에서 찜 목록 불러오기
        setMovies(manager.getWishlist());
    }, [manager]);

    const handleToggle = (movie: Movie) => {
        manager.toggleWishlist(movie);
        setMovies([...manager.getWishlist()]);
    };

    if (movies.length === 0) {
        return (
            <div className="wishlist-container">
                <h1 className="section-title">내가 찜한 리스트</h1>
                <p className="wishlist-empty">찜한 영화가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <h1 className="section-title">내가 찜한 리스트</h1>

            <div className="movie-grid">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className="movie-card wish"
                        onClick={() => handleToggle(movie)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="movie-info">
                            <h3 className="movie-title">{movie.title}</h3>
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(movie);
                                }}
                            >
                                찜 해제
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

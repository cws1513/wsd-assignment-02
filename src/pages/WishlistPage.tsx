import { useEffect, useState } from "react";
import { WishlistManager, type Movie } from "../libs/useWishlist";
import "./WishlistPage.css";

export default function WishlistPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const wishlist = new WishlistManager();


    // 첫 렌더 시 localStorage에서 위시리스트 로드
    useEffect(() => {
        setMovies(wishlist.getWishlist());
    }, []);

    const handleToggle = (movie: Movie) => {
        wishlist.toggleWishlist(movie);
        // 로컬스토리지 변경 반영 위해 다시 로드
        setMovies(wishlist.getWishlist());
    };

    return (
        <div className="wishlist-container">
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
                            onClick={() => handleToggle(movie)}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <div className="wishlist-card-info">
                                <h3>{movie.title}</h3>
                                <span className="wishlist-remove">클릭하면 찜 취소</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

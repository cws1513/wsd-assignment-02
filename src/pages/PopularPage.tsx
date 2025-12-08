// src/pages/PopularPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMovies, URLS } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./PopularPage.css";

export default function PopularPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [viewType, setViewType] = useState<"table" | "infinite">("table");

    const wishlist = new WishlistManager();

    // 페이지/뷰 타입 변경 시 TMDB에서 인기 영화 가져오기
    useEffect(() => {
        let cancelled = false;

        async function fetchPage() {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 1000));
                const data = await fetchMovies(URLS.popular(page));

                setMovies((prev) =>
                    viewType === "table" || page === 1 ? data : [...prev, ...data]
                );
            } catch (e) {
                console.error("인기 영화 불러오기 실패:", e);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchPage();

        return () => {
            cancelled = true;
        };
    }, [page, viewType]);

    // Infinite scroll
    useEffect(() => {
        if (viewType !== "infinite") return;

        function handleScroll() {
            if (loading) return;

            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;

            if (nearBottom) {
                setPage((prev) => prev + 1);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [viewType, loading]);

    const handleToggleWishlist = (movie: Movie) => {
        wishlist.toggleWishlist(movie);
        setMovies([...movies]);
    };

    const switchToTable = () => {
        setViewType("table");
        setPage(1);
    };

    const switchToInfinite = () => {
        setMovies([]);
        setPage(1);
        setViewType("infinite");
    };

    return (
        <div className="popular-container">
            <h1 className="popular-title">📈 대세 콘텐츠</h1>

            {/* View 선택 버튼 */}
            <div className="popular-view-selector">
                <button
                    className={viewType === "table" ? "active" : ""}
                    onClick={switchToTable}
                >
                    Table View
                </button>
                <button
                    className={viewType === "infinite" ? "active" : ""}
                    onClick={switchToInfinite}
                >
                    Infinite Scroll
                </button>
            </div>

            {loading && page === 1 && (
                <div className="popular-loading">Loading...</div>
            )}

            <div className={`popular-grid ${viewType}`}>
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className={`popular-card ${
                            wishlist.isWishlisted(movie.id) ? "wish" : ""
                        }`}
                        onClick={() => handleToggleWishlist(movie)}
                    >
                        <Link
                            to={`/movie/${movie.id}`}
                            className="popular-card-link"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <h3 className="popular-card-title">{movie.title}</h3>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Table View용 페이지네이션 */}
            {viewType === "table" && (
                <div className="popular-pagination">
                    <button
                        disabled={page === 1 || loading}
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    >
                        이전
                    </button>
                    <span className="page-number">{page}</span>
                    <button disabled={loading} onClick={() => setPage((prev) => prev + 1)}>
                        다음
                    </button>
                </div>
            )}

            {/* Infinite 모드에서 추가 로딩 표시 */}
            {viewType === "infinite" && loading && page > 1 && (
                <div className="popular-loading more">더 불러오는 중...</div>
            )}
        </div>
    );
}

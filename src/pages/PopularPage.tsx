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
    const [showTopButton, setShowTopButton] = useState(false);

    const wishlist = new WishlistManager();

    // ✅ 페이지 / 뷰 타입 변경 시 데이터 로드
    useEffect(() => {
        let cancelled = false;

        async function fetchPage() {
            setLoading(true);
            try {
                // 살짝 딜레이 주어 로딩 감지
                await new Promise((res) => setTimeout(res, 1000));
                const data = await fetchMovies(URLS.popular(page));

                setMovies((prev) =>
                    viewType === "table" || page === 1 ? data : [...prev, ...data]
                );
            } catch (e) {
                console.error("인기 영화 불러오기 실패:", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchPage();
        return () => {
            cancelled = true;
        };
    }, [page, viewType]);

    // ✅ Infinite Scroll + Top 버튼
    useEffect(() => {
        if (viewType !== "infinite") {
            setShowTopButton(false);
            return;
        }

        function handleScroll() {
            if (loading) return;

            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;

            if (nearBottom) {
                setPage((prev) => prev + 1);
            }

            setShowTopButton(window.scrollY > 400);
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [viewType, loading]);

    const handleToggleWishlist = (movie: Movie) => {
        wishlist.toggleWishlist(movie);
        // 🔄 로컬 state 강제 갱신 → 찜 테두리/버튼 즉시 반영
        setMovies((prev) => [...prev]);
    };

    const handleTopClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className="popular-container page-transition">
                <h1 className="popular-title">📈 대세 콘텐츠</h1>

                {/* View 선택 */}
                <div className="popular-view-selector">
                    <button
                        className={viewType === "table" ? "active" : ""}
                        onClick={() => {
                            setViewType("table");
                            setPage(1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        Table View
                    </button>
                    <button
                        className={viewType === "infinite" ? "active" : ""}
                        onClick={() => {
                            setMovies([]);
                            setViewType("infinite");
                            setPage(1);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        Infinite Scroll
                    </button>
                </div>

                {loading && page === 1 && (
                    <div className="popular-loading">Loading...</div>
                )}

                {/* 카드 그리드 */}
                <div className={`popular-grid ${viewType}`}>
                    {movies.map((movie) => {
                        const isWish = wishlist.isWishlisted(movie.id);

                        return (
                            <div
                                key={movie.id}
                                className={`popular-card ${isWish ? "wish" : ""}`}
                            >
                                <div className="popular-thumb-wrapper">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="popular-thumb"
                                    />

                                    <div className="popular-card-overlay">
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
                                                handleToggleWishlist(movie);
                                            }}
                                        >
                                            {isWish ? "찜 해제" : "찜하기"}
                                        </button>
                                    </div>
                                </div>

                                <h3 className="popular-card-title">
                                    {movie.title}
                                </h3>
                            </div>
                        );
                    })}
                </div>

                {/* Table View 페이징 */}
                {viewType === "table" && (
                    <div className="popular-pagination">
                        <button
                            disabled={page === 1 || loading}
                            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        >
                            이전
                        </button>
                        <span className="page-number">{page}</span>
                        <button
                            disabled={loading}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}

                {/* Infinite 모드 로딩 */}
                {viewType === "infinite" && loading && page > 1 && (
                    <div className="popular-loading more">더 불러오는 중...</div>
                )}
            </div>

            {/* Top 버튼 (fixed) */}
            {viewType === "infinite" && (
                <button
                    className={`popular-top-btn ${showTopButton ? "visible" : ""}`}
                    onClick={handleTopClick}
                >
                    ↑ Top
                </button>
            )}
        </>
    );
}

import { useEffect, useState } from "react";
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

    // ✅ 페이지 번호 / 뷰 타입이 바뀔 때마다 TMDB에서 인기 영화 가져오기
    useEffect(() => {
        let cancelled = false;

        async function fetchPage() {
            setLoading(true);
            try {
                await new Promise((res) => setTimeout(res, 1000));
                const data = await fetchMovies(URLS.popular(page));

                // Table → 해당 페이지 데이터만 사용
                // Infinite → 이전 것 + 새 페이지 데이터 더해서 누적
                setMovies(prev =>
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

    // ✅ Infinite Scroll 모드에서만: 스크롤 끝에 도달하면 다음 페이지 자동 로딩
    useEffect(() => {
        if (viewType !== "infinite") return;

        function handleScroll() {
            if (loading) return;

            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200;

            if (nearBottom) {
                setPage(prev => prev + 1);
            }
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [viewType, loading]);

    const handleToggleWishlist = (movie: Movie) => {
        wishlist.toggleWishlist(movie);
        // 스타일 즉시 반영 위해 새 배열로 복사
        setMovies([...movies]);
    };

    const switchToTable = () => {
        setViewType("table");
        setPage(1);      // 1페이지부터 새로
    };

    const switchToInfinite = () => {
        setMovies([]);   // 누적 리스트 초기화
        setPage(1);
        setViewType("infinite");
    };

    return (
        <div className="popular-container">
            <h1 className="popular-title">📈 대세 콘텐츠</h1>

            {/* ✅ View 선택 버튼 */}
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

            {/* ✅ 첫 페이지 로딩 중일 때만 크게 표시 */}
            {loading && page === 1 && (
                <div className="popular-loading">Loading...</div>
            )}

            {/* ✅ 영화 카드 그리드 */}
            <div className={`popular-grid ${viewType}`}>
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className={`popular-card ${
                            wishlist.isWishlisted(movie.id) ? "wish" : ""
                        }`}
                        onClick={() => handleToggleWishlist(movie)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <h3 className="popular-card-title">{movie.title}</h3>
                    </div>
                ))}
            </div>

            {/* ✅ Table View일 때만 하단 페이지네이션 표시 */}
            {viewType === "table" && (
                <div className="popular-pagination">
                    <button
                        disabled={page === 1 || loading}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    >
                        이전
                    </button>
                    <span className="page-number">{page}</span>
                    <button disabled={loading} onClick={() => setPage(prev => prev + 1)}>
                        다음
                    </button>
                </div>
            )}

            {/* ✅ Infinite 모드에서 추가로 불러올 때 표시 */}
            {viewType === "infinite" && loading && page > 1 && (
                <div className="popular-loading more">더 불러오는 중...</div>
            )}
        </div>
    );
}

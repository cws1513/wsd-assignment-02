// src/pages/SearchPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { fetchMovies, URLS } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./SearchPage.css";

type SearchMovie = Movie & {
    vote_average?: number;
    popularity?: number;
};

const RECENT_SEARCHES_KEY = "recentSearches";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState<SearchMovie[]>([]);
    const [loading, setLoading] = useState(false);

    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<"default" | "rating" | "popularity">(
        "default"
    );

    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const wishlist = new WishlistManager();

    /* 🔹 최근 검색어 로딩 */
    useEffect(() => {
        const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) setRecentSearches(parsed);
            } catch {
                // ignore
            }
        }
    }, []);

    const saveRecentSearch = (keyword: string) => {
        const trimmed = keyword.trim();
        if (!trimmed) return;

        const updated = [trimmed, ...recentSearches.filter((k) => k !== trimmed)].slice(
            0,
            5
        );
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    /* 🔹 TMDB 검색 호출 */
    useEffect(() => {
        if (!submittedQuery) return;

        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchMovies(URLS.search(submittedQuery, page));
                setMovies(data as SearchMovie[]);
            } catch (e) {
                console.error("검색 실패:", e);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [submittedQuery, page]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) {
            alert("검색어를 입력해 주세요.");
            return;
        }
        setSubmittedQuery(trimmed);
        setPage(1);
        saveRecentSearch(trimmed);

        // 🔥 새 검색 시 항상 맨 위로 스크롤
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleResetFilters = () => {
        setMinRating(0);
        setSortBy("default");
    };

    const handleRecentClick = (keyword: string) => {
        setQuery(keyword);
        setSubmittedQuery(keyword);
        setPage(1);

        // 🔥 최근 검색어 눌러서 검색할 때도 맨 위로
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* 🔹 필터/정렬 적용 */
    const processedMovies: SearchMovie[] = (() => {
        let result = [...movies];

        if (minRating > 0) {
            result = result.filter((m) => (m.vote_average ?? 0) >= minRating);
        }

        if (sortBy === "rating") {
            result.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
        } else if (sortBy === "popularity") {
            result.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        }

        return result;
    })();

    return (
        <div className="search-container page-transition">
            <h1 className="search-title">🔍 찾아보기 (Search)</h1>

            {/* 검색 폼 */}
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>

            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <span className="recent-label">최근 검색어</span>
                    {recentSearches.map((keyword) => (
                        <button
                            key={keyword}
                            type="button"
                            className="recent-chip"
                            onClick={() => handleRecentClick(keyword)}
                        >
                            {keyword}
                        </button>
                    ))}
                </div>
            )}

            {/* 필터 */}
            <div className="search-filters">
                <div className="filter-group">
                    <label>최소 평점</label>
                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                    >
                        <option value={0}>전체</option>
                        <option value={5}>★ 5.0 이상</option>
                        <option value={7}>★ 7.0 이상</option>
                        <option value={8}>★ 8.0 이상</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>정렬</label>
                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value as "default" | "rating" | "popularity"
                            )
                        }
                    >
                        <option value="default">기본</option>
                        <option value="rating">평점 높은 순</option>
                        <option value="popularity">인기순</option>
                    </select>
                </div>

                <button
                    className="filter-reset-btn"
                    type="button"
                    onClick={handleResetFilters}
                >
                    필터 초기화
                </button>
            </div>

            {/* 안내 */}
            {!submittedQuery && !loading && (
                <div className="search-helper">영화 제목을 입력하고 검색해 주세요.</div>
            )}

            {/* 로딩 */}
            {loading && (
                <div className="search-loading">
                    <div className="skeleton-row">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="skeleton-card" />
                        ))}
                    </div>
                    <p>검색 중...</p>
                </div>
            )}

            {/* 결과 */}
            {!loading && submittedQuery && (
                <>
                    {processedMovies.length === 0 ? (
                        <div className="search-empty">
                            "{submittedQuery}"에 대한 검색 결과가 없습니다.
                        </div>
                    ) : (
                        <div className="search-grid">
                            {processedMovies.map((movie) => {
                                const isWish = wishlist.isWishlisted(movie.id);

                                return (
                                    <div
                                        key={movie.id}
                                        className={`search-card movie-card ${
                                            isWish ? "wish" : ""
                                        }`}
                                    >
                                        <div className="movie-thumb-wrapper">
                                            <img
                                                className="movie-thumb"
                                                src={
                                                    movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : "https://via.placeholder.com/300x450?text=No+Image"
                                                }
                                                alt={movie.title}
                                            />

                                            {/* hover 오버레이 */}
                                            <div className="movie-card-overlay">
                                                <Link
                                                    to={`/movie/${movie.id}`}
                                                    className="overlay-btn primary"
                                                >
                                                    상세 보기
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="overlay-btn secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // ✅ 찜 토글
                                                        wishlist.toggleWishlist(movie);
                                                        // ✅ 강제 리렌더 → 빨간 오버레이 / wish 클래스 즉시 반영
                                                        setMovies((prev) => [...prev]);
                                                    }}
                                                >
                                                    {isWish ? "찜 해제" : "찜하기"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="search-card-info">
                                            <h3>{movie.title}</h3>
                                            <p className="rating">
                                                ⭐ {(movie.vote_average ?? 0).toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    {!loading && processedMovies.length > 0 && (
                        <div className="search-pagination">
                            <button
                                disabled={page === 1 || loading}
                                onClick={() => setPage(page - 1)}
                            >
                                이전
                            </button>
                            <span>{page}</span>
                            <button
                                disabled={loading}
                                onClick={() => setPage(page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

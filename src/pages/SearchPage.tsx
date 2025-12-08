// src/pages/SearchPage.tsx
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { fetchMovies, URLS } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./SearchPage.css";

// Wishlist Movie를 확장
type SearchMovie = Movie & {
    vote_average?: number;
    popularity?: number;
};

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

    const wishlist = new WishlistManager();

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
    };

    const handleResetFilters = () => {
        setMinRating(0);
        setSortBy("default");
    };

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
        <div className="search-container">
            <h1 className="search-title">🔍 찾아보기 (Search)</h1>

            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>

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

            {!submittedQuery && !loading && (
                <div className="search-helper">영화 제목을 입력하고 검색해 주세요.</div>
            )}

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

            {!loading && submittedQuery && (
                <>
                    {processedMovies.length === 0 ? (
                        <div className="search-empty">
                            "{submittedQuery}"에 대한 검색 결과가 없습니다.
                        </div>
                    ) : (
                        <>
                            <div className="search-grid">
                                {processedMovies.map((movie) => (
                                    <div
                                        key={movie.id}
                                        className={`search-card ${
                                            wishlist.isWishlisted(movie.id) ? "wish" : ""
                                        }`}
                                        onClick={() => {
                                            wishlist.toggleWishlist(movie);
                                        }}
                                    >
                                        <Link
                                            to={`/movie/${movie.id}`}
                                            className="search-card-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img
                                                src={
                                                    movie.poster_path
                                                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                        : "https://via.placeholder.com/300x450?text=No+Image"
                                                }
                                                alt={movie.title}
                                            />
                                            <div className="search-card-info">
                                                <h3>{movie.title}</h3>
                                                {movie.vote_average !== undefined && (
                                                    <p className="rating">
                                                        ⭐ {movie.vote_average.toFixed(1)}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="search-pagination">
                                <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                                    이전
                                </button>
                                <span>{page}</span>
                                <button onClick={() => setPage(page + 1)}>다음</button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

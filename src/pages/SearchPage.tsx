import { useState } from "react";
import { URLS, fetchMovies } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./SearchPage.css";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    const wishlist = new WishlistManager();

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();

        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);

        try {
            const data = await fetchMovies(URLS.search(query));
            setResults(data);
        } catch (e) {
            console.error("검색 실패:", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="search-container">
            <h1 className="search-title">🔍 영화 검색</h1>

            {/* 검색창 */}
            <form className="search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="검색어를 입력하세요…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit">검색</button>
            </form>

            {/* 로딩 중 */}
            {loading && <div className="search-loading">Loading...</div>}

            {/* 검색 결과 */}
            {!loading && results.length > 0 && (
                <div className="search-grid">
                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            className={`search-card ${
                                wishlist.isWishlisted(movie.id) ? "wish" : ""
                            }`}
                            onClick={() => {
                                wishlist.toggleWishlist(movie);
                                setResults([...results]);
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <h3>{movie.title}</h3>
                        </div>
                    ))}
                </div>
            )}

            {/* 검색 결과 없을 때 */}
            {!loading && results.length === 0 && query.trim() && (
                <p className="search-empty">검색 결과가 없습니다.</p>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import { fetchMovies } from "../../libs/URL";
import type { Movie } from "../../libs/useWishlist";
import "./HomeSection.css";

interface Props {
    title: string;
    apiUrl: string;
}

export default function HomeSection({ title, apiUrl }: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchMovies(apiUrl);
                setMovies(data);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [apiUrl]);

    if (loading) {
        return <div className="section-loading">Loading...</div>;
    }

    return (
        <div className="section-container">
            <h2 className="section-title">{title}</h2>

            <div className="movie-grid">
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <h3 className="movie-title">{movie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { fetchMovies } from "../libs/URL";
import { WishlistManager } from "../libs/useWishlist";
import type { Movie } from "../libs/useWishlist";
import "./SectionRow.css";

interface Props {
    title: string;
    url: string;
}

export default function SectionRow({ title, url }: Props) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const wishlist = new WishlistManager();

    useEffect(() => {
        async function load() {
            const data = await fetchMovies(url);
            setMovies(data);
        }
        load();
    }, [url]);

    return (
        <div className="row-container">
            <h2 className="row-title">{title}</h2>

            <div className="row-slider">
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        className={`row-card ${wishlist.isWishlisted(movie.id) ? "wish" : ""}`}
                        onClick={() => {
                            wishlist.toggleWishlist(movie);
                            setMovies([...movies]);
                        }}
                    >
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

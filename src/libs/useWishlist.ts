export interface Movie {
    id: number;
    title: string;
    poster_path: string;
}

export class WishlistManager {
    private storageKey = "movieWishlist";
    private wishlist: Movie[] = [];

    constructor() {
        const stored = localStorage.getItem(this.storageKey);
        this.wishlist = stored ? JSON.parse(stored) : [];
    }

    getWishlist() {
        return this.wishlist;
    }

    isWishlisted(id: number) {
        return this.wishlist.some((m) => m.id === id);
    }

    toggleWishlist(movie: Movie) {
        const exists = this.isWishlisted(movie.id);

        if (exists) {
            this.wishlist = this.wishlist.filter((m) => m.id !== movie.id);
        } else {
            this.wishlist.push({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
            });
        }

        localStorage.setItem(this.storageKey, JSON.stringify(this.wishlist));
    }
}

import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// 기본 URL 생성기
export const makeUrl = (path: string, page: number = 1) =>
    `${BASE_URL}${path}?api_key=${API_KEY}&language=ko-KR&page=${page}`;

// 영화 데이터 요청 함수
export const fetchMovies = async (url: string) => {
    const response = await axios.get(url);
    // TMDB는 항상 { results: [...] } 형태로 옴
    return response.data.results;
};

// 자주 쓰는 API 엔드포인트
export const URLS = {
    popular: (page = 1) => makeUrl("/movie/popular", page),
    nowPlaying: (page = 1) => makeUrl("/movie/now_playing", page),
    topRated: (page = 1) => makeUrl("/movie/top_rated", page),
    upcoming: (page = 1) => makeUrl("/movie/upcoming", page),
    discoverByGenre: (genreId: number, page = 1) =>
        makeUrl(`/discover/movie&with_genres=${genreId}`, page),
    search: (query: string, page = 1) =>
        `${BASE_URL}/search/movie?api_key=${API_KEY}&language=ko-KR&page=${page}&query=${encodeURIComponent(
            query
        )}`,
};


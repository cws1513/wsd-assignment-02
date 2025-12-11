// src/libs/URL.ts
import axios from "axios";

// .env에서 기본 API 키 불러오기
const ENV_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// TMDB 기본 URL
const BASE_URL = "https://api.themoviedb.org/3";

// 🔥 현재 로그인 유저의 TMDB-Key 가져오기
function getApiKey(): string {
    // 로그인 시 Authentication.ts에서 저장한 값
    const stored = localStorage.getItem("TMDb-Key");

    // 로그인 후에는 stored(비밀번호) 사용
    if (stored && stored.trim().length > 0) {
        return stored.trim();
    }

    // 로그인 전에는 .env 키 사용
    return ENV_API_KEY;
}

// 기본 URL 생성기
export const makeUrl = (path: string, page: number = 1) => {
    return `${BASE_URL}${path}?api_key=${getApiKey()}&language=ko-KR&page=${page}`;
};

// 영화 데이터 요청 함수
export const fetchMovies = async (url: string) => {
    const response = await axios.get(url);
    return response.data.results; // TMDB는 {results: []}
};

// 🔥 영화 trailerKey 가져오기 (배너 영상용)
export async function fetchMovieTrailerKey(movieId: number): Promise<string | null> {
    const apiKey = getApiKey();
    const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}&language=ko-KR`;

    const response = await axios.get(url);
    const videos = response.data.results;

    const trailer = videos.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );

    return trailer ? trailer.key : null;
}

// 🔥 엔드포인트 모음
export const URLS = {
    popular: (page = 1) => makeUrl("/movie/popular", page),
    nowPlaying: (page = 1) => makeUrl("/movie/now_playing", page),
    topRated: (page = 1) => makeUrl("/movie/top_rated", page),
    upcoming: (page = 1) => makeUrl("/movie/upcoming", page),

    // 장르 필터링
    discoverByGenre: (genreId: number, page = 1) =>
        `${BASE_URL}/discover/movie?api_key=${getApiKey()}&language=ko-KR&page=${page}&with_genres=${genreId}`,

    // 🔥 search 오류 해결 버전
    search: (query: string, page = 1) =>
        `${BASE_URL}/search/movie?api_key=${getApiKey()}&language=ko-KR&page=${page}&query=${encodeURIComponent(
            query
        )}`,
};

// src/libs/Authentication.ts

// 사용자 정보 타입
export interface User {
    id: string;        // 이메일
    password: string;  // 비밀번호(또는 TMDB API 키)
}

// localStorage 키 상수
const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const TMDB_KEY = "TMDb-Key";
const KEEP_LOGIN_KEY = "keepLogin";

// users 배열 불러오기
function loadUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
}

// users 배열 저장하기
function saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * ✅ TMDB API Key 검증 함수
 * /configuration 엔드포인트에 요청해서 200이면 유효한 키라고 판단
 */
async function validateTmdbKey(apiKey: string): Promise<boolean> {
    const trimmed = apiKey.trim();
    if (!trimmed) return false;

    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/configuration?api_key=${encodeURIComponent(
                trimmed
            )}`
        );

        if (!res.ok) {
            // 401, 403 등 → 잘못된 키
            return false;
        }

        // 응답은 굳이 안 써도 되지만 파싱은 한 번 해둠
        await res.json();
        return true;
    } catch (e) {
        console.error("TMDB API 검증 중 오류:", e);
        return false;
    }
}

// ✅ 회원가입 시도
// SigninPage에서: tryRegister(email, password, success, fail);
export function tryRegister(
    email: string,
    password: string,
    success: () => void,
    fail: (msg: string) => void
) {
    const users = loadUsers();
    const exists = users.some((u) => u.id === email);

    if (exists) {
        fail("이미 존재하는 이메일입니다.");
        return;
    }

    users.push({ id: email, password });
    saveUsers(users);
    success();
}

// ✅ 로그인 시도 (+ TMDB API Key 검증 추가)
// SigninPage에서: tryLogin(email, password, remember, success, fail);
export async function tryLogin(
    email: string,
    password: string,
    saveToken: boolean,        // Remember me 체크 여부
    success: (user: User) => void,
    fail: (msg: string) => void
) {
    const users = loadUsers();
    const user = users.find(
        (u) => u.id === email && u.password === password
    );

    if (!user) {
        fail("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
    }

    // 🔥 1단계: TMDB API Key로 비밀번호를 사용하므로, 실제로 유효한 키인지 검사
    const ok = await validateTmdbKey(user.password);
    if (!ok) {
        fail(
            "유효하지 않은 TMDB API Key 입니다.\nTMDB 사이트에서 발급받은 유효한 키를 비밀번호로 입력해 주세요."
        );
        return;
    }

    // 🔥 2단계: 검증 성공 시 localStorage에 키 및 유저 정보 저장
    localStorage.setItem(TMDB_KEY, user.password);                 // TMDB 키 저장
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));  // 현재 로그인 유저
    localStorage.setItem(KEEP_LOGIN_KEY, saveToken ? "true" : "false"); // 자동 로그인 여부

    success(user);
}

// ✅ 로그아웃
export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TMDB_KEY);
    localStorage.removeItem(KEEP_LOGIN_KEY);
}

// ✅ 현재 로그인 유저 가져오기
export function getCurrentUser(): User | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
}

// ✅ 로그인 여부 확인
export function isLoggedIn(): boolean {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
}

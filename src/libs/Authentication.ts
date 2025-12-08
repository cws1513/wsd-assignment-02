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

// ✅ 로그인 시도
// SigninPage에서: tryLogin(email, password, remember, success, fail);
export function tryLogin(
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

    // 과제 요구사항: TMDB API 키로 비밀번호를 사용
    localStorage.setItem(TMDB_KEY, user.password);

    // 현재 로그인된 유저 정보 저장
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    // 자동 로그인 여부 저장
    localStorage.setItem(KEEP_LOGIN_KEY, saveToken ? "true" : "false");

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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SigninPage.css";
import { tryLogin, tryRegister } from "../libs/Authentication";

export default function SigninPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [remember, setRemember] = useState(false);

    const navigate = useNavigate();
    const isLogin = mode === "login";

    const isValidEmail = (value: string) => {
        // 간단한 이메일 형식 체크 (과제 요구사항)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }

        if (!isLogin) {
            // 회원가입 모드일 때 비밀번호 확인 체크
            if (password !== passwordConfirm) {
                alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return;
            }

            tryRegister(
                email,
                password,
                () => {
                    alert("회원가입에 성공했습니다. 로그인 화면으로 이동합니다.");
                    setMode("login");
                },
                (msg) => {
                    alert(msg);
                }
            );
        } else {
            // 로그인 모드
            tryLogin(
                email,
                password,
                remember,
                () => {
                    alert("로그인에 성공했습니다.");
                    navigate("/"); // 로그인 성공 시 홈으로 이동
                },
                (msg) => {
                    alert(msg);
                }
            );
        }
    };

    const switchMode = () => {
        setMode(isLogin ? "register" : "login");
        // 모드 바꿀 때 비밀번호 관련 필드 초기화
        setPassword("");
        setPasswordConfirm("");
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* 왼쪽: 제목/모드 전환 */}
                <div className="auth-side">
                    <h1>{isLogin ? "로그인" : "회원가입"}</h1>
                    <p>
                        {isLogin
                            ? "계정이 없다면 회원가입을 해 주세요."
                            : "이미 계정이 있다면 로그인 해 주세요."}
                    </p>
                    <button
                        type="button"
                        className="auth-toggle-btn"
                        onClick={switchMode}
                    >
                        {isLogin ? "회원가입 화면으로" : "로그인 화면으로"}
                    </button>
                </div>

                {/* 오른쪽: 폼 */}
                <div className="auth-form-wrapper">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">이메일</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">
                                비밀번호 <span style={{ fontSize: "0.8rem", color: "#888" }}>
                  (TMDB API Key 또는 비밀번호)
                </span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* 회원가입일 때만 비밀번호 확인 입력 */}
                        {!isLogin && (
                            <div className="auth-field">
                                <label htmlFor="passwordConfirm">비밀번호 확인</label>
                                <input
                                    id="passwordConfirm"
                                    type="password"
                                    placeholder="비밀번호를 다시 입력하세요"
                                    required
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                />
                            </div>
                        )}

                        {/* 로그인: Remember me */}
                        {isLogin && (
                            <div className="auth-field-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                    />
                                    Remember me (자동 로그인)
                                </label>
                            </div>
                        )}

                        {/* 회원가입: 약관 동의 (필수) */}
                        {!isLogin && (
                            <div className="auth-field-row">
                                <label className="checkbox-label">
                                    <input type="checkbox" required />
                                    약관에 동의합니다.
                                </label>
                            </div>
                        )}

                        <button type="submit" className="auth-submit-btn">
                            {isLogin ? "로그인" : "회원가입"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// src/pages/SigninPage.tsx
import { useState, type FormEvent } from "react";
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }

        if (!isLogin) {
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
                    setPassword("");
                    setPasswordConfirm("");
                },
                (msg) => {
                    alert(msg);
                }
            );
        } else {
            tryLogin(
                email,
                password,
                remember,
                () => {
                    alert("로그인에 성공했습니다.");
                    navigate("/");
                },
                (msg) => {
                    alert(msg);
                }
            );
        }
    };

    const switchMode = () => {
        setMode(isLogin ? "register" : "login");
        setPassword("");
        setPasswordConfirm("");
    };

    return (
        <div className="auth-page">
            <div
                className={`auth-container ${
                    isLogin ? "login-mode" : "register-mode"
                }`}
            >
                {/* 왼쪽 영역 */}
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

                {/* 오른쪽 폼 영역 */}
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
                                비밀번호{" "}
                                <span className="auth-hint">
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

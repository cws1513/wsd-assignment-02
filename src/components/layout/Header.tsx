// src/components/layout/Header.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { getCurrentUser, logout } from "../../libs/Authentication";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser(); // 로그인 여부 판단

    // 스크롤 여부 상태
    const [scrolled, setScrolled] = useState(false);

    // 현재 경로와 비교해서 active 클래스 부여
    const isActive = (path: string) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    // 스크롤 이벤트 등록
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10); // 10px 이상 스크롤되면 true
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // 초기 한 번 호출

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        alert("로그아웃되었습니다.");
        navigate("/signin");
    };

    return (
        <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
            <div className="header-inner">
                {/* 로고 */}
                <div className="logo">
                    <Link to="/">MyFlix</Link>
                </div>

                {/* 메뉴 */}
                <nav className="nav">
                    <Link className={isActive("/")} to="/">
                        Home
                    </Link>
                    <Link className={isActive("/popular")} to="/popular">
                        Popular
                    </Link>
                    <Link className={isActive("/search")} to="/search">
                        Search
                    </Link>
                    <Link className={isActive("/wishlist")} to="/wishlist">
                        Wishlist
                    </Link>
                </nav>

                {/* 로그인 여부에 따른 표시 */}
                <div className="auth-area">
                    {user ? (
                        <>
                            {/* 사용자 이메일 */}
                            <span className="user-email">{user.id}</span>

                            {/* 로그아웃 버튼 */}
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/signin" className="login-btn">
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
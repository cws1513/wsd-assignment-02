import { Link, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <header className="header">
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

                {/* 로그인 영역 (나중에 진짜 로직 붙일 예정) */}
                <div className="auth-area">
                    <Link to="/signin" className="login-btn">
                        Sign in
                    </Link>
                </div>
            </div>
        </header>
    );
}

import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { getCurrentUser, logout } from "../../libs/Authentication";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getCurrentUser(); // 로그인 여부 판단

    const isActive = (path: string) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    const handleLogout = () => {
        logout();
        alert("로그아웃되었습니다.");
        navigate("/signin");
    };

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

                {/* 로그인 여부에 따른 표시 */}
                <div className="auth-area">
                    {user ? (
                        <>
                            {/* 사용자 이메일 */}
                            <span style={{ fontSize: "0.85rem", marginRight: "0.6rem" }}>
                                {user.id}
                            </span>

                            {/* 로그아웃 버튼 */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    borderRadius: "999px",
                                    padding: "0.4rem 0.9rem",
                                    border: "1px solid #e50914",
                                    background: "#e50914",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "0.85rem"
                                }}
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        // 로그인 버튼 (기존 그대로 유지)
                        <Link to="/signin" className="login-btn">
                            Sign in
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}

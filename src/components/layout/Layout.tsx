// src/components/layout/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import "./Layout.css"; // 필요하면 유지

const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <>
            {/* 항상 고정 헤더 */}
            <Header />

            {/* 페이지 영역 */}
            <main className="page-container">
                {/* 🔥 pathname이 바뀔 때마다 새 div + 애니메이션 */}
                <div key={location.pathname} className="route-transition">
                    <Outlet />
                </div>
            </main>
        </>
    );
};

export default Layout;

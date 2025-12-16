// src/router/AppRouter.tsx
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import SigninPage from "../pages/SigninPage";
import PopularPage from "../pages/PopularPage";
import SearchPage from "../pages/SearchPage";
import WishlistPage from "../pages/WishlistPage";
import MovieDetailPage from "../pages/MovieDetailPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <HashRouter>
            <Routes>
                {/* 🔓 로그인 페이지 (보호 X) */}
                <Route path="/signin" element={<SigninPage />} />

                {/* 🔐 로그인 보호 영역 */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/popular" element={<PopularPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/movie/:id" element={<MovieDetailPage />} />
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    );
}

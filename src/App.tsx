// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import PopularPage from "./pages/PopularPage";
import SearchPage from "./pages/SearchPage";
import WishlistPage from "./pages/WishlistPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import SigninPage from "./pages/SigninPage";
import ProtectedRoute from "./router/ProtectedRoute";

import "./App.css";

export default function App() {
    return (
        <HashRouter>
            <Routes>
                {/* ✅ 로그인 없이 접근 가능한 페이지 */}
                <Route path="/signin" element={<SigninPage />} />

                {/* ✅ 나머지 전부: 공통 Layout + 로그인 보호 + 전환 애니메이션 */}
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

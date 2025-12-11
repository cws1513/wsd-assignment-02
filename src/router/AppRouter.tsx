import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import SigninPage from "../pages/SigninPage";
import PopularPage from "../pages/PopularPage";
import SearchPage from "../pages/SearchPage";
import WishlistPage from "../pages/WishlistPage";
import MovieDetailPage from "../pages/MovieDetailPage"; // ✅ 추가
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인 페이지는 레이아웃 없이 단독 경로 */}
                <Route path="/signin" element={<SigninPage />} />

                {/* 나머지 페이지는 공통 Layout + 로그인 필요 */}
                <Route element={<Layout />}>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/popular"
                        element={
                            <ProtectedRoute>
                                <PopularPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <ProtectedRoute>
                                <SearchPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <WishlistPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* ✅ 영화 상세 페이지 (로그인 필요) */}
                    <Route
                        path="/movie/:id"
                        element={
                            <ProtectedRoute>
                                <MovieDetailPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

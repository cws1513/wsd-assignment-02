// src/router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isLoggedIn } from "../libs/Authentication";

export default function ProtectedRoute() {
    const location = useLocation();

    // 로그인 안 돼 있으면 → /signin 으로 보내고
    // 어디에서 왔는지(location)를 state.from 으로 같이 넘김
    if (!isLoggedIn()) {
        return (
            <Navigate
                to="/signin"
                replace
                state={{ from: location }}
            />
        );
    }

    // 통과되면 자식 라우트(<Route element={<ProtectedRoute />}> 안에 있는 것들) 렌더링
    return <Outlet />;
}

import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../libs/Authentication";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    if (!isLoggedIn()) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
}

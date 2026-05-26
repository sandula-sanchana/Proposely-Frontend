import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

const Home = lazy(() => import("./../pages/HomePage.tsx"));
const Login = lazy(() => import("./../pages/LoginPage.tsx"));
const Register = lazy(() => import("./../pages/RegisterPage.tsx"));

type RequireAuthProps = {
    children: ReactNode;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const Router = () => {
    return (
        <BrowserRouter>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-screen">
                        <h1>Loading...</h1>
                    </div>
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <Home />
                            </RequireAuth>
                        }
                    />

                    <Route path="/login" element={<Login />} />

                    <Route path="/register" element={<Register />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
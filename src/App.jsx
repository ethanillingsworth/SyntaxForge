import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Outlet,
} from "react-router-dom";
import "./css/tailwind.css";

// Components
import Sidebar from "./components/Sidebar";

// General
import UserPage from "./pages/UserPage";
import PlaygroundPage from "./pages/PlaygroundPage";

// Course Pages
import CoursePage from "./pages/course/CoursePage";
import ArticlePage from "./pages/course/ArticlePage";
import MCQPage from "./pages/course/MCQPage";

// Landing
import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/landing/LoginPage";
import FRQPage from "./pages/course/FRQPage";

function ContentLayout() {
    return (
        <main>
            <Outlet />
        </main>
    );
}

function ContentLayoutNoPadding() {
    return (
        <main className="p-0">
            <Outlet />
        </main>
    );
}
function ContentLayoutNoPaddingRow() {
    return (
        <main className="p-0 inline-flex w-full">
            <Outlet />
        </main>
    );
}

function Layout() {
    const location = useLocation();
    const hideSidebar =
        location.pathname === "/login" || location.pathname === "/";

    return (
        <>
            {!hideSidebar && (
                <>
                    <Sidebar />
                    <hr className="border-none w-0.5 gradient-bg h-full" />
                </>
            )}
            <Routes>
                <Route element={<ContentLayoutNoPadding />}>
                    <Route
                        path="/playgrounds/:playgroundId"
                        element={<PlaygroundPage />}
                    />
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ContentLayoutNoPaddingRow />}>
                    <Route
                        path="/:courseId/:unitName/frq/:frqName"
                        element={<FRQPage />}
                    />
                </Route>

                <Route element={<ContentLayout />}>
                    <Route path="/home" element={null} />

                    <Route path="/user/:username" element={<UserPage />} />

                    <Route path="/:courseId" element={<CoursePage />} />
                    <Route
                        path="/:courseId/:unitName/article/:articleName"
                        element={<ArticlePage />}
                    />

                    <Route
                        path="/:courseId/:unitName/mcq/:mcqName"
                        element={<MCQPage />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

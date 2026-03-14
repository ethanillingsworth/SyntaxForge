import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ArticlePage from "./pages/ArticlePage";
import LoginPage from "./pages/LoginPage";
import "./css/tailwind.css";
import CoursePage from "./pages/CoursePage";
import UnitPage from "./pages/UnitPage";
import CoursesPage from "./pages/CoursesPage";
import CategoryPage from "./pages/CategoryPage";
import PlaygroundPage from "./pages/PlaygroundPage";

import { Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

function ContentLayout() {
	return (
		<div className="content">
			<Outlet />
		</div>
	);
}

function ContentLayoutNoPadding() {
	return (
		<div className="content p-0">
			<Outlet />
		</div>
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

				<Route element={<ContentLayout />}>
					<Route path="/home" element={null} />

					<Route path="/courses" element={<CoursesPage />} />
					<Route
						path="/courses/:categoryId"
						element={<CategoryPage />}
					/>

					<Route path="/:courseId" element={<CoursePage />} />
					<Route path="/:courseId/:unitName" element={<UnitPage />} />
					<Route
						path="/:courseId/:unitName/article/:articleId"
						element={<ArticlePage />}
					/>

					{/* <Route
						path="/:courseId/:unitName/mcq/:mcqId"
						element={<MCQPage />}
					/> */}
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

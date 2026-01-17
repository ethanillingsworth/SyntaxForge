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

function Layout() {
	const location = useLocation();
	const hideSidebar = location.pathname === "/login";

	return (
		<>
			{!hideSidebar && (
				<>
					<Sidebar />
					<hr className="border-none w-0.5 gradient-bg h-full" />
				</>
			)}
			<div className="content">
				<Routes>
					<Route path="/" element={<null />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/courses" element={<CoursesPage />} />
					<Route
						path="/courses/:categoryId"
						element={<CategoryPage />}
					/>

					<Route path="/:courseId/" element={<CoursePage />} />
					<Route path="/:courseId/:unitName" element={<UnitPage />} />
					<Route
						path="/:courseId/:unitName/article/:articleId"
						element={<ArticlePage />}
					/>
				</Routes>
			</div>
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

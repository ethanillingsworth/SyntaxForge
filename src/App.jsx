import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Article from "./pages/Article";
import LoginPage from "./pages/LoginPage";
import "./css/tailwind.css";
import CoursePage from "./pages/CoursePage";
import UnitPage from "./pages/UnitPage";

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
					<Route path="/:courseId/" element={<CoursePage />} />
					<Route path="/:courseId/:unitName" element={<UnitPage />} />
					<Route
						path="/:courseId/article/:articleId"
						element={<Article />}
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

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MarkdownPage from "./components/MarkdownPage";
import LoginPage from "./components/LoginPage";
import "./css/tailwind.css"


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

			<Routes>
				<Route path="/" element={<MarkdownPage />} />
				<Route path="/login" element={<LoginPage />} />
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

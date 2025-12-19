import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./css/tailwind.css";
import Sidebar from "./components/Sidebar";
import MarkdownPage from "./components/MarkdownPage";

function App() {
	return (
		<>
			<Router>
				<Sidebar />
				<Routes>
					<Route path="/" element={<MarkdownPage />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;

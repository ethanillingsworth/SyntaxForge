import { useEffect } from "react";
import Firebase from "../firebase/Firebase";

export default function Sidebar() {
	const categorys = ["javascript", "advanced-placement"];

	useEffect(() => {
		Firebase.getAllCoursesFromCategory("javascript").then((data) => {
			console.log(data);
		});
	}, []);

	return (
		<div className="sidebar">
			<div className="flex flex-row gap-3 h-16 place-items-center">
				<img className="h-6 rounded" src="/logo.png"></img>
				<h1>SyntaxForge</h1>
			</div>
			<div className="group">
				<h2>Your Courses</h2>
			</div>

			<div className="group">
				<h2>Available Courses</h2>
				{categorys.map((category) => {
					return (
						<div className="menu">
							<span>{category.replaceAll("-", " ")}</span>
							<div className="submenu">
								<a>AP CSP</a>
								<a>Intro to JS</a>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

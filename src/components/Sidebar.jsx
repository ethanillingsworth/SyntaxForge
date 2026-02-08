// import { useEffect, useMemo, useState } from "react";
// import { Category } from "../firebase/Firebase";

import { useEffect, useState } from "react";
import { useUser } from "../Global";
import { User } from "../firebase/Firebase";
export default function Sidebar() {
	const [courses, setCourses] = useState({});

	const user = useUser();

	useEffect(() => {
		if (!user) return;

		user.get("public").then((data) => {
			setCourses(data.courses);
		});
	}, [user]);

	function createPlayground() {
		const name = prompt("Playground Name:");
		if (name) {
			const id = name.replaceAll(" ", "-").toLowerCase();
			user.set("private", {
				playgrounds: {
					[id]: {
						name: name,
					},
				},
			});
		}
	}

	return (
		<div className="sidebar">
			<a
				href="/"
				className="flex flex-row gap-3 min-h-16 place-items-center text-white hover:gradient-text"
			>
				<img className="h-6 rounded" src="/logo.png"></img>
				<h2 className="text-base">SyntaxForge</h2>
			</a>
			<div className="group">
				<h2>Personal</h2>
				<div className="menu">
					<span>Your Courses</span>
					<div className="submenu">
						{Object.keys(courses).map((key) => {
							const data = courses[key];
							console.log(data);
							if (data.added) {
								return (
									<a key={key} href={`/${key}`}>
										{data.nickname
											? data.nickname
											: key.replaceAll("-", " ")}
									</a>
								);
							}
						})}
					</div>
				</div>
			</div>

			<div className="group">
				<h2>Playgrounds</h2>
				<a onClick={createPlayground}>New Playground</a>
			</div>

			<div className="group">
				<h2>Quick Links</h2>
				<a href="/courses">Available Courses</a>
			</div>
		</div>
	);
}

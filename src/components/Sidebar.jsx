// import { useEffect, useMemo, useState } from "react";
// import { Category } from "../firebase/Firebase";

import { useEffect, useState } from "react";
import { useUser } from "../Global";
import { Category, Course } from "../firebase/Firebase";

export default function Sidebar() {
	const [courses, setCourses] = useState({});
	const [playgrounds, setPlaygrounds] = useState({});
	const [username, setUsername] = useState("");
	const [cates, setCates] = useState([]);

	const user = useUser();

	useEffect(() => {
		if (!user) return;

		user.get("public").then((data) => {
			setCourses(data.courses || {});
			setUsername(data.username);
		});

		user.get("private").then((data) => {
			setPlaygrounds(data.playgrounds || {});
		});

		Category.getAll().then((l) => {
			setCates(l);
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
			}).then(() => {
				window.location.href = "/playgrounds/" + id;
			});
		}
	}

	return (
		<div className="sidebar">
			<a
				href="/home"
				className="flex flex-row gap-3 min-h-16 place-items-center text-white hover:gradient-text"
			>
				<img
					className="h-6 rounded"
					src="/logo.png"
					alt="SyntaxForge"
				/>
				<h2 className="text-base">SyntaxForge</h2>
			</a>
			<ul className="group">
				<h2>
					<li>Personal</li>
				</h2>

				<a href={`/user/@${username}`}>
					<li>Your Profile</li>
				</a>

				<ul className="menu">
					<li>Your Courses</li>
					<ul className="submenu">
						{Object.keys(courses).map((key) => {
							const data = courses[key];
							if (data.added) {
								return (
									<a key={key} href={`/${key}`}>
										<li>
											{data.nickname
												? data.nickname
												: key.replaceAll("-", " ")}
										</li>
									</a>
								);
							}
						})}
						<a href="/courses">
							<li>Find Courses</li>
						</a>
					</ul>
				</ul>

				<ul className="menu">
					<li>Playgrounds</li>
					<ul className="submenu">
						{Object.keys(playgrounds || {}).map((key) => {
							const data = playgrounds[key];
							return (
								<a href={`/playgrounds/${key}`} key={key}>
									<li>{data.name}</li>
								</a>
							);
						})}
						<li onClick={createPlayground}>New Playground</li>
					</ul>
				</ul>
			</ul>

			<ul className="group">
				<h2>
					<li>Quick Links</li>
				</h2>
				<ul className="menu">
					<a href="/courses">
						<li>Available Courses</li>
					</a>
					<ul className="submenu">
						{cates.map((category) => {
							if (!category.hidden) {
								return (
									<a
										href={`/courses/${category.id}`}
										key={category.id}
									>
										<li
											style={{
												"--color": `${category.color || "#fc483f"}4d`,
											}}
										>
											{category.name}
										</li>
									</a>
								);
							}
						})}
					</ul>
				</ul>
			</ul>
		</div>
	);
}

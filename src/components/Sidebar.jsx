// import { useEffect, useMemo, useState } from "react";
// import { Category } from "../firebase/Firebase";

import { useState } from "react";
import { useUser } from "../Global";
export default function Sidebar() {
	const [courses, setCourses] = useState({});
	useUser((user) => {
		user.get("public").then((data) => {
			setCourses(data.courses);
		});
	});

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
				<h2>Quick Links</h2>
				<a href="/courses">Available Courses</a>
				{/* {categorys.map((category) => {
					return (
						<div className="menu">
							<span>{category.replaceAll("-", " ")}</span>
							<div className="submenu">
								{Object.values(courses[category] ?? {}).map(
									(data) => (
										<a
											key={data.id}
											href={`/${data.id}`}
											className={
												data.nickname ? "uppercase" : ""
											}
										>
											{data.nickname
												? data.nickname
												: data.id.replaceAll("-", " ")}
										</a>
									)
								)}
							</div>
						</div>
					);
				})} */}
			</div>
		</div>
	);
}

import { useEffect, useMemo, useState } from "react";
import Firebase from "../firebase/Firebase";

export default function Sidebar() {
	const categorys = useMemo(() => ["javascript", "advanced-placement"], []);

	const [courses, setCourses] = useState({});

	useEffect(() => {
		for (const cate of categorys) {
			Firebase.getAllCoursesFromCategory(cate).then((data) => {
				setCourses((prev) => ({
					...prev,
					[cate]: { ...data },
				}));
			});
		}
	}, [categorys]);

	useEffect(() => {
		console.log(courses);
	}, [courses]);

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
								{Object.entries(courses[category] ?? {}).map(
									([id, data]) => (
										<a
											key={id}
											href={``}
											className={
												data.nickname ? "uppercase" : ""
											}
										>
											{data.nickname
												? data.nickname
												: id.replaceAll("-", " ")}
										</a>
									)
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

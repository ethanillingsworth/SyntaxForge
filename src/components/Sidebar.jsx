import { useEffect, useMemo, useState } from "react";
import { Category } from "../firebase/Firebase";

export default function Sidebar() {
	const categorys = useMemo(() => ["javascript", "advanced-placement"], []);

	const [courses, setCourses] = useState({});

	useEffect(() => {
		for (const cate of categorys) {
			const category = new Category(cate);
			category.getAllCourses(cate).then((data) => {
				setCourses((prev) => ({
					...prev,
					[cate]: [...data],
				}));
			});
		}
	}, [categorys]);

	useEffect(() => {
		console.log(courses);
	}, [courses]);

	return (
		<div className="sidebar">
			<div className="flex flex-row gap-3 min-h-16 place-items-center">
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
				})}
			</div>
		</div>
	);
}

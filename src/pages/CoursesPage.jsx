import { useEffect, useState } from "react";
import { Category } from "../firebase/Firebase";

export default function CoursesPage() {
	const [categorys, setCategorys] = useState([]);

	useEffect(() => {
		Category.getAll().then((cates) => {
			setCategorys(cates);
		});
	}, []);

	return (
		<>
			<h1>Select a course category to browse</h1>
			<div className="grid grid-cols-3 gap-3 mt-5">
				{categorys.map((category) => {
					if (!category.hidden) {
						return (
							<a
								className={`unit`}
								style={{
									"background-color": category.color,
									color: category.textColor,
								}}
								key={category.id}
								href={`/courses/${category.id}`}
							>
								<h3>
									{category.name}{" "}
									{category.nickname
										? `(${category.nickname})`
										: ""}
								</h3>
							</a>
						);
					}
				})}
			</div>
		</>
	);
}

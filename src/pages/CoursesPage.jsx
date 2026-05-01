import { useEffect, useState } from "react";
import { Category } from "../firebase/Firebase";
import { Card } from "../components/Card";

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
			<div className="grid grid-cols-3 gap-4 mt-4">
				{categorys.map((category) => {
					if (!category.hidden) {
						return (
							<Card
								id={category.id}
								link={`/courses/${category.id}`}
								type={Category}
							></Card>
						);
					}
				})}
			</div>
		</>
	);
}

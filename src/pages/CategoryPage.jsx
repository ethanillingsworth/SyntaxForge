import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category, Course } from "../firebase/Firebase";
import { Card } from "../components/Card";

export default function CategoryPage() {
	let [data, setData] = useState({});
	let [courses, setCourses] = useState([]);

	let { categoryId } = useParams();

	useEffect(() => {
		const category = new Category(categoryId);
		category.get().then((dat) => {
			setData(dat);
		});

		category.getAllCourses().then((crs) => {
			setCourses(crs);
		});
	}, [categoryId]);

	return (
		<>
			<h1>{data.name} Courses</h1>
			<div className="grid grid-cols-2 gap-4 mt-4">
				{courses.map((course) => {
					if (!course.hidden) {
						return (
							<Card
								link={`/${course.id}`}
								id={course.id}
								type={Course}
							></Card>
						);
					}
				})}
			</div>
		</>
	);
}

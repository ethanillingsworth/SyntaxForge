import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category } from "../firebase/Firebase";
import { CourseCard } from "../components/CourseCard";

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
			<div className="grid grid-cols-3 gap-3 mt-5">
				{courses.map((course) => {
					if (!course.hidden) {
						return <CourseCard id={course.id}></CourseCard>;
					}
				})}
			</div>
		</>
	);
}

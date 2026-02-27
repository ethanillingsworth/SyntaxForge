import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category } from "../firebase/Firebase";

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
						return (
							<a
								className={`unit`}
								style={{
									backgroundColor: course.color,
									color: course.textColor,
								}}
								key={course.id}
								href={`/${course.id}`}
							>
								<h3>
									{course.id.replaceAll("-", " ")}{" "}
									<span className="normal-case">
										{course.nickname
											? `(${course.nickname})`
											: ""}
									</span>
								</h3>
							</a>
						);
					}
				})}
			</div>
		</>
	);
}

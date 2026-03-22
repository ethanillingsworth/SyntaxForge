import { useEffect, useState } from "react";
import { Course } from "../firebase/Firebase";

export function CourseCard({ id }) {
	const [courseData, setCourseData] = useState(null);

	useEffect(() => {
		const course = new Course(id);
		course.get().then((data) => {
			setCourseData(data);
		});
	}, [id]);

	if (!courseData)
		return <div className="animate-pulse bg-gray-700 h-10 w-24 rounded" />;

	return (
		<a
			href={`/${id}`}
			className="raised flex flex-col gap-2 hover:scale-95 normal-case"
		>
			<h3 className="mt-0 text-center">
				{courseData.name}{" "}
				{courseData.nickname ? `(${courseData.nickname})` : null}
			</h3>
		</a>
	);
}

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
		<div className="raised flex flex-col gap-2">
			<h3 className="mt-0">
				{id.replaceAll("-", " ")} ({courseData.nickname})
			</h3>
		</div>
	);
}

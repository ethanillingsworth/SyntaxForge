import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "../firebase/Firebase";
import Lesson from "../components/Lesson";

export default function CoursePage() {
	const { courseId } = useParams();
	const [data, setData] = useState({});

	const [units, setUnits] = useState([]);

	useEffect(() => {
		window.course = courseId;
		const course = new Course(courseId);
		course.get().then((d) => {
			setData(d);
		});

		course.getAllUnits().then((l) => {
			setUnits(l);
		});
	}, [courseId]);

	return (
		<>
			<div className="flex flex-row">
				<h1>{data.id?.replaceAll("-", " ")}</h1>
			</div>
			<h2>Course Description</h2>
			<p>{data.desc}</p>

			<h2>Unit Overview</h2>
			<div className="flex flex-col">
				{units.map((unit) => {
					return (
						<ul>
							<li
								id={`unit-${unit.number}`}
								className="hover:bg-none hover:border-none"
							>
								Unit {unit.number} | {unit.name}
							</li>
							<ul>
								{unit.lessons?.map((lesson, index) => {
									return (
										<Lesson
											course={courseId}
											unit={unit.number}
											type={lesson.type}
											id={index}
											index={index}
										>
											{lesson.title}
										</Lesson>
									);
								})}
							</ul>
						</ul>
					);
				})}
			</div>

			<div className="relative w-full flex flex-col place-content-center place-items-center mt-5">
				<progress
					className="w-full h-8"
					value="60"
					max="100"
				></progress>

				<span className="absolute h-full top-0 inset-0 flex items-center justify-center font-bold text-white text-shadow-black text-shadow-xs pointer-events-none">
					{`${data.percent}%`}
				</span>
			</div>
		</>
	);
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course } from "../firebase/Firebase";
import Unit from "../components/Unit";
import { useUser } from "../Global";

export default function CoursePage() {
	const { courseId } = useParams();
	const [data, setData] = useState({});

	const [units, setUnits] = useState([]);
	const user = useUser();

	const [courseAdded, setCourseAdded] = useState(false);

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

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		if (!user) return;

		user.get().then((data) => {
			setCourseAdded(!!data?.courses[courseId].added);
		});
	}, [courseId, user]);

	function addOrRemoveCourse() {
		user.set("public", {
			courses: {
				[courseId]: {
					added: !courseAdded,
				},
			},
		});

		setCourseAdded((v) => {
			return !v;
		});
	}

	return (
		<>
			<div className="flex flex-row">
				<h1>{data.id?.replaceAll("-", " ")}</h1>
				<button className="ml-auto" onClick={addOrRemoveCourse}>
					{courseAdded ? "Remove Course" : "Add Course"}
				</button>
			</div>
			<h2>Course Description</h2>
			<p>{data.desc}</p>

			<h2>Unit Overview</h2>
			<div className="grid grid-cols-4 gap-3">
				{units.map((unit) => {
					return <Unit number={unit.number}>{unit.name}</Unit>;
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

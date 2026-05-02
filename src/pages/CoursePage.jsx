import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, Unit } from "../firebase/Firebase";
import Lesson from "../components/Lesson";
import { stringToId, useAdmin } from "../Global";
import PopupMenu from "../components/PopupMenu";

export default function CoursePage() {
	const { courseId } = useParams();
	const [data, setData] = useState({});
	const [units, setUnits] = useState([]);

	const [showUnitMenu, setShowUnitMenu] = useState(false);
	const [unitMenuPos, setUnitMenuPos] = useState();
	const [currentUnit, setCurrentUnit] = useState();
	const [isAdmin, setIsAdmin] = useState(false);

	useAdmin(
		useCallback((admin) => {
			setIsAdmin(admin);
		}),
		[],
	);

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

	const unitTemplate = {
		name: {
			label: "Lesson Name:",
		},
		type: {
			label: "Lesson Type:",
			type: "select",
			options: ["article", "mcq", "frq"],
		},
	};

	return (
		<>
			{showUnitMenu & isAdmin ? (
				<PopupMenu
					closeAction={() => {
						setShowUnitMenu(false);
					}}
					submitAction={(values) => {
						const u = new Unit(currentUnit);

						u.createLesson(values.name, values.type);

						setShowUnitMenu(false);
					}}
					position={unitMenuPos}
					dataTemplate={unitTemplate}
				/>
			) : null}

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
								className="hover:bg-none hover:border-none font-semibold"
								onContextMenu={(e) => {
									e.preventDefault();
									setCurrentUnit(unit.id);
									setShowUnitMenu(true);
									setUnitMenuPos({
										x: e.clientX,
										y: e.clientY,
									});
								}}
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
											id={stringToId(lesson.title)}
											key={index}
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

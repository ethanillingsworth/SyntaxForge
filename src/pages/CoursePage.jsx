import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Category, Course, Unit } from "../firebase/Firebase";
import Lesson from "../components/Lesson";
import { stringToId, useAdmin } from "../Global";
import PopupMenu from "../components/PopupMenu";
import { Card } from "../components/Card";

export default function CoursePage() {
	const { courseId } = useParams();
	const [data, setData] = useState({});
	const [units, setUnits] = useState([]);

	const [showUnitMenu, setShowUnitMenu] = useState(false);
	const [unitMenuPos, setUnitMenuPos] = useState();
	const [currentUnit, setCurrentUnit] = useState();
	const [currentUnitNum, setCurrentUnitNum] = useState();

	const [showLessonMenu, setShowLessonMenu] = useState(false);
	const [lessonMenuPos, setLessonMenuPos] = useState();
	const [currentLesson, setCurrentLesson] = useState();

	const [isAdmin, setIsAdmin] = useState(false);

	useAdmin(
		useCallback((admin) => {
			setIsAdmin(admin);
		}, []),
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

	const lessonTemplate = {
		up: {
			type: "button",
			label: "Up",
			click: () => {
				/** @type {Array} */
				const lessons = units[currentUnitNum].lessons;

				const l1 = lessons.splice(currentLesson, 1)[0];
				lessons.splice(currentLesson - 1, 0, l1);

				setShowLessonMenu(false);

				const u = new Unit(currentUnit);

				setUnits((v) => {
					return v.map((unit, index) => {
						if (index !== currentUnitNum) return unit;

						return {
							...unit,
							lessons: lessons,
						};
					});
				});

				u.set({
					lessons: lessons,
				});
			},
		},
		down: {
			label: "Down",
			type: "button",
			click: () => {
				/** @type {Array} */
				const lessons = units[currentUnitNum].lessons;

				const l1 = lessons.splice(currentLesson, 1)[0];
				lessons.splice(currentLesson + 1, 0, l1);

				setShowLessonMenu(false);

				const u = new Unit(currentUnit);

				setUnits((v) => {
					return v.map((unit, index) => {
						if (index !== currentUnitNum) return unit;

						return {
							...unit,
							lessons: lessons,
						};
					});
				});

				u.set({
					lessons: lessons,
				});
			},
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

						setUnits((v) => {
							return v.map((unit, index) => {
								if (index !== currentUnitNum) return unit;

								// 2. Return a NEW object for the unit we are changing
								return {
									...unit,
									// 3. Ensure lessons exists and is a NEW array with the new item
									lessons: [
										...(unit.lessons || []),
										{
											title: values.name,
											type: values.type,
										},
									],
								};
							});
						});

						u.createLesson(values.name, values.type);

						setShowUnitMenu(false);
					}}
					position={unitMenuPos}
					dataTemplate={unitTemplate}
				/>
			) : null}

			{showLessonMenu & isAdmin ? (
				<PopupMenu
					closeAction={() => {
						setShowLessonMenu(false);
					}}
					submitAction={() => {
						setShowLessonMenu(false);
					}}
					position={lessonMenuPos}
					dataTemplate={lessonTemplate}
				/>
			) : null}

			<div className="flex flex-row">
				<h1>{data.id?.replaceAll("-", " ")}</h1>
				<div className="flex flex-row gap-2 ml-auto h-fit">
					{data.categorys?.map((category) => {
						return (
							<Card
								id={category}
								link={`/courses/${category}`}
								type={Category}
							></Card>
						);
					})}
				</div>
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
									setCurrentUnitNum(unit.number - 1);
									setShowUnitMenu(true);
									setUnitMenuPos({
										x: e.pageX,
										y: e.pageY,
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
											onContextMenu={(e) => {
												e.preventDefault();
												setCurrentUnit(unit.id);

												setCurrentUnitNum(
													unit.number - 1,
												);

												setCurrentLesson(index);

												setShowLessonMenu(true);
												setLessonMenuPos({
													x: e.clientX,
													y: e.clientY,
												});
											}}
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

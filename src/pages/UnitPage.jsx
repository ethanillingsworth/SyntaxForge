import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, Unit, User } from "../firebase/Firebase";
import Lesson from "../components/Lesson";
import PopupMenu from "../components/PopupMenu";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/init";
import { useUser } from "../Global";

export default function UnitPage() {
	const { courseId, unitName } = useParams();
	const [data, setData] = useState({});
	const [lessons, setLessons] = useState([]);

	const [userData, setUserData] = useState({});
	const user = useUser();

	const [unitNumber, setUnitNumber] = useState();

	const [isAdmin, setAdmin] = useState(false);

	const [addPopupPos, setAddPopupPos] = useState(null);
	const [showAddPopup, setShowAddPopup] = useState(false);

	const [deletePopupPos, setDeletePopupPos] = useState(null);
	const [showDeletePopup, setShowDeletePopup] = useState(false);
	const [recentLessonIndex, setRecentLessonIndex] = useState(null);

	let unit = useRef();

	useEffect(() => {
		const course = new Course(courseId);
		setUnitNumber(parseInt(unitName.split("-")[1]));
		course.getUnitFromNumber(unitNumber).then((unitData) => {
			let unitId = unitData.id;
			setData(unitData);
			setLessons(unitData.lessons || []);

			unit.current = new Unit(unitId);
		});
	}, [unitName, courseId, unitNumber]);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			const u = new User(user.uid);

			u.admin().then((v) => {
				setAdmin(v);
			});
		});
	}, [isAdmin]);

	useEffect(() => {
		user?.get().then((d) => {
			setUserData(d);
		});
	}, [user]);

	function createPopup() {
		setShowAddPopup(true);
	}

	function closeAddPopup() {
		setShowAddPopup(false);
	}

	const addTemplate = {
		title: { label: "Title: " },
		type: {
			type: "select",
			options: ["article", "mcq", "frq"],
		},
	};

	function submitAddPopup(data) {
		unit.current.createLesson(data.title, data.type);

		setLessons((v) => {
			return [...v, { title: data.title, type: data.type }];
		});
		closeAddPopup();
	}

	const openPopup = (e) => {
		e.preventDefault();

		setAddPopupPos({
			x: e.clientX,
			y: e.clientY,
		});
		createPopup(e);
	};

	return (
		<>
			{showAddPopup ? (
				<PopupMenu
					dataTemplate={addTemplate}
					closeAction={closeAddPopup}
					submitAction={submitAddPopup}
					position={addPopupPos}
				/>
			) : null}

			{showDeletePopup ? (
				<PopupMenu
					hideSubmit
					dataTemplate={{
						delete: {
							type: "button",
							click: () => {
								unit.current.removeLesson(recentLessonIndex);

								setLessons((value) => {
									const copy = [...value];
									copy.splice(recentLessonIndex, 1);

									return copy;
								});
								setShowDeletePopup(false);
								console.log(lessons);
							},
						},
						left: {
							type: "button",
							click: () => {
								setLessons((value) => {
									const copy = [...value];
									const element = copy.splice(
										recentLessonIndex,
										1,
									)[0];

									copy.splice(
										recentLessonIndex - 1,
										0,
										element,
									);
									unit.current.set({
										lessons: copy,
									});

									return copy;
								});

								setShowDeletePopup(false);
							},
						},
						right: {
							type: "button",
							click: () => {
								setLessons((value) => {
									const copy = [...value];
									const element = copy.splice(
										recentLessonIndex,
										1,
									)[0];

									copy.splice(
										recentLessonIndex + 1,
										0,
										element,
									);
									unit.current.set({
										lessons: copy,
									});

									return copy;
								});

								setShowDeletePopup(false);
							},
						},
					}}
					closeAction={() => {
						setShowDeletePopup(false);
					}}
					position={deletePopupPos}
				/>
			) : null}

			<div className="flex flex-row">
				<h1>{`Unit ${unitNumber} | ${data.name ?? "Loading..."}`}</h1>
				<a className="ml-auto" href="./">
					<button>Course Overview</button>
				</a>
			</div>
			<div className="flex flex-row w-full border-t border-t-zinc-700 pt-5 mb-5 gap-3">
				<h2 className="border-none p-0 m-0">Lesson Overview</h2>
				{isAdmin ? (
					<button onClick={openPopup}>Add Lesson</button>
				) : null}
			</div>

			<div className="grid grid-cols-2 gap-4">
				{lessons.map((lesson, index) => {
					return (
						<Lesson
							unit={unitNumber}
							index={index}
							course={courseId}
							id={index}
							type={lesson.type}
							progress={
								userData.courses?.[courseId]?.[unitNumber]?.[
									index
								]?.percent || 0
							}
							onContextMenu={(e) => {
								if (isAdmin) {
									e.preventDefault();

									setDeletePopupPos({
										x: e.clientX,
										y: e.clientY,
									});

									setRecentLessonIndex(index);

									setShowDeletePopup(true);
								}
							}}
						>
							{lesson.title}
						</Lesson>
					);
				})}
			</div>

			<div class="relative w-full flex flex-col place-content-center place-items-center mt-5">
				<progress class="w-full h-8" value="60" max="100"></progress>

				<span class="absolute h-full top-0 inset-0 flex items-center justify-center font-bold text-white text-shadow-black text-shadow-xs pointer-events-none">
					{`${data.percent}%`}
				</span>
			</div>
		</>
	);
}

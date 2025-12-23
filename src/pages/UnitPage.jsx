import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, Unit, User } from "../firebase/Firebase";
import Lesson from "../components/Lesson";

import plus from "../imgs/icons/plus.svg";
import PopupMenu from "../components/PopupMenu";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/init";

export default function UnitPage() {
	const { courseId, unitName } = useParams();
	const [data, setData] = useState({});

	const [unitNumber, setUnitNumber] = useState();
	const [showPopup, setShowPopup] = useState(false);

	const [lessons, setLessons] = useState([]);
	const [isAdmin, setAdmin] = useState(false);

	let course = useRef();

	useEffect(() => {
		course.current = new Course(courseId);
		setUnitNumber(parseInt(unitName.split("-")[1]));
		course.current.getUnitFromNumber(unitNumber).then((unitData) => {
			let unitId = unitData.id;
			setData(unitData);

			const unit = new Unit(unitId);

			unit.getAllLessons(courseId, parseInt(unitName.split("-")[1])).then(
				(list) => {
					setLessons(list);
				}
			);
		});
	}, [unitName, courseId, unitNumber]);

	useEffect(() => {
		console.log(data);
	}, [data]);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			const u = new User(user.uid);

			u.admin().then((v) => {
				setAdmin(v);
			});
		});
	}, [isAdmin]);
	function createPopup() {
		setShowPopup(true);
	}

	function closePopup() {
		setShowPopup(false);
	}

	const template = {
		title: {
			type: "text",
		},
		type: {
			type: "select",
			options: ["article"],
		},
	};

	function submit(data) {
		console.log(data);
		course.current
			.createLesson(unitNumber, data.title, data.type, lessons.length)
			.then(() => {
				setLessons((prev) => [
					...prev,
					{
						course: course.current.id,
						unit: unitNumber,
						title: data.title,
						type: data.type,
						index: lessons.length,
					},
				]);
			});
		closePopup();
	}

	return (
		<>
			{showPopup ? (
				<PopupMenu
					dataTemplate={template}
					closeAction={closePopup}
					submitAction={submit}
				/>
			) : null}
			<h1>{`Unit ${unitNumber} | ${data.name ?? "Loading..."}`}</h1>
			<div className="flex flex-row w-full border-t border-t-zinc-700 pt-5 mb-5 gap-3">
				<h2 className="border-none p-0 m-0">Lesson Overview</h2>
				{isAdmin ? (
					<img src={plus} className="h-7" onClick={createPopup} />
				) : null}
			</div>

			<div className="grid grid-cols-4 gap-3">
				{lessons.map((lesson) => {
					return (
						<Lesson
							index={lesson.index}
							course={courseId}
							id={lesson.id}
							type={lesson.type}
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

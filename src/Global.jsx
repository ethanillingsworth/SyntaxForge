import { useEffect } from "react";
import { Course, Unit, User } from "./firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/init";

export function useShortcut({ key, ctrl, shift, alt, meta }, callback) {
	useEffect(() => {
		const handler = (e) => {
			if (
				e.key.toLowerCase() === key.toLowerCase() &&
				(!ctrl || e.ctrlKey) &&
				(!shift || e.shiftKey) &&
				(!alt || e.altKey) &&
				(!meta || e.metaKey)
			) {
				e.preventDefault();
				callback(e);
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [key, ctrl, shift, alt, meta, callback]);
}

export function useAdmin(callback) {
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (!user) return;
			const u = new User(user.uid);
			return u.admin().then((status) => {
				callback(status);
			});
		});

		return unsub;
	}, [callback]);
}

export function useNextLesson(courseId, unitNumber, lessonId, callback) {
	useEffect(() => {
		const course = new Course(courseId);

		course.getUnitFromNumber(unitNumber).then((v) => {
			const unit = new Unit(v.id);
			unit.getNextLesson(lessonId).then((data) => {
				callback(data);
			});
		});
	}, [callback, courseId, lessonId, unitNumber]);
}

export function safeEval(input, test = null) {
	var logs = [];

	// eslint-disable-next-line no-unused-vars
	var console = {
		log: function () {
			for (const arg of arguments) {
				logs.push(arg);
			}
		},
	};
	// eslint-disable-next-line no-unused-vars
	var window = function () {};
	// eslint-disable-next-line no-unused-vars
	var document = function () {};
	// eslint-disable-next-line no-unused-vars
	var editor = function () {};
	// eslint-disable-next-line no-unused-vars
	var print = function () {};

	const a = function () {
		try {
			return eval(input + (test || ""));
		} catch (error) {
			logs.push(error.toString());
		}
	};

	// Return the eval'd result
	return { res: a(), logs: logs };
}

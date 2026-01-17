import {
	query,
	collection,
	where,
	getDocs,
	getDoc,
	doc,
	addDoc,
} from "firebase/firestore";
import { db, storage } from "./init";
import { getBlob, ref, uploadBytes } from "firebase/storage";
import { marked } from "marked";

class DataObject {
	static collectionPath = collection(db, "none");
	static path = "none";
	static name = "DataObject";

	constructor(id) {
		this.id = id;
	}

	static async getAll() {
		const q = query(this.collectionPath);
		const docs = await getDocs(q);

		const dataList = [];

		for (const d of docs.docs) {
			dataList.push({ ...d.data(), id: d.id });
		}

		return dataList;
	}

	async get() {
		const d = await getDoc(doc(db, this.constructor.path, this.id));

		if (!d.exists()) {
			console.error(`${this.name} with id "${this.id}" does not exist`);
		}

		return { ...d.data(), id: d.id };
	}
}

export class Course extends DataObject {
	static collectionPath = collection(db, "courses");
	static name = "Course";
	static path = "courses";

	constructor(id) {
		super(id);
	}

	async getUnitFromNumber(number) {
		const q = query(
			collection(db, "units"),
			where("parent", "==", this.id),
			where("number", "==", number)
		);

		const docs = await getDocs(q);

		let data = {};

		for (const d of docs.docs) {
			data = { ...d.data(), id: d.id };
		}

		return data;
	}

	async createLesson(unit, title, type, index) {
		await addDoc(collection(db, "lessons"), {
			course: this.id,
			unit,
			title,
			type,
			index,
		});
	}

	async getAllUnits() {
		const q = query(
			collection(db, "units"),
			where("parent", "==", this.id)
		);
		const docs = await getDocs(q);

		let dataList = [];

		for (const d of docs.docs) {
			dataList.push({ ...d.data(), id: d.id });
		}

		dataList = dataList.sort((a, b) => a.number - b.number);

		return dataList;
	}
}

export class Lesson extends DataObject {
	static collectionPath = collection(db, "lessons");
	static path = "lessons";
	static name = "Lesson";

	constructor(id) {
		super(id);
	}
}

export class Unit extends DataObject {
	static collectionPath = collection(db, "units");
	static name = "Unit";

	constructor(id) {
		super(id);
	}

	async getNextLesson(lessonId) {
		const lesson = new Lesson(lessonId);

		const data = await lesson.get();

		const nextIndex = data.index + 1;

		const nextLessonData = await this.getLessonFromIndex(
			nextIndex,
			data.course,
			data.unit
		);

		return nextLessonData;
	}

	async getLessonFromIndex(index, course, unit) {
		const q = query(
			collection(db, "lessons"),
			where("course", "==", course),
			where("unit", "==", unit),
			where("index", "==", index)
		);
		const docs = await getDocs(q);

		console.log(docs.docs);

		let dataList = [];

		for (const d of docs.docs) {
			dataList.push({ ...d.data(), id: d.id });
		}

		return dataList[0];
	}

	async getAllLessons(course, unit) {
		const q = query(
			collection(db, "lessons"),
			where("course", "==", course),
			where("unit", "==", unit)
		);
		const docs = await getDocs(q);

		let dataList = [];

		for (const d of docs.docs) {
			dataList.push({ ...d.data(), id: d.id });
		}

		dataList = dataList.sort((a, b) => a.index - b.index);

		return dataList;
	}
}

export class User {
	constructor(id) {
		this.id = id;
	}

	async admin() {
		const d = await getDoc(doc(db, "adminOnly", this.id));
		if (!d.exists()) {
			console.error(`${this.name} with id "${this.id}" does not exist`);
		}
		return d.data().admin;
	}
}

export class Category extends DataObject {
	static name = "Category";
	static path = "categorys";
	static collectionPath = collection(db, "categorys");

	constructor(id) {
		super(id);
	}

	async getAllCourses() {
		const q = query(
			collection(db, "courses"),
			where("categorys", "array-contains", this.id)
		);
		const docs = await getDocs(q);

		const dataList = [];

		for (const d of docs.docs) {
			dataList.push({ ...d.data(), id: d.id });
		}

		return dataList;
	}
}

export class Article extends Lesson {
	static name = "Article";
	constructor(id) {
		super(id);
	}

	async setContent(content) {
		const blob = new Blob([content], {
			type: "text/markdown",
		});

		await uploadBytes(ref(storage, `articles/${this.id}.md`), blob);
	}

	async getMarkdown() {
		const blob = await getBlob(ref(storage, `articles/${this.id}.md`));

		const text = await blob.text();

		const md = await marked.parse(text);

		return { raw: text, parsed: md };
	}

	async setDefault() {
		fetch("/default.md")
			.then((r) => {
				return r.blob();
			})
			.then(async (blob) => {
				await uploadBytes(ref(storage, `articles/${this.id}.md`), blob);
			});
	}
}

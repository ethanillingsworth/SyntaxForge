import {
	query,
	collection,
	where,
	getDocs,
	getDoc,
	doc,
	addDoc,
} from "firebase/firestore";
import { db } from "./init";

class DataObject {
	static collectionPath = collection(db, "null");
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
		const d = await getDoc(doc(db, "courses", this.id));

		if (!d.exists()) {
			console.error(`${this.name} with id "${this.id}" does not exist`);
		}

		return { ...d.data(), id: d.id };
	}
}

export class Course extends DataObject {
	static collectionPath = collection(db, "courses");
	static name = "Course";

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

		console.log(docs.docs);

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

export class Unit extends DataObject {
	static collectionPath = collection(db, "units");
	static name = "Unit";

	constructor(id) {
		super(id);
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

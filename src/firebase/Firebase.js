import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./init";

export default class Firebase {
	static async getAllCoursesFromCategory(category) {
		const q = query(
			collection(db, "courses"),
			where("categorys", "array-contains", category)
		);
		const docs = await getDocs(q);

		const dataList = [];

		for (const d of docs.docs) {
			dataList.push(d.data());
		}

		return dataList;
	}
}

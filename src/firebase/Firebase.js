import {
    query,
    collection,
    where,
    getDocs,
    getDoc,
    doc,
    setDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { db, storage } from "./init";
import { getBlob, ref, uploadBytes } from "firebase/storage";
import { marked } from "marked";

const RANKS = [
    {
        name: "Initiate",
        minXp: 0,
        color: "#94a3b8",
        description: "The journey begins.",
    },
    {
        name: "Scribe",
        minXp: 1500,
        color: "#38bdf8",
        description: "Translating thought into script.",
    },
    {
        name: "Artisan",
        minXp: 3000,
        color: "#818cf8",
        description: "Crafting code with style.",
    },
    {
        name: "Adept",
        minXp: 6000,
        color: "#c084fc",
        description: "Intuitive mastery of core syntax.",
    },
    {
        name: "Scholar",
        minXp: 10000,
        color: "#fb923c",
        description: "Master of theory and documentation.",
    },
    {
        name: "Veteran",
        minXp: 20000,
        color: "#f87171",
        description: "Survivor of complex debug cycles.",
    },
    {
        name: "Titan",
        minXp: 40000,
        color: "#f472b6",
        description: "A powerhouse of high-performance code.",
    },
    {
        name: "Oracle",
        minXp: 75000,
        color: "#2dd4bf",
        description: "Predicts errors before execution.",
    },
    {
        name: "Architect",
        minXp: 150000,
        color: "#fbbf24",
        description: "Designer of digital ecosystems.",
    },
];

export class DataObject {
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

    async set(data) {
        await setDoc(doc(db, this.constructor.path, this.id), data, {
            merge: true,
        });
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
            where("number", "==", number),
        );

        const docs = await getDocs(q);

        let data = {};

        for (const d of docs.docs) {
            data = { ...d.data(), id: d.id };
        }

        return data;
    }

    async getCategorysData() {
        const d = await this.get();
        const q = query(
            collection(db, "categorys"),
            where("__name__", "in", d.categorys),
        );

        const docs = await getDocs(q);

        let data = [];

        for (const d of docs.docs) {
            data.push({ ...d.data(), id: d.id });
        }

        return data;
    }

    async getAllUnits() {
        const q = query(
            collection(db, "units"),
            where("parent", "==", this.id),
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
    static path = "units";

    constructor(id) {
        super(id);
    }

    async createLesson(title, type) {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
        });

        // This returns MM/DD/YYYY, so we swap slashes for dashes
        const formattedDate = formatter.format(now).replace(/\//g, "-");
        await this.set({
            lessons: arrayUnion({
                title,
                type,
                date: formattedDate,
            }),
        });
    }

    async removeLesson(index) {
        const data = await this.get();
        const lessons = data.lessons;

        const lessonToRemove = lessons.find((_, i) => {
            return i === index;
        });

        await this.set({
            lessons: arrayRemove(lessonToRemove),
        });
    }
}

export class User {
    constructor(id) {
        this.id = id;
    }

    static async getFromUsername(username) {
        const c = await getDocs(
            query(collection(db, "public"), where("username", "==", username)),
        );
        if (c.docs[0]) {
            const u = new User(c.docs[0].id);

            return u;
        }

        return null;
    }

    getCurrentRank(userXp) {
        return (
            [...RANKS].reverse().find((rank) => userXp >= rank.minXp) ||
            RANKS[0]
        );
    }

    getNextRank(userXp) {
        let currentRankIndex = -1;

        // 1. Find where the user currently sits in the hierarchy
        for (let i = 0; i < RANKS.length; i++) {
            const rank = RANKS[i];
            const nextRank = RANKS[i + 1];

            if (
                userXp >= rank.minXp &&
                (!nextRank || userXp < nextRank.minXp)
            ) {
                currentRankIndex = i;
                break;
            }
        }

        // 2. Check if they have reached the final rank (Architect)
        if (currentRankIndex === -1 || currentRankIndex === RANKS.length - 1) {
            return null;
        }

        // 3. Identify the next rank and calculate the remaining XP
        const nextRank = RANKS[currentRankIndex + 1];
        const xpNeeded = nextRank.minXp - userXp;

        return {
            name: nextRank.name,
            minXp: nextRank.minXp,
            color: nextRank.color,
            description: nextRank.description,
            xpNeeded: xpNeeded,
        };
    }

    async get(type = "public") {
        const d = await getDoc(doc(db, type, this.id));

        if (!d.exists()) {
            console.error(
                `User with id "${this.id}" and type "${type}" does not exist`,
            );
        }

        return { ...d.data(), id: d.id };
    }

    async set(type = "public", data = {}) {
        await setDoc(doc(db, type, this.id), data, { merge: true });
    }

    async giveXP(amount, percent, courseId, unitNumber, index, meta = {}) {
        const updatedData = {
            courses: {
                [courseId]: {
                    [parseInt(unitNumber)]: {
                        [index]: {
                            percent: percent,
                            xpEarned: amount,
                            ...meta,
                        },
                    },
                },
            },
        };

        await this.set("public", updatedData);
    }

    async getCourseData(courseId, unitNumber, index) {
        const data = await this.get("public");

        return data.courses[courseId][unitNumber][index];
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

    static async getAll() {
        const items = await super.getAll();

        // 1. Create an array of Promises without awaiting them yet
        const promises = items.map(async (item) => {
            const cate = new Category(item.id);
            const courses = await cate.getAllCourses();

            return { ...item, courses };
        });

        // 2. Execute all promises concurrently and wait for them all to finish
        return Promise.all(promises);
    }

    async getAllCourses() {
        const q = query(
            collection(db, "courses"),
            where("categorys", "array-contains", this.id),
        );
        const docs = await getDocs(q);

        const dataList = [];

        for (const d of docs.docs) {
            dataList.push({ ...d.data(), id: d.id });
        }

        return dataList;
    }
}

export class Article {
    static name = "Article";
    constructor(course, unitNumber, index) {
        this.course = course;
        this.unitNumber = unitNumber;
        this.index = index;
    }

    async setContent(content) {
        const blob = new Blob([content], {
            type: "text/markdown",
        });

        await uploadBytes(
            ref(
                storage,
                `courses/${this.course}/unit-${this.unitNumber}/articles/${this.index}.md`,
            ),
            blob,
        );
    }

    async getMarkdown() {
        const blob = await getBlob(
            ref(
                storage,
                `courses/${this.course}/unit-${this.unitNumber}/articles/${this.index}.md`,
            ),
        );

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
                await uploadBytes(
                    ref(
                        storage,
                        `courses/${this.course}/unit-${this.unitNumber}/articles/${this.index}.md`,
                    ),
                    blob,
                );
            });
    }
}

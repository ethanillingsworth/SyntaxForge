// Firebase
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

// DOM libs
import "../css/tailwind.css";
import $ from "jquery";

// Code Editor stuff
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { basicDark } from "@fsegurai/codemirror-theme-bundle";
import { indentWithTab } from "@codemirror/commands";
import { keymap, EditorView } from "@codemirror/view";
import { Prec } from "@codemirror/state";

// Load JSON data
const courses = (await (await fetch("/data/courses.json")).json()) || {};

/**
 * Creates a new user object
 *
 * @param {string} uid - User's unique id
 * @returns {User} The new User object
 *
 * @example
 * const user = new User("nouser")
 * const user = new User("ejnf24h24ufn2")
 */
export class User {
	constructor(uid) {
		this.uid = uid;
	}

	/**
	 * Get the users public data from firebase
	 *
	 * @returns {object} The data returned in the form of a dict
	 *
	 * @example
	 * const data = user.get() // returns {} if user.uid == "nouser" or data not found
	 * const data = user.get() // returns data if found
	 */
	async get() {
		if (this.uid == "nouser") {
			return {};
		}
		const r = await getDoc(doc(db, `public/${this.uid}`));

		if (r.exists()) {
			return r.data();
		} else {
			return {};
		}
	}
	/**
	 * Check if a user is an admin or not
	 *
	 * @returns {boolean} True if admin, false if not
	 *
	 * @example
	 * const admin = user.admin() // true or false
	 */
	async admin() {
		if (this.uid == "nouser") {
			return false;
		}

		const r = await getDoc(doc(db, `adminOnly/${this.uid}`));

		if (r.exists()) {
			return r.data().admin;
		}

		return false;
	}
	/**
	 * Add data to users public directory
	 *
	 * @param {object} data - Data to add users public dir
	 *
	 * @returns {null}
	 *
	 * @example
	 * user.update({"name": "test"}) // adds "name": "test" to public
	 */
	async update(data) {
		if (this.uid == "nouser") {
			return;
		}
		await setDoc(doc(db, `public/${this.uid}`), data, { merge: true });
	}
	/**
	 * Creates a new user
	 *
	 * @param {string} email - Users email
	 * @param {string} password - Users password
	 *
	 * @returns {null}
	 *
	 * @example
	 * User.create("sample@syntaxforge.dev", "1234") // Creates user
	 */
	static async create(email, password) {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed up
				const user = userCredential.user;
				if (user) {
					setDoc(doc(db, `public/${user.uid}`), {
						uid: user.uid,
						// username: username
					});
					setDoc(doc(db, `private/${user.uid}`), {
						email: email,
					});
				}

				// ...
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log(errorMessage);
			});
	}
}

export class Lesson {
	constructor(parent, index) {
		this.parent = parent;
		this.index = index;
	}

	get() {
		return this.parent.get().lessons[this.index];
	}
}

export class Section {
	constructor(parent, index) {
		this.parent = parent;
		this.index = index;
	}

	getLessons() {
		const l = [];
		for (const index in this.get().lessons) {
			l.push(new Lesson(this, index));
		}

		return l;
	}

	getLesson(index) {
		return new Lesson(this, index);
	}

	get() {
		return this.parent.get().sections[this.index];
	}
}

/**
 * Creates a new course object
 *
 * @param {string} id - Course id (from courses.json)
 *
 * @returns {Course} - Course object created
 *
 * @example
 * const course = new Course("js101")
 */
export class Course {
	constructor(id) {
		this.id = id;
	}
	/**
	 * Get all sections with this course as a parent
	 *
	 * @returns {Section[]} - Sorted list of lessons by id in ascending order
	 *
	 * @example
	 * course.getSections() // [Lesson1, Lesson2]
	 */
	getSections() {
		const data = this.get();

		const l = [];

		for (const index in data.sections) {
			l.push(new Section(this, index));
		}
		return l;
	}

	getSection(index) {
		return new Section(this, index);
	}

	/**
	 * Get all courses in courses.json
	 *
	 * @returns {Course[]} - List of courses
	 *
	 * @example
	 * Course.getAll() // [Course1, Course2]
	 */
	static getAll() {
		return Object.keys(courses).map((id) => {
			return new Course(id);
		});
	}

	/**
	 * Returns Course data
	 *
	 * @returns {object} - Course data or {}
	 *
	 * @example
	 * const courseData = course.get()
	 */
	get() {
		return courses[this.id] || {};
	}
	/**
	 * Displays course info on /courses
	 *
	 * @param {string} id - Id of the user to check for where to display courses
	 *
	 * @returns {object} - Course data or {}
	 *
	 * @example
	 * Course.display("SOMEUSERID")
	 * Course.display() // for a user logged out
	 */
	async display(id = "nouser") {
		const userData = (await new User(id).get())["courses"];

		const data = this.get();

		const link = $("<a/>")
			.addClass("card")
			.attr("href", `/course/${this.id}`);
		const name = $("<h3/>").text(data.name);
		const desc = $("<p/>").text(data.desc);
		const progress = $("<progress/>").attr("max", 100).val(0);

		let num = 0;
		let percent = 0;

		const l = this.getSections();
		let total = 0;

		for (const section of l) {
			for (const lesson of section.getLessons()) {
				if (
					userData &&
					userData[this.id] &&
					userData[this.id][section.index] &&
					userData[this.id][section.index][lesson.index]
				) {
					const lessonData =
						userData[this.id][section.index][lesson.index];

					if (lessonData.finished) {
						num += 1;
					}
				}
				total += 1;
			}
		}

		percent = Math.round((num / total) * 100) || 0;
		progress.val(percent);

		link.append(name, desc, progress);
		let on = $("#yours");
		if (percent == 0) {
			on = $("#avail");
		}
		$(on).append(link);
	}
}

/**
 * Creates a new editor object
 *
 * @param {JQuery.<HTMLElement>} [parent = $("#editor")] - Element to place editor on
 * @param {string} [defaultCode = ""] - Element to place editor on
 *
 * @returns {Editor} - New editor object
 *
 * @example
 * const editor = new Editor()
 * const editor = new Editor($("#SOMEELEMENT")) // with parent
 * const editor = new Editor($("#SOMEELEMENT"), SOMECODEVAR) // with parent & default code
 */
export class Editor {
	constructor(parent = $("#editor"), defaultCode = "") {
		this.wrapper = $("<div>").addClass("editor gap-0");

		this.col = $("<div/>").addClass(
			"col h-full max-w-4/5 w-full gap-0 place-content-start place-items-start"
		);

		this.buttons = $("<div/>").addClass(
			"row w-full bg-forge-surface p-2 place-content-end border-t-4 border-t-forge-accent text-sm"
		);

		this.buttonsBack = $("<div/>").addClass("row mr-auto");

		this.buttons.append(this.buttonsBack);

		this.terminal = $("<div/>")
			.addClass("terminal order-last md:order-none min-w-1/5")
			.text("SyntaxForge Terminal v1.0.0");

		this.wrapper.append(this.col, this.terminal);

		this.view = new EditorView({
			extensions: [
				basicSetup,
				javascript(),
				basicDark,
				Prec.highest(
					keymap.of([
						indentWithTab,
						{
							key: "Mod-Enter",
							run: () => {
								console.log("Mod-Enter triggered");
								this.runButton.trigger("click");
								return true;
							},
						},
					])
				),
			],
			parent: this.col[0],
		});

		this.fontSize = $("<select/>")
			.html(
				`
            <option>10px</option>
            <option>12px</option>
            <option>14px</option>
            <option selected>16px</option>
            <option>18px</option>
            <option>20px</option>`
			)
			.addClass("muted");

		const editorSize = localStorage.getItem("editorSize") || "16px";

		this.fontSize.val(editorSize);

		this.fontSize.on("change", () => {
			$(".cm-editor").css("font-size", this.fontSize.val());
			localStorage.setItem("editorSize", this.fontSize.val());
		});

		this.runButton = $("<button/>").text("Run Code");

		this.runButton.on("click", () => {
			this.terminal.text("");
			for (const log of this.safeEval(this.getContent()).logs) {
				this.terminal.append($("<span/>").text(log));
			}
			this.terminal.scrollTop(this.terminal.get(0).scrollHeight);
		});

		this.addCustomButton(this.runButton);
		this.addCustomButton(this.fontSize, true);

		this.col.append(this.buttons);

		this.setContent(defaultCode);

		parent.append(this.wrapper);
		$(".cm-editor").css("font-size", editorSize);

		$(document).on("keypress", (e) => {
			if (e.ctrlKey && e.key == "Enter") {
				this.runButton.trigger("click");
			}
		});
	}
	/**
	 * Disables the editors terminal
	 *
	 * @example
	 * editor.disableTerminal() // Terminal gets hidden
	 */
	disableTerminal() {
		this.terminal.addClass("hidden");
	}
	/**
	 * Enables the editors terminal
	 *
	 * @example
	 * editor.enableTerminal() // Terminal gets unhidden
	 */
	enableTerminal() {
		this.terminal.removeClass("hidden");
	}

	verticalMode() {
		this.wrapper.addClass("flex flex-col h-full");
		this.col.addClass("flex-1 overflow-auto");
		this.col.removeClass("max-w-4/5").addClass("w-full"); // full width
		this.terminal.css({
			minWidth: "100%",
			height: "250px",
			flexShrink: 0,
		});
	}

	/**
	 * Adds an element to the editors buttons
	 *
	 * @param {JQuery.<HTMLElement>} e - Element to add
	 * @param {boolean} [back = false] - Place on the backside or frontside
	 *
	 * @example
	 * editor.addCustomButton($("#SOMEELMT"))
	 * editor.addCustomButton($("#SOMEELMT"), true) // adds to other side
	 */
	addCustomButton(e, back = false) {
		if (back) {
			this.buttonsBack.append(e);
		} else {
			this.buttons.append(e);
		}
	}
	/**
	 * Safely evaluate users js on the frontend with a test case added if wanted
	 *
	 * @param {string} input - Code to test
	 * @param {string} [test = null] - Test case or null for none
	 *
	 * @example
	 * editor.saveEval(editor.getContent()) // tests current content
	 * editor.saveEval(editor.getContent(), ";test == true") // tests current content with test case
	 */
	safeEval(input, test = null) {
		var logs = [];

		var console = {
			log: function (text) {
				logs.push(text);
			},
		};
		var window = function () {};
		var document = function () {};
		var editor = function () {};
		var print = function () {};

		const a = function () {
			return eval(input + (test || ""));
		};

		// Return the eval'd result
		return { res: a(), logs: logs };
	}
	/**
	 * Gets the editors current content
	 *
	 * @returns {string} - Editors current content
	 *
	 * @example
	 * editor.getContent() // "Some string"
	 */
	getContent() {
		return this.view.state.doc.toString();
	}
	/**
	 * Sets editor content to a piece of code
	 *
	 * @param {code} input - Code to set content to
	 *
	 * @example
	 * editor.setContent("// This is some codes")
	 */
	setContent(code) {
		this.view.dispatch({
			changes: {
				from: 0,
				to: this.view.state.doc.length,
				insert: code,
			},
		});
	}
}

onAuthStateChanged(auth, (user) => {
	if (user) {
		// Hide the login button
		$("#login").addClass("hidden");

		// Create avatar container
		const avatarContainer = $("<div/>")
			.attr("id", "user-avatar")
			.addClass("relative cursor-pointer");

		// Function to generate a consistent color from string (like how Google does)
		const stringToColor = (str) => {
			const colors = [
				"#F44336",
				"#E91E63",
				"#9C27B0",
				"#673AB7",
				"#3F51B5",
				"#2196F3",
				"#03A9F4",
				"#00BCD4",
				"#009688",
				"#4CAF50",
				"#8BC34A",
				"#CDDC39",
				"#FF9800",
				"#FF5722",
				"#795548",
				"#607D8B",
			];
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				hash = str.charCodeAt(i) + ((hash << 5) - hash);
			}
			return colors[Math.abs(hash) % colors.length];
		};

		// Function to get the first letter
		const getInitial = (name, email) => {
			if (name) {
				return name.charAt(0).toUpperCase();
			}
			return email ? email.charAt(0).toUpperCase() : "U";
		};

		// Function to create default avatar
		const createDefaultAvatar = (size, fontSize) => {
			const initial = getInitial(user.displayName, user.email);
			const bgColor = stringToColor(user.email);

			return $("<div/>")
				.text(initial)
				.addClass(
					`${size} rounded-full border-2 border-forge-accent text-white font-medium ${fontSize}`
				)
				.css({
					backgroundColor: bgColor,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				});
		};

		// Create avatar - either image or default
		let avatar;
		if (user.photoURL) {
			avatar = $("<img/>")
				.attr("src", user.photoURL)
				.attr("alt", "User Avatar")
				.addClass(
					"w-10 h-10 rounded-full border-2 border-forge-accent object-cover"
				)
				.on("error", function () {
					$(this).replaceWith(
						createDefaultAvatar("w-10 h-10", "text-lg")
					);
				});
		} else {
			avatar = createDefaultAvatar("w-10 h-10", "text-lg");
		}

		// Create popup menu (hidden by default)
		const popup = $("<div/>")
			.attr("id", "avatar-popup")
			.addClass(
				"hidden absolute right-0 top-12 bg-forge-surface border-2 border-forge-accent rounded-lg p-4 shadow-lg min-w-[200px] z-50"
			);

		// Popup avatar
		let popupAvatar;
		if (user.photoURL) {
			popupAvatar = $("<img/>")
				.attr("src", user.photoURL)
				.attr("alt", "User Avatar")
				.addClass("w-16 h-16 rounded-full mx-auto mb-2 object-cover")
				.on("error", function () {
					$(this).replaceWith(
						createDefaultAvatar(
							"w-16 h-16 mx-auto mb-2",
							"text-3xl"
						)
					);
				});
		} else {
			popupAvatar = createDefaultAvatar(
				"w-16 h-16 mx-auto mb-2",
				"text-3xl"
			);
		}

		const userName = $("<p/>")
			.text(user.displayName || user.email.split("@")[0])
			.addClass("text-center font-semibold mb-2");

		const userEmail = $("<p/>")
			.text(user.email)
			.addClass("text-center text-sm text-forge-subtext mb-4");

		const logoutButton = $("<button/>")
			.text("Logout")
			.addClass(
				"w-full bg-forge-accent text-white py-2 rounded hover:opacity-80"
			);

		// Logout functionality
		logoutButton.on("click", async () => {
			try {
				await signOut(auth);
				window.location.reload();
			} catch (error) {
				console.error("Error signing out:", error);
			}
		});

		// Assemble popup
		popup.append(popupAvatar, userName, userEmail, logoutButton);

		// Toggle popup on avatar click
		avatarContainer.on("click", (e) => {
			e.stopPropagation();
			popup.toggleClass("hidden");
		});

		// Close popup when clicking outside
		$(document).on("click", (e) => {
			if (!$(e.target).closest("#user-avatar").length) {
				popup.addClass("hidden");
			}
		});

		// Assemble avatar container
		avatarContainer.append(avatar, popup);

		// Add to header (replace the #back div content)
		$("#back").append(avatarContainer);
	} else {
		// User is signed out
		$("#login").removeClass("hidden");
		$("#user-avatar").remove();
	}
});

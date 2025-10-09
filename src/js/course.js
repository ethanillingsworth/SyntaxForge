import { onAuthStateChanged } from "firebase/auth";
import { Course, User } from "./main.js";
import { initMobileMenu } from './mobile-menu.js';
import $ from "jquery";
import { auth } from "./firebase.js";

// Initialize mobile menu
initMobileMenu();

const pathParts = window.location.pathname.split("/");
const courseId = pathParts[pathParts.length - 1];

if (courseId == "course" || courseId == "") window.location.href = "/courses";

const course = new Course(courseId);

const data = await course.get();

document.title = `SyntaxForge | ${data.name}`;

$("#name").text(data.name);
$("#desc").text(data.desc);

const sections = course.getSections();

for (const section of sections) {
	let open = false;

	const sec = $("<div/>").addClass("w-full");

	const head = $("<div/>")
		.addClass("section")
		.attr("id", "section-" + section.index);
	const secData = section.get();

	const dropdown = $("<img/>")
		.attr("src", "/imgs/icons/dropdown.svg")
		.addClass("ml-auto h-6");

	head.append($("<h2/>").text(`Unit ${section.index} | ${secData.title}`));
	head.append(dropdown);

	const lessonsContent = $("<div/>").addClass("lessonsContent");

	head.on("click", () => {
		if (open) {
			lessonsContent.removeClass("flex");
			head.removeClass("rounded-br-none rounded-bl-none");
			dropdown.removeClass("rotate-90");
		} else {
			lessonsContent.addClass("flex");
			head.addClass("rounded-br-none rounded-bl-none");
			dropdown.addClass("rotate-90");
		}
		open = !open;
	});

	for (const lesson of section.getLessons()) {
		const lessonData = lesson.get();
		const l = $("<a/>")
			.attr(
				"href",
				`/course/${courseId}/section-${section.index}/lesson-${lesson.index}`
			)
			.addClass(`lesson text-forge-text text-lg`)
			.attr("id", `${section.index}-${lesson.index}`)
			.text(
				`Lesson ${lesson.index} | ${lessonData.title} | ${lessonData.type}`
			);

		lessonsContent.append(l);
	}

	sec.append(head);
	sec.append(lessonsContent);

	$("#lessons").append(sec);
}

onAuthStateChanged(auth, async () => {
	const cu = auth.currentUser;
	let id;

	if (cu) {
		id = cu.uid;
	} else {
		id = "nouser";
	}

	const user = new User(id);

	const userData = (await user.get())["courses"];

	let num = 0;
	let total = 0;
	if (Object.keys(userData || {}).length > 0) {
		const sections = course.getSections();

		for (const section of sections) {
			let numberGoodSec = 0;
			let totalSec = 0;
			for (const lesson of section.getLessons()) {
				if (
					userData &&
					userData[course.id] &&
					userData[course.id][section.index] &&
					userData[course.id][section.index][lesson.index] &&
					userData[course.id][section.index][lesson.index].finished
				) {
					$(`#${section.index}-${lesson.index}`).addClass(
						"gradient-bg font-bold"
					);
					num++;
					numberGoodSec += 1;
				}
				total += 1;
				totalSec += 1;
			}
			if (numberGoodSec == totalSec) {
				$(`#section-${section.index}`).addClass("gradient-bg");
			}
		}

		let percent = Math.round((num / total) * 100) || 0;
		$("#pbar").val(percent);

		if (percent == 0) {
			$("#per").text("Not started");
		} else if (percent == 100) {
			$("#per").text("DONE!");
		} else {
			$("#per").text(`${percent}% Done`);
		}
	} else {
		$("#per").text("Not started");
	}
});

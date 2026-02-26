import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "../components/Editor";
import { useShortcut, useUser } from "../Global";
import { useParams } from "react-router-dom";
import { deleteField } from "firebase/firestore";

export default function PlaygroundPage() {
	const { playgroundId } = useParams();

	const [title, setTitle] = useState("Loading...");

	const [lang, setLang] = useState("JavaScript");
	const [content, setContent] = useState("");

	let name = useRef();

	const user = useUser();
	useEffect(() => {
		user?.get("private").then((data) => {
			const playground = data.playgrounds[playgroundId];
			name.current = playground.name;
			setTitle(playground.name);
			setLang(playground.lang || "JavaScript");
			setContent(playground.content || "");
		});
	}, [playgroundId, user]);

	const extraSettings = useMemo(
		() => ({
			heading2: {
				type: "text",
				label: "Playground Settings",
			},

			playgroundName: {
				label: "Display Name: ",
				value: title,
			},

			lang: {
				type: "select",
				label: "Language: ",
				options: ["JavaScript", "Python"],
				value: lang,
			},

			delete: {
				type: "button",
				label: "Delete Playground",
				click: () => {
					user.set("private", {
						playgrounds: {
							[playgroundId]: deleteField(),
						},
					}).then(() => {
						window.location.href = "/";
					});
				},
			},
		}),
		[lang, playgroundId, title, user],
	);

	function onSettingsSubmit(values) {
		setLang(values.lang);
		setTitle(values.playgroundName);

		user.set("private", {
			playgrounds: {
				[playgroundId]: {
					lang: values.lang,
					name: values.playgroundName,
				},
			},
		});
	}

	function updateContent(value) {
		setContent(value);
	}

	useShortcut({ key: "s", ctrl: true }, () => {
		user.set("private", {
			playgrounds: {
				[playgroundId]: {
					content: content,
				},
			},
		});

		setTitle("Saving...");

		setTimeout(() => {
			setTitle(name.current);
		}, 1000);
	});

	return (
		<>
			<Editor
				title={title}
				extraSettings={extraSettings}
				language={lang.toLowerCase()}
				value={content}
				onChange={updateContent}
				onSettingsSubmit={onSettingsSubmit}
			></Editor>
		</>
	);
}

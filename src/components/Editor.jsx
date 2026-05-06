import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

import PopupMenu from "./PopupMenu";
import { useEffect, useMemo, useState } from "react";
import { useShortcut, useUser } from "../Global";
import {
	githubDark,
	consoleDark,
	xcodeDark,
	vscodeDark,
} from "@uiw/codemirror-themes-all";

import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { color } from "@uiw/codemirror-extensions-color";

import axios from "axios";
import { Card } from "./Card";
import { Category } from "../firebase/Firebase";

export default function Editor({
	title,
	language = "javascript",
	hideSettings = false,
	showDecorativeButtons = false,
	noLoginRequired = false,
	topBarItems = [],
	extraSettings = {},
	onChange = () => {},
	onSettingsSubmit = () => {},
	value = "",
}) {
	const user = useUser();

	const [showPopup, setPopup] = useState(false);
	const [popupPos, setPopupPos] = useState(null);

	const [fontSize, setFontSize] = useState(14);

	const [content, setContent] = useState(value);

	const [terminalLines, setTerminalLines] = useState([
		"SyntaxForge Terminal v1",
	]);

	const [theme, setTheme] = useState("Dark");

	useEffect(() => {
		user?.get("private").then((data) => {
			setFontSize(parseInt(data.editorSettings?.textSize) || 14);
			setTheme(data.editorSettings?.theme || "Dark");
		});
	}, [user]);

	useEffect(() => {
		setContent(value);
	}, [value]);

	function updateSettings(values) {
		setFontSize(values.textSize);

		if (values.theme) {
			setTheme(values.theme);
		}

		user?.set("private", {
			editorSettings: {
				textSize: values.textSize,
				theme: values.theme,
			},
		});

		onSettingsSubmit(values);

		closePopup();
	}

	function openPopup(e) {
		setPopupPos({
			x: e.clientX,
			y: e.clientY,
		});

		setPopup(true);
	}

	function closePopup() {
		setPopup(false);
	}

	function runCode() {
		console.log(content);
		setTerminalLines(["Running Code..."]);
		if (user || noLoginRequired) {
			axios
				.post("https://runcode-qjvn4b2nya-uc.a.run.app", {
					code: content,
					lang: language,
				})
				.then((res) => {
					setTerminalLines((v) => {
						return [...v, ...res.data.logs];
					});
				})
				.catch((e) => {
					console.error(e);
					if (e.status === 504) {
						setTerminalLines((v) => {
							return [...v, "ERROR: Timed Out"];
						});
					} else {
						setTerminalLines((v) => {
							return [...v, e.response.data.error];
						});
					}
				});
		} else {
			setTerminalLines((v) => {
				return [...v, "ERROR: User not logged in"];
			});
		}
	}

	useShortcut({ key: "=", ctrl: true }, () => {
		updateSettings({
			textSize: fontSize + 2,
		});
	});

	useShortcut({ key: "-", ctrl: true }, () => {
		updateSettings({
			textSize: fontSize - 2,
		});
	});

	const [themes] = useState({
		Dark: "dark",
		"Github Dark": githubDark,
		"Console Dark": consoleDark,
		"VSCode Dark": vscodeDark,
		"XCode Dark": xcodeDark,
	});

	const template = useMemo(
		() => ({
			heading1: {
				label: "Global Settings",
				type: "text",
			},

			textSize: {
				type: "number",
				value: fontSize,
				label: "Font Size: ",
				units: "px",
			},

			theme: {
				type: "select",
				options: Object.keys(themes),
				label: "Theme: ",
				value: theme,
			},

			...extraSettings,
		}),
		[fontSize, themes, theme, extraSettings],
	);

	const languageLookup = {
		javascript: javascript(),
		python: python(),
	};

	return (
		<>
			{showPopup ? (
				<PopupMenu
					closeAction={closePopup}
					submitAction={updateSettings}
					position={popupPos}
					dataTemplate={template}
				/>
			) : null}
			<div className="editor">
				<div className="head">
					{showDecorativeButtons ? (
						<div className="flex flex-row gap-2">
							<span className="w-3 h-3 bg-red-400 rounded-full"></span>
							<span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
							<span className="w-3 h-3 bg-green-400 rounded-full"></span>
						</div>
					) : null}
					<span>{title}</span>
					{!hideSettings ? (
						<button onClick={openPopup}>Settings</button>
					) : null}
					{topBarItems.map((item) => {
						if (item.type === "button") {
							return (
								<button onClick={item.onclick}>
									{item.text}
								</button>
							);
						} else {
							return <h2>{item.text}</h2>;
						}
					})}

					<Card
						id={language}
						type={Category}
						className={"ml-auto"}
					></Card>

					<button className="accent-button" onClick={runCode}>
						Run
					</button>
				</div>
				<div
					className="wrapper"
					style={{ fontSize: fontSize + "px" }}
				>
					<div className="inner">
						<CodeMirror
							className="normal-case w-full h-full"
							extensions={[
								languageLookup[language],
								hyperLink,
								color,
							]}
							onChange={(v, update) => {
								onChange(v, update);
								setContent(v);
							}}
							value={value}
							height="100%"
							theme={themes[theme]}
						/>
					</div>

					<div className="terminal">
						{terminalLines.map((line, index) => {
							return <span key={index}>{line}</span>;
						})}
					</div>
				</div>
			</div>
		</>
	);
}

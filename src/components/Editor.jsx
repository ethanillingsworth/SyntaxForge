import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

import PopupMenu from "./PopupMenu";
import { useEffect, useMemo, useState } from "react";
import { useShortcut, useUser } from "../Global";

import axios from "axios";

export default function Editor({
	title,
	language = "javascript",
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

	useEffect(() => {
		user?.get("private").then((data) => {
			setFontSize(data.editorSettings?.textSize || 14);
		});
	}, [user]);

	function updateSettings(values) {
		setFontSize(values.textSize);

		user.set("private", {
			editorSettings: {
				textSize: values.textSize,
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
		axios
			.post(" https://runcode-qjvn4b2nya-uc.a.run.app ", {
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
	}

	useEffect(() => {
		setContent(value);
	}, [value]);

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

			...extraSettings,
		}),
		[fontSize, extraSettings],
	);

	const languageLookup = {
		javascript: javascript(),
		python: python(),
	};

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
			<div className="flex flex-col m-0 h-full">
				<div className="flex flex-row p-2 place-items-center gap-3">
					<span>{title}</span>
					<button onClick={openPopup}>Settings</button>
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

					<button className="ml-auto accent-button" onClick={runCode}>
						Run
					</button>
				</div>
				<div
					className={`flex flex-row w-full h-full`}
					style={{ fontSize: fontSize + "px" }}
				>
					<div className="flex-1 min-h-0 overflow-auto">
						<CodeMirror
							className="normal-case w-full h-full"
							extensions={[languageLookup[language]]}
							onChange={(v, update) => {
								onChange(v, update);
								setContent(v);
							}}
							value={value}
							height="100%"
							theme="dark"
						/>
					</div>

					<div className="terminal">
						{terminalLines.map((line) => {
							return <span>{line}</span>;
						})}
					</div>
				</div>
			</div>
		</>
	);
}

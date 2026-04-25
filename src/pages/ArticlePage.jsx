import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article } from "../firebase/Firebase";

import Editor from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { materialDark } from "@uiw/codemirror-theme-material";
import { languages } from "@codemirror/language-data";
import { marked } from "marked";
import { useAdmin, useShortcut, useUser } from "../Global";

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);

export default function ArticlePage() {
	const { articleIndex, unitName, courseId } = useParams();

	const [articleContent, setArticleContent] = useState();
	const [rawContent, setRawContent] = useState("");
	const [isAdminAtStart, setAdminAtStart] = useState(false);
	const [isAdmin, setAdmin] = useState(false);

	const user = useUser();

	useAdmin(
		useCallback((status) => {
			setAdmin(status);
			setAdminAtStart(true);
		}, []),
	);

	useEffect(() => {
		const article = new Article(
			courseId,
			unitName.split("-")[1],
			articleIndex,
		);

		article
			.getMarkdown()
			.then((content) => {
				setRawContent(content.raw);
				setArticleContent(content.parsed);
			})
			.catch(() => {
				article.setDefault();
			});
	}, [articleIndex, courseId, unitName]);

	useEffect(() => {
		const xp = Math.floor(rawContent.length / 200) * 5;

		if (xp > 0) {
			user?.get().then((d) => {
				const firstView =
					!d.courses?.[courseId]?.[
						parseInt(unitName.split("-")[1])
					]?.[articleIndex];

				if (firstView) {
					const updatedData = {
						courses: {
							[courseId]: {
								[parseInt(unitName.split("-")[1])]: {
									[articleIndex]: {
										percent: 100,
										xpEarned:
											Math.floor(
												rawContent.length / 200,
											) * 5,
									},
								},
							},
						},
					};

					user?.set("public", updatedData);
				}
			});
		}
	}, [articleIndex, courseId, rawContent, unitName, user]);

	useEffect(() => {
		hljs.highlightAll();
	}, [rawContent, articleContent, isAdmin]);

	const onChange = (val) => {
		console.log(val);
		setArticleContent(marked.parse(val));
		setRawContent(val);
	};

	function submit() {
		const article = new Article(
			courseId,
			unitName.split("-")[1],
			articleIndex,
		);

		article.setContent(rawContent);

		alert("Saved!");
	}

	useShortcut({ key: "s", ctrl: true }, () => {
		submit();
	});

	useShortcut({ key: "a", ctrl: true }, () => {
		if (isAdminAtStart) setAdmin(!isAdmin);
	});

	return (
		<div
			className={`flex flex-row gap-3 w-full ${isAdmin ? "h-full" : ""}`}
		>
			{isAdmin ? (
				<div className="flex flex-col h-full">
					<Editor
						className="rounded overflow-auto h-full normal-case"
						height="100%"
						width="700px"
						indentWithTab
						theme={materialDark}
						extensions={[
							markdown({
								base: markdownLanguage,
								codeLanguages: languages,
							}),
						]}
						value={rawContent}
						onChange={onChange}
						tabsize={4}
					/>
					<div className="flex flex-row">
						<button onClick={submit}>Submit</button>
					</div>
				</div>
			) : null}
			<div
				className={`w-full flex flex-col ${
					isAdmin ? "overflow-auto" : ""
				}`}
			>
				<div
					dangerouslySetInnerHTML={{ __html: articleContent }}
					className="md"
				></div>
				<div className="flex flex-row gap-4 capitalize mt-8">
					<a href="../">
						<button>{`Back to ${unitName}`}</button>
					</a>
					{/* <a href={nextLesson}>
						<button>Next Lesson</button>
					</a> */}
				</div>
			</div>
		</div>
	);
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article, Course, Unit } from "../firebase/Firebase";

import Editor from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { materialDark } from "@uiw/codemirror-theme-material";
import { languages } from "@codemirror/language-data";
import { marked } from "marked";
import { useAdmin, useNextLesson, useShortcut } from "../Global";

export default function ArticlePage() {
	const { articleId, unitName, courseId } = useParams();

	const [articleContent, setArticleContent] = useState();
	const [rawContent, setRawContent] = useState("");
	const [isAdminAtStart, setAdminAtStart] = useState(false);
	const [isAdmin, setAdmin] = useState(false);
	const [nextLesson, setNextLesson] = useState();

	useAdmin((status) => {
		setAdmin(status);
		setAdminAtStart(true);
	});

	useEffect(() => {
		const article = new Article(articleId);

		article
			.getMarkdown()
			.then((content) => {
				setRawContent(content.raw);
				setArticleContent(content.parsed);
			})
			.catch(() => {
				if (isAdmin) {
					article.setDefault();
				}
			});
	}, [articleId, courseId, isAdmin, unitName]);

	useNextLesson(
		courseId,
		parseInt(unitName.split("-")[1]),
		articleId,
		(nextLessonData) => {
			setNextLesson(`../${nextLessonData.type}/${nextLessonData.id}`);
		}
	);

	const onChange = (val) => {
		setArticleContent(marked.parse(val));
		setRawContent(val);
	};

	function submit() {
		const article = new Article(articleId);

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
				<div className="flex flex-row gap-3 capitalize">
					<a href="../">
						<button>{`Back to ${unitName}`}</button>
					</a>
					<a href={nextLesson}>
						<button>Next Lesson</button>
					</a>
				</div>
			</div>
		</div>
	);
}

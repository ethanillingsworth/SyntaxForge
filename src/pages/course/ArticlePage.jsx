import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article, Course } from "../../firebase/Firebase";

import Editor from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { materialDark } from "@uiw/codemirror-theme-material";
import { languages } from "@codemirror/language-data";
import { marked } from "marked";
import { capitalize, useAdmin, useShortcut, useUser } from "../../Global";

import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);

export default function ArticlePage() {
    const { articleName, unitName, courseId } = useParams();

    const [articleContent, setArticleContent] = useState();
    const [rawContent, setRawContent] = useState("");
    const [title, setTitle] = useState("Loading...");
    const [date, setDate] = useState("Loading...");

    const user = useUser();
    const isAdmin = useAdmin();

    const courseName = capitalize(courseId.replaceAll("-", " "));
    const unit = unitName.split("-")[1];
    const articleIndex = articleName.split("-")[0];

    useEffect(() => {
        const article = new Article(courseId, unit, articleIndex);

        article
            .getMarkdown()
            .then((content) => {
                setRawContent(content.raw);
                setArticleContent(content.parsed);
            })
            .catch(() => {
                article.setDefault();
            });

        const course = new Course(courseId);

        course.getUnitFromNumber(parseInt(unit)).then((data) => {
            const lData = data.lessons[articleIndex];

            setTitle(lData.title);
            setDate(lData.date);
        });
    }, [articleIndex, courseId, unit]);

    // XP on load
    useEffect(() => {
        const xp = Math.floor(rawContent.length / 300) * 5;

        if (xp > 0) {
            user.giveXP(
                xp,
                100,
                courseId,
                unitName.split("-")[1],
                articleIndex,
            );
        }
    }, [articleIndex, courseId, rawContent, unitName, user]);

    useEffect(() => {
        hljs.highlightAll();
    }, [rawContent, articleContent, isAdmin]);

    const onChange = (val) => {
        setArticleContent(marked.parse(val));
        setRawContent(val);
    };

    function submit() {
        const article = new Article(courseId, unit, articleIndex);

        article.setContent(rawContent);

        alert("Saved!");
    }

    useShortcut({ key: "s", ctrl: true }, () => {
        submit();
    });

    return (
        <>
            <div className={`flex flex-col gap-4 w-full`}>
                {isAdmin ? (
                    <div className="flex flex-col h-full gap-4">
                        <Editor
                            className="rounded overflow-auto h-full normal-case"
                            height="500px"
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
                    <div className="md flex flex-row w-full">
                        <h1>{title}</h1>
                        <time
                            className="my-auto ml-auto text-lg font-semibold"
                            dateTime={date}
                        >
                            {date}
                        </time>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{ __html: articleContent }}
                        className="md mt-4"
                    ></div>
                    <div className="flex flex-row gap-4 capitalize mt-8">
                        <a href={`/${courseId}#unit-1`}>
                            <button>{`Back to ${courseName}`}</button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

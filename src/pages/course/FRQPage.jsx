import Editor from "../../components/Editor";
import { useEffect, useRef, useState } from "react";
import { Course, Unit } from "../../firebase/Firebase";
import { useParams } from "react-router-dom";
import { toCamelCase, toSnakeCase, useAdmin, useUser } from "../../Global";

import GEditor from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { materialDark } from "@uiw/codemirror-theme-material";
import { languages } from "@codemirror/language-data";
import { marked } from "marked";
import hljs from "highlight.js";
import { deleteField } from "firebase/firestore";

export default function FRQPage() {
    const { unitName, frqName, courseId } = useParams();
    const [data, setData] = useState();

    const unitId = parseInt(unitName.split("-")[1]);
    const frqId = parseInt(frqName.split("-")[0]);

    const [rawContent, setRawContent] = useState("");
    const [renderedContent, setRenderedContent] = useState("");

    const [code, setCode] = useState("");
    const [checks, setChecks] = useState([]);

    const [showChecks, setShowChecks] = useState(false);

    const unit = useRef();

    const user = useUser();
    const admin = useAdmin();

    useEffect(() => {
        const course = new Course(courseId);

        course.getUnitFromNumber(unitId).then((d) => {
            setData(d.lessons[frqId]);
            unit.current = d;
            setRawContent(d.lessons[frqId].content);
            setCode(d.lessons[frqId].default || "");
            setChecks(d.lessons[frqId].checks || []);

            setRenderedContent(marked.parse(d.lessons[frqId].content));
        });
    }, [courseId, frqId, unitId]);

    useEffect(() => {
        user?.getLessonPrivate(courseId, unitId, frqId).then((uD) => {
            console.log(uD);
            if (uD.code) {
                setCode(uD.code);
            }
        });
    }, [courseId, frqId, unitId, user]);

    useEffect(() => {
        user?.get("private").then((u) => {
            setShowChecks(u.settings?.showChecks || false);
        });
    }, [user]);

    useEffect(() => {
        hljs.highlightAll();
    }, [rawContent, renderedContent]);

    const onChange = (val) => {
        setRenderedContent(marked.parse(val));
        setRawContent(val);
    };

    function setContent() {
        const u = new Unit(unit.current.id);

        const copy = { ...unit.current };

        copy.lessons[frqId].content = rawContent;

        u.set(copy);
    }

    const getTitle = () => {
        if (data?.lang == "python") {
            return toSnakeCase(data?.title || "") + ".py";
        }
        if (data?.lang == "javascript") {
            return toCamelCase(data?.title || "") + ".js";
        }
    };

    function updateChecks(action, index) {
        const u = new Unit(unit.current.id);

        const copy = { ...unit.current };
        if (!copy.lessons[frqId].checks) {
            copy.lessons[frqId].checks = [];
        }

        if (action == "add") {
            copy.lessons[frqId].checks.push(prompt("New Check"));
        } else if (action == "remove") {
            copy.lessons[frqId].checks.splice(index, 1);
        }

        u.set(copy);

        setChecks(copy.lessons[frqId].checks);
    }

    return (
        <>
            <div className="bg-zinc-950/50 w-xl p-4 overflow-auto">
                {admin ? (
                    <div className="flex flex-col gap-4">
                        <GEditor
                            className="rounded overflow-auto normal-case sticky bottom-0"
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
                            <button onClick={setContent}>Submit</button>
                        </div>
                    </div>
                ) : null}
                <div
                    className="md overflow-auto"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                ></div>
            </div>
            <Editor
                title={getTitle()}
                value={code}
                language={data?.lang}
                checks={checks}
                showChecks={showChecks}
                addSettings={(menu) => {
                    menu = menu
                        .addText("frq", "FRQ Settings")
                        .addCheckbox("showChecks", "Show Checks: ", showChecks)
                        .addButton("reset", "Reset Code");
                    if (admin) {
                        menu = menu
                            .addText("admin", "Admin Settings")

                            .addList("checks", "Checks:", checks, updateChecks)
                            .addButton("setDefault", "Set Default Code");
                    }

                    return menu;
                }}
                topBarItems={[
                    <a href={`/${courseId}#unit-${unitId}`}>
                        <button>Back to Unit-1</button>
                    </a>,
                ]}
                onRun={(checksPassed) => {
                    user.setLessonPrivate(courseId, unitId, frqId, {
                        code: code,
                    });

                    user.giveXP(
                        checksPassed * 30,
                        Math.round((checksPassed / checks.length) * 100),
                        courseId,
                        unitId,
                        frqId,
                    );
                }}
                onChange={(v) => {
                    setCode(v);
                    console.log(v);
                }}
                onSettingsSubmit={(values) => {
                    const u = new Unit(unit.current.id);

                    const copy = { ...unit.current };
                    if (values.setDefault) {
                        copy.lessons[frqId].default = code;
                    }

                    user.set("private", {
                        settings: { showChecks: values.showChecks || false },
                    });
                    setShowChecks(values.showChecks || false);

                    if (values.reset) {
                        user.setLessonPrivate(courseId, unitId, frqId, {
                            code: deleteField(),
                        });

                        setCode(copy.lessons[frqId].default);
                    }

                    u.set(copy);
                }}
            />
        </>
    );
}

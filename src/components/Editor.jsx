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
import { createMenu, usePopup } from "../use/usePopup";

export default function Editor({
    title,
    language = "javascript",
    hideSettings = false,
    readOnly = false,
    showDecorativeButtons = false,
    noLoginRequired = false,
    topBarItems = [],
    showChecks = false,
    checks = [],
    addSettings = null,
    onChange = () => {},
    onSettingsSubmit = () => {},
    onRun = () => {},
    value = "",
}) {
    const user = useUser();

    const [fontSize, setFontSize] = useState(14);

    const [content, setContent] = useState(value);

    const [terminalLines, setTerminalLines] = useState([
        "SyntaxForge Terminal v1",
    ]);

    const [theme, setTheme] = useState("Dark");
    const [themes] = useState({
        Dark: "dark",
        "Github Dark": githubDark,
        "Console Dark": consoleDark,
        "VSCode Dark": vscodeDark,
        "XCode Dark": xcodeDark,
    });

    const settingsMenu = useMemo(() => {
        const menu = createMenu()
            .addText("heading1", "Global Settings")
            .addNumber("textSize", "Font Size: ", "px", fontSize)
            .addSelect("theme", "Theme: ", Object.keys(themes), theme);

        if (addSettings) {
            return addSettings(menu);
        }
        return menu;
    }, [addSettings, fontSize, theme, themes]);

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
    }

    const settingsPopup = usePopup(settingsMenu.build(), updateSettings);

    useEffect(() => {
        user?.get("private").then((data) => {
            setFontSize(parseInt(data.editorSettings?.textSize) || 14);
            setTheme(data.editorSettings?.theme || "Dark");
        });
    }, [user]);

    useEffect(() => {
        setContent(value);
    }, [value]);

    function runCode() {
        setTerminalLines(["Running Code..."]);
        if (user || noLoginRequired) {
            axios
                .post("https://runner.syntaxforge.dev", {
                    code: content,
                    lang: language,
                    checks: checks,
                })
                .then((res) => {
                    if (checks) {
                        const newLines = [];
                        let passed = 0;
                        for (const check of res.data.systemChecks) {
                            if (check.status == "passed") {
                                passed += 1;
                            }
                            if (showChecks) {
                                newLines.push(
                                    `${check.id}. ${check.condition}... ${check.status.toUpperCase()}${check.message ? `\n${check.message}` : ""}`,
                                );
                            } else {
                                newLines.push(
                                    `Check ${check.id}... ${check.status.toUpperCase()}${check.message ? `\n${check.message}` : ""}`,
                                );
                            }
                        }

                        if (res.data.allPassed) {
                            newLines.push("All tests PASSED!");
                        }

                        setTerminalLines((v) => {
                            return [...v, ...newLines];
                        });

                        onRun(passed);
                    } else {
                        setTerminalLines((v) => {
                            return [...v, ...res.data.logs];
                        });
                    }
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

    const languageLookup = {
        javascript: javascript(),
        python: python(),
    };

    return (
        <>
            {settingsPopup.element}

            <div className="editor">
                <div className="head">
                    {showDecorativeButtons ? (
                        <div className="flex flex-row gap-2">
                            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                            <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                        </div>
                    ) : null}
                    <span className="normal-case">{title}</span>
                    {!hideSettings ? (
                        <button onClick={settingsPopup.open}>Settings</button>
                    ) : null}
                    {topBarItems.map((item) => {
                        return item;
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
                <div className="wrapper" style={{ fontSize: fontSize + "px" }}>
                    <div className="inner">
                        <CodeMirror
                            className="normal-case w-full h-full"
                            extensions={[
                                languageLookup[language],
                                hyperLink,
                                color,
                            ]}
                            readOnly={readOnly}
                            editable={!readOnly}
                            onChange={(v, update) => {
                                onChange(v, update);
                                setContent(v);
                            }}
                            value={value}
                            height="100%"
                            width="100%"
                            theme={themes[theme]}
                        />
                    </div>

                    <div className="terminal">
                        {terminalLines.map((line, index) => {
                            return (
                                <span
                                    key={index}
                                    className="whitespace-pre-wrap"
                                >
                                    {line}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Lesson } from "../firebase/Firebase";
import { useAdmin } from "../Global";
import PopupMenu from "../components/PopupMenu";
import { deleteField } from "firebase/firestore";

export default function MCQPage() {
    const { mcqId } = useParams();

    const [data, setData] = useState({});
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [showPopup, setPopup] = useState(false);
    const [popupPos, setPopupPos] = useState(null);

    const [currentQIndex, setCurrentQIndex] = useState(null);

    const isAdmin = useAdmin();

    useEffect(() => {
        const l = new Lesson(mcqId);

        l.get().then((d) => {
            setData(d);
            console.log(d);
        });
    }, [mcqId]);

    function submit() {
        for (const qIndex of Object.keys(userAnswers)) {
            const aIndex = userAnswers[qIndex];
            const correctIndex = data.answerKey[qIndex];

            if (correctIndex == aIndex) {
                document.getElementById(`${qIndex}-${aIndex}`).className =
                    "correct";
                document.getElementById(`${qIndex}-head`).innerText +=
                    ` - Correct`;
            } else {
                document.getElementById(`${qIndex}-${correctIndex}`).className =
                    "correct";
                document.getElementById(`${qIndex}-${aIndex}`).className =
                    "incorrect";
                document.getElementById(`${qIndex}-head`).innerText +=
                    ` - Incorrect`;
            }
        }
        setSubmitted(true);
    }

    function reset() {
        for (const qIndex of Object.keys(data.answerKey)) {
            for (const child of document.getElementById(`${qIndex}`).children) {
                child.className = "";
            }
            document.getElementById(`${qIndex}-head`).innerText = document
                .getElementById(`${qIndex}-head`)
                .innerText.split("-", 1)[0]
                .trim();
            setUserAnswers({});
        }
        setSubmitted(false);
    }

    /** @argument {MouseEvent} e  */
    function select(e, qIndex, aIndex) {
        if (!submitted) {
            Array.from(document.getElementById(qIndex).children).forEach(
                (elm) => {
                    elm.className = "";
                },
            );

            setUserAnswers((val) => {
                const copy = { ...val };
                copy[qIndex] = aIndex;
                return copy;
            });

            e.target.className = "selected";
        }
    }

    const [template, setTemplate] = useState({});

    const openPopup = (e, qIndex) => {
        e.preventDefault();
        setCurrentQIndex(qIndex);
        const newTemplate = {
            prompt: {
                type: "textbox",
                value: data.questions[qIndex].prompt,
            },
        };

        const answers = data.questions[qIndex].answers;

        for (const aIndex of Object.keys(answers)) {
            newTemplate[`question-${aIndex}`] = {
                type: "text",
                value: answers[aIndex],
                label: `${aIndex} - `,
            };
        }

        console.log(data.answerKey[qIndex]);

        newTemplate.correctAnswer = {
            type: "text",
            label: "Correct Answer",
            value: "" + data.answerKey[qIndex],
        };

        newTemplate["Add Answer"] = {
            type: "button",
            click: () => {
                const ran = Math.round(Math.random() * 1000);
                const l = new Lesson(mcqId);

                const next =
                    Object.keys(data.questions[qIndex].answers).length + 1;

                l.set({
                    [`questions.${qIndex}.answers.${next}`]: "Question " + ran,
                });

                setData((prev) => {
                    const value = "Question " + ran;

                    const answers = prev.questions?.[qIndex]?.answers ?? {};

                    return {
                        ...prev,
                        questions: {
                            ...prev.questions,
                            [qIndex]: {
                                ...prev.questions[qIndex],
                                answers: { ...answers, [next]: value },
                            },
                        },
                    };
                });
                closePopup();
            },
        };

        newTemplate["Remove Answer"] = {
            type: "button",
            click: () => {
                const l = new Lesson(mcqId);
                const p = Object.keys(data.questions[qIndex].answers).length;
                l.set({
                    [`questions.${qIndex}.answers.${p}`]: deleteField(),
                });

                setData((prev) => {
                    const answers = prev.questions?.[qIndex]?.answers ?? {};

                    const { [p]: _, ...rest } = answers;

                    console.log(rest);

                    return {
                        ...prev,
                        questions: {
                            ...prev.questions,
                            [qIndex]: {
                                ...prev.questions[qIndex],
                                answers: rest,
                            },
                        },
                    };
                });

                closePopup();
            },
        };

        setTemplate(newTemplate);

        setPopupPos({
            x: e.clientX,
            y: e.clientY,
        });
        setPopup(true);
    };

    function submitPopup(values) {
        if (currentQIndex == null) return console.log(1);

        const l = new Lesson(mcqId);

        l.set({
            [`questions.${currentQIndex}.prompt`]: values.prompt,
            [`answerKey.${currentQIndex}`]: parseInt(values.correctAnswer) || 0,
        });

        const filtered = Object.keys(values)
            .filter((key) => key.startsWith("question"))
            .reduce((obj, key) => {
                obj[key] = values[key];
                return obj;
            }, {});

        for (const q of Object.keys(filtered)) {
            const index = parseInt(q.split("-")[1]);
            l.set({
                [`questions.${currentQIndex}.answers.${index}`]:
                    values[`question-${index}`],
            });
        }

        setData((val) => {
            let newData = {
                ...val,
                questions: {
                    ...val["questions"],
                    [currentQIndex]: {
                        ...val["questions"][currentQIndex],
                        prompt: values.prompt,
                    },
                },
                answerKey: {
                    ...val.answerKey,
                    [currentQIndex]: parseInt(values.correctAnswer) || 0,
                },
            };

            for (const q of Object.keys(filtered)) {
                const index = parseInt(q.split("-")[1]);

                newData = {
                    ...newData,
                    questions: {
                        ...newData["questions"],
                        [currentQIndex]: {
                            ...newData["questions"][currentQIndex],
                            answers: {
                                ...newData["questions"][currentQIndex].answers,
                                [index]: values[`question-${index}`],
                            },
                        },
                    },
                };
            }
            console.log(newData);

            return newData;
        });

        closePopup();
    }

    function closePopup() {
        setPopup(false);
    }

    function removeQuestion() {
        const p = Object.keys(data.questions).length - 1;
        const l = new Lesson(mcqId);

        const { [p]: _, ...rest } = data.questions;

        l.set({
            [`questions.${p}`]: deleteField(),
        });

        setData((prev) => {
            return {
                ...prev,
                questions: rest,
            };
        });
    }

    function addQuestion() {
        const next = Object.keys(data.questions).length;
        const l = new Lesson(mcqId);

        l.set({
            [`questions.${next}`]: {
                prompt: "New Question",
                answers: {},
            },
        });

        setData((prev) => {
            return {
                ...prev,
                questions: {
                    ...prev.questions,
                    [next]: {
                        prompt: "New Question",
                        answers: {},
                    },
                },
            };
        });
    }

    return (
        <div className="mcq">
            {showPopup ? (
                <PopupMenu
                    dataTemplate={template}
                    closeAction={closePopup}
                    submitAction={submitPopup}
                    position={popupPos}
                />
            ) : null}
            <h1>
                {data.title} | {Object.keys(data.questions || {}).length}{" "}
                Questions
            </h1>
            {Object.entries(data.questions || {}).map(([qIndex, q]) => {
                console.log(data.questions);
                return (
                    <>
                        <div className="flex flex-row gap-1.5 w-full pt-4 mb-2 border-t border-t-zinc-700">
                            <h2
                                className="p-0 m-0 border-none"
                                id={`${qIndex}-head`}
                            >
                                Question {parseInt(qIndex) + 1}
                            </h2>
                            {isAdmin ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            openPopup(e, qIndex);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button onClick={removeQuestion}>
                                        Remove
                                    </button>
                                </>
                            ) : null}
                        </div>
                        <h3 className="font-normal mt-2 normal-case">
                            {q.prompt}
                        </h3>
                        <ol className="list-[upper-alpha]" id={qIndex}>
                            {Object.entries(q.answers).map(([aIndex, a]) => {
                                return (
                                    <li
                                        onClick={(e) => {
                                            select(e, qIndex, aIndex);
                                        }}
                                        key={`${qIndex}-${aIndex}`}
                                        id={`${qIndex}-${aIndex}`}
                                    >
                                        {a}
                                    </li>
                                );
                            })}
                        </ol>
                    </>
                );
            })}
            <div className="flex flex-row gap-1.5">
                {submitted ? (
                    <button onClick={reset}>Try Again</button>
                ) : (
                    <button onClick={submit}>Submit Answers</button>
                )}
                {isAdmin ? (
                    <button onClick={addQuestion}>Add Question</button>
                ) : null}
            </div>
        </div>
    );
}

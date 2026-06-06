import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, DataObject, Unit } from "../../firebase/Firebase";
import { useAdmin, useUser } from "../../Global";
import PopupMenu from "../../components/PopupMenu";
import { createMenu, usePopup } from "../../use/usePopup";
import hljs from "highlight.js";

const answerMenu = createMenu()
    .addInput("text")
    .addButton("setCorrect", "Set Correct")
    .build();

const questionMenu = createMenu()
    .addInput("text")
    .addButton("remove", "Remove")
    .build();

const codeMenu = createMenu()
    .addSelect("lang", "Language: ", ["python", "javascript"])
    .build();

export default function MCQPage() {
    const { unitName, mcqName, courseId } = useParams();
    const [data, setData] = useState({});
    const [userCourseData, setUserCouseData] = useState({});
    const [finished, setFinished] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const unit = useRef(null);
    const mainData = useRef({});

    const unitId = parseInt(unitName.split("-")[1]);
    const mcqId = parseInt(mcqName.split("-")[0]);

    const user = useUser();
    const admin = useAdmin();

    const [currentIndexes, setCurrentIndexes] = useState({
        question: 0,
        answer: 0,
    });

    function submitAnswerMenu(values) {
        const qIdx = currentIndexes["question"];
        const aIdx = currentIndexes["answer"];

        if (values.setCorrect) {
            const updatedAnswers = [...data.answers];
            updatedAnswers[qIdx] = aIdx;

            setData((v) => ({
                ...v,
                answers: updatedAnswers,
            }));
            mainData.current.lessons[mcqId].answers = updatedAnswers;
        } else {
            const updatedChoices = [...data.questions[qIdx].choices];
            updatedChoices[aIdx] = values.text;

            const updatedQuestions = [...data.questions];
            updatedQuestions[qIdx] = {
                ...updatedQuestions[qIdx],
                choices: updatedChoices,
            };

            setData((v) => ({
                ...v,
                questions: updatedQuestions,
            }));
            mainData.current.lessons[mcqId].questions = updatedQuestions;
        }

        unit.current.set({
            ...mainData.current,
        });
    }

    const answerPrompt = usePopup(answerMenu, submitAnswerMenu);

    function submitQuestionMenu(values) {
        const qIdx = currentIndexes["question"];

        const updatedQuestions = [...data.questions];
        updatedQuestions[qIdx] = {
            ...updatedQuestions[qIdx],
            text: values.text || "",
        };

        setData((v) => ({
            ...v,
            questions: updatedQuestions,
        }));

        mainData.current.lessons[mcqId].questions = updatedQuestions;

        if (values.remove) {
            const updatedQs = [...data.questions];

            updatedQs.splice(qIdx, 1);

            const updatedAnswers = [...data.answers];

            updatedAnswers.splice(qIdx, 1);
            setData((v) => ({
                ...v,
                answers: updatedAnswers,
                questions: updatedQs,
            }));

            mainData.current.lessons[mcqId].questions = updatedQs;
            mainData.current.lessons[mcqId].answers = updatedAnswers;
        }
        unit.current.set({
            ...mainData.current,
        });
    }

    const questionPrompt = usePopup(questionMenu, submitQuestionMenu);

    function submitCodeMenu(values) {
        const qIdx = currentIndexes["question"];

        const updatedQuestions = [...data.questions];
        updatedQuestions[qIdx] = {
            ...updatedQuestions[qIdx],
            lang: values.lang,
        };

        setData((v) => ({
            ...v,
            questions: updatedQuestions,
        }));

        mainData.current.lessons[mcqId].questions[qIdx].lang = values.lang;
        unit.current.set({
            ...mainData.current,
        });
    }

    const codePrompt = usePopup(codeMenu, submitCodeMenu);

    useEffect(() => {
        const course = new Course(courseId);

        course.getUnitFromNumber(unitId).then((d) => {
            unit.current = new Unit(d.id);
            mainData.current = d;
            setData(d.lessons[mcqId]);
        });

        user?.getLesson(courseId, unitId, mcqId).then((uD) => {
            setUserCouseData(uD);
        });
    }, [courseId, mcqId, unitId, user]);

    useEffect(() => {
        hljs.highlightAll();
    }, [data]);

    function select(e, index, questionIndex) {
        if (!finished) {
            for (const child of document.querySelector(
                `#question-${questionIndex} .answers`,
            ).childNodes) {
                child.className = "";
            }
            e.target.className = "selected";

            setSelectedAnswers((v) => {
                return {
                    ...v,
                    [questionIndex]: index,
                };
            });
        }
    }

    function submit() {
        setFinished(true);

        let correctCount = 0;

        for (const i in data.answers) {
            const correctAnswer = data.answers[i];
            const userAnswer = selectedAnswers[i];

            const correctAnswerId = `#answer-${i}-${correctAnswer}`;
            const wrongAnswerId = `#answer-${i}-${userAnswer}`;

            const questionText = `#question-${i} h2`;

            try {
                if (correctAnswer !== userAnswer) {
                    document.querySelector(wrongAnswerId).className =
                        "incorrect";
                    document.querySelector(questionText).textContent +=
                        " - 0 / 1";
                } else {
                    document.querySelector(questionText).textContent +=
                        " - 1 / 1";
                    correctCount += 1;
                }
                document.querySelector(correctAnswerId).className = "correct";
            } catch {
                /* empty */
            }
        }

        const xp = correctCount * 25;
        const maxXp = data.answers.length * 25;

        user.giveXP(
            xp,
            Math.round((xp / maxXp) * 100),
            courseId,
            unitId,
            mcqId,
            {
                correctCount: correctCount,
            },
        );
    }

    function addQuestion() {
        const updatedQuestions = [
            ...data.questions,
            {
                text: "Question",
                choices: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
            },
        ];

        const updatedAnswers = [...data.answers, 0];
        setData((v) => ({
            ...v,
            answers: updatedAnswers,
            questions: updatedQuestions,
        }));

        mainData.current.lessons[mcqId].questions = updatedQuestions;
        mainData.current.lessons[mcqId].answers = updatedAnswers;

        unit.current.set({
            ...mainData.current,
        });
    }

    function saveCode(code) {
        const qIdx = currentIndexes["question"];

        mainData.current.lessons[mcqId].questions[qIdx].code = code;
        unit.current.set({
            ...mainData.current,
        });
    }

    return (
        <>
            {answerPrompt.element}
            {questionPrompt.element}
            {codePrompt.element}

            <h1>
                {data.title} - {data.questions?.length} Questions{" "}
                {userCourseData
                    ? `- Last Attempt: ${userCourseData.correctCount || 0}/${data.answers?.length || 0}`
                    : ""}
            </h1>
            {data.questions?.map((q, index) => {
                return (
                    <div className="question" id={`question-${index}`}>
                        <h2
                            onContextMenu={(e) => {
                                if (admin) {
                                    e.preventDefault();
                                    setCurrentIndexes({
                                        question: index,
                                        answer: 0,
                                    });

                                    questionPrompt.open(e);
                                }
                            }}
                        >
                            {index + 1}. {q.text}
                        </h2>
                        {q.code || admin ? (
                            <pre>
                                <code
                                    contentEditable={admin}
                                    className={`hljs language-${q.lang || "plaintext"}`}
                                    suppressContentEditableWarning={true} // Prevents React from throwing a warning in the console
                                    onBlur={(e) => {
                                        setCurrentIndexes({
                                            question: index,
                                            answer: 0,
                                        });
                                        delete e.target.dataset.highlighted;
                                        hljs.highlightElement(e.target);
                                        saveCode(e.target.textContent);
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        setCurrentIndexes({
                                            question: index,
                                            answer: 0,
                                        });
                                        codePrompt.open(e);
                                    }}
                                >
                                    {q.code}
                                </code>
                            </pre>
                        ) : null}
                        <ul className="answers list-[upper-alpha] list-inside">
                            {q.choices.map((choice, cIndex) => {
                                return (
                                    <li
                                        onClick={(e) => {
                                            select(e, cIndex, index);
                                        }}
                                        onContextMenu={(e) => {
                                            if (admin) {
                                                e.preventDefault();
                                                setCurrentIndexes({
                                                    question: index,
                                                    answer: cIndex,
                                                });

                                                answerPrompt.open(e);
                                            }
                                        }}
                                        id={`answer-${index}-${cIndex}`}
                                    >
                                        {choice}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
            <div className="inline-flex gap-2">
                <a href={`/${courseId}#unit-${unitId}`}>
                    <button>Back to Unit-{unitId}</button>
                </a>

                <button onClick={submit}>Submit</button>
                {finished ? (
                    <button
                        onClick={() => {
                            window.location.reload();
                        }}
                    >
                        Try Again
                    </button>
                ) : null}
                {admin ? (
                    <button onClick={addQuestion}>Add Question</button>
                ) : null}
            </div>
        </>
    );
}

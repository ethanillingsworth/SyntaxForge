import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Course, DataObject, Unit } from "../../firebase/Firebase";
import { useAdmin, useUser } from "../../Global";
import PopupMenu from "../../components/PopupMenu";

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

    const [showAnswerPrompt, setShowAnswerPrompt] = useState(false);
    const [showQuestionPrompt, setShowQuestionPrompt] = useState(false);

    const [pos, setPos] = useState();

    const [currentIndexes, setCurrentIndexes] = useState({
        question: 0,
        answer: 0,
    });

    useEffect(() => {
        const course = new Course(courseId);

        course.getUnitFromNumber(unitId).then((d) => {
            unit.current = new Unit(d.id);
            mainData.current = d;
            setData(d.lessons[mcqId]);
        });

        user?.getCourseData(courseId, unitId, mcqId).then((uD) => {
            setUserCouseData(uD);
        });
    }, [courseId, mcqId, unitId, user]);

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

            if (correctAnswer !== userAnswer) {
                document.querySelector(wrongAnswerId).className = "incorrect";
                document.querySelector(questionText).textContent += " - 0 / 1";
            } else {
                document.querySelector(questionText).textContent += " - 1 / 1";
                correctCount += 1;
            }

            document.querySelector(correctAnswerId).className = "correct";
        }

        const xp = correctCount * 10;
        const maxXp = data.answers.length * 10;

        user.giveXP(xp, Math.round(xp / maxXp) * 100, courseId, unitId, mcqId, {
            correctCount: correctCount,
        });
    }

    const answerTemplate = useMemo(() => {
        return {
            text: {
                value:
                    data?.questions?.[currentIndexes["question"]]?.choices[
                        currentIndexes["answer"]
                    ] || "none",
            },
            setCorrect: {
                type: "button",
                label: "Set Correct",
                click: () => {
                    const qIdx = currentIndexes["question"];
                    const aIdx = currentIndexes["answer"];

                    // 2. Calculate the updated data upfront so BOTH React and Firebase can use it

                    const updatedAnswers = [...data.answers];
                    updatedAnswers[qIdx] = aIdx;

                    // 3. Update local React state instantly for a snappy UI
                    setData((v) => ({
                        ...v,
                        answers: updatedAnswers,
                    }));
                    mainData.current.lessons[mcqId].answers = updatedAnswers;
                    // Close your modal/prompt
                    setShowAnswerPrompt(false);

                    unit.current.set({
                        ...mainData.current,
                    });
                },
            },
        };
    }, [currentIndexes, data.answers, data?.questions, mcqId]);

    const questionTemplate = useMemo(() => {
        return {
            text: {
                value: data?.questions?.[currentIndexes["question"]]?.text,
            },
            remove: {
                type: "button",
                click: () => {
                    console.log(currentIndexes);
                    const qIdx = currentIndexes["question"];

                    const updatedQuestions = [...data.questions];

                    updatedQuestions.splice(qIdx, 1);

                    const updatedAnswers = [...data.answers];

                    updatedAnswers.splice(qIdx, 1);
                    setData((v) => ({
                        ...v,
                        answers: updatedAnswers,
                        questions: updatedQuestions,
                    }));

                    mainData.current.lessons[mcqId].questions =
                        updatedQuestions;
                    mainData.current.lessons[mcqId].answers = updatedAnswers;

                    unit.current.set({
                        ...mainData.current,
                    });

                    setShowQuestionPrompt(false);
                },
            },
        };
    }, [currentIndexes, data.answers, data.questions, mcqId]);

    function submitAnswerMenu(values) {
        const qIdx = currentIndexes["question"];
        const aIdx = currentIndexes["answer"];

        // 2. Calculate the updated data upfront so BOTH React and Firebase can use it
        const updatedChoices = [...data.questions[qIdx].choices];
        updatedChoices[aIdx] = values.text;

        const updatedQuestions = [...data.questions];
        updatedQuestions[qIdx] = {
            ...updatedQuestions[qIdx],
            choices: updatedChoices,
        };

        // 3. Update local React state instantly for a snappy UI
        setData((v) => ({
            ...v,
            questions: updatedQuestions,
        }));
        mainData.current.lessons[mcqId].questions = updatedQuestions;
        // Close your modal/prompt
        setShowAnswerPrompt(false);

        unit.current.set({
            ...mainData.current,
        });
    }

    function submitQuestionMenu(values) {
        const qIdx = currentIndexes["question"];

        const updatedQuestions = [...data.questions];
        updatedQuestions[qIdx] = {
            ...updatedQuestions[qIdx],
            text: values.text,
        };

        // 3. Update local React state instantly for a snappy UI
        setData((v) => ({
            ...v,
            questions: updatedQuestions,
        }));
        mainData.current.lessons[mcqId].questions = updatedQuestions;
        // Close your modal/prompt
        setShowQuestionPrompt(false);

        unit.current.set({
            ...mainData.current,
        });
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

    return (
        <>
            <PopupMenu
                dataTemplate={answerTemplate}
                showCondition={admin && showAnswerPrompt}
                submitAction={submitAnswerMenu}
                closeAction={() => {
                    setShowAnswerPrompt(false);
                }}
                position={pos}
            />

            <PopupMenu
                dataTemplate={questionTemplate}
                position={pos}
                submitAction={submitQuestionMenu}
                showCondition={admin && showQuestionPrompt}
                closeAction={() => {
                    setShowQuestionPrompt(false);
                }}
            />
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
                                e.preventDefault();
                                setCurrentIndexes({
                                    question: index,
                                    answer: 0,
                                });
                                setPos({
                                    x: e.pageX,
                                    y: e.pageY,
                                });
                                setShowQuestionPrompt(true);
                            }}
                        >
                            {q.text}
                        </h2>
                        <ul className="answers">
                            {q.choices.map((choice, cIndex) => {
                                return (
                                    <li
                                        onClick={(e) => {
                                            select(e, cIndex, index);
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setCurrentIndexes({
                                                question: index,
                                                answer: cIndex,
                                            });
                                            setPos({
                                                x: e.pageX,
                                                y: e.pageY,
                                            });
                                            setShowAnswerPrompt(true);
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

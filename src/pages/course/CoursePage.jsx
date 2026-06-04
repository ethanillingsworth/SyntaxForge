import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Article, Category, Course, Unit } from "../../firebase/Firebase";
import Lesson from "../../components/Lesson";
import { stringToId, useAdmin } from "../../Global";
import PopupMenu from "../../components/PopupMenu";
import { Card } from "../../components/Card";
import ProgressBar from "../../components/ProgressBar";
import { createMenu, usePopup } from "../../use/usePopup";

const unitMenuTemplate = createMenu()
    .addInput("name", "Lesson Name:")
    .addSelect("type", "Lesson Type:", ["article", "mcq", "frq"])
    .build();

const lessonMenuTemplate = createMenu()
    .addButton("up", "Up")
    .addButton("down", "Down")
    .build();

export default function CoursePage() {
    const { courseId } = useParams();
    const [data, setData] = useState({});
    const [units, setUnits] = useState([]);

    const admin = useAdmin();

    const unitMenu = usePopup(unitMenuTemplate, (values) => {
        const u = new Unit(currentUnit);

        setUnits((v) => {
            return v.map((unit, index) => {
                if (index !== currentUnitNum) return unit;

                // 2. Return a NEW object for the unit we are changing
                return {
                    ...unit,
                    // 3. Ensure lessons exists and is a NEW array with the new item
                    lessons: [
                        ...(unit.lessons || []),
                        {
                            title: values.name,
                            type: values.type,
                        },
                    ],
                };
            });
        });

        u.createLesson(values.name, values.type);
    });

    const [currentUnit, setCurrentUnit] = useState();
    const [currentUnitNum, setCurrentUnitNum] = useState();
    const [currentLesson, setCurrentLesson] = useState();

    function updateUnit(lessons) {
        setUnits((v) => {
            return v.map((unit, index) => {
                if (index !== currentUnitNum) return unit;

                return {
                    ...unit,
                    lessons: lessons,
                };
            });
        });

        u.set({
            lessons: lessons,
        });
    }
    function moveLessonUp() {
        /** @type {Array} */
        const lessons = units[currentUnitNum].lessons;

        const l1 = lessons.splice(currentLesson, 1)[0];
        lessons.splice(currentLesson - 1, 0, l1);

        const article1 = new Article(
            courseId,
            currentUnitNum + 1,
            currentLesson - 1,
        );
        const article2 = new Article(
            courseId,
            currentUnitNum + 1,
            currentLesson,
        );

        article1.moveContent(currentLesson);
        article2.moveContent(currentLesson - 1);

        updateUnit(lessons);
    }

    function moveLessonDown() {
        /** @type {Array} */
        const lessons = units[currentUnitNum].lessons;

        const l1 = lessons.splice(currentLesson, 1)[0];
        lessons.splice(currentLesson + 1, 0, l1);

        const article1 = new Article(
            courseId,
            currentUnitNum + 1,
            currentLesson,
        );
        const article2 = new Article(
            courseId,
            currentUnitNum + 1,
            currentLesson + 1,
        );

        article1.moveContent(currentLesson + 1);
        article2.moveContent(currentLesson);

        updateUnit(lessons);
    }

    const lessonMenu = usePopup(lessonMenuTemplate, (values) => {
        console.log(values);
        if (values.up) {
            moveLessonUp();
        }

        if (values.down) {
            moveLessonDown();
        }
    });

    const u = new Unit(currentUnit);

    useEffect(() => {
        const course = new Course(courseId);
        course.get().then((d) => {
            setData(d);
        });

        course.getAllUnits().then((l) => {
            setUnits(l);
        });
    }, [courseId]);

    return (
        <>
            {unitMenu.element}
            {lessonMenu.element}

            <div className="hero">
                <h1>{data.name}</h1>
                <h2>{data.blurb}</h2>
                <div className="tags">
                    {data.categorys?.map((category) => {
                        return <Card large key={category} id={category}></Card>;
                    })}
                </div>
            </div>
            <ProgressBar value={50} accentColor={data.color} />

            <h2>Course Description</h2>
            <p>{data.desc}</p>

            <h2>Unit Overview</h2>
            <div className="flex flex-col">
                {units.map((unit) => {
                    return (
                        <ul>
                            <li
                                id={`unit-${unit.number}`}
                                className="hover:bg-none hover:border-none font-semibold"
                                onContextMenu={(e) => {
                                    if (admin) {
                                        e.preventDefault();
                                        setCurrentUnit(unit.id);
                                        setCurrentUnitNum(unit.number - 1);
                                        unitMenu.open(e);
                                    }
                                }}
                            >
                                Unit {unit.number} | {unit.name}
                            </li>
                            <ul>
                                {unit.lessons?.map((lesson, index) => {
                                    return (
                                        <Lesson
                                            course={data}
                                            unit={unit.number}
                                            type={lesson.type}
                                            id={stringToId(lesson.title)}
                                            key={index}
                                            index={index}
                                            onContextMenu={(e) => {
                                                if (admin) {
                                                    e.preventDefault();
                                                    setCurrentUnit(unit.id);
                                                    setCurrentUnitNum(
                                                        unit.number - 1,
                                                    );
                                                    setCurrentLesson(index);
                                                    lessonMenu.open(e);
                                                }
                                            }}
                                        >
                                            {lesson.title}
                                        </Lesson>
                                    );
                                })}
                            </ul>
                        </ul>
                    );
                })}
            </div>
        </>
    );
}

import Course from "../components/Course";
import Section from "../components/Section"
import Sections from "../components/Sections"
import courses from "../data/courses.json";



export default function Courses() {


    return (
        <>
            <Sections>
                <Section className="grid grid-cols-2 gap-6">
                    {Object.keys(courses).map((key) => {
                        return <Course id={key} key={key} />
                    })}
                </Section>
            </Sections>

        </>
    );
}
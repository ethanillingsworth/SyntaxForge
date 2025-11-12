import Course from "../components/Course";
import Section from "../components/Section"
import Sections from "../components/Sections"


export default function Courses() {


    return (
        <>
            <Sections>
                <Section className="grid grid-cols-2 gap-6">
                    <Course id="apcsp"></Course>
                </Section>
            </Sections>

        </>
    );
}
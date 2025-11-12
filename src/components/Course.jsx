import { useEffect, useState } from "react";
import courses from "../data/courses.json";
export default function Course({ id }) {

    const [data, setData] = useState({})

    useEffect(() => {
        setData(courses[id])

        console.log(courses[id])

    }, [id])


    return (
        <a href={`/course/${id}`} className="course" id={id}>
            <h3 className="text-forge-text">{data.name}</h3>
            <p className="line-clamp-2">{data.desc}</p>
            <progress value={0} className="mt-3"></progress>
        </a>
    );
}
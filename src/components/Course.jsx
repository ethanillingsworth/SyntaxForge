import { useEffect, useState } from "react";

export default function Course({ id }) {

    const [data, setData] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/data/courses.json"); // your server endpoint
            const data = await response.json(); // parse JSON
            setData(data);
        }

        fetchData()

    }, [])


    return (
        <div className="course" id={id}>
            
        </div>
    );
}
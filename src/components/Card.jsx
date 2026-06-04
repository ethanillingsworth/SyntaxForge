import { useEffect, useState } from "react";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import pythonLogo from "../icons/python.svg";
import jsLogo from "../icons/js.svg";
import introLogo from "../icons/intro.svg";
import { Category } from "../firebase/Firebase";

extend([namesPlugin]);

export function Card({ id, link = null, type, large = false, className = "" }) {
    const [data, setData] = useState({});
    const [images, setImages] = useState({});

    useEffect(() => {
        const obj = new Category(id);
        obj.get().then((data) => {
            setData(data);

            setImages((v) => {
                const n = { ...v };

                n[id] = [data.image];
                return n;
            });
        });
    }, [id, type]);

    const lookup = {
        python: pythonLogo,
        javascript: jsLogo,
        intro: introLogo,
    };

    return (
        <a
            href={link}
            className={`card ${large ? "large" : ""} ${className}`}
            key={id}
            style={{
                backgroundColor: data.color,
                borderColor: colord(data.color).darken(0.1).toHex(),
            }}
        >
            {Object.values(images[data?.id] || {}).map((i) => {
                return <img alt={data?.name} src={lookup[i]} />;
            })}
            <span className="mt-0 text-center text-shadow-sm h-fit text-shadow-black">
                {data?.name
                    ? `${data?.name} ${data?.nickname ? `(${data?.nickname})` : ""}`
                    : "Loading..."}
            </span>
        </a>
    );
}

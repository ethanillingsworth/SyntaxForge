import articleIcon from "../imgs/icons/article.svg";
import mcqIcon from "../imgs/icons/mcq.svg";

import frqIcon from "../imgs/icons/frq.svg";

export default function Lesson({
    course,
    unit,
    type,
    id,
    index,
    children,
    onContextMenu = () => {},
}) {
    function getIcon() {
        if (type == "article") {
            return <img alt="article" src={articleIcon} />;
        }
        if (type == "mcq") {
            return <img alt="mcq" src={mcqIcon} />;
        }
        if (type == "frq") {
            return <img alr="frq" src={frqIcon} />;
        }
    }

    return (
        <a
            href={`/${course}/unit-${unit}/${type}/${index}`}
            id={id}
            className="lesson"
            onContextMenu={onContextMenu}
        >
            <li>
                {getIcon()}
                {`Lesson ${unit}.${index + 1} | ${children}`}
            </li>
        </a>
    );
}

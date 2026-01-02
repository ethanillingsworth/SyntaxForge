import articleIcon from "../imgs/icons/article.svg";
import mcqIcon from "../imgs/icons/mcq.svg";

export default function Lesson({ course, unit, type, id, index, children }) {
	function getIcon() {
		if (type == "article") {
			return <img src={articleIcon} />;
		}
		if (type == "mcq") {
			return <img src={mcqIcon} />;
		}
	}

	return (
		<a
			href={`/${course}/unit-${unit}/${type}/${id}`}
			className="unit gap-1.5"
		>
			{getIcon()}
			<h3>{`Lesson ${index} | ${children}`}</h3>
		</a>
	);
}

import articleIcon from "../imgs/icons/article.svg";
import mcqIcon from "../imgs/icons/mcq.svg";

export default function Lesson({
	course,
	unit,
	type,
	id,
	index,
	children,
	progress = 0,
	onContextMenu = () => {},
}) {
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
			href={`/${course}/unit-${unit}/${type}/${index}`}
			className="unit gap-2 overflow-hidden"
			style={{
				"--progress": progress,
			}}
			id={id}
			onContextMenu={onContextMenu}
		>
			{getIcon()}
			<h3>{`Lesson ${unit}.${index + 1} | ${children}`}</h3>
		</a>
	);
}

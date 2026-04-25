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
		if (type == "frq") {
			return <img src={frqIcon} />;
		}
	}

	return (
		<a
			href={`/${course}/unit-${unit}/${type}/${index}`}
			className="unit gap-2 overflow-hidden place-content-start"
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

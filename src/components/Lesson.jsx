import articleIcon from "../imgs/icons/article.svg";

export default function Lesson({ course, type, id, index, children }) {
	function getIcon() {
		if (type == "article") {
			return <img src={articleIcon} />;
		}
	}

	return (
		<a href={`/${course}/${type}/${id}`} className="unit">
			{getIcon()}
			<h3>{`Lesson ${index} | ${children}`}</h3>
		</a>
	);
}

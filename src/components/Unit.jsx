export default function Unit({ number, children }) {
	return (
		<a href={`/${window.course}/unit-${number}`} className="unit">
			<h3>{`Unit ${number} | ${children}`}</h3>
		</a>
	);
}

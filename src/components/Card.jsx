import { useEffect, useState } from "react";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import pythonLogo from "../icons/python.svg";
import jsLogo from "../icons/js.svg";
import introLogo from "../icons/intro.svg";

extend([namesPlugin]);

export function Card({ id, link, type, className }) {
	const [data, setData] = useState({});
	const [images, setImages] = useState({});

	useEffect(() => {
		const obj = new type(id);
		obj.get().then((data) => {
			setData(data);

			setImages((v) => {
				const n = { ...v };

				n[id] = [data.image];
				return n;
			});
		});

		if (obj.constructor.name == "Course") {
			obj.getCategorysData().then((d) => {
				const i = d.map((v) => {
					return v.image;
				});

				setImages((v) => {
					const n = { ...v };
					n[id] = i;
					return n;
				});
			});
		}
	}, [id, type]);

	const lookup = {
		python: pythonLogo,
		javascript: jsLogo,
		intro: introLogo,
	};

	return (
		<a
			href={link}
			className={`card ${className}`}
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

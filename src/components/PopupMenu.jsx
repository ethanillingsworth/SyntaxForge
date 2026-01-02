import { useEffect, useState } from "react";

export default function PopupMenu({
	dataTemplate,
	className,
	closeAction,
	submitAction,
	hideSubmit = false,
	position,
}) {
	const [values, setValues] = useState({});

	useEffect(() => {
		const defaults = {};

		Object.keys(dataTemplate).forEach((key) => {
			const field = dataTemplate[key];

			if (field.type === "select") {
				defaults[key] = field.options[0];
			} else {
				defaults[key] = "";
			}
		});

		setValues(defaults);
	}, [dataTemplate]);

	const handleChange = (key, value) => {
		setValues((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSubmit = () => {
		submitAction(values);
	};

	return (
		<div
			className={`popupMenu ${className ?? ""}`}
			style={{
				left: position?.x,
				top: position?.y,
			}}
		>
			{Object.keys(dataTemplate).map((title) => {
				const data = dataTemplate[title];

				if (data.type == "select") {
					return (
						<select
							key={title}
							value={values[title]}
							onChange={(e) =>
								handleChange(title, e.target.value)
							}
						>
							{data.options.map((option) => {
								return <option>{option}</option>;
							})}
						</select>
					);
				}

				if (data.type == "button") {
					return (
						<button key={title} onClick={data.click}>
							{title}
						</button>
					);
				}

				return (
					<input
						key={title}
						type={data.type}
						placeholder={title}
						value={values[title] || ""}
						onChange={(e) => handleChange(title, e.target.value)}
					/>
				);
			})}

			<div className="flex flex-row gap-1.5">
				<button onClick={closeAction}>Cancel</button>
				{!hideSubmit ? (
					<button onClick={handleSubmit}>Submit</button>
				) : null}
			</div>
		</div>
	);
}

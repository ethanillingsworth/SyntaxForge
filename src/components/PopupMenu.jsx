import { useEffect, useState } from "react";

export default function PopupMenu({
    dataTemplate,
    className,
    closeAction,
    submitAction,
    hideSubmit = false,
    showCondition = false,
    position,
}) {
    const [values, setValues] = useState({});

    useEffect(() => {
        const defaults = {};

        Object.keys(dataTemplate).forEach((key) => {
            const field = dataTemplate[key];

            if (field.type === "select") {
                if (field.value) {
                    defaults[key] = field.value;
                } else {
                    defaults[key] = field.options[0];
                }
            } else {
                defaults[key] = field.value;
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
        closeAction(false);
    };

    if (showCondition) {
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
                            <div className="flex flex-row gap-1.5">
                                <span>{data.label}</span>

                                <select
                                    key={title}
                                    value={values[title]}
                                    onChange={(e) =>
                                        handleChange(title, e.target.value)
                                    }
                                    className="w-full"
                                >
                                    {data.options.map((option) => {
                                        return (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        );
                    }

                    if (data.type == "button") {
                        return (
                            <button
                                key={title}
                                onClick={() => {
                                    submitAction({ ...values, [title]: true });
                                    closeAction();
                                }}
                            >
                                {data.label || title}
                            </button>
                        );
                    }

                    if (data.type == "textbox") {
                        return (
                            <div className="flex flex-row gap-1.5">
                                <span>{data.label}</span>
                                <textarea
                                    placeholder={title}
                                    onChange={(e) =>
                                        handleChange(title, e.target.value)
                                    }
                                    key={title}
                                    rows={1}
                                    className="min-h-6"
                                    value={values[title] || ""}
                                ></textarea>
                            </div>
                        );
                    }

                    if (data.type == "text") {
                        return (
                            <span className="font-semibold">{data.label}</span>
                        );
                    }

                    return (
                        <div className="flex flex-row place-items-center gap-1.5">
                            {data.label ? <span>{data.label}</span> : null}

                            <input
                                key={title}
                                type={data.type}
                                placeholder={title}
                                value={values[title] || ""}
                                onChange={(e) =>
                                    handleChange(title, e.target.value)
                                }
                            />
                            {data.units ? (
                                <span className="normal-case raised text-xs">
                                    {data.units}
                                </span>
                            ) : null}
                        </div>
                    );
                })}

                <div className="flex flex-row gap-1.5">
                    <button
                        onClick={() => {
                            closeAction(false);
                        }}
                        className="w-full"
                    >
                        Cancel
                    </button>
                    {!hideSubmit ? (
                        <button onClick={handleSubmit} className="w-full">
                            Submit
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
}

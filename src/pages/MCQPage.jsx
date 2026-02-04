import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Lesson } from "../firebase/Firebase";
import { useAdmin } from "../Global";

export default function MCQPage() {
	const { mcqId } = useParams();

	const [data, setData] = useState({});
	const [userAnswers, setUserAnswers] = useState({});
	const [isAdmin, setAdmin] = useState(false);

	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		const l = new Lesson(mcqId);

		l.get().then((d) => {
			setData(d);
			console.log(d);
		});
	}, [mcqId]);

	function submit() {
		for (const qIndex of Object.keys(userAnswers)) {
			const aIndex = userAnswers[qIndex];
			const correctIndex = data.answerKey[qIndex];
			if (correctIndex === aIndex) {
				document.getElementById(`${qIndex}-${aIndex}`).className =
					"correct";

				document.getElementById(`${qIndex}-head`).innerText +=
					` - Correct`;
			} else {
				document.getElementById(`${qIndex}-${correctIndex}`).className =
					"correct";
				document.getElementById(`${qIndex}-${aIndex}`).className =
					"incorrect";
				document.getElementById(`${qIndex}-head`).innerText +=
					` - Incorrect`;
			}
		}
		setSubmitted(true);
	}

	useAdmin((admin) => {
		setAdmin(admin);
	});

	/** @argument {MouseEvent} e  */
	function select(e, qIndex, aIndex) {
		if (!submitted) {
			Array.from(document.getElementById(qIndex).children).forEach(
				(elm) => {
					elm.className = "";
				},
			);

			setUserAnswers((val) => {
				const copy = { ...val };
				copy[qIndex] = aIndex;
				return copy;
			});

			e.target.className = "selected";
		}
	}

	return (
		<div className="mcq">
			<h1>
				{data.title} | {data.questions?.length} Questions
			</h1>
			{data.questions?.map((q, qIndex) => {
				return (
					<>
						<div className="flex flex-row gap-1.5 w-full pt-4 mb-2 border-t border-t-zinc-700">
							<h2
								className="p-0 m-0 border-none"
								id={`${qIndex}-head`}
							>
								Question {qIndex + 1}
							</h2>
							{isAdmin ? <button>Edit</button> : null}
						</div>
						<h3 className="font-normal mt-2 normal-case">
							{q.prompt}
						</h3>
						<ol className="list-[upper-alpha]" id={qIndex}>
							{q.answers.map((a, aIndex) => {
								return (
									<li
										onClick={(e) => {
											select(e, qIndex, aIndex);
										}}
										key={`${qIndex}-${aIndex}`}
										id={`${qIndex}-${aIndex}`}
									>
										{a}
									</li>
								);
							})}
						</ol>
					</>
				);
			})}

			{submitted ? (
				<button>Try Again</button>
			) : (
				<button onClick={submit}>Submit Answers</button>
			)}
		</div>
	);
}

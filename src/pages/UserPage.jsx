import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../firebase/Firebase";
import { formatNumber, useUser } from "../Global";

export default function UserPage() {
	const { username } = useParams();

	const [pageUser, setPageUser] = useState();
	const [pageData, setPageData] = useState({});
	const [rank, setRank] = useState({});
	const [nextRank, setNextRank] = useState({});

	const user = useUser();

	const [currentUserData, setUserData] = useState({});

	useEffect(() => {
		User.getFromUsername(username.split("@")[1]).then((u) => {
			setPageUser(u);
		});
	}, [username]);

	useEffect(() => {
		pageUser?.get().then((d) => {
			setPageData(d);
			setRank(pageUser.getCurrentRank(d.xp));
			setNextRank(pageUser.getNextRank(d.xp));
		});
		user?.get().then((d) => {
			setUserData(d);
		});
	}, [pageUser, user]);

	return (
		<>
			<div className="top flex flex-row mt-0 gap-4">
				<img
					src="https://placehold.co/150x150"
					className="rounded overflow-hidden h-fit w-[150px]"
				/>

				<div className="flex flex-col gap-4">
					<div className="flex flex-row gap-2 place-items-center">
						<h1 className="normal-case m-0">
							{pageData.displayName ? (
								<>
									{pageData.displayName}{" "}
									<span className="text-zinc-400 text-2xl">
										({username})
									</span>
								</>
							) : (
								username
							)}
						</h1>
						<span className="px-2 p-1 gradient-bg-r text-black h-fit rounded">
							Premium
						</span>
					</div>

					<div
						style={{ color: rank.color }}
						className=" flex flex-row gap-2 place-items-center"
					>
						<span
							className="px-2 p-1 text-black h-fit rounded"
							style={{ backgroundColor: rank.color }}
						>
							{rank.name}
						</span>
						<hr
							className="w-0.5 h-full"
							style={{ backgroundColor: rank.color }}
						/>
						<div className="w-60 h-6 bg-gray-700 rounded-full overflow-hidden relative my-1">
							<div
								style={{
									width: `${(pageData.xp / nextRank?.minXp) * 100}%`,
									backgroundColor: rank.color,
								}}
								className="h-full transition-all duration-500"
							/>
							<span className="absolute top-0 w-full text-md text-center text-white text-shadow-xs text-shadow-black font-bold">
								{formatNumber(pageData.xp || 0)} /{" "}
								{formatNumber(nextRank?.minXp || "")} XP
							</span>
						</div>
					</div>

					<p className="text-zinc-400 text-lg">
						{pageData.desc || "No Description"}
					</p>

					{currentUserData.username == pageData.username ? (
						<button className="w-fit">Edit Profile</button>
					) : null}
				</div>
			</div>
			<h2>Courses</h2>
			<div className="flex flex-row gap-2">
				{Object.keys(pageData.courses || {}).map((id) => {
					const c = pageData.courses[id];
					if (c.added) {
						return <CourseCard id={id} key={id} />;
					}
				})}
			</div>

			<h2>Top Skills</h2>
		</>
	);
}

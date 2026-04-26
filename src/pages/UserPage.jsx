import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../firebase/Firebase";
import { useUser } from "../Global";
import Rank from "../components/Rank";

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
					alt={username}
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

					<Rank
						name={rank.name || "Loading..."}
						color={rank.color || "#999999"}
						xp={pageData.xp}
						minXp={nextRank?.minXp}
					></Rank>

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

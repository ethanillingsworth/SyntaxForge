// import { useEffect, useMemo, useState } from "react";
// import { Category } from "../firebase/Firebase";

export default function Sidebar() {
	return (
		<div className="sidebar">
			<a
				href="/"
				className="flex flex-row gap-3 min-h-16 place-items-center text-white hover:gradient-text"
			>
				<img className="h-6 rounded" src="/logo.png"></img>
				<h2 className="text-base">SyntaxForge</h2>
			</a>
			<div className="group">
				<h2>Personal</h2>
			</div>

			<div className="group">
				<h2>Quick Links</h2>
				<a href="/courses">Available Courses</a>
				{/* {categorys.map((category) => {
					return (
						<div className="menu">
							<span>{category.replaceAll("-", " ")}</span>
							<div className="submenu">
								{Object.values(courses[category] ?? {}).map(
									(data) => (
										<a
											key={data.id}
											href={`/${data.id}`}
											className={
												data.nickname ? "uppercase" : ""
											}
										>
											{data.nickname
												? data.nickname
												: data.id.replaceAll("-", " ")}
										</a>
									)
								)}
							</div>
						</div>
					);
				})} */}
			</div>
		</div>
	);
}

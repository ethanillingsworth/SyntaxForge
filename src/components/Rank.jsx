import { formatNumber } from "../Global";

export default function Rank({ name, color, xp, minXp }) {
	return (
		<>
			<div
				style={{ color: color }}
				className=" flex flex-row gap-2 place-items-center"
			>
				<span
					className="px-2 p-1 text-black h-fit rounded"
					style={{ backgroundColor: color }}
				>
					{name}
				</span>
				<hr
					className="w-0.5 h-full"
					style={{ backgroundColor: color }}
				/>
				<div className="w-60 h-6 bg-gray-700 rounded-full overflow-hidden relative my-1">
					<div
						style={{
							width: `${(xp / minXp) * 100}%`,
							backgroundColor: color,
						}}
						className="h-full transition-all duration-500"
					/>
					<span className="absolute top-0 w-full text-md text-center text-white text-shadow-xs text-shadow-black font-bold">
						{formatNumber(xp || 0)} / {formatNumber(minXp || "")} XP
					</span>
				</div>
			</div>
		</>
	);
}

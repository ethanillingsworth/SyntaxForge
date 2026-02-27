export default function LandingPage() {
	return (
		<>
			<div className="sticky top-0 m-0">
				<div className="w-full flex flex-row text-xl font-bold place-items-center bg-forge-surface m-0 p-4">
					<a href="/" className="gradient-text">
						SyntaxForge
					</a>

					<a href="/login" className="ml-auto">
						<button>Login</button>
					</a>
				</div>
				<hr className="gradient-bg-r h-0.5 border-none m-0" />
			</div>
			<div className="w-full flex flex-col place-content-center place-items-center h-full m-0">
				<h1>
					<span className="gradient-text">Forge</span> new programming
					skills!
				</h1>
				<h2 className="p-0 border-none text-zinc-400">
					Build real-world projects, master modern tools, and turn
					your code into confidence.
				</h2>
				<a href="/login">
					<button className="text-xl accent-button">
						Start Today
					</button>
				</a>
			</div>
		</>
	);
}

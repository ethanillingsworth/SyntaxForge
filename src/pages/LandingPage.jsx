import Editor from "../components/Editor";

export default function LandingPage() {
	const sampleCode = `/**
 * SyntaxForge: Logic Challenge #01
 * Task: Create a URL-friendly "Slug" from a project title.
 */

const projectTitle = "Mastering JavaScript: The Forge Way!";

function forgeSlug(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\\w\\s-]/g, '') // Remove special characters
		.replace(/[\\s_-]+/g, '-') // Replace spaces with hyphens
		.replace(/^-+|-+$/g, ''); // Trim hyphens from ends
}

const slug = forgeSlug(projectTitle);

// Proof of execution:
console.log(\`Original: "\${projectTitle}"\`);
console.log(\`Forged Slug: "\${slug}"\`);

// Returns: "mastering-javascript-the-forge-way"`;

	return (
		<>
			<div className="sticky top-0 m-0 z-1000">
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
			<div className="min-h-full py-4 flex flex-col place-items-center">
				<div className="w-full flex flex-col place-content-center place-items-center h-dvh m-0">
					<h1 className="text-4xl">
						<span className="gradient-text">Forge</span> new
						programming skills!
					</h1>
					<h2 className="p-0 border-none text-zinc-400">
						Build real-world projects, master modern tools, and turn
						your code into confidence.
					</h2>
					<a href="/login" className="mt-6">
						<button className="text-xl accent-button">
							Start Today
						</button>
					</a>
				</div>

				<h2 className="p-0 border-none text-3xl">Editor Preview</h2>

				<div className="w-300 h-125 border-2 border-zinc-600 rounded">
					<Editor
						hideSettings
						showDecorativeButtons
						value={sampleCode}
					/>
				</div>
			</div>
		</>
	);
}

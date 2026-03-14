import Editor from "../components/Editor";
import "../css/landing.css";
export default function LandingPage() {
	const sampleCode = `const projectTitle = "Mastering JavaScript: The Forge Way!";

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
		<div className="landing">
			<div className="header-wrapper">
				<div className="header">
					<a href="/" className="gradient-text">
						SyntaxForge
					</a>

					<a href="/login" className="ml-auto">
						<button>Login</button>
					</a>
				</div>
				<hr className="gradient-bg-r h-0.5 border-none m-0" />
			</div>
			<main>
				<div className="hero">
					<h1 className="text-4xl">
						<span className="gradient-text">Forge</span> new
						programming skills!
					</h1>
					<h2 className="text-zinc-400 text-2xl! m-0!">
						Build real-world projects, master modern tools, and turn
						your code into confidence.
					</h2>
					<a href="/login" className="mt-6">
						<button className="text-xl accent-button">
							Get Started for Free
						</button>
					</a>
				</div>

				<h2>Editor Preview</h2>

				<div className="w-250 h-125 border-2 border-zinc-600 rounded">
					<Editor
						showDecorativeButtons
						noLoginRequired
						value={sampleCode}
					/>
				</div>

				<h2>
					Why <span className="gradient-text">SyntaxForge</span>?
				</h2>

				<h3>Learning & Curriculum</h3>

				<table className="max-w-250">
					<thead>
						<tr>
							<td>Feature</td>
							<td>Description</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Interactive Courses</td>
							<td>
								Master new concepts through a blend of hands-on
								coding challenges and instant-feedback quizzes.
							</td>
						</tr>
						<tr>
							<td>Smart Assessments</td>
							<td>
								Test your knowledge with multiple-choice and
								free-response questions designed to bridge the
								gap between theory and practice.
							</td>
						</tr>
						<tr>
							<td>Curated Learning Hub</td>
							<td>
								Deepen your understanding with high-quality
								articles and video tutorials baked directly into
								your lessons.
							</td>
						</tr>
						<tr>
							<td>Integrated Documentation</td>
							<td>
								Never get lost in a sea of tabs with instant,
								beginner-friendly references for the language
								you're currently learning.
							</td>
						</tr>
					</tbody>
				</table>

				<a href="/login" className="mt-6">
					<button className="text-xl accent-button">
						Learn More
					</button>
				</a>

				<h3>Practice & Play</h3>

				<table className="max-w-250">
					<thead>
						<tr>
							<td>Feature</td>
							<td>Description</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>The Playground</td>
							<td>
								Experiment freely in a zero-setup environment to
								test out snippets of NodeJS or Python on the
								fly.
							</td>
						</tr>
						<tr>
							<td>Real-Time Execution</td>
							<td>
								Run your code instantly and see the output
								without the headache of configuring local
								compilers or servers.
							</td>
						</tr>
						<tr>
							<td>Sandbox Mode</td>
							<td>
								A distraction-free space to break things, fix
								them, and learn how code actually behaves under
								the hood.
							</td>
						</tr>
					</tbody>
				</table>

				<a href="/login" className="mt-6">
					<button className="text-xl accent-button">
						Learn More
					</button>
				</a>
			</main>
		</div>
	);
}

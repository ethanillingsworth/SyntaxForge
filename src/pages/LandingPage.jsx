import Editor from "../components/Editor";
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
		<div className="landing m-0">
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
				{/* Hero Section */}
				<div className="hero">
					<div className="hero-glow" />
					<p className="text-forge-subtext text-sm tracking-widest uppercase mb-4">
						Interactive Coding Platform
					</p>
					<h1>
						<span className="gradient-text">Forge</span> new
						programming skills
					</h1>
					<h2 className="text-zinc-400 text-xl! m-0! max-w-160 text-center leading-relaxed">
						Build real-world projects, master modern tools, and turn
						your code into confidence — all in one place.
					</h2>
					<div className="flex gap-4 mt-8">
						<a href="/login">
							<button className="text-lg accent-button">
								Get Started for Free
							</button>
						</a>
						<a href="#features">
							<button className="text-lg raised-button">
								See Features
							</button>
						</a>
					</div>
				</div>

				{/* Editor Showcase */}
				<section className="editor-showcase">
					<h2>
						Try the <span className="gradient-text">Editor</span>
					</h2>
					<p className="text-forge-subtext text-center max-w-140 mb-8">
						Write, run, and experiment with code directly in your
						browser. No setup needed.
					</p>
					<div className="editor-frame">
						<Editor
							showDecorativeButtons
							noLoginRequired
							value={sampleCode}
						/>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="features-section">
					<h2>
						Why <span className="gradient-text">SyntaxForge</span>?
					</h2>
					<p className="text-forge-subtext text-center max-w-140 mb-12">
						Everything you need to go from beginner to confident
						developer, built into one streamlined platform.
					</p>

					<div className="features-grid">
						<div className="feature-card">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
									<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
								</svg>
							</div>
							<h3>Interactive Courses</h3>
							<p>
								Master new concepts through hands-on coding
								challenges and instant-feedback quizzes that
								keep you engaged.
							</p>
						</div>

						<div className="feature-card">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M9 11l3 3L22 4" />
									<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
								</svg>
							</div>
							<h3>Smart Assessments</h3>
							<p>
								Test your knowledge with thoughtfully designed
								questions that bridge the gap between theory and
								practice.
							</p>
						</div>

						<div className="feature-card">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
								</svg>
							</div>
							<h3>Curated Learning Hub</h3>
							<p>
								Deepen your understanding with high-quality
								articles and tutorials baked directly into your
								lessons.
							</p>
						</div>

						<div className="feature-card">
							<div className="feature-icon">
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
									<polyline points="14 2 14 8 20 8" />
									<line x1="16" y1="13" x2="8" y2="13" />
									<line x1="16" y1="17" x2="8" y2="17" />
									<polyline points="10 9 9 9 8 9" />
								</svg>
							</div>
							<h3>Integrated Docs</h3>
							<p>
								Never get lost in a sea of tabs — access
								beginner-friendly references for the language
								you're learning.
							</p>
						</div>
					</div>
				</section>

				{/* Practice Section */}
				<section className="practice-section">
					<h2>
						Practice & <span className="gradient-text">Play</span>
					</h2>
					<p className="text-forge-subtext text-center max-w-140 mb-12">
						A zero-setup environment to experiment, break things,
						and learn how code actually works.
					</p>

					<div className="practice-grid">
						<div className="practice-card">
							<div className="practice-number gradient-text">
								01
							</div>
							<div>
								<h3>The Playground</h3>
								<p>
									Experiment freely in a zero-setup
									environment. Test out snippets of NodeJS or
									Python on the fly.
								</p>
							</div>
						</div>

						<div className="practice-card">
							<div className="practice-number gradient-text">
								02
							</div>
							<div>
								<h3>Real-Time Execution</h3>
								<p>
									Run your code instantly and see output
									without configuring local compilers or
									servers.
								</p>
							</div>
						</div>

						<div className="practice-card">
							<div className="practice-number gradient-text">
								03
							</div>
							<div>
								<h3>Sandbox Mode</h3>
								<p>
									A distraction-free space to break things,
									fix them, and learn how code behaves under
									the hood.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="cta-section">
					<div className="cta-glow" />
					<h2>
						Ready to start{" "}
						<span className="gradient-text">forging</span>?
					</h2>
					<p className="text-forge-subtext text-center max-w-120 mb-8">
						Join SyntaxForge today and start building real skills
						with interactive courses, playgrounds, and more.
					</p>
					<a href="/login">
						<button className="text-lg accent-button">
							Get Started for Free
						</button>
					</a>
				</section>

				{/* Footer */}
				<footer className="landing-footer">
					<hr className="gradient-bg-r h-0.5 border-none m-0 w-full" />
					<div className="footer-content">
						<span className="gradient-text font-bold text-lg">
							SyntaxForge
						</span>
						<span className="text-zinc-500 text-sm">
							&copy; {new Date().getFullYear()} SyntaxForge. Built
							for learners.
						</span>
					</div>
				</footer>
			</main>
		</div>
	);
}

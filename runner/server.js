import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.post("/run", async (req, res) => {
	const { code, lang } = req.body;

	if (!code) return res.status(400).json({ error: "No code provided" });
	if (!lang) return res.status(400).json({ error: "No language specified" });

	let output = [];

	try {
		if (lang === "javascript") {
			const sandboxConsole = {
				log: (...args) => output.push(args.join(" ")),
			};

			try {
				const fn = new Function("console", code); // may throw SyntaxError
				fn(sandboxConsole); // may throw runtime error

				res.json({ logs: output });
			} catch (err) {
				res.status(500).json({
					error: err.name + ": " + err.message,
				});
			}
		} else if (lang === "python") {
			exec(
				`python3 -c "${code.replace(/"/g, '\\"')}"`,
				(err, stdout, stderr) => {
					if (err) return res.status(500).json({ error: stderr });
					res.json({ logs: stdout.trim().split("\n") });
				},
			);
		} else {
			res.status(400).json({ error: "Unsupported language" });
		}
	} catch {
		res.status(500).json({ error: "Error", output });
	}
});

app.get("/", (req, res) => res.send("OK"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Runner ready on port ${PORT}`));

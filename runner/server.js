import express from "express";
import { execFile } from "child_process";

const app = express();
app.use(express.json());

app.post("/run", async (req, res) => {
    const { code, lang, checks } = req.body;

    if (!code) return res.status(400).json({ error: "No code provided" });
    if (!lang) return res.status(400).json({ error: "No language specified" });

    // Ensure checks is an array, default to empty array if not provided
    const finalizedChecks = Array.isArray(checks) ? checks : [];

    let output = [];

    try {
        if (lang === "javascript") {
            const sandboxConsole = {
                log: (...args) => output.push(args.join(" ")),
            };

            try {
                const fn = new Function("console", code);
                fn(sandboxConsole);
                res.json({ logs: output });
            } catch (err) {
                res.status(500).json({
                    error: err.name + ": " + err.message,
                });
            }
        } else if (lang === "python") {
            // 1. Keep this string COMPLETELY static. No ${} interpolation here!
            const testChecksPython = `
# --- SYSTEM DATA EVALUATOR ---
import json
import sys

def run_system_checks():
    try:
        # Securely read the JSON string passed via command-line arguments
        conditions = json.loads(sys.argv[1])
    except Exception:
        conditions = []

    results = []
    
    for index, condition in enumerate(conditions):
        try:
            passed = bool(eval(condition))
            results.append({
                "id": index + 1,
                "condition": condition,
                "status": "passed" if passed else "failed"
            })
        except Exception as e:
            results.append({
                "id": index + 1,
                "condition": condition,
                "status": "error",
                "message": str(e)
            })
            
    # Print the delimiter line followed by the structured data
    print("\\n---SYSTEM_METADATA_SEPARATOR---")
    print(json.dumps(results))

run_system_checks()
`;

            const finalCode = `${code}\n\n${testChecksPython}`;

            // 2. PASS JSON.stringify(finalizedChecks) AS THE THIRD ARGUMENT HERE
            execFile(
                "python3",
                ["-c", finalCode, JSON.stringify(finalizedChecks)],
                { timeout: 5000 },
                (err, stdout, stderr) => {
                    if (err && !stdout) {
                        return res
                            .status(400)
                            .json({ error: stderr || err.message });
                    }

                    // 3. Separate user stdout prints from system metadata
                    const parts = stdout
                        .trim()
                        .split("---SYSTEM_METADATA_SEPARATOR---");

                    const logs = parts[0] ? parts[0].trim().split("\n") : [];

                    let systemChecks = [];
                    if (parts[1]) {
                        try {
                            systemChecks = JSON.parse(parts[1].trim());
                        } catch {
                            return res.status(500).json({
                                error: "Failed to parse test metadata results.",
                            });
                        }
                    }

                    // 4. Return everything back cleanly
                    res.json({
                        logs,
                        systemChecks,
                        allPassed: systemChecks.every(
                            (check) => check.status === "passed",
                        ),
                    });
                },
            );
        } else {
            res.status(400).json({ error: "Unsupported language" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

app.get("/", (req, res) => res.send("OK"));

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Runner ready on port ${PORT}`));

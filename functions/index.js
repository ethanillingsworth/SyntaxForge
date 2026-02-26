import * as functions from "firebase-functions";
import { GoogleAuth } from "google-auth-library";
import cors from "cors";

// Allow requests from localhost (React dev server)
const corsHandler = cors({
	origin: ["http://localhost:5173", "https://syntaxforge.dev"],
});

export const runCode = functions.https.onRequest(async (req, res) => {
	// Wrap your code inside corsHandler
	corsHandler(req, res, async () => {
		const { code, lang } = req.body;
		const RUNNER_URL =
			"https://code-runner-874960583919.us-central1.run.app/run";

		try {
			const auth = new GoogleAuth();
			const client = await auth.getIdTokenClient(RUNNER_URL);

			const response = await client.request({
				url: RUNNER_URL,
				method: "POST",
				data: { code, lang },
				headers: { "Content-Type": "application/json" },
				validateStatus: () => true,
			});

			res.status(response.status).json(response.data);
		} catch (err) {
			console.error("Error calling runner:", err);
			res.status(500).json({ error: err.message });
		}
	});
});

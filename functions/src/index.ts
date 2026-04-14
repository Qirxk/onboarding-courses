/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

setGlobalOptions({maxInstances: 10});

// Nuxt SSR handler for Firebase Functions

import {resolve} from "node:path";
import {existsSync} from "node:fs";


let nuxtHandler: unknown;

export const nuxtApp = onRequest(async (req, res) => {
	try {
		if (!nuxtHandler) {
			// Path to the Nuxt server entry
			const nuxtServerPath = resolve(__dirname, "../../.output/server/index.mjs");
			if (!existsSync(nuxtServerPath)) {
				res.status(500).send("Nuxt server build not found. Did you run 'yarn build'?");
				return;
			}
			// Dynamically import the Nuxt server handler
			const {default: handler} = await import(nuxtServerPath);
			nuxtHandler = handler;
		}
		(nuxtHandler as (req: unknown, res: unknown) => void)(req, res);
	} catch (err: unknown) {
		logger.error("Nuxt SSR error", err);
		const message = typeof err === "object" && err && "message" in err ? (err as {message?: string}).message : String(err);
		res.status(500).send("Nuxt SSR error: " + message);
	}
});

// Worker entry point for the workspace-root deployment. Serves the built
// website's static assets and routes enquiry API calls to the shared
// handler that lives with the website artifact.
import { onRequestPost } from "./artifacts/bhawani-holdings/functions/api/enquiries";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.pathname === "/api/enquiries" && request.method === "POST") {
			return onRequestPost({ request, env });
		}
		return env.ASSETS.fetch(request);
	},
};

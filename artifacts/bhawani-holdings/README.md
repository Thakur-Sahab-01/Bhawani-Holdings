# BHAWANI Holdings website

React and Vite website for BHAWANI Holdings, Maa Bhawani Construction, and Maa Bhawani Properties.

## Replit preview and API

The website runs in the Replit preview. Its enquiry forms submit to `/api/enquiries`, which stores form details in the project's PostgreSQL database. The endpoint validates the request and does not send email. No public enquiry listing or admin page is exposed.

## Cloudflare Pages

The site is prepared as a static Vite build with Cloudflare Pages Functions and D1 for enquiry storage.

- Cloudflare Pages root directory: `artifacts/bhawani-holdings`
- Build command: `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter @workspace/bhawani-holdings run build`
- Build output directory: `dist`
- Cloudflare Pages Functions directory: `functions`
- Wrangler configuration: `wrangler.jsonc`
- D1 migration: `artifacts/bhawani-holdings/migrations/0001_create_enquiries.sql`

Before the Cloudflare version of the enquiry endpoint can store submissions:

1. Create the D1 database named `bhawani-holdings-enquiries` (requires the Cloudflare `D1 Write` permission).
2. Replace `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID` in `wrangler.jsonc` with the database ID from Cloudflare.
3. Apply `migrations/0001_create_enquiries.sql` to the remote database.
4. Configure the Cloudflare Pages project with the root directory, build command and output directory above.
5. Deploy to the generated `*.pages.dev` URL (requires `Pages Write`) and verify the form endpoint there.

No DNS records, nameservers, email DNS records, or custom-domain settings may be changed without explicit approval. Connecting `bhawaniholdings.in` or `www.bhawaniholdings.in` must be done separately and only after explicit approval.

The contact forms store enquiries but do not send email notifications. Check the database through the Cloudflare D1 console after deployment, or request a secure notification flow separately.

## Verified contact routes

- Email: maabhawaniconstruction1401@gmail.com
- WhatsApp: +91 88533 41008
- WhatsApp channel: https://whatsapp.com/channel/0029Vb90dRyGzzKWmdoPy928

// ─────────────────────────────────────────────────────────────────────────────
// Site configuration you are expected to edit.
//
// Both values below are intentionally blank. The site works without them — it
// falls back to GitHub, which needs no account or infrastructure — but the
// newsletter cannot collect an address and the contact page cannot show an
// inbox until you fill them in.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Where the newsletter form POSTs the subscriber's email.
 *
 * This is a static site, so there is no server to receive signups. Paste the
 * form endpoint from whichever provider you use, for example:
 *
 *   Buttondown  https://buttondown.com/api/emails/embed-subscribe/<username>
 *   Mailchimp   https://<user>.us1.list-manage.com/subscribe/post?u=...&id=...
 *   ConvertKit  https://app.kit.com/forms/<form-id>/subscriptions
 *   Listmonk    https://<your-host>/subscription/form
 *
 * Leave empty and the form degrades to a mailto link, which still works but
 * requires you to add each subscriber by hand.
 */
export const NEWSLETTER_ENDPOINT = '';

/**
 * Public contact address. Use a dedicated inbox, never a personal one — this
 * is an activist site and the address will be scraped, and may attract abuse
 * or legal threats from the companies named here.
 *
 * Leave empty and the contact page routes everything through GitHub instead.
 */
export const CONTACT_EMAIL = '';

/** Public repository, used for issue links and corrections. */
export const REPO_URL = 'https://github.com/richyrich006/test-repo';

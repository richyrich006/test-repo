'use client';

import { useState } from 'react';
import { NEWSLETTER_ENDPOINT, CONTACT_EMAIL, REPO_URL } from '@/site.config';

/**
 * Newsletter signup.
 *
 * With NEWSLETTER_ENDPOINT set this posts straight to the provider, which
 * handles confirmation and unsubscribes. Without it there is nowhere to send
 * an address, so rather than accept an email and silently drop it, the form
 * falls back to a mailto link that the reader sends themselves.
 */
export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const configured = NEWSLETTER_ENDPOINT.length > 0;
  const fallbackAddress = CONTACT_EMAIL;

  const mailto = `mailto:${fallbackAddress}?subject=${encodeURIComponent(
    'Subscribe to Boycott PE Brands'
  )}&body=${encodeURIComponent('Please add me to the update list.')}`;

  return (
    <div className={`newsletter${compact ? ' newsletter-compact' : ''}`}>
      <h3>Get updates when brands change hands</h3>
      <p>
        Ownership moves constantly — a brand that is independent today can be
        bought next quarter. Occasional emails covering new entries, corrections,
        and the buyouts worth knowing about. No tracking, no selling the list,
        unsubscribe whenever.
      </p>

      {configured ? (
        <form
          className="newsletter-form"
          action={NEWSLETTER_ENDPOINT}
          method="post"
          target="_blank"
          rel="noopener noreferrer"
        >
          <label className="sr-only" htmlFor="nl-email">
            Email address
          </label>
          <input
            id="nl-email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Subscribe
          </button>
        </form>
      ) : fallbackAddress ? (
        <p>
          <a className="btn btn-primary" href={mailto}>
            Email to subscribe →
          </a>
        </p>
      ) : (
        <p>
          <a className="btn btn-primary" href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
            Watch the repository for updates →
          </a>
        </p>
      )}

      {!configured && (
        <p className="newsletter-note">
          A mailing list needs a provider to hold the addresses — this is a
          static site with no server of its own. Until one is connected, updates
          go out through the link above.
        </p>
      )}
    </div>
  );
}

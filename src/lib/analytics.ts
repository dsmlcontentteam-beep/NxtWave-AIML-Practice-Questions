import { track as vercelTrack } from '@vercel/analytics';

type Props = Record<string, string | number | boolean | null>;

/**
 * Privacy-friendly events for Vercel Web Analytics: no personal data, no search text.
 * Page views are recorded on every Vercel plan; custom events like these appear in the
 * dashboard on plans that include custom events (Pro and above at the time of writing).
 */
export function track(event: string, props: Props = {}) {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics must never break the page.
  }
}

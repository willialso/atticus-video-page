import posthog from "posthog-js";

type EventProps = Record<string, string | number | boolean | null | undefined>;

let initialized = false;

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const utmContent = params.get("utm_content");
  const utmTerm = params.get("utm_term");

  return {
    ...(utmSource ? { utm_source: utmSource } : {}),
    ...(utmMedium ? { utm_medium: utmMedium } : {}),
    ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
    ...(utmContent ? { utm_content: utmContent } : {}),
    ...(utmTerm ? { utm_term: utmTerm } : {})
  };
}

export function initAnalytics() {
  if (initialized || typeof window === "undefined") {
    return;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    return;
  }

  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false,
    persistence: "localStorage+cookie"
  });
  initialized = true;
}

export function trackEvent(eventName: string, properties?: EventProps) {
  if (!initialized) {
    return;
  }

  posthog.capture(eventName, properties);
}

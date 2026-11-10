"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const REFRESH_MS = 5 * 60 * 1000;

/**
 * Keeps an open page's gold price current by re-requesting the page's server
 * render every five minutes while the tab is visible. The server reuses a
 * fetched price for ten minutes, so this never adds provider requests.
 */
export function GoldTickerRefresh() {
  const router = useRouter();

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [router]);

  return null;
}

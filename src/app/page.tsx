"use client";

import { useEffect, useRef } from "react";
import { getUtmParams, initAnalytics, trackEvent } from "@/lib/analytics";

const VIDEO_PATH = "/final_pitch_v2.mp4";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTrackedPlay = useRef(false);
  const trackedQuartiles = useRef({
    q25: false,
    q50: false,
    q75: false,
    q100: false
  });

  useEffect(() => {
    initAnalytics();

    const utmParams = getUtmParams();
    trackEvent("video_page_open", {
      page: "/",
      ...utmParams
    });
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) {
      return;
    }

    const utmParams = getUtmParams();

    const onPlay = () => {
      if (hasTrackedPlay.current) {
        return;
      }
      hasTrackedPlay.current = true;
      trackEvent("video_play", {
        page: "/",
        ...utmParams
      });
    };

    const onTimeUpdate = () => {
      const duration = videoEl.duration;
      if (!duration || Number.isNaN(duration)) {
        return;
      }

      const pct = (videoEl.currentTime / duration) * 100;

      if (pct >= 25 && !trackedQuartiles.current.q25) {
        trackedQuartiles.current.q25 = true;
        trackEvent("video_25", { page: "/", ...utmParams });
      }
      if (pct >= 50 && !trackedQuartiles.current.q50) {
        trackedQuartiles.current.q50 = true;
        trackEvent("video_50", { page: "/", ...utmParams });
      }
      if (pct >= 75 && !trackedQuartiles.current.q75) {
        trackedQuartiles.current.q75 = true;
        trackEvent("video_75", { page: "/", ...utmParams });
      }
      if (pct >= 99 && !trackedQuartiles.current.q100) {
        trackedQuartiles.current.q100 = true;
        trackEvent("video_100", { page: "/", ...utmParams });
      }
    };

    videoEl.addEventListener("play", onPlay);
    videoEl.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      videoEl.removeEventListener("play", onPlay);
      videoEl.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  return (
    <main className="page-wrap">
      <section className="card">
        <p className="eyebrow">Atticus Trade</p>
        <h1 className="title">Investor Presentation</h1>
        <p className="subtitle">
          Thank you for your time. Please watch the presentation below. If playback does not start
          smoothly on your connection, use the direct download link.
        </p>
        <div className="video-wrap">
          <video
            ref={videoRef}
            className="video"
            controls
            preload="metadata"
            playsInline
            controlsList="nodownload"
          >
            <source src={VIDEO_PATH} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="footnote">
          Direct link:{" "}
          <a href={VIDEO_PATH} target="_blank" rel="noreferrer">
            Download video
          </a>
        </p>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
        <Image
          className="logo"
          src="https://i.ibb.co/YBfZqnKT/atlogo.png"
          alt="Atticus logo"
          width={180}
          height={72}
          priority
        />
        <h1 className="title">Platform and Live Production Pilot Video</h1>
        <p className="subtitle">
          Thank you for watching. A direct download link is available below.
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
        <div className="contact">
          <p className="contact-title">Contact</p>
          <p className="contact-line">
            Email:{" "}
            <a href="mailto:michael@atticustrade.com" rel="noreferrer">
              michael@atticustrade.com
            </a>
          </p>
          <p className="contact-line">
            Telegram:{" "}
            <a href="https://t.me/willialso" target="_blank" rel="noreferrer">
              @willialso
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}

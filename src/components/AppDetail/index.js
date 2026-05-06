import React, { useEffect, useRef, useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import clsx from "clsx";

import { Categories, Properties, Showcases } from "@site/src/data/apps";
import {
  getAppStats,
  isTrackable,
  formatTxCount,
  STATS_GENERATED_AT,
} from "@site/src/utils/appStats";
import OpenGraphInfo from "@site/src/components/Layout/OpenGraphInfo";
import AppTile from "@site/src/components/AppTile";

import styles from "./styles.module.css";

const APPS_JS_GITHUB_URL =
  "https://github.com/cardano-foundation/cardano-org/blob/staging/src/data/apps.js";

function buildJsonLd(app) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.title,
    description: app.description,
    url: app.website,
    applicationCategory: Categories[app.category].label,
    ...(app.source ? { codeRepository: app.source } : {}),
    ...(app.x ? { sameAs: [`https://x.com/${app.x}`] } : {}),
  });
}

const RELATED_LIMIT = 4;

function getRelatedApps(currentApp) {
  return Showcases
    .filter((s) => s.category === currentApp.category && s.slug !== currentApp.slug)
    .sort((a, b) => {
      const txDiff = (getAppStats(b)?.txCount ?? 0) - (getAppStats(a)?.txCount ?? 0);
      return txDiff !== 0 ? txDiff : a.title.localeCompare(b.title);
    })
    .slice(0, RELATED_LIMIT);
}

function CarouselSlide({ url, eager }) {
  const href = useBaseUrl(url);
  return (
    <img
      src={href}
      alt=""
      aria-hidden
      loading={eager ? "eager" : "lazy"}
      width={1280}
      height={720}
      className={styles.carouselSlide}
    />
  );
}

function PreviewCarousel({ urls }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(urls.length > 1);
  const dragRef = useRef(null);

  const getStep = () => {
    const el = trackRef.current;
    if (!el || !el.firstElementChild) return 1;
    return el.firstElementChild.offsetWidth + 12; // matches CSS gap
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const step = getStep();
      const idx = Math.round(el.scrollLeft / step);
      setActive(idx);
      setCanPrev(el.scrollLeft > 1);
      setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [urls.length]);

  const scrollTo = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * getStep(), behavior: "smooth" });
  };

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * getStep(), behavior: "smooth" });
  };

  const onPointerDown = (e) => {
    if (e.pointerType === "touch") return;
    const el = trackRef.current;
    if (!el) return;
    dragRef.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
    el.style.scrollSnapType = "none";
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.startX;
    if (Math.abs(dx) > 3) drag.moved = true;
    el.scrollLeft = drag.startScroll - dx;
  };

  const onPointerUp = (e) => {
    const drag = dragRef.current;
    const el = trackRef.current;
    dragRef.current = null;
    if (!el) return;
    el.style.cursor = "";
    el.style.scrollSnapType = "";
    if (drag && drag.moved) {
      const step = getStep();
      const idx = Math.round(el.scrollLeft / step);
      el.scrollTo({ left: idx * step, behavior: "smooth" });
    }
  };

  return (
    <figure className={styles.preview}>
      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {urls.map((url, idx) => (
            <CarouselSlide key={url} url={url} eager={idx === 0} />
          ))}
        </div>
        <button
          type="button"
          className={clsx(styles.carouselArrow, styles.carouselArrowPrev)}
          onClick={() => scrollBy(-1)}
          disabled={!canPrev}
          aria-label={translate({ id: "apps.carousel.prev", message: "Previous" })}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
            <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
        <button
          type="button"
          className={clsx(styles.carouselArrow, styles.carouselArrowNext)}
          onClick={() => scrollBy(1)}
          disabled={!canNext}
          aria-label={translate({ id: "apps.carousel.next", message: "Next" })}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden focusable="false">
            <path fill="currentColor" d="M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>
      <div className={styles.carouselDots} role="tablist" aria-label="Screenshots">
        {urls.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={idx === active}
            aria-label={`Screenshot ${idx + 1}`}
            className={clsx(styles.carouselDot, idx === active && styles.carouselDotActive)}
            onClick={() => scrollTo(idx)}
          />
        ))}
      </div>
    </figure>
  );
}

function PreviewHero({ app }) {
  const [errored, setErrored] = useState(false);
  const previewHref = useBaseUrl(app.previewUrl || "");
  const urls = (app.previewUrls && app.previewUrls.length > 0)
    ? app.previewUrls
    : app.previewUrl ? [app.previewUrl] : [];
  if (urls.length === 0 || errored) return null;
  if (urls.length > 1) {
    return <PreviewCarousel urls={urls} />;
  }
  return (
    <figure className={styles.preview}>
      <img
        src={previewHref}
        alt=""
        aria-hidden
        loading="lazy"
        width={1280}
        height={720}
        onError={() => setErrored(true)}
      />
    </figure>
  );
}

function hasPreviews(app) {
  return Boolean(
    (app.previewUrls && app.previewUrls.length > 0) || app.previewUrl
  );
}

function ShareButton({ url, title }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    const fullUrl = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : url;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
      } catch {
        // user cancelled or share failed — leave it; do not fall back to clipboard
        // (clipboard.writeText would throw without a fresh user gesture)
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {
        // clipboard blocked — fail silently
      }
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.iconButton}
      aria-label={translate({ id: "apps.detail.share", message: "Share" })}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12l5 5 9-9"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4M12 4l-4 4M12 4l4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5"
          />
        </svg>
      )}
    </button>
  );
}

export default function AppDetail({ app }) {
  const iconHref = useBaseUrl(app.icon || "");
  const categoryDef = Categories[app.category];
  const stats = isTrackable(app) ? getAppStats(app) : null;
  const showActivity = stats && stats.txCount > 0;
  const relatedApps = getRelatedApps(app);

  const pageTitle = `${app.title} on Cardano`;
  const pageDescription = app.description;

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <OpenGraphInfo
        pageName="apps"
        title={pageTitle}
        description={pageDescription}
      />
      <Head>
        <script type="application/ld+json">{buildJsonLd(app)}</script>
      </Head>
      <main className={clsx("container", styles.detail)}>
        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          <Link to="/apps">
            {translate({ id: "apps.detail.crumbApps", message: "Apps" })}
          </Link>
          {categoryDef && (
            <>
              <span className={styles.crumbSep} aria-hidden>/</span>
              <Link to={`/apps?tags=${app.category}`}>{categoryDef.label}</Link>
            </>
          )}
          <span className={styles.crumbSep} aria-hidden>/</span>
          <span className={styles.crumbCurrent}>{app.title}</span>
        </nav>

        {app.maintainerPick && (
          <div className={styles.pickBadgeRow}>
            <span className={styles.pickBadge}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden focusable="false">
                <path
                  fill="currentColor"
                  d="M12 2.5l2.9 6.5 7.1.8-5.3 4.9 1.5 7-6.2-3.6L5.8 21.7l1.5-7L2 9.8l7.1-.8z"
                />
              </svg>
              {translate({
                id: "apps.detail.maintainerPick",
                message: "Maintainer pick",
              })}
            </span>
          </div>
        )}

        <header className={styles.header}>
          {app.icon ? (
            <img src={iconHref} alt="" className={styles.icon} aria-hidden />
          ) : (
            <div className={styles.iconFallback} aria-hidden>
              {app.title.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.headerText}>
            <h1 className={styles.title}>{app.title}</h1>
            {app.tagline && <p className={styles.tagline}>{app.tagline}</p>}
          </div>
        </header>

        <div className={styles.tagRow}>
          {categoryDef && (
            <Link
              to={`/apps?tags=${app.category}`}
              className={styles.categoryPill}
              style={{
                backgroundColor: `color-mix(in srgb, ${categoryDef.color} 15%, transparent)`,
                color: `color-mix(in srgb, ${categoryDef.color} 85%, black)`,
              }}
              title={categoryDef.description}
            >
              <span
                className={styles.tagDot}
                style={{ backgroundColor: categoryDef.color }}
              />
              {categoryDef.label}
            </Link>
          )}
          {app.properties.map((p) => {
            const def = Properties[p];
            if (!def) return null;
            return (
              <Link
                key={p}
                to={`/apps?tags=${p}`}
                className={styles.categoryPill}
                style={{
                  backgroundColor: `color-mix(in srgb, ${def.color} 15%, transparent)`,
                  color: `color-mix(in srgb, ${def.color} 85%, black)`,
                }}
                title={def.description}
              >
                <span
                  className={styles.tagDot}
                  style={{ backgroundColor: def.color }}
                />
                {def.label}
              </Link>
            );
          })}
        </div>

        <p className={styles.description}>{app.description}</p>

        {app.spotlight && (
          <Link
            href={app.spotlight.url}
            className={styles.spotlight}
            aria-label={translate({
              id: "apps.detail.spotlight.aria",
              message: "Open Developer Spotlight on developers.cardano.org",
            })}
          >
            <span className={styles.spotlightLabel}>
              {translate({
                id: "apps.detail.spotlight.label",
                message: "Developer Spotlight",
              })}
            </span>
            <span className={styles.spotlightTitle}>
              {app.spotlight.title}
            </span>
            <span className={styles.spotlightMeta}>
              {new Date(app.spotlight.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · developers.cardano.org
            </span>
          </Link>
        )}

        <div className={styles.actions}>
          <Link href={app.website} className={styles.visitButton}>
            {translate(
              { id: "apps.detail.visit", message: "Visit {title}" },
              { title: app.title }
            )}
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden focusable="false">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M9 7h8v8"
              />
            </svg>
          </Link>
          {app.x && (
            <Link
              href={`https://x.com/${app.x}`}
              className={styles.iconButton}
              aria-label={translate(
                {
                  id: "apps.detail.viewOnX.aria",
                  message: "View {title} on X (Twitter)",
                },
                { title: app.title }
              )}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </Link>
          )}
          {app.source && (
            <Link
              href={app.source}
              className={styles.iconButton}
              aria-label={translate({
                id: "apps.detail.viewSource",
                message: "View source",
              })}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
                <path
                  fill="currentColor"
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
                />
              </svg>
            </Link>
          )}
          <ShareButton url={app.website} title={app.title} />
        </div>

        {hasPreviews(app) && (
          <section className={styles.previewWrap}>
            <h2 className={styles.previewHeading}>
              {translate({
                id: "apps.detail.screenshots",
                message: "Screenshots",
              })}
            </h2>
            <PreviewHero app={app} />
          </section>
        )}

        {showActivity && (
          <section className={styles.activity}>
            <h2 className={styles.sectionHeading}>
              {translate({ id: "apps.detail.activity", message: "Activity" })}
              <span className={styles.activityDot} aria-hidden />
            </h2>
            <p className={styles.activityCopy}>
              {translate(
                {
                  id: "apps.detail.activityBody",
                  message:
                    "{count} on-chain transactions in the last 30 days (snapshot {date}).",
                },
                {
                  count: formatTxCount(stats.txCount),
                  date: STATS_GENERATED_AT ?? "n/a",
                }
              )}
            </p>
          </section>
        )}

        {relatedApps.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.sectionHeading}>
              {translate({
                id: "apps.detail.related",
                message: "More in this category",
              })}
            </h2>
            <ul className={styles.relatedGrid}>
              {relatedApps.map((related) => (
                <li key={related.slug}>
                  <AppTile app={related} />
                </li>
              ))}
            </ul>
            <Link
              className={styles.relatedMore}
              to={`/apps?tags=${app.category}`}
            >
              {translate(
                {
                  id: "apps.detail.relatedMore",
                  message: "View all {category} apps",
                },
                { category: categoryDef?.label ?? app.category }
              )}
            </Link>
          </section>
        )}

        <aside className={styles.improve}>
          <div className={styles.improveIcon} aria-hidden>
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path
                fill="currentColor"
                d="M12 3 2 8l10 5 10-5-10-5zm-8 9.5L12 17l8-4.5 2 1L12 19 2 13.5l2-1zm0 4L12 21l8-4.5 2 1L12 23 2 17.5l2-1z"
              />
            </svg>
          </div>
          <h2 className={styles.improveHeading}>
            {translate({
              id: "apps.detail.improveHeading",
              message: "Spotted something off?",
            })}
          </h2>
          <p className={styles.improveCopy}>
            {translate({
              id: "apps.detail.improveCopy",
              message:
                "This catalog is open source. Submit a pull request to update or correct this entry.",
            })}
          </p>
          <Link href={APPS_JS_GITHUB_URL} className={styles.improveButton}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
              <path
                fill="currentColor"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.05.78 2.13v3.16c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
              />
            </svg>
            {translate(
              {
                id: "apps.detail.improveButton",
                message: "Edit {title} on GitHub",
              },
              { title: app.title }
            )}
          </Link>
        </aside>
      </main>
    </Layout>
  );
}

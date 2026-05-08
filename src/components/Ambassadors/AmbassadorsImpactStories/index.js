import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import { translate } from "@docusaurus/Translate";
import { HiArrowRight } from "react-icons/hi";

import Divider from "@site/src/components/Layout/Divider";
import TitleWithText from "@site/src/components/Layout/TitleWithText";
import ambassadorsData from "@site/src/data/ambassadorsData.json";
import impactData from "@site/src/data/ambassadorsImpact.json";
import styles from "./styles.module.css";

function findAmbassador(ref) {
  if (!ref) return null;
  return ambassadorsData.find((a) => a.name === ref) || null;
}

function StoryGradient({ name }) {
  // Deterministic two-stop gradient based on name, for stories without an image asset yet.
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 60) % 360;
  return (
    <div
      className={styles.storyGradient}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${h1} 60% 45%), hsl(${h2} 65% 35%))`,
      }}
      aria-hidden="true"
    >
      <span className={styles.gradientInitial}>{(name || "?").charAt(0)}</span>
    </div>
  );
}

function StoryByline({ ambassador }) {
  if (!ambassador) return null;
  const flag = useBaseUrl(`img/flags/${ambassador.country}.svg`);
  return (
    <div className={styles.byline}>
      <span>
        {translate({ id: "ambassadors.stories.byPrefix", message: "By" })} {ambassador.name}
      </span>
      <img src={flag} alt="" className={styles.bylineFlag} />
    </div>
  );
}

function StoryMedia({ image, name }) {
  const resolved = useBaseUrl(image || "");
  if (!image) return <StoryGradient name={name} />;
  return <img src={resolved} alt="" className={styles.storyImg} />;
}

function FeaturedStory({ story }) {
  const ambassador = findAmbassador(story.ambassadorRef);
  return (
    <article className={styles.featured}>
      <div className={styles.featuredMedia}>
        <StoryMedia image={story.image} name={ambassador?.name || story.titleDefault} />
        {story.tagDefault && (
          <span className={styles.tagPill}>
            {translate({ id: `ambassadors.story.${story.id}.tag`, message: story.tagDefault })}
          </span>
        )}
      </div>
      <div className={styles.featuredBody}>
        <h3 className={styles.featuredTitle}>
          {translate({ id: `ambassadors.story.${story.id}.title`, message: story.titleDefault })}
        </h3>
        <p className={styles.featuredExcerpt}>
          {translate({ id: `ambassadors.story.${story.id}.excerpt`, message: story.excerptDefault })}
        </p>
        <div className={styles.featuredFooter}>
          <Link to={story.link} className={styles.readMore}>
            {translate({ id: "ambassadors.stories.readMore", message: "Read story" })}
            <HiArrowRight />
          </Link>
          <StoryByline ambassador={ambassador} />
        </div>
      </div>
    </article>
  );
}

function ThumbStory({ story }) {
  const ambassador = findAmbassador(story.ambassadorRef);
  return (
    <Link to={story.link} className={styles.thumb}>
      <div className={styles.thumbMedia}>
        <StoryMedia image={story.image} name={ambassador?.name || story.titleDefault} />
      </div>
      <div className={styles.thumbBody}>
        {story.tagDefault && (
          <span className={styles.thumbTag}>
            {translate({ id: `ambassadors.story.${story.id}.tag`, message: story.tagDefault })}
          </span>
        )}
        <div className={styles.thumbTitle}>
          {translate({ id: `ambassadors.story.${story.id}.title`, message: story.titleDefault })}
        </div>
        <StoryByline ambassador={ambassador} />
      </div>
    </Link>
  );
}

export default function AmbassadorsImpactStories() {
  const stories = impactData.stories || [];
  if (!stories.length) return null;
  const [featured, ...rest] = stories;

  return (
    <section>
      <Divider
        text={translate({ id: "ambassadors.stories.divider", message: "Impact Stories" })}
        id="stories"
      />
      <TitleWithText
        title={translate({
          id: "ambassadors.stories.title",
          message: "Real stories from ambassadors making a difference",
        })}
        titleType="black"
        headingDot={true}
      />

      <div className={styles.layout}>
        <FeaturedStory story={featured} />
        <div className={styles.thumbs}>
          {rest.slice(0, 3).map((story) => (
            <ThumbStory key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState, useMemo } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import multiavatar from "@multiavatar/multiavatar";

import { present } from "@site/src/utils/ambassadorLanguages";
import styles from "./styles.module.css";

function multiavatarDataUri(name) {
  const svg = multiavatar(name || "Ambassador");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function Flag({ country, className }) {
  const flag = useBaseUrl(`img/flags/${country}.svg`);
  return <img src={flag} alt="" className={className} />;
}

export default function AmbassadorAvatar({
  ambassador,
  className,
  initialClassName,
  photoClassName,
}) {
  const [errored, setErrored] = useState(false);
  const showPhoto = present(ambassador.profilePicture) && !errored;
  const fallbackSrc = useMemo(() => multiavatarDataUri(ambassador.name), [ambassador.name]);

  if (showPhoto) {
    return (
      <img
        src={ambassador.profilePicture}
        alt=""
        className={photoClassName || className || styles.photo}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    );
  }
  return (
    <img
      src={fallbackSrc}
      alt=""
      className={initialClassName || className || styles.fallback}
      aria-hidden="true"
    />
  );
}

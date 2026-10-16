import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import multiavatar from "@multiavatar/multiavatar";

import { present } from "@site/src/utils/ambassadorLanguages";
import useImageFallback from "@site/src/utils/useImageFallback";
import styles from "./styles.module.css";

const avatarCache = new Map();
function multiavatarDataUri(name) {
  const key = name || "Ambassador";
  let uri = avatarCache.get(key);
  if (!uri) {
    uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(multiavatar(key))}`;
    avatarCache.set(key, uri);
  }
  return uri;
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
  const { ref, onError, hasFailed } = useImageFallback();
  const showPhoto = present(ambassador.profilePicture) && !hasFailed(ambassador.profilePicture);

  if (showPhoto) {
    return (
      <img
        ref={ref}
        src={ambassador.profilePicture}
        alt=""
        className={photoClassName || className || styles.photo}
        loading="lazy"
        onError={onError}
      />
    );
  }
  return (
    <img
      src={multiavatarDataUri(ambassador.name)}
      alt=""
      className={initialClassName || className || styles.fallback}
      aria-hidden="true"
    />
  );
}

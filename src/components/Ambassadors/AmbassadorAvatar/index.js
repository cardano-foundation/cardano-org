import React, { useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import multiavatar from "@multiavatar/multiavatar";

import { present } from "@site/src/utils/ambassadorLanguages";
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
  const [errored, setErrored] = useState(false);
  const showPhoto = present(ambassador.profilePicture) && !errored;

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
      src={multiavatarDataUri(ambassador.name)}
      alt=""
      className={initialClassName || className || styles.fallback}
      aria-hidden="true"
    />
  );
}

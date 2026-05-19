import React, { useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

import { avatarColor } from "@site/src/utils/ambassadorColors";
import { present } from "@site/src/utils/ambassadorLanguages";
import styles from "./styles.module.css";

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
    <div
      className={initialClassName || className || styles.initial}
      style={{ backgroundColor: avatarColor(ambassador.name) }}
      aria-hidden="true"
    >
      {ambassador.name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

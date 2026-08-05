import React, { memo } from "react";
import { translate } from "@docusaurus/Translate";

import AppTile from "@site/src/components/AppTile";
import HorizontalScroller from "@site/src/components/HorizontalScroller";

// Thin wrapper over HorizontalScroller: renders a row of AppTiles at the
// narrower /apps sizing. All scroll/arrow/dot behavior lives in HorizontalScroller.
function AppTileCarousel({ apps, ariaLabel, renderBadge }) {
  return (
    <HorizontalScroller
      ariaLabel={ariaLabel}
      prevLabel={translate({ id: "apps.carousel.prev", message: "Previous" })}
      nextLabel={translate({ id: "apps.carousel.next", message: "Next" })}
      gap="1rem"
      itemWidth="260px"
      itemWidthMobile="220px"
    >
      {apps.map((app, i) => (
        <AppTile
          key={app.slug}
          app={app}
          badge={renderBadge ? renderBadge(app, i) : null}
        />
      ))}
    </HorizontalScroller>
  );
}

export default memo(AppTileCarousel);

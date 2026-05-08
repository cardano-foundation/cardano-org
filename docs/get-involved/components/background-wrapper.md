---
title: Background Wrapper
description: Apply themed background variants (zoom, plain, adaLight) to a page section with the BackgroundWrapper component.
---

import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";

## Background Wrapper

[`<BackgroundWrapper>`](/docs/get-involved/components/background-wrapper) applies a selectable background style to its child components. 

:::info

Most of the time you do not want to put a [`<BackgroundWrapper>`](/docs/get-involved/components/background-wrapper) inside a [`<BoundaryBox>`](/docs/get-involved/components/boundary-box) because it would add a margin around it. However, it is common to place a [`<BoundaryBox>`](/docs/get-involved/components/boundary-box) inside a [`<BackgroundWrapper>`](/docs/get-involved/components/background-wrapper).

:::

## Background Styles

You can select between different background types by passing the backgroundType to the component. 

### Solid Grey
```
<BackgroundWrapper backgroundType="solidGrey">
```

#### Result
<BackgroundWrapper backgroundType="solidGrey">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### Solid Blue
```
<BackgroundWrapper backgroundType="solidBlue">
```

#### Result
<BackgroundWrapper backgroundType="solidBlue">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### Zoom
```
<BackgroundWrapper backgroundType="zoom">
```

#### Result
<BackgroundWrapper backgroundType="zoom">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more.  
</BackgroundWrapper>

### zoomBlueRight

A blue Cardano zoom-blur logo anchored to the bottom-right of the section. Use it to signal product or ecosystem depth without overpowering content. Works best on tall sections that have empty space on the right (e.g. two-column intros above a grid).

```
<BackgroundWrapper backgroundType="zoomBlueRight">
```

#### Result
<BackgroundWrapper backgroundType="zoomBlueRight">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more.
</BackgroundWrapper>

### zoomBlueCenter

A lighter, faded variant of the Cardano zoom-blur logo, centered behind the section content. Acts as a subtle watermark for hero-style sections that need a quiet visual accent rather than a foreground graphic.

```
<BackgroundWrapper backgroundType="zoomBlueCenter">
```

#### Result
<BackgroundWrapper backgroundType="zoomBlueCenter">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more.
</BackgroundWrapper>

### gradientLight
```
<BackgroundWrapper backgroundType="gradientLight">
```

#### Result
<BackgroundWrapper backgroundType="gradientLight">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### gradientDark
```
<BackgroundWrapper backgroundType="gradientDark">
```

#### Result
<BackgroundWrapper backgroundType="gradientDark">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>

### ada
```
<BackgroundWrapper backgroundType="ada">
```

#### Result
<BackgroundWrapper backgroundType="ada">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more. 
</BackgroundWrapper>

### adaLight
```
<BackgroundWrapper backgroundType="adaLight">
```

#### Result
<BackgroundWrapper backgroundType="adaLight">
  This is how<br />
  the selected<br />
  background style<br />
  looks like.<br />
  <br />
  This needs<br />
  more space<br />
  to breathe.<br />
  <br />
  Way more. 
</BackgroundWrapper>

### none (default)
<BackgroundWrapper>
  This is how<br />
  the selected<br />
  background style<br />
  looks like.
</BackgroundWrapper>
 
 :::info

For the sake of simplicity, no other elements were used here as children of [`<BackgroundWrapper>`](/docs/get-involved/components/background-wrapper). Get to know the [`<BoundaryBox>`](/docs/get-involved/components/boundary-box) with which you could have made it look even better.

:::
---
title: Divider
---

import Divider from "@site/src/components/Layout/Divider";
import BackgroundWrapper from "@site/src/components/Layout/BackgroundWrapper";
import BoundaryBox from "@site/src/components/Layout/BoundaryBox";

## Divider

The [`<Divider>`](/docs/get-involved/components/divider) component adds a horizontal line with spacing and optional text. You can assign an optional `id` to it for linking to a specific anchor, such as [`#hello`](#hello). It can also be used invisibly, serving solely as an anchor like [`#hidden`](#hidden).

## Simple Divider

Example of a simple [`<Divider>`](/docs/get-involved/components/divider) with a text.

```
<Divider text="Hello World"/>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
ut aliquip ex ea commodo consequat.
```

### Result
<Divider text="Hello World"/>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Divider with Link

Example of a [`<Divider>`](/docs/get-involved/components/divider) with a text and the anchor link [`hello`](#hello).  [Try jumping to `#hello` ](#hello).

```
<Divider text="Hello World" id="hello"/>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
ut aliquip ex ea commodo consequat.
```

### Result
<Divider text="Hello World" id="hello"/>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Divider without Text

If you use [`<Divider>`](/docs/get-involved/components/divider) without text it will act as an invisible anchor that you can use to link to positions. [Try jumping to `#hidden` ](#hidden).

```
<Divider id="hidden" />
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
ut aliquip ex ea commodo consequat.
```

### Result
<Divider id="hidden" />
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do 
eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim 
ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
ut aliquip ex ea commodo consequat.

:::info

Do not set your own #anchor links in `/src/pages/` as you might in plain HTML because they do not work as expected in React due to its handling of routing and navigation. Instead, use the [`<Divider>`](/docs/get-involved/components/divider) component.

:::

## Divider with Forced White Text

Normally, the [`<Divider>`](/docs/get-involved/components/divider) component itself takes care of the color of the text depending on dark mode or light mode. However, you may find yourself in a situation where you need to force the color, e.g. if you use [`<Divider>`](/docs/get-involved/components/divider) within a dark [`<BackgroundWrapper>`](/docs/get-involved/components/background-wrapper):

```
<BackgroundWrapper backgroundType="gradientDark">
  <BoundaryBox>
    <Divider text="Hello World" id="hello" white= {true}/>
  </BoundaryBox>
</BackgroundWrapper>
```

### Result

<BackgroundWrapper backgroundType="gradientDark">
  <BoundaryBox>
    <Divider text="White Divider Text" id="white" white= {true}/>
  </BoundaryBox>
</BackgroundWrapper>
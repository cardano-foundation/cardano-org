---
sidebar_position: 2
title: Add your Application
description: Submit your Cardano application to the cardano.org showcase. Requirements, available tags, screenshots, and the pull request workflow.
---

## Add your application

The Cardano applications page is a curated list where users discover what can be built on Cardano. It should feature quality apps that demonstrate the ecosystem's capabilities.

Philosophy: The Cardano applications page is designed to help newcomers to the Cardano ecosystem see what's possible today. We focus on live, functional products on mainnet - not promises, pre-sales, or coming soon pages. We're not trying to map out a future ecosystem, but rather showcase the present reality of what's been built.

## Requirements

Before making a pull request, please make sure that you fulfill all these requirements. 

- Live on Cardano mainnet
- Functional product with real use case (not just a concept or idea)
- Stable domain (no temporary/test domains, URL shorteners, or app store links)
- Clear description without marketing claims like "the best", "the first", "the only"
- Must provide unique value distinct from existing showcase items
- Must have sufficient community reputation

## Step-by-Step Process

1. **Prepare your project screenshot**

   Cards on `/apps` crop to roughly 280×150 px. To look sharp on retina displays without bloating the repo, follow these specs:

   | Item | Recommendation |
   |---|---|
   | Resolution | **1280×720 px** (1280 wide, 16:9) — downscales cleanly |
   | Aspect ratio | **16:9 or 16:10** landscape; anything taller gets cropped on the card |
   | Format | **JPEG** (quality 80) for UI screenshots; PNG only when pixel-perfect text or transparency matters; WebP welcome |
   | File size | **Under 500 KB** (build will fail otherwise — limit enforced by `scripts/check-app-screenshots.js`) |
   | Content | the actual app UI, cropped to the meaningful area. Not a marketing landing page. |
   | Theme | prefer **light theme** for visual consistency with the grid |
   | Browser chrome | omit URL bar and tabs unless intentional (use a clean window or crop them out) |

   One-liner to resize and re-encode an oversized PNG (macOS, ships with `sips`):

   ```bash
   sips -Z 1280 -s formatOptions 80 -s format jpeg input.png --out your-project-name.jpg
   ```

   Equivalent on Linux (with ImageMagick):

   ```bash
   convert input.png -resize 1280x -quality 80 your-project-name.jpg
   ```

   Name the file descriptively, lowercase, hyphens (e.g. `minswap.jpg`, not `Screenshot 2026-04-19.png`).

2. **Add your screenshot to the repository**
   - Place it in: `src/data/app-screenshots/your-project-name.jpg`

3. **(Optional) Add your project icon/logo**
   - Icons are displayed in specialized components like the DEX grid and app lists
   - Supported formats: SVG, PNG, WebP, JPEG
   - Place it in: `static/img/app-icons/your-project-name.svg` (or .png, .webp, .jpg)
   - Recommended size: Square aspect ratio, minimum 128x128px
   - Use SVG when possible for best quality at all sizes

4. **Add your project entry**
   - Edit: `src/data/apps.js`
   - Add your entry to the **END** of the Showcases array
   - Use this format:

   :::caution Title is identifying
   The detail page URL `/apps/<slug>` is derived from the title via `slugify`, so renaming an app's title later changes its slug. Curated [Collections](/apps/collections) reference apps by slug — `grep -r "<old-slug>" src/pages/apps/collections/` before merging title changes.
   :::

   ```javascript
   {
     title: "Your Project Name",
     description: "Brief description of what your project does (avoid 'best/first/only' claims)",
     preview: require("./app-screenshots/your-project-name.jpg"),
     icon: "/img/app-icons/your-project-name.svg", // OPTIONAL - for logo display in components
     statsLabel: "yourprojectlabel", // OPTIONAL - for transaction statistics mapping
     website: "https://your-project.com",
     source: "https://github.com/your-org/your-project", // or null if not open-source
     category: "dex",                  // exactly one — see categories below
     properties: ["opensource"],       // zero or more — see properties below
     maintainerPick: false,            // leave false; maintainers set this
     beginnerFriendly: false,          // leave false unless verifiably beginner-friendly
   }
   ```

5. **Pick exactly one category** ⚠️

   Each app has one primary category that answers "what kind of app is this?". Available categories: `wallet`, `dex`, `lending`, `marketplace`, `governance`, `explorer`, `pooltool`, `analytics`, `educational`, `minting`, `stablecoin`, `bridge`, `identity`, `daotool`, `oracle`, `game`, `distribution`, `notary`, `accounting`, `ecosystem`, `social`, `funding`, `music`, `gateway`, `metadata`.

   Pick the most specific one. Do not list multiple. If your app legitimately spans two, choose the primary user intent.

6. **Add properties (zero or more)**

   Properties are additive flags answering "what does this app also offer?":
   - `mobile` — first-class native mobile app (not a responsive site)
   - `nft` — supports or uses NFTs (do not use for image-based NFT collections)
   - `opensource` — public source repository; you must also fill in `source`

7. **`maintainerPick` and `beginnerFriendly`**

   Both default to `false` for new submissions.
   - `maintainerPick: true` is set only by page maintainers via the [Maintainer picks](/docs/get-involved/maintainer-picks) process.
   - `beginnerFriendly: true` should only be set if onboarding is genuinely smooth for newcomers (no jargon walls, sensible defaults, working out of the box). Reviewers may push back if this looks promotional.

8. **Optional Fields Explained**

   **icon field:**
   - Path to your logo/icon for display in component grids
   - Must be in `/static/img/app-icons/` directory
   - Example: `icon: "/img/app-icons/minswap.svg"`
   - If omitted, components will show a fallback badge with your app's first letter

   **statsLabel field:**
   - Used to map your app to transaction statistics data
   - Only needed if your app has on-chain transaction metrics
   - Must match the exact label in `/src/data/tx-stats.json`
   - See [Transaction Rankings Guide](/docs/get-involved/tx-rankings) for details on getting your app tracked
   - Example: `statsLabel: "minswap"`
   - If omitted, the system will attempt normalized matching on your title

   **spotlight field (set by maintainers):**
   - Links to a Developer Spotlight blog post on `developers.cardano.org/blog/`
   - Renders a callout banner on the app's detail page (`/apps/<slug>`)
   - Shape: `spotlight: { url: "https://developers.cardano.org/blog/...", title: "Spotlight: <App>", date: "YYYY-MM-DD" }`
   - All three fields required if set; URL must be `http(s)://`
   - Submitters: leave omitted. Maintainers add this when a Spotlight is published.

9. **Test your submission**
   - Run `yarn build` (must complete without errors). The schema validator will reject unknown categories or properties.
   - Check that your project displays correctly
   - Verify your icon appears if you added one
   - Ensure category is the most specific match and properties are minimal

10. **Submit your pull request**
   - Use the "Add Your App" GitHub PR template
   - Fill out the checklist in the template 
---
sidebar_position: 2
title: Add your Application
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

1. **Prepare your project image**
   - Create a PNG or JPG file
   - Name it descriptively (e.g., `your-project-name.png`)

2. **Add your image to the repository**
   - Place it in: `src/data/app-images/your-project-name.png`

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

   ```javascript
   {
     title: "Your Project Name",
     description: "Brief description of what your project does (avoid 'best/first/only' claims)",
     preview: require("./app-images/your-project-name.png"),
     icon: "/img/app-icons/your-project-name.svg", // OPTIONAL - for logo display in components
     statsLabel: "yourprojectlabel", // OPTIONAL - for transaction statistics mapping
     website: "https://your-project.com",
     source: "https://github.com/your-org/your-project", // or null if not open-source
     tags: ["primary", "secondary"], // Use 1-2 tags maximum - see guidelines below
   }
   ```

5. **Select appropriate tags** ⚠️ **Keep it minimal!**

   Available tags include: `wallet`, `dex`, `oracle`, `bridge`, `lending`, `governance`, `marketplace`, `game`, `nft`, `educational`, and more.

   **Critical Guidelines:**
   - **Use only 1-2 tags** that best describe your app's primary function
   - Tags are used in the AppList component and other discovery features
   - Too many tags dilute your app's discoverability
   - Choose the most specific tag that fits (e.g., `dex` over generic `token`)
   - Do NOT add the `favorite` tag yourself
   - Check `src/data/apps.js` for the complete list of available tags
   - If your project is open-source, include the `opensource` tag AND provide the `source` URL

   **Examples:**
   - DEX: `["dex"]` ✅
   - Wallet: `["wallet", "nft"]` ✅
   - Marketplace: `["marketplace", "nft"]` ✅
   - Too many: `["dex", "marketplace", "lending", "governance", "nft"]` ❌

6. **Optional Fields Explained**

   **icon field:**
   - Path to your logo/icon for display in component grids
   - Must be in `/static/img/app-icons/` directory
   - Example: `icon: "/img/app-icons/minswap.svg"`
   - If omitted, components will show a fallback badge with your app's first letter

   **statsLabel field:**
   - Used to map your app to transaction statistics data
   - Only needed if your app has on-chain transaction metrics
   - Must match the exact label in `/src/data/app-stats.json`
   - See [Transaction Rankings Guide](/docs/get-involved/tx-rankings) for details on getting your app tracked
   - Example: `statsLabel: "minswap"`
   - If omitted, the system will attempt normalized matching on your title

7. **Test your submission**
   - Run `yarn build` (must complete without errors)
   - Check that your project displays correctly
   - Verify your icon appears if you added one
   - Ensure your tags are appropriate and minimal

8. **Submit your pull request**
   - Use the "Add Your App" GitHub PR template
   - Fill out the checklist in the template 
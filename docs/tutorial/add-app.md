---
sidebar_position: 10
---

# Add your Cardano application

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

3. **Add your project entry**
   - Edit: `src/data/apps.js`
   - Add your entry to the **END** of the Showcases array
   - Use this format:

   ```javascript
   {
     title: "Your Project Name",
     description: "Brief description of what your project does (avoid 'best/first/only' claims)",
     preview: require("./app-images/your-project-name.png"),
     website: "https://your-project.com",
     source: "https://github.com/your-org/your-project", // or null if not open-source
     tags: ["relevant", "tags"], // see available tags in the file
   }
   ```

4. **Select appropriate tags**

   Available tags include: `wallet`, `dex`, `oracle`, `bridge`, `lending`, `governance`, `marketplace`, `game`, `nftproject`, `educational`, and more.

   **Important:**
   - Do NOT add the `favorite` tag yourself
   - Check `src/data/apps.js` for the complete list of available tags
   - If your project is open-source, include `opensource` tag AND provide the `source` URL

5. **Test your submission**
   - Run `yarn build` (must complete without errors)
   - Check that your project displays correctly

6. **Submit your pull request**
   - Use the "Add Your App" GitHub PR template
   - Fill out the checklist in the template 
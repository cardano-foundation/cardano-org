👋 Hello there! Welcome. Please follow the steps below to tell us about your contribution.

1. Please complete a Checklist
2. Fill in all sections of the template
3. Click "Create pull request"

## Checklist

 <!-- Please fill the boxes with [x] before submitting a pull request -->

- [ ] I have read the [Contributing Guidelines](https://github.com/cardano-foundation/cardano-org/blob/staging/CONTRIBUTING.md).
- [ ] I have read the [App Requirements](https://github.com/cardano-foundation/cardano-org/blob/staging/docs/get-involved/add-app.md) and understand that entries failing the [curation policy](https://github.com/cardano-foundation/cardano-org/blob/staging/docs/get-involved/apps-curation-policy.md) may be removed during quarterly review.
- [ ] I have added my image to `src/data/app-screenshots/`
- [ ] (Optional) I have added my icon/logo to `static/img/app-icons/`
- [ ] I have run `yarn build` after adding my changes **without getting any errors**.
- [ ] I have not committed any changes to `yarn.lock`.
- [ ] I have left `maintainerPick: false` on my entry. `maintainerPick` is set by page maintainers through the [Maintainer picks](https://github.com/cardano-foundation/cardano-org/blob/staging/docs/get-involved/maintainer-picks.md) process, not by submitters.
- [ ] I have left `beginnerFriendly: false` unless the app is verifiably newcomer-friendly (clear onboarding, low jargon, working defaults).
- [ ] My screenshot follows the [screenshot guidelines](https://github.com/cardano-foundation/cardano-org/blob/staging/docs/get-involved/add-app.md#step-by-step-process): around 1280×720 (16:9) JPEG, under 500 KB, light theme, app UI not a marketing page. The build's screenshot size check will reject anything over 500 KB.
- [ ] My `title` is ≤ 25 characters (ideally 15-20). The build's schema validator rejects anything longer. Drop a redundant `Cardano` prefix where the bare project name still reads cleanly.
- [ ] My `tagline` is ≤ 60 characters and describes what the app **is**, not what it promises (e.g. "Multi-pool DEX with deepest liquidity", not "Best DEX on Cardano!"). The build's schema validator rejects anything longer.
- [ ] My `description` is between **120 and 180 characters** (1-2 sentences). The build's schema validator rejects anything outside this range. Long descriptions get truncated in search results and social-share previews; very short ones repeat the tagline.
- [ ] (Optional) If I added an `x` field, it is just the handle — no `@`, no URL — and matches X's own handle rules (1-15 characters, letters/digits/underscores).

## App addition

<!-- Fill in every bullet. Pick exactly one category that best describes the primary intent of your app, plus any properties that apply. -->

* Title: *Project name*
* Description: *Describe your project (avoid "best/first/only" claims)*
* Website: <link_to_project>
* Source: <link_to_source_code> (or null if not open-source)
* Icon: (Optional) <path_to_icon_in_static/img/app-icons/>
* Category — pick **exactly one**:
  * `analytics`
  * `bridge`
  * `dex`
  * `distribution`
  * `ecosystem`
  * `education`
  * `explorer`
  * `game`
  * `governance`
  * `identity`
  * `lending`
  * `marketplace`
  * `minting`
  * `notary`
  * `pooltool`
  * `wallet`
  * `other` — thin segments (stablecoin, oracle, gateway, music, social)
* Properties — pick zero or more (additive):
  * `mobile` — native mobile app, not a responsive site
  * `nft` — supports or uses NFTs (not for image-based collections)
  * `opensource` — public source repository linked above

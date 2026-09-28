---
title: トークン化資産
description: Cardano上のトークン化による実物資産の分割所有
sidebar_label: トークン化資産
sidebar_position: 13
---

# トークン化資産

## 課題

Traditional investment in real-world assets like real estate, art, or commodities requires significant capital and involves complex legal and administrative processes. This excludes most people from wealth-building opportunities that have historically been reserved for the wealthy.

Even for those who can invest, assets are often illiquid, making it difficult to access funds when needed. The overhead of buying, selling, and managing these assets further reduces returns.

## ブロックチェーンによる解決策

資産のトークン化は、実物資産の所有権をデジタルトークンに分割し、簡単に取引できるようにします。

- **分割所有**: ビル、美術品、その他の価値ある資産の一部を所有可能
- **流動性の向上**: 分散型取引所で24時間365日トークンを売買可能
- **参入障壁の低減**: 最低投資額を下げ、より多くの人に機会を開放
- **コンプライアンスの自動化**: スマートコントラクトにより規制要件を自動的に適用
- **透明な所有記録**: すべての所有記録が公開検証可能

Tokenization can apply to virtually any asset class: real estate, infrastructure, commodities, collectibles, intellectual property, and more.

## Compliance Rules on Token Transfers

Tokenized assets can fall under financial regulation. Depending on the asset and the jurisdiction, their issuers may need to limit transfers to verified investors, or freeze and recover tokens for legal reasons. An ordinary native token cannot enforce this, because once minted it follows whoever controls the address it sits at.

[Programmable tokens](/glossary/programmable-token/) add that layer. They are native tokens that holders can only send when the issuer's transfer rules approve, for example an allowlist of verified holders or a limit per transfer. CIP-113, the proposed standard for them on Cardano, is still under review, and the Cardano Foundation maintains an open-source reference implementation.

What an issuer can do beyond that depends on the scripts the token's registry entry names. Some let authorized parties freeze or seize holdings. A substandard can also limit third-party actions to ones that never reduce a holder's balance. The issuer may be able to swap these scripts later, and the shared contracts can be upgraded by whoever holds the upgrade authority of that deployment. Investors should know who can change the rules before they buy.

## なぜCardanoなのか

- **ネイティブトークン**: 効率的で安全な資産のデジタル表現を実現
- **低トランザクション手数料**: 小口取引も経済的に成立
- **規制への意識**: コンプライアンスに対応したトークン化スキームをサポート
- **スマートコントラクトの安全性**: 形式検証手法による堅牢性の確保
- **グローバルなアクセス**: 世界中から誰でも参加可能

## はじめよう

- [Cardanoアプリケーションを探す](/apps)
- [Cardano開発者向けリソース](https://developers.cardano.org)
- [Developer guide to programmable tokens](https://developers.cardano.org/docs/developers/curriculum/native-tokens/programmable-tokens/)
- [エンタープライズソリューションを見る](/solutions)

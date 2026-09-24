---
title: Tokenisierte Assets
description: Anteiliges Eigentum an realen Vermögenswerten durch Tokenisierung auf Cardano
sidebar_label: Tokenisierte Assets
sidebar_position: 13
---

# Tokenisierte Assets

## Die Herausforderung

Wer klassisch in reale Vermögenswerte wie Immobilien, Kunst oder Rohstoffe investieren will, braucht viel Kapital und muss sich durch komplexe rechtliche und administrative Prozesse arbeiten. Das schließt die meisten Menschen von Anlagechancen aus, die historisch den Wohlhabenden vorbehalten waren.

Und selbst wer investieren kann, sitzt oft auf illiquiden Anlagen, an deren Wert er im Bedarfsfall nur schwer herankommt. Der Aufwand für Kauf, Verkauf und Verwaltung schmälert die Rendite zusätzlich.

## Wie Blockchain dies löst

Die Tokenisierung teilt das Eigentum an realen Vermögenswerten in digitale Token auf, die sich einfach handeln lassen:

- **Anteiliges Eigentum**: Besitze einen Anteil an einem Gebäude, Kunstwerk oder anderen Wertgegenstand
- **Mehr Liquidität**: Token lassen sich rund um die Uhr auf dezentralen Börsen handeln
- **Niedrigere Hürden**: Geringere Mindestanlagen öffnen die Chancen für mehr Menschen
- **Automatisierte Compliance**: Smart Contracts können regulatorische Vorgaben durchsetzen
- **Transparentes Eigentum**: Alle Eigentumsverhältnisse sind öffentlich überprüfbar

Tokenisierung eignet sich für praktisch jede Anlageklasse: Immobilien, Infrastruktur, Rohstoffe, Sammlerstücke, geistiges Eigentum und mehr.

## Compliance Rules on Token Transfers

Tokenized assets can fall under financial regulation. Depending on the asset and the jurisdiction, their issuers may need to limit transfers to verified investors, or freeze and recover tokens for legal reasons. An ordinary native token cannot enforce this, because once minted it follows whoever controls the address it sits at.

[Programmable tokens](/glossary/programmable-token/) add that layer. They are native tokens that holders can only send when the issuer's transfer rules approve, for example an allowlist of verified holders or a limit per transfer. CIP-113, the proposed standard for them on Cardano, is still under review, and the Cardano Foundation maintains an open-source reference implementation.

What an issuer can do beyond that depends on the scripts the token's registry entry names. Some let authorized parties freeze or seize holdings. A substandard can also limit third-party actions to ones that never reduce a holder's balance. The issuer may be able to swap these scripts later, and the shared contracts can be upgraded by whoever holds the upgrade authority of that deployment. Investors should know who can change the rules before they buy.

## Warum Cardano

- **Native Token** bilden Vermögenswerte effizient und sicher ab
- **Niedrige Transaktionsgebühren** machen auch kleine Trades wirtschaftlich
- **Regulatorisches Bewusstsein** unterstützt regelkonforme Tokenisierungsmodelle
- **Smart-Contract-Sicherheit** durch formale Verifikationsmethoden
- **Globale Zugänglichkeit** ermöglicht weltweite Teilnahme

## Erste Schritte

- [Cardano-Anwendungen entdecken](/apps)
- [Ressourcen für Entwickler zur Programmierung auf Cardano](https://developers.cardano.org)
- [Developer guide to programmable tokens](https://developers.cardano.org/docs/developers/curriculum/native-tokens/programmable-tokens/)
- [Enterprise-Lösungen ansehen](/solutions)

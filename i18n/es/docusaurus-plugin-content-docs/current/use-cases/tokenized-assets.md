---
title: Activos tokenizados
description: Propiedad fraccionada de los activos del mundo real a través de la tokenización en Cardano
sidebar_label: Activos tokenizados
sidebar_position: 13
---

# Activos tokenizados

## El Desafío

La inversión tradicional en activos del mundo real, como inmuebles, obras de arte o materias primas, requiere un capital considerable e implica procesos legales y administrativos complejos. Esto excluye a la mayoría de las personas de las oportunidades de generar riqueza que, históricamente, han estado reservadas a los más adinerados.

Incluso para quienes pueden invertir, los activos suelen carecer de liquidez, lo que dificulta el acceso a los fondos cuando se necesitan. Los gastos generales que conllevan la compra, la venta y la gestión de estos activos reducen aún más la rentabilidad.

## Cómo la Blockchain resuelve esto

La tokenización de activos divide la propiedad de los activos del mundo real en tokens digitales que se pueden negociar fácilmente:

- **Propiedad fraccionada**: ser propietario de una parte de un edificio, una obra de arte u otro activo valioso
- **Mayor liquidez**: negociar tokens las 24 horas del día, los 7 días de la semana, en mercados descentralizados
- **barreras reducidas**: unas inversiones mínimas más bajas abren oportunidades a más personas
- **Cumplimiento normativo automatizado**: los contratos inteligentes pueden hacer cumplir los requisitos normativos
  Propiedad transparente: todos los registros de propiedad son verificables públicamente
- **Propiedad transparente**: Todos los registros de propiedad son verificables públicamente

La tokenización se puede aplicar a prácticamente cualquier clase de activos: inmuebles, infraestructuras, materias primas, objetos de colección, propiedad intelectual y mucho más.

## Compliance Rules on Token Transfers

Tokenized assets can fall under financial regulation. Depending on the asset and the jurisdiction, their issuers may need to limit transfers to verified investors, or freeze and recover tokens for legal reasons. An ordinary native token cannot enforce this, because once minted it follows whoever controls the address it sits at.

[Programmable tokens](/glossary/programmable-token/) add that layer. They are native tokens that holders can only send when the issuer's transfer rules approve, for example an allowlist of verified holders or a limit per transfer. CIP-113, the proposed standard for them on Cardano, is still under review, and the Cardano Foundation maintains an open-source reference implementation.

What an issuer can do beyond that depends on the scripts the token's registry entry names. Some let authorized parties freeze or seize holdings. A substandard can also limit third-party actions to ones that never reduce a holder's balance. The issuer may be able to swap these scripts later, and the shared contracts can be upgraded by whoever holds the upgrade authority of that deployment. Investors should know who can change the rules before they buy.

## Porqué Cardano

- Los \*\*tokens nativos \*\* ofrecen una representación eficiente y segura de los activos
- Las **Bajas comisiones por transacción**: hacen que las operaciones de pequeño volumen sean económicamente viables
- La **constancia regulatoria** respalda los esquemas de tokenización que cumplen con la legislación
- **Seguridad del contrato inteligente** mediante métodos de verificación formal
- La **accesibilidad global** permite la participación en todo el mundo

## Primeros Pasos

- [Explore las aplicaciones Cardano](/apps)
- [Recursos para desarrolladores que construyen sobre Cardano](https://developers.cardano.org)
- [Developer guide to programmable tokens](https://developers.cardano.org/docs/developers/curriculum/native-tokens/programmable-tokens/)
- [Vea las soluciones para empresas](/solutions)

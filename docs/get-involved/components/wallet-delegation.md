---
title: Wallet Delegation
description: Shared wallet building blocks for the delegation tools on cardano.org, from wallet selection and network warning to transaction status, search, and avatars.
---

## WalletDelegation

A set of small building blocks shared by the delegation tools on `/governance/delegate` (DRep delegation) and `/stake-pool-delegation`. They cover the parts every wallet flow needs: picking and connecting a CIP-30 wallet, warning about the wrong network, showing the transaction status, searching a list, and showing an avatar with an initials fallback.

Use these exports when you build another wallet flow, instead of writing a new wallet picker or status banner.

Because the components need a browser wallet and live transactions, there is no live preview here, only the usage pattern.

## Basic Usage

```jsx
import { WalletPicker, NetworkWarning, TxBanner } from '@site/src/components/WalletDelegation';

{!wallet && <WalletPicker onConnect={setWallet} busy={txBusy} />}
{wrongNetwork && <NetworkWarning />}
<TxBanner state={tx} />
```

`tx` is an object such as `{ status: 'building', message }`, `{ status: 'success', message, txHash }`, or `{ status: 'error', message }`. The caller translates `message`.

## WalletPicker

Detects the installed CIP-30 wallets, lists them as buttons, and connects the one the reader picks. While it looks for wallets and while the wallet's own approval dialog is open, it shows a status line, and the buttons stay disabled so a second click cannot open a second prompt. A cancelled approval shows no error.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onConnect` | `({ instance, name, address, networkId }) => void` | *required* | Called after a successful connection with the wallet API, its name, the first address in bech32, and the network ID. |
| `busy` | `boolean` | `false` | Disables the wallet buttons, for example while a transaction is being signed. |
| `emptyMessage` | `string` | built-in text | Text shown when no wallet is installed. |

## NetworkWarning

A warning banner that asks the reader to switch the wallet to Mainnet. It has no props. Render it when the connected wallet's network ID is not Mainnet.

## TxBanner

A status banner for a transaction. It renders nothing while `state.status` is anything other than `building`, `success`, or `error`. On success it adds a link to the transaction on the explorer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `{ status, message, txHash }` | *required* | `status` picks the tone, `message` is the translated text, `txHash` is needed for the explorer link on success. |

## SearchRow

A search field with a "Clear" button that appears once the field has a value.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | *required* | Current search text. |
| `onChange` | `(value: string) => void` | *required* | Called with the new text, and with an empty string on "Clear". |
| `placeholder` | `string` | - | Placeholder text. |
| `label` | `string` | - | Accessible name of the field. Pass it, because the field has no visible label. |

## SnapshotImage

An avatar or logo from the self-hosted image snapshots, such as DRep avatars and stake pool logos. It falls back to `Initials` when the ID has no image or the file fails to load.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ids` | `Set<string>` | *required* | The IDs that have an image, from the snapshot manifest. |
| `id` | `string` | *required* | The ID to look up. |
| `path` | `string` | *required* | Site path of the image, resolved with the base URL. |
| `name` | `string` | - | Name used for the initials fallback. |
| `className` | `string` | - | Class on the `<img>`. |

## Initials

A round placeholder with up to two initials of `name`, hidden from screen readers.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `"?"` | Name to take the initials from. |

## Helpers

`@site/src/components/WalletDelegation/helpers` holds small utilities for the same tools: `fisherYates` (shuffled copy of an array), `chunk` (split an array into pages), and `readCache` and `writeCache` (a `sessionStorage` cache with an expiry time that treats every failure as a miss).

## Translation

All built-in texts are translated with IDs under `governance.delegate.*`, so the DRep and stake pool tools share them.

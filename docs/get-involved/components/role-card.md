---
title: Role Card
description: Display a role or persona description with icon and accent color using the RoleCard component.
---

import RoleCard from '@site/src/components/Layout/RoleCard';
import { FaUsers, FaServer, FaUniversity } from 'react-icons/fa';

## RoleCard

A compact card with an accented icon, title and description. Made for introducing ecosystem roles, principles, or any small set of related entities. Optionally renders as a link.

## Basic Usage

```jsx
import RoleCard from '@site/src/components/Layout/RoleCard';
import { FaUsers } from 'react-icons/fa';

<RoleCard
  accent="blue"
  icon={<FaUsers />}
  title="Delegated Representatives"
>
  DReps vote on governance proposals on behalf of ada holders who delegate to them.
</RoleCard>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ReactNode` | – | Icon shown in the accented circle. Use a FontAwesome icon component (e.g. `<FaUsers />`). |
| `title` | `string` | – | Card heading. |
| `children` | `ReactNode` | – | Description text below the title. |
| `accent` | `'blue' \| 'violet' \| 'teal'` | `'blue'` | Tints the icon background and the title. |
| `href` | `string` | – | If set, the card renders as a `<Link>` to this URL. |
| `className` | `string` | – | Additional class name passed to the root element. |

## Live Preview

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem'}}>
  <RoleCard accent="blue" icon={<FaUsers />} title="Delegated Representatives">
    DReps vote on governance proposals on behalf of ada holders who delegate to them.
  </RoleCard>
  <RoleCard accent="violet" icon={<FaServer />} title="Stake Pool Operators">
    SPOs validate transactions and vote on hard forks and security-critical parameters.
  </RoleCard>
  <RoleCard accent="teal" icon={<FaUniversity />} title="Constitutional Committee">
    Ensures governance proposals align with Cardano's constitution.
  </RoleCard>
</div>

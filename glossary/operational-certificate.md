---
title: operational certificate
slug: operational-certificate
short: The certificate a stake pool operator signs to authorise a KES key to produce blocks on the pool's behalf.
category: consensus
aliases: ["Op Cert", "Operational Cert"]
related: [stake-pool, kes, vrf]
---

An operational certificate (op cert) is a signed credential that links a fresh KES key to a stake pool's cold key. The pool operator generates a new op cert each time the KES key is rotated and uploads it to the block-producing node.

Every block the pool produces is signed by the KES key referenced in the current op cert; if the op cert is missing or its KES period range has expired, the pool cannot produce blocks. Op certs let operators keep the long-lived cold key safely offline while still rotating the hot KES key on schedule.

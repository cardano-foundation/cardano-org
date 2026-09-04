// One curated question per station (two for the delegation station), fixed
// by id so the question fits the topic and the server and client render the
// same thing. `yarn test:get-started` fails if a pool drops one of these ids.
export const STATION_QUESTIONS = {
  wallet: [{ quiz: 'wallets', id: 'wallets-1' }],
  phrase: [{ quiz: 'security', id: 'security-7' }],
  connect: [{ quiz: 'wallets', id: 'wallets-10' }],
  ada: [{ quiz: 'wallets', id: 'wallets-8' }],
  delegate: [
    { quiz: 'staking', id: 'staking-1' },
    { quiz: 'governance', id: 'governance-1' },
  ],
};

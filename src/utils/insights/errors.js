// Normalize Axios errors for UI
export function parseApiError(err) {
  if (err?.code === 'ECONNABORTED') {
    return {
      kind: 'timeout',
      title: 'Data endpoint timed out',
      message: 'The data endpoint did not respond in time. Check connectivity or try again later.',
    };
  }
  if (!err?.response) {
    return {
      kind: 'network',
      title: 'Data endpoint not reachable',
      message: 'The data endpoint is currently not reachable. Please check your connection or try again later.',
    };
  }

  const { status, data, headers } = err.response;

  if (status === 429) {
    const reason = data?.reason || '';
    const limit = data?.limit;
    const used = data?.client_requests;
    const retryAfter = headers?.['retry-after'];

    const isHourly = /hour/i.test(reason);
    const isBurst = /second|burst/i.test(reason);

    const details = [];
    if (typeof used === 'number' && typeof limit === 'number') details.push(`Usage: ${used}/${limit}`);
    if (retryAfter) details.push(`Retry-After: ${retryAfter}s`);

    return {
      kind: isHourly ? 'rate-hourly' : isBurst ? 'rate-burst' : 'rate-limit',
      title: isHourly ? 'Hourly rate limit reached' : isBurst ? 'Burst limit reached' : 'Rate limit reached',
      message: isHourly
        ? 'Your client exceeded the hourly quota. Please wait for the window to reset.'
        : isBurst
        ? 'Too many requests in a short time. Slow down and try again.'
        : 'Too many requests. Please try again later.',
      extra: details.length ? details.join(' • ') : undefined,
    };
  }

  return {
    kind: `http-${status}`,
    title: `Request failed (${status})`,
    message: data?.error || 'Unexpected response from the data endpoint.',
  };
}

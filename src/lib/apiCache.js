// lib/apiCache.js
let lastResponse = null;

export function getLastResponse() {
  return lastResponse;
}

export function setLastResponse(data) {
  lastResponse = data;
}

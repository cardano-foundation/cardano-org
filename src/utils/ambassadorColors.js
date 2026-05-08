const PALETTE = [
  "#3a5fd6",
  "#7c5be0",
  "#10a17a",
  "#d99808",
  "#dc2c5a",
  "#00a3a3",
  "#5b80ff",
];

export function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

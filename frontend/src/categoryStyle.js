// Visual identity per category — glyph + colors, mirroring the
// --cat-<key>-bg / -fg custom properties defined in index.css so the same
// palette drives badges (CSS class) and the activity-feed icon / select
// (inline style, for robust cross-browser per-option coloring).
const CATEGORY_STYLE = {
  Hotel: { icon: '🏨', bg: '#efe9fe', fg: '#6d28d9' },
  Flight: { icon: '✈️', bg: '#e3edfe', fg: '#1d4ed8' },
  Meals: { icon: '🍽️', bg: '#fef3d6', fg: '#b45309' },
  Transport: { icon: '🚕', bg: '#dcf7e6', fg: '#15803d' },
  Other: { icon: '🧾', bg: '#eef0f4', fg: '#4b5563' },
};

export function categoryStyle(category) {
  return CATEGORY_STYLE[category] || CATEGORY_STYLE.Other;
}

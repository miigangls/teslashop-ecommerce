export const publicRoutePatterns = [
  /^\/$/,
  /^\/products(?:\/|$)/,
  /^\/news(?:\/|$)/,
  /^\/gender\/[^/]+$/,
  /^\/product\/[^/]+$/,
  /^\/auth(?:\/|$)/,
];

export const protectedRoutePatterns = [/^\/admin(?:\/|$)/, /^\/dashboard(?:\/|$)/];

export const ignoredRoutePatterns = [
  /^\/_next\//,
  /^\/api\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /\.[a-z0-9]+$/i,
];

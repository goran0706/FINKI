/**
 * Localized Routing
 * =================
 *
 * Localized routing maps application routes to locale-aware URL paths.
 * A route can use the same underlying application resource while exposing different
 * path segments for different locales, such as `/en/products` and `/de/produkte`.
 *
 * Localized routing is a routing concern, not a translation concern alone.
 * The application must keep route identity, locale detection, URL generation,
 * navigation, matching, and fallback behavior consistent.
 */

import { useMemo, useState, type ChangeEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Locale and route types
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR" | "ar";

type RouteId = "home" | "products" | "product" | "about" | "contact" | "notFound";

interface RouteDefinition {
  readonly id: RouteId;
  readonly paths: Partial<Record<SupportedLocale, string>>;
}

interface RouteMatch {
  readonly locale: SupportedLocale;
  readonly routeId: RouteId;
  readonly params: Readonly<Record<string, string>>;
}

// ---------------------------------------------------------------------
// 2. Locale prefixes
// ---------------------------------------------------------------------

const DEFAULT_LOCALE: SupportedLocale = "en-US";

const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR", "ar"];

const LOCALE_PREFIXES: Record<SupportedLocale, string> = {
  "en-US": "en",
  "de-DE": "de",
  "fr-FR": "fr",
  ar: "ar",
};

// A locale prefix is a URL concern, so it can differ from the full BCP 47 locale.
console.log(LOCALE_PREFIXES["en-US"]); // "en"
console.log(LOCALE_PREFIXES["de-DE"]); // "de"

// ---------------------------------------------------------------------
// 3. Localized route definitions
// ---------------------------------------------------------------------

const ROUTES: readonly RouteDefinition[] = [
  {
    id: "home",
    paths: {
      "en-US": "/",
      "de-DE": "/",
      "fr-FR": "/",
      ar: "/",
    },
  },
  {
    id: "products",
    paths: {
      "en-US": "/products",
      "de-DE": "/produkte",
      "fr-FR": "/produits",
      ar: "/المنتجات",
    },
  },
  {
    id: "product",
    paths: {
      "en-US": "/products/:productId",
      "de-DE": "/produkte/:productId",
      "fr-FR": "/produits/:productId",
      ar: "/المنتجات/:productId",
    },
  },
  {
    id: "about",
    paths: {
      "en-US": "/about",
      "de-DE": "/ueber-uns",
      "fr-FR": "/a-propos",
      ar: "/من-نحن",
    },
  },
  {
    id: "contact",
    paths: {
      "en-US": "/contact",
      "de-DE": "/kontakt",
      "fr-FR": "/contact",
      ar: "/اتصل-بنا",
    },
  },
];

console.log(ROUTES[1].paths["de-DE"]); // "/produkte"

// ---------------------------------------------------------------------
// 4. Route identity versus localized path
// ---------------------------------------------------------------------

// The route ID is stable across locales.
const routeId: RouteId = "products";

// The visible path changes according to the locale.
const englishPath = ROUTES.find((route) => route.id === routeId)?.paths["en-US"];
const germanPath = ROUTES.find((route) => route.id === routeId)?.paths["de-DE"];

console.log(routeId); // "products"
console.log(englishPath); // "/products"
console.log(germanPath); // "/produkte"

// Keeping a stable route ID separate from its localized path prevents
// translated URL segments from becoming the application's internal identity.

// ---------------------------------------------------------------------
// 5. Building a localized path
// ---------------------------------------------------------------------

const getLocalizedPath = (routeId: RouteId, locale: SupportedLocale): string => {
  const route = ROUTES.find((candidate) => candidate.id === routeId);
  const path = route?.paths[locale];

  if (!path) {
    throw new Error(`No path defined for route "${routeId}" and locale "${locale}".`);
  }

  return path;
};

console.log(getLocalizedPath("products", "en-US")); // "/products"
console.log(getLocalizedPath("products", "de-DE")); // "/produkte"

// ---------------------------------------------------------------------
// 6. Localized paths with parameters
// ---------------------------------------------------------------------

const replaceRouteParams = (path: string, params: Readonly<Record<string, string>>): string => {
  return path.replace(/:([A-Za-z0-9_]+)/g, (match, name: string) => {
    const value = params[name];

    if (value === undefined) {
      throw new Error(`Missing route parameter "${name}".`);
    }

    return encodeURIComponent(value);
  });
};

const getProductPath = (locale: SupportedLocale, productId: string): string => {
  const path = getLocalizedPath("product", locale);
  return replaceRouteParams(path, { productId });
};

console.log(getProductPath("en-US", "42")); // "/products/42"
console.log(getProductPath("de-DE", "42")); // "/produkte/42"

// ---------------------------------------------------------------------
// 7. Encoding route parameters
// ---------------------------------------------------------------------

const productIdWithSpaces = "example product";

console.log(getProductPath("en-US", productIdWithSpaces)); // "/products/example%20product"

// Dynamic values should be encoded as URL components.
// Localized static path segments should be defined as route data rather than
// generated by interpolating arbitrary user-controlled strings.

// ---------------------------------------------------------------------
// 8. Parsing the locale prefix
// ---------------------------------------------------------------------

const getLocaleFromPrefix = (prefix: string): SupportedLocale | undefined => {
  return SUPPORTED_LOCALES.find((locale) => LOCALE_PREFIXES[locale] === prefix);
};

console.log(getLocaleFromPrefix("en")); // "en-US"
console.log(getLocaleFromPrefix("de")); // "de-DE"
console.log(getLocaleFromPrefix("xx")); // undefined

// ---------------------------------------------------------------------
// 9. Locale-aware URL structure
// ---------------------------------------------------------------------

const addLocalePrefix = (locale: SupportedLocale, path: string): string => {
  const prefix = LOCALE_PREFIXES[locale];

  if (path === "/") {
    return `/${prefix}`;
  }

  return `/${prefix}${path}`;
};

console.log(addLocalePrefix("en-US", "/products")); // "/en/products"
console.log(addLocalePrefix("de-DE", "/produkte")); // "/de/produkte"
console.log(addLocalePrefix("ar", "/المنتجات")); // "/ar/المنتجات"

// A locale-prefixed architecture makes the locale explicit in the URL.
// The routing strategy can also use locale-specific domains or subdomains instead.

// ---------------------------------------------------------------------
// 10. Building complete localized URLs
// ---------------------------------------------------------------------

const buildLocalizedUrl = (
  routeId: RouteId,
  locale: SupportedLocale,
  params: Readonly<Record<string, string>> = {},
): string => {
  const localizedPath = replaceRouteParams(getLocalizedPath(routeId, locale), params);

  return addLocalePrefix(locale, localizedPath);
};

console.log(buildLocalizedUrl("products", "en-US"));
// "/en/products"

console.log(buildLocalizedUrl("product", "de-DE", { productId: "42" }));
// "/de/produkte/42"

// ---------------------------------------------------------------------
// 11. Relative versus absolute URLs
// ---------------------------------------------------------------------

const relativeUrl = buildLocalizedUrl("products", "en-US");

const absoluteUrl = new URL(relativeUrl, "https://example.com");

console.log(relativeUrl); // "/en/products"
console.log(absoluteUrl.href); // "https://example.com/en/products"

// Route builders should generally return paths when they are used by
// client-side routers and full URLs when an absolute origin is required.

// ---------------------------------------------------------------------
// 12. Locale-independent route IDs
// ---------------------------------------------------------------------

interface NavigationItem {
  readonly routeId: Exclude<RouteId, "notFound">;
  readonly label: string;
}

const navigationItems: readonly NavigationItem[] = [
  { routeId: "home", label: "Home" },
  { routeId: "products", label: "Products" },
  { routeId: "about", label: "About" },
  { routeId: "contact", label: "Contact" },
];

// The navigation model stores route identity rather than translated URLs.
console.log(navigationItems.map((item) => item.routeId));
// ["home", "products", "about", "contact"]

// ---------------------------------------------------------------------
// 13. Localized navigation URLs
// ---------------------------------------------------------------------

const getNavigationItems = (locale: SupportedLocale): readonly string[] => {
  return navigationItems.map((item) => buildLocalizedUrl(item.routeId, locale));
};

console.log(getNavigationItems("en-US"));
// ["/en", "/en/products", "/en/about", "/en/contact"]

console.log(getNavigationItems("fr-FR"));
// ["/fr", "/fr/produits", "/fr/a-propos", "/fr/contact"]

// ---------------------------------------------------------------------
// 14. Locale switching should preserve route identity
// ---------------------------------------------------------------------

const switchLocale = (
  routeId: RouteId,
  nextLocale: SupportedLocale,
  params: Readonly<Record<string, string>> = {},
): string => {
  return buildLocalizedUrl(routeId, nextLocale, params);
};

console.log(switchLocale("products", "de-DE")); // "/de/produkte"

console.log(switchLocale("product", "fr-FR", { productId: "42" })); // "/fr/produits/42"

// A language switcher should normally navigate to the equivalent route,
// rather than simply replacing one language segment in the current string.

// ---------------------------------------------------------------------
// 15. Why string replacement is fragile
// ---------------------------------------------------------------------

const currentPath = "/en/products/42";

// Replacing "/en/" with "/de/" would not translate "products" to "produkte".
const naiveSwitch = currentPath.replace("/en/", "/de/");

console.log(naiveSwitch); // "/de/products/42"

// Route identity allows the application to generate the correct localized path.
console.log(switchLocale("product", "de-DE", { productId: "42" })); // "/de/produkte/42"

// ---------------------------------------------------------------------
// 16. Matching a localized static route
// ---------------------------------------------------------------------

const normalizePath = (path: string): string => {
  const withoutQuery = path.split("?")[0];
  const withoutHash = withoutQuery.split("#")[0];

  if (withoutHash.length > 1 && withoutHash.endsWith("/")) {
    return withoutHash.slice(0, -1);
  }

  return withoutHash || "/";
};

const matchStaticRoute = (path: string, locale: SupportedLocale): RouteDefinition | undefined => {
  const normalizedPath = normalizePath(path);

  return ROUTES.find((route) => {
    const localizedPath = route.paths[locale];

    if (!localizedPath || localizedPath.includes(":")) {
      return false;
    }

    return normalizePath(localizedPath) === normalizedPath;
  });
};

console.log(matchStaticRoute("/produkte", "de-DE")?.id);
// "products"

console.log(matchStaticRoute("/products", "de-DE")?.id);
// undefined

// ---------------------------------------------------------------------
// 17. Matching parameterized routes
// ---------------------------------------------------------------------

const matchParameterizedRoute = (path: string, locale: SupportedLocale): RouteMatch | undefined => {
  const normalizedPath = normalizePath(path);
  const segments = normalizedPath.split("/").filter(Boolean);

  for (const route of ROUTES) {
    const localizedPath = route.paths[locale];

    if (!localizedPath) {
      continue;
    }

    const routeSegments = normalizePath(localizedPath).split("/").filter(Boolean);

    if (routeSegments.length !== segments.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let matches = true;

    for (let index = 0; index < routeSegments.length; index += 1) {
      const routeSegment = routeSegments[index];
      const pathSegment = segments[index];

      if (routeSegment.startsWith(":")) {
        params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
        continue;
      }

      if (routeSegment !== pathSegment) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return {
        locale,
        routeId: route.id,
        params,
      };
    }
  }

  return undefined;
};

console.log(matchParameterizedRoute("/produkte/42", "de-DE"));
// { locale: "de-DE", routeId: "product", params: { productId: "42" } }

// ---------------------------------------------------------------------
// 18. Locale-prefixed route matching
// ---------------------------------------------------------------------

interface ParsedLocalizedPath {
  readonly locale: SupportedLocale;
  readonly path: string;
}

const parseLocalizedPath = (urlPath: string): ParsedLocalizedPath | undefined => {
  const normalizedPath = normalizePath(urlPath);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return {
      locale: DEFAULT_LOCALE,
      path: "/",
    };
  }

  const locale = getLocaleFromPrefix(segments[0]);

  if (!locale) {
    return undefined;
  }

  const remainingSegments = segments.slice(1);

  return {
    locale,
    path: remainingSegments.length > 0 ? `/${remainingSegments.join("/")}` : "/",
  };
};

console.log(parseLocalizedPath("/de/produkte/42"));
// { locale: "de-DE", path: "/produkte/42" }

// ---------------------------------------------------------------------
// 19. Complete localized route matching
// ---------------------------------------------------------------------

const matchLocalizedRoute = (urlPath: string): RouteMatch | undefined => {
  const parsed = parseLocalizedPath(urlPath);

  if (!parsed) {
    return undefined;
  }

  return matchParameterizedRoute(parsed.path, parsed.locale);
};

console.log(matchLocalizedRoute("/fr/produits/42"));
// { locale: "fr-FR", routeId: "product", params: { productId: "42" } }

// ---------------------------------------------------------------------
// 20. Handling the root path
// ---------------------------------------------------------------------

const matchRootPath = (urlPath: string): RouteMatch | undefined => {
  const normalizedPath = normalizePath(urlPath);

  if (normalizedPath === "/") {
    return {
      locale: DEFAULT_LOCALE,
      routeId: "home",
      params: {},
    };
  }

  return matchLocalizedRoute(normalizedPath);
};

console.log(matchRootPath("/"));
// { locale: "en-US", routeId: "home", params: {} }

// ---------------------------------------------------------------------
// 21. Locale-prefixed root paths
// ---------------------------------------------------------------------

console.log(matchLocalizedRoute("/en"));
// { locale: "en-US", routeId: "home", params: {} }

console.log(matchLocalizedRoute("/de"));
// { locale: "de-DE", routeId: "home", params: {} }

console.log(matchLocalizedRoute("/ar"));
// { locale: "ar", routeId: "home", params: {} }

// ---------------------------------------------------------------------
// 22. Locale fallback
// ---------------------------------------------------------------------

const resolveLocale = (requestedLocale: string | undefined): SupportedLocale => {
  if (!requestedLocale) {
    return DEFAULT_LOCALE;
  }

  const exactLocale = SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === requestedLocale.toLowerCase());

  if (exactLocale) {
    return exactLocale;
  }

  const language = requestedLocale.split("-")[0].toLowerCase();

  return SUPPORTED_LOCALES.find((locale) => locale.split("-")[0].toLowerCase() === language) ?? DEFAULT_LOCALE;
};

console.log(resolveLocale("de-DE")); // "de-DE"
console.log(resolveLocale("de")); // "de-DE"
console.log(resolveLocale("xx")); // "en-US"

// Locale resolution should be explicit and deterministic.
// It should not silently create unsupported locale identifiers.

// ---------------------------------------------------------------------
// 23. Locale prefixes and BCP 47 locales
// ---------------------------------------------------------------------

const localePrefixToLocale = (prefix: string): SupportedLocale | undefined => {
  return getLocaleFromPrefix(prefix);
};

console.log(localePrefixToLocale("fr")); // "fr-FR"
console.log(localePrefixToLocale("ar")); // "ar"

// The short URL prefix and the full locale are related but are not necessarily
// identical strings.

// ---------------------------------------------------------------------
// 24. Localized slugs
// ---------------------------------------------------------------------

interface LocalizedSlug {
  readonly locale: SupportedLocale;
  readonly slug: string;
}

interface LocalizedProduct {
  readonly id: string;
  readonly names: Readonly<Record<SupportedLocale, string>>;
  readonly slugs: readonly LocalizedSlug[];
}

const product: LocalizedProduct = {
  id: "42",
  names: {
    "en-US": "Example Product",
    "de-DE": "Beispielprodukt",
    "fr-FR": "Produit exemple",
    ar: "منتج مثالي",
  },
  slugs: [
    { locale: "en-US", slug: "example-product" },
    { locale: "de-DE", slug: "beispielprodukt" },
    { locale: "fr-FR", slug: "produit-exemple" },
    { locale: "ar", slug: "منتج-مثالي" },
  ],
};

// Localized slugs can improve readability, but they introduce additional
// mapping data that must remain consistent with the underlying resource.
console.log(product.slugs[1].slug); // "beispielprodukt"

// ---------------------------------------------------------------------
// 25. Slug-based product routes
// ---------------------------------------------------------------------

interface SlugRouteParams {
  readonly productId: string;
  readonly slug: string;
}

const getProductSlug = (productData: LocalizedProduct, locale: SupportedLocale): string => {
  return productData.slugs.find((item) => item.locale === locale)?.slug ?? productData.id;
};

const getLocalizedProductSlugUrl = (locale: SupportedLocale, productData: LocalizedProduct): string => {
  const slug = getProductSlug(productData, locale);

  return addLocalePrefix(
    locale,
    `${getLocalizedPath("product", locale).replace("/:productId", "")}/${encodeURIComponent(slug)}`,
  );
};

console.log(getLocalizedProductSlugUrl("de-DE", product)); // "/de/produkte/beispielprodukt"

// ---------------------------------------------------------------------
// 26. Resource identity with localized slugs
// ---------------------------------------------------------------------

const resolveProductIdFromSlug = (
  productData: LocalizedProduct,
  locale: SupportedLocale,
  slug: string,
): string | undefined => {
  const localizedSlug = productData.slugs.find((item) => item.locale === locale && item.slug === slug);

  return localizedSlug ? productData.id : undefined;
};

console.log(resolveProductIdFromSlug(product, "fr-FR", "produit-exemple")); // "42"

// The localized slug is a presentation-layer identifier.
// The application can still use a stable internal resource ID.

// ---------------------------------------------------------------------
// 27. Query strings are separate from route paths
// ---------------------------------------------------------------------

const localizedUrl = new URL("https://example.com/en/products");

localizedUrl.searchParams.set("sort", "price");
localizedUrl.searchParams.set("page", "2");

console.log(localizedUrl.pathname); // "/en/products"
console.log(localizedUrl.search); // "?sort=price&page=2"

// Query parameters should not be confused with localized path segments.

// ---------------------------------------------------------------------
// 28. Preserving query parameters during locale switching
// ---------------------------------------------------------------------

const switchLocalePreservingQuery = (
  currentUrl: string,
  nextRoute: RouteId,
  nextLocale: SupportedLocale,
  params: Readonly<Record<string, string>> = {},
): string => {
  const url = new URL(currentUrl, "https://example.com");
  const nextPath = buildLocalizedUrl(nextRoute, nextLocale, params);

  return `${nextPath}${url.search}${url.hash}`;
};

console.log(
  switchLocalePreservingQuery("https://example.com/en/products?sort=price&page=2#results", "products", "de-DE"),
);
// "/de/produkte?sort=price&page=2#results"

// ---------------------------------------------------------------------
// 29. Hash fragments are separate from localized paths
// ---------------------------------------------------------------------

const urlWithFragment = new URL("https://example.com/fr/produits#featured");

console.log(urlWithFragment.pathname); // "/fr/produits"
console.log(urlWithFragment.hash); // "#featured"

// Route generation should preserve fragments only when the application
// intentionally treats them as part of navigation state.

// ---------------------------------------------------------------------
// 30. Localized route metadata
// ---------------------------------------------------------------------

interface LocalizedRouteMetadata {
  readonly title: string;
  readonly description: string;
}

const routeMetadata: Record<RouteId, Partial<Record<SupportedLocale, LocalizedRouteMetadata>>> = {
  home: {
    "en-US": {
      title: "Home",
      description: "Example home page",
    },
    "de-DE": {
      title: "Startseite",
      description: "Beispiel-Startseite",
    },
  },
  products: {
    "en-US": {
      title: "Products",
      description: "Browse example products",
    },
    "de-DE": {
      title: "Produkte",
      description: "Beispielprodukte durchsuchen",
    },
  },
  product: {},
  about: {},
  contact: {},
  notFound: {},
};

console.log(routeMetadata.products["de-DE"]?.title); // "Produkte"

// The route path and page metadata are separate localization concerns,
// even though they are often configured together.

// ---------------------------------------------------------------------
// 31. Localized document titles
// ---------------------------------------------------------------------

const getRouteTitle = (routeId: RouteId, locale: SupportedLocale): string => {
  return routeMetadata[routeId][locale]?.title ?? "Example";
};

console.log(getRouteTitle("products", "en-US")); // "Products"
console.log(getRouteTitle("products", "de-DE")); // "Produkte"

// In a real application, the router or framework can use the matched route
// and locale to select document metadata.

// ---------------------------------------------------------------------
// 32. Alternate language URLs
// ---------------------------------------------------------------------

const getAlternateUrls = (
  routeId: RouteId,
  params: Readonly<Record<string, string>> = {},
): Readonly<Record<SupportedLocale, string>> => {
  return Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [locale, buildLocalizedUrl(routeId, locale, params)]),
  ) as Record<SupportedLocale, string>;
};

console.log(getAlternateUrls("product", { productId: "42" }));
/*
{
    "en-US": "/en/products/42",
    "de-DE": "/de/produkte/42",
    "fr-FR": "/fr/produits/42",
    ar: "/ar/المنتجات/42"
}
*/

// Equivalent-language URLs can be used when the application needs
// locale-aware alternate navigation or metadata.

// ---------------------------------------------------------------------
// 33. Localized links
// ---------------------------------------------------------------------

interface LocalizedLinkProps {
  readonly locale: SupportedLocale;
  readonly routeId: Exclude<RouteId, "notFound">;
  readonly children: string;
  readonly params?: Readonly<Record<string, string>>;
}

export const LocalizedLink: FC<LocalizedLinkProps> = ({ locale, routeId, children, params = {} }): ReactElement => {
  const href = buildLocalizedUrl(routeId, locale, params);

  return <a href={href}>{children}</a>;
};

// The component uses the route definition instead of concatenating
// translated strings directly into the href.

// ---------------------------------------------------------------------
// 34. Links should remain semantic
// ---------------------------------------------------------------------

export const SemanticLocalizedLink: FC<LocalizedLinkProps> = ({
  locale,
  routeId,
  children,
  params = {},
}): ReactElement => {
  return <a href={buildLocalizedUrl(routeId, locale, params)}>{children}</a>;
};

// A localized URL does not change the semantic requirement for a link.
// Interactive navigation should remain represented by an appropriate element.

// ---------------------------------------------------------------------
// 35. Locale switcher properties
// ---------------------------------------------------------------------

interface LocaleSwitcherProps {
  readonly currentRoute: RouteId;
  readonly currentLocale: SupportedLocale;
  readonly params?: Readonly<Record<string, string>>;
  readonly onNavigate: (url: string) => void;
}

// The switcher needs route identity and parameters so it can generate
// equivalent URLs in other locales.

// ---------------------------------------------------------------------
// 36. Locale switcher
// ---------------------------------------------------------------------

export const LocaleSwitcher: FC<LocaleSwitcherProps> = ({
  currentRoute,
  currentLocale,
  params = {},
  onNavigate,
}): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextLocale = event.target.value as SupportedLocale;

    if (nextLocale === currentLocale) {
      return;
    }

    onNavigate(buildLocalizedUrl(currentRoute, nextLocale, params));
  };

  return (
    <label>
      Language
      <select value={currentLocale} onChange={handleChange}>
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
    </label>
  );
};

// ---------------------------------------------------------------------
// 37. Locale switcher and browser navigation
// ---------------------------------------------------------------------

const navigateWithBrowser = (url: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(url);
};

// Browser navigation is an environment-specific side effect.
// Keeping it outside route-generation logic makes route generation easier to test.

// ---------------------------------------------------------------------
// 38. Avoiding locale loss during navigation
// ---------------------------------------------------------------------

const localizedNavigationTarget = buildLocalizedUrl("products", "de-DE");

console.log(localizedNavigationTarget); // "/de/produkte"

// Every generated internal destination should use the active locale,
// unless the navigation intentionally targets another locale.

// ---------------------------------------------------------------------
// 39. Localized navigation component
// ---------------------------------------------------------------------

interface NavigationProps {
  readonly locale: SupportedLocale;
}

export const LocalizedNavigation: FC<NavigationProps> = ({ locale }): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        {navigationItems.map((item) => (
          <li key={item.routeId}>
            <a href={buildLocalizedUrl(item.routeId, locale)}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// The example labels remain simple placeholders.
// A production application would obtain the visible labels from its
// translation resources while route IDs remain stable.

// ---------------------------------------------------------------------
// 40. Localized routing and server rendering
// ---------------------------------------------------------------------

interface ServerRouteRequest {
  readonly pathname: string;
}

const resolveServerRoute = (request: ServerRouteRequest): RouteMatch | undefined => {
  return matchRootPath(request.pathname);
};

console.log(resolveServerRoute({ pathname: "/de/produkte/42" }));
// { locale: "de-DE", routeId: "product", params: { productId: "42" } }

// The server can derive locale and route identity from the incoming URL
// before rendering the requested page.

// ---------------------------------------------------------------------
// 41. Localized routing and client rendering
// ---------------------------------------------------------------------

interface ClientRouteState {
  readonly pathname: string;
  readonly match: RouteMatch | undefined;
}

const createClientRouteState = (pathname: string): ClientRouteState => {
  return {
    pathname,
    match: matchRootPath(pathname),
  };
};

console.log(createClientRouteState("/fr/a-propos"));
// { pathname: "/fr/a-propos", match: ... }

// Client-side routing must apply the same route semantics as server routing
// when both environments handle the same URLs.

// ---------------------------------------------------------------------
// 42. Keeping server and client route definitions consistent
// ---------------------------------------------------------------------

const routeIds = ROUTES.map((route) => route.id);

console.log(routeIds);
// ["home", "products", "product", "about", "contact"]

// A shared route definition can reduce the risk that server and client
// routing tables interpret localized URLs differently.

// ---------------------------------------------------------------------
// 43. Detecting missing localized paths
// ---------------------------------------------------------------------

const findMissingLocalizedPaths = (): readonly string[] => {
  const missing: string[] = [];

  for (const route of ROUTES) {
    for (const locale of SUPPORTED_LOCALES) {
      if (!route.paths[locale]) {
        missing.push(`${route.id}:${locale}`);
      }
    }
  }

  return missing;
};

console.log(findMissingLocalizedPaths());
// []

// Missing translations in route configuration should be detected deliberately
// rather than discovered only after a user follows a broken link.

// ---------------------------------------------------------------------
// 44. Validating route configuration
// ---------------------------------------------------------------------

const validateLocalizedRoutes = (): void => {
  const missing = findMissingLocalizedPaths();

  if (missing.length > 0) {
    throw new Error(`Missing localized routes: ${missing.join(", ")}`);
  }
};

validateLocalizedRoutes();

// Compile-time types help when route data is static, while runtime validation
// remains useful when route configuration is loaded dynamically.

// ---------------------------------------------------------------------
// 45. Localized route collisions
// ---------------------------------------------------------------------

const localizedPathSet = new Set<string>();

for (const route of ROUTES) {
  for (const locale of SUPPORTED_LOCALES) {
    const path = route.paths[locale];

    if (!path) {
      continue;
    }

    const key = `${locale}:${normalizePath(path)}`;

    if (localizedPathSet.has(key)) {
      throw new Error(`Duplicate localized route: ${key}`);
    }

    localizedPathSet.add(key);
  }
}

// Each locale should have an unambiguous route mapping.
// Parameterized route overlap may require more sophisticated route ranking.

// ---------------------------------------------------------------------
// 46. Route ordering
// ---------------------------------------------------------------------

const orderedRoutes: readonly RouteDefinition[] = [
  ...ROUTES.filter((route) => route.paths["en-US"]?.includes(":")),
  ...ROUTES.filter((route) => !route.paths["en-US"]?.includes(":")),
];

console.log(orderedRoutes.map((route) => route.id));

// Real routing libraries generally provide route ranking/matching rules.
// A custom matcher should define precedence explicitly rather than relying
// on accidental declaration order.

// ---------------------------------------------------------------------
// 47. Catch-all and not-found handling
// ---------------------------------------------------------------------

const notFoundMatch = (locale: SupportedLocale): RouteMatch => ({
  locale,
  routeId: "notFound",
  params: {},
});

const resolveRouteOrNotFound = (pathname: string): RouteMatch => {
  return matchRootPath(pathname) ?? notFoundMatch(DEFAULT_LOCALE);
};

console.log(resolveRouteOrNotFound("/unknown"));
// { locale: "en-US", routeId: "notFound", params: {} }

// A production router may preserve the detected locale for the not-found page.

// ---------------------------------------------------------------------
// 48. Locale-aware not-found handling
// ---------------------------------------------------------------------

const resolveLocalizedRouteOrNotFound = (pathname: string): RouteMatch => {
  const match = matchRootPath(pathname);

  if (match) {
    return match;
  }

  const parsed = parseLocalizedPath(pathname);

  return notFoundMatch(parsed?.locale ?? DEFAULT_LOCALE);
};

console.log(resolveLocalizedRouteOrNotFound("/de/unknown"));
// { locale: "de-DE", routeId: "notFound", params: {} }

// ---------------------------------------------------------------------
// 49. Redirecting an unprefixed route
// ---------------------------------------------------------------------

const buildLocaleRedirect = (pathname: string, locale: SupportedLocale): string => {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === "/") {
    return addLocalePrefix(locale, "/");
  }

  const route = matchParameterizedRoute(normalizedPath, locale);

  if (!route) {
    return addLocalePrefix(locale, "/");
  }

  return buildLocalizedUrl(route.routeId, locale, route.params);
};

console.log(buildLocaleRedirect("/products", "de-DE")); // "/de/produkte"

// A redirect policy should be explicit. It should not blindly prepend a locale
// to a path that may already contain a locale prefix.

// ---------------------------------------------------------------------
// 50. Avoiding redirect loops
// ---------------------------------------------------------------------

const redirectTarget = "/de/produkte";

console.log(parseLocalizedPath(redirectTarget));
// { locale: "de-DE", path: "/produkte" }

// Before redirecting, determine whether the URL is already localized.
// Redirect logic should be idempotent for already-canonical URLs.

// ---------------------------------------------------------------------
// 51. Canonical localized URLs
// ---------------------------------------------------------------------

const canonicalizeLocalizedPath = (pathname: string): string => {
  const match = matchRootPath(pathname);

  if (!match) {
    return pathname;
  }

  return buildLocalizedUrl(match.routeId, match.locale, match.params);
};

console.log(canonicalizeLocalizedPath("/de/produkte/42")); // "/de/produkte/42"

// Canonicalization should have one deterministic output for a recognized route.

// ---------------------------------------------------------------------
// 52. Trailing slash policy
// ---------------------------------------------------------------------

console.log(canonicalizeLocalizedPath("/de/produkte/")); // "/de/produkte"

// Normalization can enforce one trailing-slash convention.
// The router and server should agree on that convention.

// ---------------------------------------------------------------------
// 53. Case sensitivity
// ---------------------------------------------------------------------

const caseSensitivePath = "/de/produkte";

console.log(normalizePath(caseSensitivePath)); // "/de/produkte"

// Path matching rules should define whether localized path segments are
// case-sensitive. URL path handling should not assume that all environments
// treat path casing identically.

// ---------------------------------------------------------------------
// 54. Unicode path segments
// ---------------------------------------------------------------------

const arabicProductsPath = addLocalePrefix("ar", getLocalizedPath("products", "ar"));

console.log(arabicProductsPath);
// "/ar/المنتجات"

// Unicode characters can appear in URL paths.
// Applications should still encode and decode dynamic components correctly.

// ---------------------------------------------------------------------
// 55. Unicode normalization
// ---------------------------------------------------------------------

const normalizeUnicodePath = (path: string): string => {
  return path.normalize("NFC");
};

const normalizedArabicPath = normalizeUnicodePath("/ar/المنتجات");

console.log(normalizedArabicPath);

// Unicode normalization can matter when comparing user-visible Unicode strings.
// Applications should define a consistent normalization strategy when relevant.

// ---------------------------------------------------------------------
// 56. Route slugs should not be trusted as identifiers
// ---------------------------------------------------------------------

const userProvidedSlug = "example-product";

const productFromSlug = resolveProductIdFromSlug(product, "en-US", userProvidedSlug);

console.log(productFromSlug); // "42"

// The route layer resolves a slug to an internal resource.
// Authorization and resource existence checks still belong to the application layer.

// ---------------------------------------------------------------------
// 57. Locale-aware route state
// ---------------------------------------------------------------------

interface RouteState {
  readonly routeId: RouteId;
  readonly locale: SupportedLocale;
  readonly params: Readonly<Record<string, string>>;
}

const createRouteState = (pathname: string): RouteState => {
  const match = resolveLocalizedRouteOrNotFound(pathname);

  return {
    routeId: match.routeId,
    locale: match.locale,
    params: match.params,
  };
};

console.log(createRouteState("/fr/produits/42"));
// { routeId: "product", locale: "fr-FR", params: { productId: "42" } }

// Route state can expose both locale and route identity to application components.

// ---------------------------------------------------------------------
// 58. React route state example
// ---------------------------------------------------------------------

interface RouteStateViewProps {
  readonly pathname: string;
}

export const RouteStateView: FC<RouteStateViewProps> = ({ pathname }): ReactElement => {
  const routeState = useMemo(() => createRouteState(pathname), [pathname]);

  return (
    <section>
      <p>Locale: {routeState.locale}</p>
      <p>Route: {routeState.routeId}</p>
    </section>
  );
};

// The route state is derived from the pathname.
// It does not need separate React state when the pathname itself is the source of truth.

// ---------------------------------------------------------------------
// 59. Avoiding duplicated route state
// ---------------------------------------------------------------------

const pathname = "/de/produkte/42";

const derivedRouteState = createRouteState(pathname);

// The application should generally avoid independently storing both
// `pathname` and a manually synchronized route object when one can be derived
// deterministically from the other.
console.log(derivedRouteState.routeId); // "product"

// ---------------------------------------------------------------------
// 60. Localized routing with a controlled locale selector
// ---------------------------------------------------------------------

interface RoutingDemoProps {
  readonly initialLocale: SupportedLocale;
}

export const LocalizedRoutingDemo: FC<RoutingDemoProps> = ({ initialLocale }): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>(initialLocale);
  const [routeId, setRouteId] = useState<RouteId>("products");
  const [productId, setProductId] = useState("42");

  const productUrl = useMemo(() => buildLocalizedUrl("product", locale, { productId }), [locale, productId]);

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const handleRouteChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRouteId(event.target.value as RouteId);
  };

  return (
    <section>
      <h2>Localized routing</h2>

      <label>
        Locale
        <select value={locale} onChange={handleLocaleChange}>
          {SUPPORTED_LOCALES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Route
        <select value={routeId} onChange={handleRouteChange}>
          <option value="home">Home</option>
          <option value="products">Products</option>
          <option value="product">Product</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
        </select>
      </label>

      {routeId === "product" && (
        <label>
          Product ID
          <input value={productId} onChange={(event) => setProductId(event.target.value)} />
        </label>
      )}

      <p>URL: {buildLocalizedUrl(routeId, locale, routeId === "product" ? { productId } : {})}</p>

      <p>Product example: {productUrl}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 61. Navigation should use route identity
// ---------------------------------------------------------------------

interface RouteLinkExampleProps {
  readonly locale: SupportedLocale;
}

export const RouteLinkExample: FC<RouteLinkExampleProps> = ({ locale }): ReactElement => {
  return (
    <div>
      <LocalizedLink locale={locale} routeId="products">
        Products
      </LocalizedLink>

      <LocalizedLink locale={locale} routeId="about">
        About
      </LocalizedLink>
    </div>
  );
};

// Route IDs remain stable while href values change with locale.

// ---------------------------------------------------------------------
// 62. Localized routing does not require translated route segments
// ---------------------------------------------------------------------

const localeOnlyProductUrl = buildLocalizedUrl("product", "de-DE", { productId: "42" });

console.log(localeOnlyProductUrl); // "/de/produkte/42"

// An application can choose stable route segments such as `/de/products/42`
// while still localizing the locale prefix and page content.
// Translating path segments is a product and routing decision, not a requirement.

// ---------------------------------------------------------------------
// 63. Stable routes versus localized slugs
// ---------------------------------------------------------------------

const stableRouteUrl = addLocalePrefix("de-DE", "/products/42");

console.log(stableRouteUrl); // "/de/products/42"

console.log(getLocalizedProductSlugUrl("de-DE", product)); // "/de/produkte/beispielprodukt"

// Both architectures are possible.
// Stable paths simplify routing; localized slugs can make URLs more descriptive.

// ---------------------------------------------------------------------
// 64. Route generation should be centralized
// ---------------------------------------------------------------------

const routesForLocale = (locale: SupportedLocale): Readonly<Record<RouteId, string | undefined>> => {
  return Object.fromEntries(ROUTES.map((route) => [route.id, route.paths[locale]])) as Record<
    RouteId,
    string | undefined
  >;
};

console.log(routesForLocale("fr-FR"));

// Centralized route generation prevents individual components from having
// to understand localization-specific path structures.

// ---------------------------------------------------------------------
// 65. Route generation and testing
// ---------------------------------------------------------------------

const routeTests = [
  {
    routeId: "products" as const,
    locale: "en-US" as const,
    expected: "/en/products",
  },
  {
    routeId: "products" as const,
    locale: "de-DE" as const,
    expected: "/de/produkte",
  },
  {
    routeId: "products" as const,
    locale: "fr-FR" as const,
    expected: "/fr/produits",
  },
];

for (const test of routeTests) {
  const actual = buildLocalizedUrl(test.routeId, test.locale);

  if (actual !== test.expected) {
    throw new Error(`Expected "${test.expected}", received "${actual}".`);
  }
}

// Route generation is deterministic and can be tested without rendering React.

// ---------------------------------------------------------------------
// 66. Round-trip route testing
// ---------------------------------------------------------------------

const roundTripPath = buildLocalizedUrl("product", "de-DE", { productId: "42" });

const roundTripMatch = matchLocalizedRoute(roundTripPath);

console.log(roundTripPath); // "/de/produkte/42"
console.log(roundTripMatch?.routeId); // "product"
console.log(roundTripMatch?.params.productId); // "42"

// A useful invariant is that generating a recognized route and then matching it
// should recover the same route identity and parameters.

// ---------------------------------------------------------------------
// 67. Route parameters should survive locale changes
// ---------------------------------------------------------------------

const productRouteParameters = {
  productId: "42",
};

const englishProductUrl = buildLocalizedUrl("product", "en-US", productRouteParameters);

const germanProductUrl = buildLocalizedUrl("product", "de-DE", productRouteParameters);

console.log(englishProductUrl); // "/en/products/42"
console.log(germanProductUrl); // "/de/produkte/42"

// The route identity and parameter values remain the same;
// only the localized path representation changes.

// ---------------------------------------------------------------------
// 68. Preserving application state separately from locale
// ---------------------------------------------------------------------

interface ProductRouteState {
  readonly productId: string;
  readonly locale: SupportedLocale;
}

const productRouteState: ProductRouteState = {
  productId: "42",
  locale: "de-DE",
};

console.log(productRouteState);

// Route parameters and locale are distinct pieces of routing state.
// Changing locale should not accidentally change the underlying resource ID.

// ---------------------------------------------------------------------
// 69. Localized routing and external URLs
// ---------------------------------------------------------------------

const externalUrl = "https://example.com";

console.log(externalUrl);

// A localized router generally controls application-owned routes.
// External URLs should not be passed through localized route generation.

// ---------------------------------------------------------------------
// 70. Do not localize arbitrary URL values
// ---------------------------------------------------------------------

const apiEndpoint = "/api/products/42";

console.log(apiEndpoint);

// API endpoints, identifiers, and other protocol-level values should not be
// translated merely because the user interface has a different locale.

// ---------------------------------------------------------------------
// 71. Localized routing and accessibility
// ---------------------------------------------------------------------

export const AccessibleLocalizedNavigation: FC<NavigationProps> = ({ locale }): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        {navigationItems.map((item) => (
          <li key={item.routeId}>
            <a href={buildLocalizedUrl(item.routeId, locale)}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Localization changes the destination URL, not the basic semantics of navigation.

// ---------------------------------------------------------------------
// 72. Localized routing and document language
// ---------------------------------------------------------------------

interface LocalizedPageProps {
  readonly locale: SupportedLocale;
  readonly children: ReactElement;
}

export const LocalizedPage: FC<LocalizedPageProps> = ({ locale, children }): ReactElement => {
  return <main lang={locale}>{children}</main>;
};

// The URL locale and document language often correspond,
// but they represent different layers of application state.

// ---------------------------------------------------------------------
// 73. Locale-aware direction
// ---------------------------------------------------------------------

const RTL_LOCALES: readonly SupportedLocale[] = ["ar"];

const getTextDirection = (locale: SupportedLocale): "ltr" | "rtl" => {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
};

console.log(getTextDirection("en-US")); // "ltr"
console.log(getTextDirection("ar")); // "rtl"

// Locale-aware routing can provide the locale needed by the rendering layer,
// which can then select appropriate language and direction settings.

// ---------------------------------------------------------------------
// 74. Localized routing and browser history
// ---------------------------------------------------------------------

const navigationUrl = buildLocalizedUrl("products", "fr-FR");

console.log(navigationUrl); // "/fr/produits"

// A client-side router can place this URL into browser history without
// reloading the document when the routing environment supports it.

// ---------------------------------------------------------------------
// 75. Example browser history navigation
// ---------------------------------------------------------------------

const pushLocalizedUrl = (url: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.history.pushState({}, "", url);
};

// The browser API is guarded so importing this module does not require a browser.
// A real router also needs to update its route state after pushState/popstate.

// ---------------------------------------------------------------------
// 76. A locale-aware router boundary
// ---------------------------------------------------------------------

interface RouterBoundaryProps {
  readonly pathname: string;
}

export const RouterBoundary: FC<RouterBoundaryProps> = ({ pathname }): ReactElement => {
  const route = useMemo(() => resolveLocalizedRouteOrNotFound(pathname), [pathname]);

  return (
    <section>
      <p>Locale: {route.locale}</p>
      <p>Route: {route.routeId}</p>
    </section>
  );
};

// A routing boundary can expose matched locale and route identity to the
// rendering layer without making individual components parse URLs themselves.

// ---------------------------------------------------------------------
// 77. Integrated localized routing example
// ---------------------------------------------------------------------

export const IntegratedLocalizedRouting: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [productId, setProductId] = useState("42");

  const productUrl = useMemo(() => buildLocalizedUrl("product", locale, { productId }), [locale, productId]);

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  return (
    <section>
      <h2>Localized product route</h2>

      <label>
        Locale
        <select value={locale} onChange={handleLocaleChange}>
          {SUPPORTED_LOCALES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Product ID
        <input value={productId} onChange={(event) => setProductId(event.target.value)} />
      </label>

      <p>Locale: {locale}</p>

      <p>Direction: {getTextDirection(locale)}</p>

      <p>URL: {productUrl}</p>

      <a href={productUrl}>Open product</a>
    </section>
  );
};

// ---------------------------------------------------------------------
// 78. Routing architecture checklist
// ---------------------------------------------------------------------

const routingPrinciples = [
  "Keep route identity separate from localized path text.",
  "Centralize localized route definitions.",
  "Encode dynamic route parameters.",
  "Preserve route parameters when switching locales.",
  "Treat query strings and fragments separately from path segments.",
  "Validate localized route configuration.",
  "Keep server and client route semantics consistent.",
  "Use explicit fallback behavior for unsupported locales.",
  "Test route generation and matching as deterministic functions.",
] as const;

console.log(routingPrinciples);

// These principles describe the responsibilities that become important
// as localized routing grows beyond a small application.

// ---------------------------------------------------------------------
// 79. Complete usage example
// ---------------------------------------------------------------------

export const LocalizedRoutingExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");
  const [productId, setProductId] = useState("42");

  const url = buildLocalizedUrl("product", locale, { productId });

  const handleLocaleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setLocale(event.target.value as SupportedLocale);
  };

  const handleProductIdChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setProductId(event.target.value);
  };

  return (
    <section lang={locale} dir={getTextDirection(locale)}>
      <h2>Localized routing example</h2>

      <label>
        Locale
        <select value={locale} onChange={handleLocaleChange}>
          {SUPPORTED_LOCALES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Product ID
        <input value={productId} onChange={handleProductIdChange} />
      </label>

      <p>Generated URL: {url}</p>

      <a href={url}>View product</a>
    </section>
  );
};

// ---------------------------------------------------------------------
// 80. Default export
// ---------------------------------------------------------------------

export default LocalizedRoutingExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Localized routing maps stable route identities to locale-specific URL paths.
// - A route ID should remain independent from translated path segments.
// - Locale prefixes can expose the active locale directly in the URL.
// - Dynamic route parameters should be encoded when inserted into paths.
// - Locale switching should regenerate the equivalent route instead of replacing strings.
// - Localized slugs require explicit mappings between URL values and stable resource identities.
// - Query strings and hash fragments are separate from localized path segments.
// - Route matching should recover locale, route identity, and dynamic parameters.
// - Server and client routing should use consistent route semantics.
// - Unsupported locales need deterministic fallback behavior.
// - Route configuration should be validated for missing paths and collisions.
// - Route generation and matching are deterministic logic that can be tested independently.
// - Accessibility semantics do not change merely because a destination is localized.
// - Localized routing can provide locale information to the rendering layer without making every component parse URLs.

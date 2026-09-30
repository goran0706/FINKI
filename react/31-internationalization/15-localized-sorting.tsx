/**
 * Localized Sorting
 * =================
 *
 * Localized sorting orders user-facing strings according to the linguistic
 * and collation conventions of a locale.
 *
 * JavaScript's Intl.Collator provides locale-sensitive comparison rules
 * for sorting strings, including differences in accents, case, punctuation,
 * and numeric text.
 */

import { useMemo, useState, type ChangeEvent, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Define supported locales
// ---------------------------------------------------------------------

type SupportedLocale = "en-US" | "de-DE" | "fr-FR" | "sv-SE";

const supportedLocales: readonly SupportedLocale[] = ["en-US", "de-DE", "fr-FR", "sv-SE"];

const localeLabels: Record<SupportedLocale, string> = {
  "en-US": "English (United States)",
  "de-DE": "Deutsch (Deutschland)",
  "fr-FR": "Français (France)",
  "sv-SE": "Svenska (Sverige)",
};

// ---------------------------------------------------------------------
// 2. Create a basic Collator
// ---------------------------------------------------------------------

const englishCollator = new Intl.Collator("en-US");

console.log(englishCollator.compare("apple", "banana"));

console.log(englishCollator.compare("banana", "apple"));

console.log(englishCollator.compare("apple", "apple"));

// ---------------------------------------------------------------------
// 3. Sort a simple list
// ---------------------------------------------------------------------

const fruits = ["banana", "apple", "orange", "grape"];

const sortedFruits = [...fruits].sort(englishCollator.compare);

console.log(sortedFruits);

// ---------------------------------------------------------------------
// 4. Avoid relying on exact comparator values
// ---------------------------------------------------------------------

const comparison = englishCollator.compare("apple", "banana");

if (comparison < 0) {
  console.log("apple comes before banana");
} else if (comparison > 0) {
  console.log("apple comes after banana");
} else {
  console.log("The values compare as equivalent");
}

// ---------------------------------------------------------------------
// 5. Sort without mutating the source array
// ---------------------------------------------------------------------

const originalNames = ["Charlie", "Alice", "Bob"];

const sortedNames = [...originalNames].sort(englishCollator.compare);

console.log(originalNames);
console.log(sortedNames);

// ---------------------------------------------------------------------
// 6. Compare with default JavaScript sorting
// ---------------------------------------------------------------------

const accentedWords = ["éclair", "apple", "École", "banana"];

const defaultSortedWords = [...accentedWords].sort();

const localizedSortedWords = [...accentedWords].sort(englishCollator.compare);

console.log(defaultSortedWords);
console.log(localizedSortedWords);

// ---------------------------------------------------------------------
// 7. Sort accented characters
// ---------------------------------------------------------------------

const accentedNames = ["Émile", "Andre", "André", "Zoë"];

const accentAwareNames = [...accentedNames].sort(new Intl.Collator("en-US").compare);

console.log(accentAwareNames);

// ---------------------------------------------------------------------
// 8. Compare German and Swedish collation
// ---------------------------------------------------------------------

const germanCollator = new Intl.Collator("de-DE");

const swedishCollator = new Intl.Collator("sv-SE");

console.log(germanCollator.compare("ä", "z"));

console.log(swedishCollator.compare("ä", "z"));

// ---------------------------------------------------------------------
// 9. Sort using a German locale
// ---------------------------------------------------------------------

const germanNames = ["Zacharias", "Änne", "Anna", "Ölrich"];

console.log([...germanNames].sort(germanCollator.compare));

// ---------------------------------------------------------------------
// 10. Sort using a Swedish locale
// ---------------------------------------------------------------------

const swedishNames = ["Zara", "Åke", "Anna", "Äsa", "Östen"];

console.log([...swedishNames].sort(swedishCollator.compare));

// ---------------------------------------------------------------------
// 11. Use localeCompare for one-off comparisons
// ---------------------------------------------------------------------

console.log("ä".localeCompare("z", "de-DE"));

console.log("ä".localeCompare("z", "sv-SE"));

// ---------------------------------------------------------------------
// 12. Use localeCompare for sorting
// ---------------------------------------------------------------------

const countries = ["France", "Deutschland", "España", "Canada"];

const sortedCountries = [...countries].sort((a, b) => a.localeCompare(b, "en-US"));

console.log(sortedCountries);

// ---------------------------------------------------------------------
// 13. Prefer a Collator for repeated comparisons
// ---------------------------------------------------------------------

const repeatedCollator = new Intl.Collator("en-US");

const largeNameList = ["Charlie", "Alice", "Émile", "Bob", "Diana"];

const repeatedlySortedNames = [...largeNameList].sort(repeatedCollator.compare);

console.log(repeatedlySortedNames);

// ---------------------------------------------------------------------
// 14. Define case-insensitive sorting
// ---------------------------------------------------------------------

const caseInsensitiveCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

const mixedCaseNames = ["charlie", "Alice", "BOB", "diana"];

console.log([...mixedCaseNames].sort(caseInsensitiveCollator.compare));

// ---------------------------------------------------------------------
// 15. Use accent sensitivity
// ---------------------------------------------------------------------

const accentSensitiveCollator = new Intl.Collator("en-US", {
  sensitivity: "accent",
});

console.log(accentSensitiveCollator.compare("cafe", "café"));

console.log(accentSensitiveCollator.compare("cafe", "Cafe"));

// ---------------------------------------------------------------------
// 16. Use case sensitivity
// ---------------------------------------------------------------------

const caseSensitiveCollator = new Intl.Collator("en-US", {
  sensitivity: "case",
});

console.log(caseSensitiveCollator.compare("apple", "Apple"));

console.log(caseSensitiveCollator.compare("cafe", "café"));

// ---------------------------------------------------------------------
// 17. Use variant sensitivity
// ---------------------------------------------------------------------

const variantCollator = new Intl.Collator("en-US", {
  sensitivity: "variant",
});

console.log(variantCollator.compare("apple", "Apple"));

console.log(variantCollator.compare("cafe", "café"));

// ---------------------------------------------------------------------
// 18. Compare sensitivity modes
// ---------------------------------------------------------------------

const sensitivityModes: Array<"base" | "accent" | "case" | "variant"> = ["base", "accent", "case", "variant"];

for (const sensitivity of sensitivityModes) {
  const collator = new Intl.Collator("en-US", {
    sensitivity,
  });

  console.log(sensitivity, collator.compare("café", "Cafe"));
}

// ---------------------------------------------------------------------
// 19. Use numeric collation
// ---------------------------------------------------------------------

const numericCollator = new Intl.Collator("en-US", {
  numeric: true,
});

const versions = ["item-10", "item-2", "item-1", "item-20"];

console.log([...versions].sort(numericCollator.compare));

// ---------------------------------------------------------------------
// 20. Compare numeric and lexical ordering
// ---------------------------------------------------------------------

const numericValues = ["2", "10", "1"];

const lexicalCollator = new Intl.Collator("en-US", {
  numeric: false,
});

const numericValueCollator = new Intl.Collator("en-US", {
  numeric: true,
});

const lexicalOrder = [...numericValues].sort(lexicalCollator.compare);

const numericOrder = [...numericValues].sort(numericValueCollator.compare);

console.log(lexicalOrder);
console.log(numericOrder);

// ---------------------------------------------------------------------
// 21. Sort filenames numerically
// ---------------------------------------------------------------------

const filenames = ["file-10.txt", "file-2.txt", "file-1.txt", "file-20.txt"];

const filenameCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...filenames].sort(filenameCollator.compare));

// ---------------------------------------------------------------------
// 22. Use caseFirst
// ---------------------------------------------------------------------

const uppercaseFirstCollator = new Intl.Collator("en-US", {
  caseFirst: "upper",
});

const lowercaseFirstCollator = new Intl.Collator("en-US", {
  caseFirst: "lower",
});

const caseMixedValues = ["apple", "Apple", "banana", "Banana"];

console.log([...caseMixedValues].sort(uppercaseFirstCollator.compare));

console.log([...caseMixedValues].sort(lowercaseFirstCollator.compare));

// ---------------------------------------------------------------------
// 23. Use the locale's default case ordering
// ---------------------------------------------------------------------

const defaultCaseCollator = new Intl.Collator("en-US", {
  caseFirst: "false",
});

console.log([...caseMixedValues].sort(defaultCaseCollator.compare));

// ---------------------------------------------------------------------
// 24. Ignore punctuation
// ---------------------------------------------------------------------

const punctuationCollator = new Intl.Collator("en-US", {
  ignorePunctuation: true,
});

const punctuatedNames = ["Smith", "Smith-Jones", "Smith Jones", "Smith.Jones"];

console.log([...punctuatedNames].sort(punctuationCollator.compare));

// ---------------------------------------------------------------------
// 25. Preserve punctuation significance
// ---------------------------------------------------------------------

const punctuationSensitiveCollator = new Intl.Collator("en-US", {
  ignorePunctuation: false,
});

console.log([...punctuatedNames].sort(punctuationSensitiveCollator.compare));

// ---------------------------------------------------------------------
// 26. Configure sorting explicitly
// ---------------------------------------------------------------------

const explicitSortCollator = new Intl.Collator("en-US", {
  usage: "sort",
});

console.log([...countries].sort(explicitSortCollator.compare));

// ---------------------------------------------------------------------
// 27. Search mode
// ---------------------------------------------------------------------

const searchCollator = new Intl.Collator("en-US", {
  usage: "search",
});

console.log(searchCollator.compare("resume", "résumé"));

// ---------------------------------------------------------------------
// 28. Compare search and sort usage
// ---------------------------------------------------------------------

const sortUsageCollator = new Intl.Collator("en-US", {
  usage: "sort",
  sensitivity: "base",
});

const searchUsageCollator = new Intl.Collator("en-US", {
  usage: "search",
  sensitivity: "base",
});

console.log(sortUsageCollator.compare("resume", "résumé"));

console.log(searchUsageCollator.compare("resume", "résumé"));

// ---------------------------------------------------------------------
// 29. Use a locale array for fallback
// ---------------------------------------------------------------------

const fallbackCollator = new Intl.Collator(["fr-CA", "fr-FR", "en-US"]);

console.log(fallbackCollator.resolvedOptions().locale);

// ---------------------------------------------------------------------
// 30. Use Intl.Locale
// ---------------------------------------------------------------------

const frenchLocale = new Intl.Locale("fr-FR");

const localeObjectCollator = new Intl.Collator(frenchLocale);

console.log(localeObjectCollator.compare("éclair", "eagle"));

// ---------------------------------------------------------------------
// 31. Inspect resolved options
// ---------------------------------------------------------------------

const configuredCollator = new Intl.Collator("en-US", {
  numeric: true,
  sensitivity: "base",
  ignorePunctuation: true,
});

console.log(configuredCollator.resolvedOptions());

// ---------------------------------------------------------------------
// 32. Check supported locales
// ---------------------------------------------------------------------

const supportedCollatorLocales = Intl.Collator.supportedLocalesOf(["en-US", "de-DE", "fr-FR", "sv-SE"]);

console.log(supportedCollatorLocales);

// ---------------------------------------------------------------------
// 33. Compare strings for equality
// ---------------------------------------------------------------------

const equalityCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

const sameForSorting = equalityCollator.compare("Apple", "apple") === 0;

console.log(sameForSorting);

// ---------------------------------------------------------------------
// 34. Do not use lowercasing as a universal collation strategy
// ---------------------------------------------------------------------

const firstValue = "I";
const secondValue = "ı";

console.log(firstValue.toLowerCase() === secondValue.toLowerCase());

console.log(
  new Intl.Collator("tr-TR", {
    sensitivity: "base",
  }).compare(firstValue, secondValue),
);

// ---------------------------------------------------------------------
// 35. Sort objects by a localized property
// ---------------------------------------------------------------------

interface Person {
  readonly id: number;
  readonly name: string;
}

const people: readonly Person[] = [
  {
    id: 1,
    name: "Émile",
  },
  {
    id: 2,
    name: "Alice",
  },
  {
    id: 3,
    name: "Zoë",
  },
  {
    id: 4,
    name: "Bob",
  },
];

const personCollator = new Intl.Collator("en-US");

const sortedPeople = [...people].sort((a, b) => personCollator.compare(a.name, b.name));

console.log(sortedPeople);

// ---------------------------------------------------------------------
// 36. Sort objects by a localized property with numeric text
// ---------------------------------------------------------------------

interface Product {
  readonly id: number;
  readonly name: string;
}

const products: readonly Product[] = [
  {
    id: 1,
    name: "Product 10",
  },
  {
    id: 2,
    name: "Product 2",
  },
  {
    id: 3,
    name: "Product 1",
  },
];

const productCollator = new Intl.Collator("en-US", {
  numeric: true,
});

const sortedProducts = [...products].sort((a, b) => productCollator.compare(a.name, b.name));

console.log(sortedProducts);

// ---------------------------------------------------------------------
// 37. Sort by a nested property
// ---------------------------------------------------------------------

interface UserProfile {
  readonly profile: {
    readonly displayName: string;
  };
}

const userProfiles: readonly UserProfile[] = [
  {
    profile: {
      displayName: "Charlie",
    },
  },
  {
    profile: {
      displayName: "Alice",
    },
  },
  {
    profile: {
      displayName: "Bob",
    },
  },
];

const profileCollator = new Intl.Collator("en-US");

const sortedProfiles = [...userProfiles].sort((a, b) =>
  profileCollator.compare(a.profile.displayName, b.profile.displayName),
);

console.log(sortedProfiles);

// ---------------------------------------------------------------------
// 38. Sort with a reusable property selector
// ---------------------------------------------------------------------

const sortByString = <T,>(values: readonly T[], selector: (value: T) => string, collator: Intl.Collator): T[] => {
  return [...values].sort((a, b) => collator.compare(selector(a), selector(b)));
};

const reusableSortedPeople = sortByString(people, (person) => person.name, personCollator);

console.log(reusableSortedPeople);

// ---------------------------------------------------------------------
// 39. Keep sorting separate from rendering
// ---------------------------------------------------------------------

interface SortedListProps {
  readonly values: readonly string[];
  readonly locale: SupportedLocale;
}

const SortedList: FC<SortedListProps> = ({ values, locale }): ReactElement => {
  const sortedValues = useMemo(() => {
    const collator = new Intl.Collator(locale);

    return [...values].sort(collator.compare);
  }, [values, locale]);

  return (
    <ul>
      {sortedValues.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------
// 40. Memoize a Collator in React
// ---------------------------------------------------------------------

interface LocalizedCollatorProps {
  readonly locale: SupportedLocale;
}

const LocalizedCollatorExample: FC<LocalizedCollatorProps> = ({ locale }): ReactElement => {
  const collator = useMemo(() => new Intl.Collator(locale), [locale]);

  return <output>{collator.compare("apple", "banana")}</output>;
};

// ---------------------------------------------------------------------
// 41. Memoize sorting in React
// ---------------------------------------------------------------------

interface MemoizedSortProps {
  readonly locale: SupportedLocale;
  readonly values: readonly string[];
}

const MemoizedSortExample: FC<MemoizedSortProps> = ({ locale, values }): ReactElement => {
  const sortedValues = useMemo(() => {
    const collator = new Intl.Collator(locale);

    return [...values].sort(collator.compare);
  }, [locale, values]);

  return (
    <ul>
      {sortedValues.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------
// 42. Keep the source list immutable
// ---------------------------------------------------------------------

const immutableSource = ["Charlie", "Alice", "Bob"];

const immutableSorted = [...immutableSource].sort(new Intl.Collator("en-US").compare);

console.log(immutableSource);

console.log(immutableSorted);

// ---------------------------------------------------------------------
// 43. Sort a readonly collection
// ---------------------------------------------------------------------

const readonlyNames: readonly string[] = ["Charlie", "Alice", "Bob"];

const sortedReadonlyNames = [...readonlyNames].sort(new Intl.Collator("en-US").compare);

console.log(sortedReadonlyNames);

// ---------------------------------------------------------------------
// 44. Use localized sorting for navigation lists
// ---------------------------------------------------------------------

const navigationItems = ["About", "Contact", "Products", "Services"];

const navigationCollator = new Intl.Collator("en-US");

const sortedNavigationItems = [...navigationItems].sort(navigationCollator.compare);

console.log(sortedNavigationItems);

// ---------------------------------------------------------------------
// 45. Sort a directory of names
// ---------------------------------------------------------------------

const directoryNames = ["Åsa", "André", "Zoë", "Émile", "Alice"];

const directoryCollator = new Intl.Collator("fr-FR", {
  sensitivity: "base",
});

console.log([...directoryNames].sort(directoryCollator.compare));

// ---------------------------------------------------------------------
// 46. Sort labels while preserving original objects
// ---------------------------------------------------------------------

interface LabelItem {
  readonly id: string;
  readonly label: string;
}

const labelItems: readonly LabelItem[] = [
  {
    id: "a",
    label: "Banana",
  },
  {
    id: "b",
    label: "Apple",
  },
  {
    id: "c",
    label: "Cherry",
  },
];

const labelCollator = new Intl.Collator("en-US");

const sortedLabelItems = [...labelItems].sort((a, b) => labelCollator.compare(a.label, b.label));

console.log(sortedLabelItems);

// ---------------------------------------------------------------------
// 47. Use a stable secondary key when needed
// ---------------------------------------------------------------------

interface RankedName {
  readonly id: number;
  readonly name: string;
}

const rankedNames: readonly RankedName[] = [
  {
    id: 3,
    name: "Alex",
  },
  {
    id: 1,
    name: "alex",
  },
  {
    id: 2,
    name: "Alex",
  },
];

const rankedCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

const deterministicallySortedNames = [...rankedNames].sort((a, b) => {
  const primaryComparison = rankedCollator.compare(a.name, b.name);

  if (primaryComparison !== 0) {
    return primaryComparison;
  }

  return a.id - b.id;
});

console.log(deterministicallySortedNames);

// ---------------------------------------------------------------------
// 48. Use numeric sorting for version-like labels
// ---------------------------------------------------------------------

const releaseLabels = ["Release 10", "Release 2", "Release 1", "Release 11"];

const releaseCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...releaseLabels].sort(releaseCollator.compare));

// ---------------------------------------------------------------------
// 49. Do not treat numeric collation as version parsing
// ---------------------------------------------------------------------

const semanticVersions = ["2.10.0", "2.2.0", "10.0.0", "2.1.0"];

const versionCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...semanticVersions].sort(versionCollator.compare));

// ---------------------------------------------------------------------
// 50. Sort numbers as numbers
// ---------------------------------------------------------------------

const numericData = [10, 2, 1, 20];

const numericallySortedData = [...numericData].sort((a, b) => a - b);

console.log(numericallySortedData);

// ---------------------------------------------------------------------
// 51. Sort formatted numbers only when necessary
// ---------------------------------------------------------------------

const formattedNumbers = ["10", "2", "1", "20"];

const formattedNumberCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...formattedNumbers].sort(formattedNumberCollator.compare));

// ---------------------------------------------------------------------
// 52. Sort localized display strings carefully
// ---------------------------------------------------------------------

const localizedLabels = ["10 items", "2 items", "1 item"];

const localizedLabelCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...localizedLabels].sort(localizedLabelCollator.compare));

// ---------------------------------------------------------------------
// 53. Sort by data and format separately
// ---------------------------------------------------------------------

interface QuantityItem {
  readonly id: number;
  readonly quantity: number;
}

const quantityItems: readonly QuantityItem[] = [
  {
    id: 1,
    quantity: 10,
  },
  {
    id: 2,
    quantity: 2,
  },
  {
    id: 3,
    quantity: 1,
  },
];

const sortedQuantityItems = [...quantityItems].sort((a, b) => a.quantity - b.quantity);

console.log(sortedQuantityItems);

// ---------------------------------------------------------------------
// 54. Use collation for mixed content
// ---------------------------------------------------------------------

const mixedContent = ["100", "Alice", "10", "Bob", "2"];

const mixedContentCollator = new Intl.Collator("en-US", {
  numeric: true,
});

console.log([...mixedContent].sort(mixedContentCollator.compare));

// ---------------------------------------------------------------------
// 55. Configure a phonebook collation
// ---------------------------------------------------------------------

const germanPhonebookCollator = new Intl.Collator("de-DE-u-co-phonebk");

const germanDirectory = ["Hochberg", "Hönigswald", "Holzman"];

console.log([...germanDirectory].sort(germanPhonebookCollator.compare));

// ---------------------------------------------------------------------
// 56. Configure a dictionary collation
// ---------------------------------------------------------------------

const germanDictionaryCollator = new Intl.Collator("de-DE-u-co-dict");

console.log([...germanDirectory].sort(germanDictionaryCollator.compare));

// ---------------------------------------------------------------------
// 57. Read the locale's collation
// ---------------------------------------------------------------------

const localeWithCollation = new Intl.Locale("de-DE-u-co-phonebk");

console.log(localeWithCollation.collation);

// ---------------------------------------------------------------------
// 58. Use a collation option directly
// ---------------------------------------------------------------------

const directPhonebookCollator = new Intl.Collator("de-DE", {
  collation: "phonebk",
});

console.log([...germanDirectory].sort(directPhonebookCollator.compare));

// ---------------------------------------------------------------------
// 59. Prefer the application's locale
// ---------------------------------------------------------------------

const userLocale: SupportedLocale = "fr-FR";

const userLocaleCollator = new Intl.Collator(userLocale);

const userVisibleNames = ["Émile", "Alice", "André", "Zoë"];

console.log([...userVisibleNames].sort(userLocaleCollator.compare));

// ---------------------------------------------------------------------
// 60. Do not use the runtime default accidentally
// ---------------------------------------------------------------------

const implicitLocaleCollator = new Intl.Collator();

console.log(implicitLocaleCollator.resolvedOptions().locale);

// ---------------------------------------------------------------------
// 61. Use locale fallback intentionally
// ---------------------------------------------------------------------

const preferredLocales = ["fr-CA", "fr-FR", "en-US"] as const;

const fallbackAwareCollator = new Intl.Collator(preferredLocales);

console.log(fallbackAwareCollator.resolvedOptions().locale);

// ---------------------------------------------------------------------
// 62. Keep sorting deterministic within one configuration
// ---------------------------------------------------------------------

const deterministicCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
  numeric: true,
});

const deterministicInput = ["item-10", "Item-2", "item-1", "Item-20"];

const deterministicOutput = [...deterministicInput].sort(deterministicCollator.compare);

console.log(deterministicOutput);

// ---------------------------------------------------------------------
// 63. Understand equivalent values
// ---------------------------------------------------------------------

const equivalentCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

console.log(equivalentCollator.compare("Apple", "apple"));

console.log(equivalentCollator.compare("café", "CAFE"));

// ---------------------------------------------------------------------
// 64. Add an explicit tie-breaker
// ---------------------------------------------------------------------

const tieBreakerCollator = new Intl.Collator("en-US", {
  sensitivity: "base",
});

const tieBreakerValues = ["apple", "Apple", "APPLE"];

const tieBrokenValues = [...tieBreakerValues].sort((a, b) => {
  const comparison = tieBreakerCollator.compare(a, b);

  if (comparison !== 0) {
    return comparison;
  }

  return a < b ? -1 : a > b ? 1 : 0;
});

console.log(tieBrokenValues);

// ---------------------------------------------------------------------
// 65. Build a reusable localized sorter
// ---------------------------------------------------------------------

const createLocalizedSorter = (
  locale: SupportedLocale,
  options: Intl.CollatorOptions = {},
): ((left: string, right: string) => number) => {
  const collator = new Intl.Collator(locale, options);

  return collator.compare;
};

const localizedSorter = createLocalizedSorter("en-US", {
  sensitivity: "base",
  numeric: true,
});

console.log([...versions].sort(localizedSorter));

// ---------------------------------------------------------------------
// 66. Build a reusable object sorter
// ---------------------------------------------------------------------

// IMPORTANT FOR TSX:
// The trailing comma in <T,> prevents TypeScript from interpreting
// the generic parameter as JSX.

const createPropertySorter = <T,>(
  locale: SupportedLocale,
  selector: (value: T) => string,
  options: Intl.CollatorOptions = {},
): ((left: T, right: T) => number) => {
  const collator = new Intl.Collator(locale, options);

  return (left, right) => collator.compare(selector(left), selector(right));
};

const sortPeopleByName = createPropertySorter<Person>("en-US", (person) => person.name, {
  sensitivity: "base",
});

console.log([...people].sort(sortPeopleByName));

// ---------------------------------------------------------------------
// 67. Build a locale-aware list component
// ---------------------------------------------------------------------

interface LocalizedListProps {
  readonly locale: SupportedLocale;
  readonly values: readonly string[];
}

const LocalizedList: FC<LocalizedListProps> = ({ locale, values }): ReactElement => {
  const sortedValues = useMemo(() => {
    const collator = new Intl.Collator(locale, {
      sensitivity: "base",
    });

    return [...values].sort(collator.compare);
  }, [locale, values]);

  return (
    <ul>
      {sortedValues.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------
// 68. Build a numeric localized list
// ---------------------------------------------------------------------

interface NumericLocalizedListProps {
  readonly locale: SupportedLocale;
  readonly values: readonly string[];
}

const NumericLocalizedList: FC<NumericLocalizedListProps> = ({ locale, values }): ReactElement => {
  const sortedValues = useMemo(() => {
    const collator = new Intl.Collator(locale, {
      numeric: true,
      sensitivity: "base",
    });

    return [...values].sort(collator.compare);
  }, [locale, values]);

  return (
    <ol>
      {sortedValues.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </ol>
  );
};

// ---------------------------------------------------------------------
// 69. Build a localized directory component
// ---------------------------------------------------------------------

interface DirectoryProps {
  readonly locale: SupportedLocale;
  readonly people: readonly Person[];
}

const Directory: FC<DirectoryProps> = ({ locale, people }): ReactElement => {
  const sortedPeople = useMemo(() => {
    const collator = new Intl.Collator(locale, {
      sensitivity: "base",
    });

    return [...people].sort((a, b) => collator.compare(a.name, b.name));
  }, [locale, people]);

  return (
    <ul>
      {sortedPeople.map((person) => (
        <li key={person.id}>{person.name}</li>
      ))}
    </ul>
  );
};

// ---------------------------------------------------------------------
// 70. Preserve IDs while changing presentation order
// ---------------------------------------------------------------------

// FIXED:
// The original code attempted to pass Person objects directly to
// Intl.Collator.compare(). The Collator compares strings, so we compare
// a.name and b.name instead.

const frenchPeopleCollator = new Intl.Collator("fr-FR", {
  sensitivity: "base",
});

const sortedPeopleForPresentation = [...people].sort((a, b) => frenchPeopleCollator.compare(a.name, b.name));

console.log(sortedPeopleForPresentation);

// ---------------------------------------------------------------------
// 71. Use one Collator instance correctly
// ---------------------------------------------------------------------

const correctlySortedFrenchPeople = [...people].sort((a, b) => frenchPeopleCollator.compare(a.name, b.name));

console.log(correctlySortedFrenchPeople);

// ---------------------------------------------------------------------
// 72. Build a locale selector
// ---------------------------------------------------------------------

interface LocaleSelectorProps {
  readonly locale: SupportedLocale;
  readonly onChange: (locale: SupportedLocale) => void;
}

const LocaleSelector: FC<LocaleSelectorProps> = ({ locale, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextLocale = event.target.value as SupportedLocale;

    onChange(nextLocale);
  };

  return (
    <label>
      Sort locale{" "}
      <select value={locale} onChange={handleChange}>
        {supportedLocales.map((supportedLocale) => (
          <option key={supportedLocale} value={supportedLocale}>
            {localeLabels[supportedLocale]}
          </option>
        ))}
      </select>
    </label>
  );
};

// ---------------------------------------------------------------------
// 73. Build an integrated sorting example
// ---------------------------------------------------------------------

const LocalizedSortingExample: FC = (): ReactElement => {
  const [locale, setLocale] = useState<SupportedLocale>("en-US");

  const [values] = useState<readonly string[]>(["item-10", "Änne", "item-2", "Alice", "Émile", "item-1", "Bob"]);

  const [numeric, setNumeric] = useState(true);

  const [ignorePunctuation, setIgnorePunctuation] = useState(false);

  const sortedValues = useMemo(() => {
    const collator = new Intl.Collator(locale, {
      numeric,
      ignorePunctuation,
      sensitivity: "base",
    });

    return [...values].sort(collator.compare);
  }, [locale, numeric, ignorePunctuation, values]);

  const handleLocaleChange = (nextLocale: SupportedLocale): void => {
    setLocale(nextLocale);
  };

  const handleNumericChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNumeric(event.target.checked);
  };

  const handlePunctuationChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setIgnorePunctuation(event.target.checked);
  };

  return (
    <main>
      <h2>Localized Sorting</h2>

      <LocaleSelector locale={locale} onChange={handleLocaleChange} />

      <label>
        <input type="checkbox" checked={numeric} onChange={handleNumericChange} /> Numeric collation
      </label>

      <label>
        <input type="checkbox" checked={ignorePunctuation} onChange={handlePunctuationChange} /> Ignore punctuation
      </label>

      <ul>
        {sortedValues.map((value, index) => (
          <li key={`${value}-${index}`}>{value}</li>
        ))}
      </ul>
    </main>
  );
};

// ---------------------------------------------------------------------
// 74. Keep locale configuration with presentation state
// ---------------------------------------------------------------------

interface SortConfiguration {
  readonly locale: SupportedLocale;
  readonly numeric: boolean;
  readonly sensitivity: "base" | "accent" | "case" | "variant";
}

const defaultSortConfiguration: SortConfiguration = {
  locale: "en-US",
  numeric: true,
  sensitivity: "base",
};

console.log(defaultSortConfiguration);

// ---------------------------------------------------------------------
// 75. Keep the domain model locale-independent
// ---------------------------------------------------------------------

interface DirectoryEntry {
  readonly id: string;
  readonly displayName: string;
}

const directoryEntries: readonly DirectoryEntry[] = [
  {
    id: "1",
    displayName: "Alice",
  },
  {
    id: "2",
    displayName: "Émile",
  },
  {
    id: "3",
    displayName: "Bob",
  },
];

console.log(directoryEntries);

// ---------------------------------------------------------------------
// 76. Re-sort when the locale changes
// ---------------------------------------------------------------------

const sortForLocale = (values: readonly string[], locale: SupportedLocale): string[] => {
  const collator = new Intl.Collator(locale);

  return [...values].sort(collator.compare);
};

console.log(sortForLocale(["Zara", "Åsa", "Anna", "Äsa"], "sv-SE"));

console.log(sortForLocale(["Zara", "Åsa", "Anna", "Äsa"], "en-US"));

// ---------------------------------------------------------------------
// 77. Distinguish localized sorting from filtering
// ---------------------------------------------------------------------

const filteringCollator = new Intl.Collator("en-US", {
  usage: "search",
  sensitivity: "base",
});

const filteringComparison = filteringCollator.compare("café", "CAFE");

console.log(filteringComparison);

// ---------------------------------------------------------------------
// 78. Keep sorting at the presentation boundary
// ---------------------------------------------------------------------

const sourceOrder = ["Émile", "Alice", "Bob"];

const presentationOrder = [...sourceOrder].sort(
  new Intl.Collator("fr-FR", {
    sensitivity: "base",
  }).compare,
);

console.log(sourceOrder);
console.log(presentationOrder);

// ---------------------------------------------------------------------
// 79. Export the integrated example
// ---------------------------------------------------------------------

export default LocalizedSortingExample;

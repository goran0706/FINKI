import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// ============================================================================
// 1. Types & Interfaces
// ============================================================================

export type FeatureFlagName = "new-dashboard" | "beta-user-profile" | "promo-banner" | "dark-mode" | "checkout-v2";

export type FeatureVariant = "control" | "variant-a" | "variant-b" | string;

export interface FlagState {
  enabled: boolean;
  variant?: FeatureVariant;
}

export type FeatureFlagValue = boolean | FlagState;
export type FeatureFlags = Record<FeatureFlagName, FeatureFlagValue>;
export type FeatureFlagOverrides = Partial<Record<FeatureFlagName, boolean>>;

interface FeatureFlagContextType {
  flags: Partial<FeatureFlags>;
  overrides: FeatureFlagOverrides;
  isLoaded: boolean;
  isEnabled: (flag: FeatureFlagName) => boolean;
  getVariant: (flag: FeatureFlagName) => FeatureVariant | undefined;
  setOverride: (flag: FeatureFlagName, value: boolean | null) => void;
  resetOverrides: () => void;
}

interface FeatureFlagProviderProps {
  children: ReactNode;
  defaultFlags?: Partial<FeatureFlags>;
  fetchFlags?: () => Promise<Partial<FeatureFlags>>;
  enableDevOverrides?: boolean;
}

// ============================================================================
// 2. Local Storage Helpers
// ============================================================================

const OVERRIDES_STORAGE_KEY = "app_feature_flag_overrides";

const loadSavedOverrides = (): FeatureFlagOverrides => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const item = window.localStorage.getItem(OVERRIDES_STORAGE_KEY);

    if (!item) {
      return {};
    }

    return JSON.parse(item) as FeatureFlagOverrides;
  } catch {
    return {};
  }
};

const saveOverrides = (overrides: FeatureFlagOverrides): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (error) {
    console.error("Failed to save flag overrides to localStorage:", error);
  }
};

// ============================================================================
// 3. Context & Provider
// ============================================================================

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  defaultFlags = {},
  fetchFlags,
  enableDevOverrides = true,
}) => {
  const [flags, setFlags] = useState<Partial<FeatureFlags>>(defaultFlags);
  const [overrides, setOverrides] = useState<FeatureFlagOverrides>({});
  const [isLoaded, setIsLoaded] = useState(!fetchFlags);

  useEffect(() => {
    if (enableDevOverrides) {
      setOverrides(loadSavedOverrides());
    }
  }, [enableDevOverrides]);

  useEffect(() => {
    if (!fetchFlags) {
      return;
    }

    let isMounted = true;

    fetchFlags()
      .then((fetchedFlags) => {
        if (!isMounted) {
          return;
        }

        setFlags((previousFlags) => ({
          ...previousFlags,
          ...fetchedFlags,
        }));

        setIsLoaded(true);
      })
      .catch((error: unknown) => {
        console.error("Failed to load remote feature flags:", error);

        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchFlags]);

  const isEnabled = useCallback(
    (flag: FeatureFlagName): boolean => {
      const overrideValue = overrides[flag];

      if (overrideValue !== undefined) {
        return overrideValue;
      }

      const flagValue = flags[flag];

      if (typeof flagValue === "boolean") {
        return flagValue;
      }

      if (flagValue && typeof flagValue === "object") {
        return Boolean(flagValue.enabled);
      }

      return false;
    },
    [flags, overrides],
  );

  const getVariant = useCallback(
    (flag: FeatureFlagName): FeatureVariant | undefined => {
      const flagValue = flags[flag];

      if (flagValue && typeof flagValue === "object") {
        return flagValue.variant;
      }

      return undefined;
    },
    [flags],
  );

  const setOverride = useCallback((flag: FeatureFlagName, value: boolean | null): void => {
    setOverrides((previousOverrides) => {
      const updatedOverrides = {
        ...previousOverrides,
      };

      if (value === null) {
        delete updatedOverrides[flag];
      } else {
        updatedOverrides[flag] = value;
      }

      saveOverrides(updatedOverrides);

      return updatedOverrides;
    });
  }, []);

  const resetOverrides = useCallback((): void => {
    setOverrides({});
    saveOverrides({});
  }, []);

  const contextValue: FeatureFlagContextType = {
    flags,
    overrides,
    isLoaded,
    isEnabled,
    getVariant,
    setOverride,
    resetOverrides,
  };

  return <FeatureFlagContext.Provider value={contextValue}>{children}</FeatureFlagContext.Provider>;
};

// ============================================================================
// 4. Custom Hooks
// ============================================================================

export const useFeatureFlagsContext = (): FeatureFlagContextType => {
  const context = useContext(FeatureFlagContext);

  if (!context) {
    throw new Error("useFeatureFlagsContext must be used within a FeatureFlagProvider");
  }

  return context;
};

export const useFeatureFlag = (flag: FeatureFlagName): boolean => {
  const { isEnabled } = useFeatureFlagsContext();

  return isEnabled(flag);
};

export const useFeatureVariant = (flag: FeatureFlagName): FeatureVariant | undefined => {
  const { getVariant } = useFeatureFlagsContext();

  return getVariant(flag);
};

// ============================================================================
// 5. Feature Components
// ============================================================================

interface FeatureProps {
  name: FeatureFlagName;
  children: ReactNode;
  fallback?: ReactNode;
  invert?: boolean;
}

export const Feature: React.FC<FeatureProps> = ({ name, children, fallback = null, invert = false }) => {
  const isEnabled = useFeatureFlag(name);
  const showContent = invert ? !isEnabled : isEnabled;

  return <>{showContent ? children : fallback}</>;
};

interface FeatureSwitchProps {
  name: FeatureFlagName;
  children: ReactNode;
  fallback?: ReactNode;
}

interface FeatureCaseProps {
  variant: FeatureVariant;
  children: ReactNode;
}

export const FeatureSwitch: React.FC<FeatureSwitchProps> = ({ name, children, fallback = null }) => {
  const currentVariant = useFeatureVariant(name);
  let match: ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement<FeatureCaseProps>(child) && child.props.variant === currentVariant) {
      match = child.props.children;
    }
  });

  return <>{match ?? fallback}</>;
};

export const FeatureCase: React.FC<FeatureCaseProps> = ({ children }) => {
  return <>{children}</>;
};

// ============================================================================
// 6. QA / DevTools Overlay
// ============================================================================

export const FeatureDevTools: React.FC = () => {
  const { flags, overrides, setOverride, resetOverrides } = useFeatureFlagsContext();

  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const flagKeys = Object.keys(flags) as FeatureFlagName[];

  return (
    <div style={devToolsStyles.container}>
      <button type="button" style={devToolsStyles.toggleBtn} onClick={() => setIsOpen((open) => !open)}>
        ⚙️ Feature Flags ({Object.keys(overrides).length} active overrides)
      </button>

      {isOpen && (
        <div style={devToolsStyles.panel}>
          <h3>QA Flag Overrides</h3>

          {flagKeys.map((flag) => {
            const hasOverride = overrides[flag] !== undefined;
            const flagValue = flags[flag];

            const defaultValue = typeof flagValue === "boolean" ? flagValue : (flagValue?.enabled ?? false);

            const effectiveValue = overrides[flag] ?? defaultValue;

            return (
              <div key={flag} style={devToolsStyles.row}>
                <span>{flag}</span>

                <span>
                  <button
                    type="button"
                    style={effectiveValue ? devToolsStyles.activeBtn : devToolsStyles.inactiveBtn}
                    onClick={() => setOverride(flag, !effectiveValue)}
                  >
                    {effectiveValue ? "ON" : "OFF"}
                  </button>

                  {hasOverride && (
                    <button type="button" style={devToolsStyles.resetBtn} onClick={() => setOverride(flag, null)}>
                      Reset
                    </button>
                  )}
                </span>
              </div>
            );
          })}

          <button type="button" style={devToolsStyles.clearAllBtn} onClick={resetOverrides}>
            Clear All Overrides
          </button>
        </div>
      )}
    </div>
  );
};

const devToolsStyles = {
  container: {
    position: "fixed" as const,
    bottom: 16,
    right: 16,
    zIndex: 9999,
    fontFamily: "sans-serif",
  },
  toggleBtn: {
    padding: "8px 14px",
    background: "#222",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
  },
  panel: {
    position: "absolute" as const,
    bottom: 44,
    right: 0,
    width: 340,
    background: "#1e1e1e",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  activeBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  inactiveBtn: {
    background: "#c62828",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: "bold",
  },
  resetBtn: {
    marginLeft: 6,
    background: "#555",
    color: "#fff",
    border: "none",
    padding: "4px 6px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 11,
  },
  clearAllBtn: {
    marginTop: 12,
    width: "100%",
    padding: "8px",
    background: "#444",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

// ============================================================================
// 7. Demonstration Page
// ============================================================================

const mockFetchFlagsFromAPI = async (): Promise<Partial<FeatureFlags>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        "new-dashboard": true,
        "beta-user-profile": false,
        "promo-banner": true,
        "dark-mode": false,
        "checkout-v2": {
          enabled: true,
          variant: "variant-b",
        },
      });
    }, 600);
  });
};

export default function FeatureFlagsDemo() {
  return (
    <FeatureFlagProvider fetchFlags={mockFetchFlagsFromAPI} enableDevOverrides>
      <AppDashboard />
      <FeatureDevTools />
    </FeatureFlagProvider>
  );
}

function AppDashboard() {
  const isDarkMode = useFeatureFlag("dark-mode");

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: isDarkMode ? "#121212" : "#f5f5f5",
        color: isDarkMode ? "#fff" : "#222",
      }}
    >
      <h1>Production Feature Flags Demonstration</h1>

      <Feature name="promo-banner">
        <div
          style={{
            padding: 16,
            marginBottom: 24,
            background: "#fff3cd",
            color: "#664d03",
            borderRadius: 8,
          }}
        >
          🎉 Promotional Banner: 20% off all subscriptions this week!
        </div>
      </Feature>

      <section>
        <h2>Dashboard Experience</h2>

        <Feature name="new-dashboard" fallback={<p>Standard Dashboard V1 (Legacy)</p>}>
          <p>✨ New Real-time Analytics Dashboard V2</p>
        </Feature>

        <Feature name="new-dashboard" invert fallback={null}>
          <p>⚠️ Notice: You are seeing legacy controls because the "new-dashboard" flag is OFF.</p>
        </Feature>
      </section>

      <section>
        <h2>Beta Features</h2>

        <Feature name="beta-user-profile" fallback={<p>Beta User Profile is currently unavailable.</p>}>
          <button type="button">Access Beta User Profile</button>
        </Feature>
      </section>

      <section>
        <h2>Checkout Experiment</h2>

        <FeatureSwitch name="checkout-v2" fallback={<p>Standard 3-Step Checkout</p>}>
          <FeatureCase variant="variant-a">
            <p>Variant A: Express Single-Page Checkout</p>
          </FeatureCase>

          <FeatureCase variant="variant-b">
            <p>Variant B: One-Click Instant Pay</p>
          </FeatureCase>
        </FeatureSwitch>
      </section>
    </main>
  );
}

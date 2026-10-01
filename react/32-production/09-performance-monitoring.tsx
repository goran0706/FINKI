/**
 * Performance Monitoring
 * =======================
 *
 * Performance monitoring measures real user experience and identifies slow work in
 * rendering, navigation, network requests, and browser tasks. Measurements should
 * capture meaningful user-facing operations and send only the metrics needed for
 * production analysis.
 */

import { Profiler, useEffect, useState, type FC, type ProfilerOnRenderCallback, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Performance measurements
// ---------------------------------------------------------------------

const measure = (name: string, startMark: string, endMark: string): number | null => {
  try {
    performance.measure(name, startMark, endMark);

    const entry = performance.getEntriesByName(name, "measure").at(-1);

    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(name);

    return entry?.duration ?? null;
  } catch {
    return null;
  }
};

const startMeasure = (name: string): void => {
  performance.mark(`${name}:start`);
};

const endMeasure = (name: string): number | null => {
  const endMark = `${name}:end`;

  performance.mark(endMark);

  return measure(name, `${name}:start`, endMark);
};

// ---------------------------------------------------------------------
// 2. React render performance
// ---------------------------------------------------------------------

const handleRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
  reportPerformance({
    name: "react-render",
    duration: actualDuration,
    context: {
      component: id,
      phase,
      baseDuration,
    },
  });
};

const PerformanceBoundary: FC<{
  readonly id: string;
  readonly children: ReactNode;
}> = ({ id, children }) => (
  <Profiler id={id} onRender={handleRender}>
    {children}{" "}
  </Profiler>
);

// ---------------------------------------------------------------------
// 3. Network performance
// ---------------------------------------------------------------------

const fetchWithMeasurement = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const start = performance.now();

  try {
    const response = await fetch(input, init);

    reportPerformance({
      name: "network-request",
      duration: performance.now() - start,
      context: {
        status: response.status,
        method: init?.method ?? "GET",
      },
    });

    return response;
  } catch (error) {
    reportPerformance({
      name: "network-request-failed",
      duration: performance.now() - start,
      context: {
        method: init?.method ?? "GET",
      },
    });

    throw error;
  }
};

// ---------------------------------------------------------------------
// 4. User-facing operation
// ---------------------------------------------------------------------

const Dashboard: FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startMeasure("dashboard-load");

    void fetchWithMeasurement("/api/dashboard")
      .then(() => {
        const duration = endMeasure("dashboard-load");

        if (duration !== null) {
          reportPerformance({
            name: "dashboard-load",
            duration,
          });
        }

        setReady(true);
      })
      .catch(() => {
        endMeasure("dashboard-load");
      });
  }, []);

  return <p>{ready ? "Dashboard ready" : "Loading..."}</p>;
};

// ---------------------------------------------------------------------
// 5. Browser performance entries
// ---------------------------------------------------------------------

const observeLongTasks = (): (() => void) | undefined => {
  if (typeof PerformanceObserver === "undefined") {
    return undefined;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        reportPerformance({
          name: "long-task",
          duration: entry.duration,
        });
      }
    });

    observer.observe({
      type: "longtask",
      buffered: true,
    });

    return () => observer.disconnect();
  } catch {
    return undefined;
  }
};

// ---------------------------------------------------------------------
// 6. Reporting
// ---------------------------------------------------------------------

interface PerformanceReport {
  readonly name: string;
  readonly duration: number;
  readonly context?: Readonly<Record<string, unknown>>;
}

const reportPerformance = ({ name, duration, context }: PerformanceReport): void => {
  void fetch("/api/performance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      duration,
      context,
      timestamp: new Date().toISOString(),
    }),
    keepalive: true,
  }).catch(() => undefined);
};

// ---------------------------------------------------------------------
// 7. Application
// ---------------------------------------------------------------------

const App: FC = () => {
  useEffect(() => observeLongTasks(), []);

  return (
    <PerformanceBoundary id="dashboard">
      <Dashboard />
    </PerformanceBoundary>
  );
};

export default App;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Measure user-facing operations rather than arbitrary code execution.
// performance.mark() and performance.measure() provide precise custom timings.
// React Profiler measures component rendering work and distinguishes render phases.
// Network timing should include both successful and failed requests.
// PerformanceObserver can capture browser performance entries such as long tasks.
// Send metrics asynchronously and keep monitoring failures from affecting the application.
// Analyze distributions such as p50, p75, p95, and p99 rather than relying only on averages.

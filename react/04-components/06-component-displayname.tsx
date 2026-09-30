/**
 * Display Name
 * ============
 *
 * In React development, the `displayName` string property labels components within the React DevTools
 * element inspection tree. While named function declarations infer names automatically, assigning explicit
 * `displayName` values is essential for advanced architecture patterns.
 *
 * Explicit `displayName` properties prevent anonymous tree clutter in production build minification,
 * clarify dynamic sub-components in compound architectures, and enable legible debugging wrappers for
 * Higher-Order Components (HOCs) via standard composite naming (`HOCName(WrappedName)`).
 */

import React, { useEffect, useState } from "react";

export interface BasicProfileProps {
  readonly title: string;
}

export interface AdvancedCardProps {
  readonly heading: string;
  readonly content: string;
}

export const AnonymousRawComponent: React.FC<BasicProfileProps> = (props) => {
  const { title } = props;

  return (
    <div>
      <h4>Direct Display Name Example: {title}</h4>
    </div>
  );
};

AnonymousRawComponent.displayName = "ExplicitlyRenamedProfileComponent";

export function withFeatureAudit<P extends object>(TargetComponent: React.ComponentType<P>) {
  const AuditWrapper: React.FC<P> = (props) => {
    useEffect(() => {
      console.log("[Audit Wrapper Active]");
    }, []);

    return <TargetComponent {...props} />;
  };

  const innerName = TargetComponent.displayName || TargetComponent.name || "Component";
  AuditWrapper.displayName = `WithFeatureAudit(${innerName})`;

  return AuditWrapper;
}

export const CardComponent: React.FC<AdvancedCardProps> = (props) => {
  const { heading, content } = props;

  return (
    <div>
      <h5>{heading}</h5>
      <p>{content}</p>
    </div>
  );
};

export const AuditedCardComponent = withFeatureAudit(CardComponent);

export const DisplayNameComprehensiveDemoContainer: React.FC = () => {
  const [activeTitle] = useState<string>("System Profile Inspector");

  return (
    <div>
      <h1>Display Name Comprehensive Architecture Demonstration</h1>
      <p>Inspect React DevTools to observe direct overrides and HOC wrapper naming patterns.</p>

      <AnonymousRawComponent title={activeTitle} />
      <AuditedCardComponent heading="HOC Wrapped Card" content="Inspecting dynamic wrapper display names." />
    </div>
  );
};

export default DisplayNameComprehensiveDemoContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Direct Component Assignment: `Component.displayName` provides explicit control over DevTools labels, overriding production minification names.
// - HOC Wrapper Preservation: Higher-order components use composite naming to maintain component hierarchy visibility during debugging.
// - Standard Convention Pattern: Formatting wrapper labels as `Wrapper(Component)` ensures immediate structural legibility in DevTools trees.
// - Structural Tree Clarity: Prevents anonymous component pollution in dynamic factory patterns and higher-order decorators.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, following established layout rules.

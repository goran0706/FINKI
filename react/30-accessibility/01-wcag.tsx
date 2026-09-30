/**
 * WCAG
 * ====
 *
 * The Web Content Accessibility Guidelines (WCAG) provide testable requirements for making
 * web content and applications more accessible to people with disabilities. WCAG 2.2 organizes
 * accessibility requirements around four principles: Perceivable, Operable, Understandable,
 * and Robust (POUR).
 *
 * WCAG is organized into principles, guidelines, and testable success criteria. Success criteria
 * are assigned conformance levels of A, AA, or AAA. Accessibility is broader than any single
 * technique or automated test, so accessible implementation requires appropriate technical
 * practices, functional testing, and human evaluation.
 */

// ---------------------------------------------------------------------
// 1. What WCAG is
// ---------------------------------------------------------------------

// WCAG stands for Web Content Accessibility Guidelines.
//
// WCAG provides requirements for making web content more accessible to
// people with disabilities.
//
// It applies to websites, web applications, and other web content.
//
// WCAG is developed by the World Wide Web Consortium (W3C) through the
// Web Accessibility Initiative (WAI).

export const wcag = {
  name: "Web Content Accessibility Guidelines",
  version: "2.2",
  organization: "W3C",
} as const;

// ---------------------------------------------------------------------
// 2. Accessibility and disability
// ---------------------------------------------------------------------

// Accessibility concerns whether people with different disabilities can
// perceive, operate, understand, and interact with digital content.
//
// Disabilities can affect:
//
// - vision
// - hearing
// - movement
// - speech
// - cognition
// - learning
//
// A person can also have more than one disability or use multiple forms
// of assistive technology.

// ---------------------------------------------------------------------
// 3. Accessibility is not a single feature
// ---------------------------------------------------------------------

export const accessibilityAreas = [
  "Content",
  "Structure",
  "Keyboard interaction",
  "Focus behavior",
  "Forms",
  "Names and labels",
  "Color and contrast",
  "Dynamic updates",
  "Multimedia",
  "Assistive technology support",
] as const;

// Accessibility is an interaction between content, user agents, and
// assistive technologies.
//
// A visually attractive interface can still be inaccessible if its
// structure, interaction model, or information is unavailable to users
// who interact differently.

// ---------------------------------------------------------------------
// 4. The POUR principles
// ---------------------------------------------------------------------

export type WcagPrinciple = "Perceivable" | "Operable" | "Understandable" | "Robust";

export const wcagPrinciples: readonly WcagPrinciple[] = ["Perceivable", "Operable", "Understandable", "Robust"];

// The four principles form the foundation of WCAG.
//
// Perceivable:
// Users must be able to perceive the information and interface.
//
// Operable:
// Users must be able to operate the interface.
//
// Understandable:
// Users must be able to understand the information and interaction.
//
// Robust:
// Content should work reliably with user agents and assistive
// technologies.

// ---------------------------------------------------------------------
// 5. Principle 1: Perceivable
// ---------------------------------------------------------------------

export const perceivableExamples = [
  "Text alternatives for non-text content",
  "Captions for prerecorded video",
  "Content that can be presented in different ways",
  "Sufficient text and non-text contrast",
] as const;

// Perceivable content provides information in forms that users can
// access through different senses or presentation modes.

// ---------------------------------------------------------------------
// 6. Principle 2: Operable
// ---------------------------------------------------------------------

export const operableExamples = [
  "Keyboard accessibility",
  "Visible focus",
  "Enough time to use content",
  "Navigation mechanisms",
  "Pointer and motion interaction considerations",
] as const;

// An interface is not operable if a user cannot perform its actions
// through the input methods available to them.

// ---------------------------------------------------------------------
// 7. Principle 3: Understandable
// ---------------------------------------------------------------------

export const understandableExamples = [
  "Readable content",
  "Predictable interaction",
  "Clear form instructions",
  "Useful error identification",
  "Error prevention for applicable situations",
] as const;

// Understandability includes both the information presented to users and
// the behavior of the interface.

// ---------------------------------------------------------------------
// 8. Principle 4: Robust
// ---------------------------------------------------------------------

export const robustExamples = [
  "Programmatically determinable names",
  "Compatible semantic structure",
  "Correct relationships between controls and content",
  "Interoperability with assistive technologies",
] as const;

// Robustness is about whether content can continue to be interpreted
// reliably as browsers and assistive technologies process it.

// ---------------------------------------------------------------------
// 9. WCAG principles, guidelines, and success criteria
// ---------------------------------------------------------------------

export type WcagRequirementType = "Principle" | "Guideline" | "Success Criterion";

export interface WcagRequirement {
  readonly type: WcagRequirementType;
  readonly description: string;
}

export const wcagRequirementHierarchy: readonly WcagRequirement[] = [
  {
    type: "Principle",
    description: "A high-level accessibility foundation.",
  },
  {
    type: "Guideline",
    description: "A goal that organizes related accessibility requirements.",
  },
  {
    type: "Success Criterion",
    description: "A testable requirement used for conformance.",
  },
];

// Principles provide the highest-level structure.
//
// Guidelines describe accessibility goals.
//
// Success criteria provide testable requirements.

// ---------------------------------------------------------------------
// 10. Success criteria are testable
// ---------------------------------------------------------------------

// WCAG success criteria are written so that conformance can be evaluated.
//
// Evaluation can involve:
//
// - automated testing
// - manual inspection
// - keyboard testing
// - assistive technology testing
// - functional testing
// - human judgment

export const successCriterionTesting = {
  automatedTesting: true,
  humanEvaluation: true,
  functionalTesting: true,
} as const;

// Automated testing can identify many common problems, but it cannot
// establish every aspect of accessibility by itself.

// ---------------------------------------------------------------------
// 11. WCAG conformance levels
// ---------------------------------------------------------------------

export type WcagConformanceLevel = "A" | "AA" | "AAA";

export const wcagConformanceLevels: readonly WcagConformanceLevel[] = ["A", "AA", "AAA"];

// Level A is the minimum conformance level.
//
// Level AA includes all Level A and Level AA success criteria.
//
// Level AAA includes all Level A, AA, and AAA success criteria.

// ---------------------------------------------------------------------
// 12. Level A
// ---------------------------------------------------------------------

export const levelA = {
  name: "Level A",
  requirement: "All applicable Level A success criteria are satisfied.",
} as const;

// Level A represents the minimum WCAG conformance level.
//
// Conforming at Level A does not mean that every accessibility issue has
// been addressed.

// ---------------------------------------------------------------------
// 13. Level AA
// ---------------------------------------------------------------------

export const levelAA = {
  name: "Level AA",
  requirement: "All applicable Level A and Level AA success criteria are satisfied.",
} as const;

// Level AA includes Level A requirements.
//
// A Level AA claim therefore cannot omit applicable Level A requirements.

// ---------------------------------------------------------------------
// 14. Level AAA
// ---------------------------------------------------------------------

export const levelAAA = {
  name: "Level AAA",
  requirement: "All applicable Level A, AA, and AAA success criteria are satisfied.",
} as const;

// Level AAA is the highest WCAG conformance level.
//
// W3C does not recommend requiring Level AAA conformance for entire sites
// as a general policy because some Level AAA success criteria cannot
// reasonably be satisfied for all types of content.

// ---------------------------------------------------------------------
// 15. Conformance is about the complete page
// ---------------------------------------------------------------------

export interface ConformanceScope {
  readonly fullPageIncluded: boolean;
  readonly applicableContentIncluded: boolean;
  readonly conformingAlternativeProvidedWhenRequired: boolean;
}

export const conformanceScope: ConformanceScope = {
  fullPageIncluded: true,
  applicableContentIncluded: true,
  conformingAlternativeProvidedWhenRequired: true,
};

// WCAG conformance is evaluated against the complete page rather than
// only a convenient subset of its interface.

// ---------------------------------------------------------------------
// 16. WCAG 2.2
// ---------------------------------------------------------------------

export const wcag22 = {
  publishedAsRecommendation: true,
  additionalSuccessCriteria: 9,
  parsingCriterionRemoved: true,
} as const;

// WCAG 2.2 adds nine success criteria compared with WCAG 2.1.
//
// WCAG 2.2 also makes 4.1.1 Parsing obsolete and removes it from the
// requirements of WCAG 2.2.

// ---------------------------------------------------------------------
// 17. New WCAG 2.2 success criteria
// ---------------------------------------------------------------------

export const wcag22NewSuccessCriteria = [
  "2.4.11 Focus Not Obscured (Minimum)",
  "2.4.12 Focus Not Obscured (Enhanced)",
  "2.4.13 Focus Appearance",
  "2.5.7 Dragging Movements",
  "2.5.8 Target Size (Minimum)",
  "3.2.6 Consistent Help",
  "3.3.7 Redundant Entry",
  "3.3.8 Accessible Authentication (Minimum)",
  "3.3.9 Accessible Authentication (Enhanced)",
] as const;

// These criteria expand WCAG coverage in areas including focus visibility,
// dragging interactions, target sizes, help mechanisms, repeated data
// entry, and authentication.

// ---------------------------------------------------------------------
// 18. WCAG is not a design system
// ---------------------------------------------------------------------

// WCAG does not prescribe:
//
// - a particular visual design
// - a particular JavaScript framework
// - a particular component library
// - a specific CSS methodology
// - a specific testing library
//
// Multiple implementations can satisfy the same accessibility requirement.

// ---------------------------------------------------------------------
// 19. WCAG does not require ARIA everywhere
// ---------------------------------------------------------------------

export const semanticFirstPrinciple = {
  nativeHTML: "Prefer native HTML semantics when they provide the required behavior.",
  aria: "Use ARIA when appropriate to communicate semantics that native HTML does not provide.",
} as const;

// ARIA supplements HTML semantics.
//
// It does not automatically make a custom component accessible.

// ---------------------------------------------------------------------
// 20. Native HTML is an accessibility foundation
// ---------------------------------------------------------------------

export const nativeHtmlExamples = {
  button: "button",
  link: "a",
  heading: "h1-h6",
  formLabel: "label",
  list: "ul / ol / li",
  mainContent: "main",
  navigation: "nav",
} as const;

// Native HTML elements provide semantics and browser behavior that
// assistive technologies can often use without additional scripting.

// ---------------------------------------------------------------------
// 21. React does not remove WCAG responsibilities
// ---------------------------------------------------------------------

export interface ReactAccessibilityResponsibilities {
  readonly semanticMarkup: boolean;
  readonly keyboardInteraction: boolean;
  readonly accessibleNames: boolean;
  readonly focusManagement: boolean;
  readonly dynamicContent: boolean;
  readonly formAccessibility: boolean;
}

export const reactAccessibilityResponsibilities: ReactAccessibilityResponsibilities = {
  semanticMarkup: true,
  keyboardInteraction: true,
  accessibleNames: true,
  focusManagement: true,
  dynamicContent: true,
  formAccessibility: true,
};

// React generates browser-facing UI.
//
// The resulting DOM still needs to expose appropriate semantics and
// interaction behavior.

// ---------------------------------------------------------------------
// 22. Semantic HTML example
// ---------------------------------------------------------------------

export const SemanticArticle = (): ReactElement => {
  return (
    <article>
      <header>
        <h2>Example article</h2>
        <p>Published on September 29, 2026.</p>
      </header>

      <p>Semantic HTML communicates the structure of the content to browsers and assistive technologies.</p>
    </article>
  );
};

// The semantic elements communicate relationships that generic div
// elements do not automatically provide.

// ---------------------------------------------------------------------
// 23. Accessible names
// ---------------------------------------------------------------------

export interface AccessibleNameExample {
  readonly element: string;
  readonly accessibleName: string;
}

export const accessibleNameExamples: readonly AccessibleNameExample[] = [
  {
    element: "button",
    accessibleName: "Save",
  },
  {
    element: "input",
    accessibleName: "Email address",
  },
  {
    element: "link",
    accessibleName: "View profile",
  },
];

// An accessible name identifies the purpose of a user interface element.
//
// The visible text, associated label, or another supported naming
// mechanism can contribute to an accessible name.

// ---------------------------------------------------------------------
// 24. Text alternatives
// ---------------------------------------------------------------------

export interface ImageAccessibility {
  readonly purpose: "informative" | "decorative";
  readonly alternativeText: string;
}

export const imageAccessibilityExamples: readonly ImageAccessibility[] = [
  {
    purpose: "informative",
    alternativeText: "Example product shown from the front",
  },
  {
    purpose: "decorative",
    alternativeText: "",
  },
];

// Informative images need an appropriate text alternative.
//
// Decorative images can use an empty alt attribute when they should not
// contribute information to the accessibility tree.

// ---------------------------------------------------------------------
// 25. Keyboard accessibility
// ---------------------------------------------------------------------

export interface KeyboardRequirement {
  readonly interactiveElement: string;
  readonly keyboardAccessible: boolean;
}

export const keyboardRequirements: readonly KeyboardRequirement[] = [
  {
    interactiveElement: "Button",
    keyboardAccessible: true,
  },
  {
    interactiveElement: "Link",
    keyboardAccessible: true,
  },
  {
    interactiveElement: "Custom interactive control",
    keyboardAccessible: true,
  },
];

// If an interaction can be performed with a pointer but not through the
// keyboard, users who rely on keyboard interaction can be blocked.

// ---------------------------------------------------------------------
// 26. Focus
// ---------------------------------------------------------------------

export interface FocusRequirement {
  readonly focusCanBeReached: boolean;
  readonly focusIsVisible: boolean;
  readonly focusIsNotUnexpectedlyObscured: boolean;
}

export const focusRequirements: FocusRequirement = {
  focusCanBeReached: true,
  focusIsVisible: true,
  focusIsNotUnexpectedlyObscured: true,
};

// Keyboard users need to know where focus is and need to be able to reach
// the controls they need.

// ---------------------------------------------------------------------
// 27. Color is not the only information channel
// ---------------------------------------------------------------------

export interface ColorInformation {
  readonly colorUsed: boolean;
  readonly nonColorIndicatorProvided: boolean;
}

export const colorInformation: ColorInformation = {
  colorUsed: true,
  nonColorIndicatorProvided: true,
};

// Information should not depend exclusively on color.
//
// For example, an error state can use text, an icon, or another
// distinguishable indicator in addition to color.

// ---------------------------------------------------------------------
// 28. Contrast
// ---------------------------------------------------------------------

export interface ContrastRequirement {
  readonly textContrastConsidered: boolean;
  readonly nonTextContrastConsidered: boolean;
  readonly stateChangesConsidered: boolean;
}

export const contrastRequirement: ContrastRequirement = {
  textContrastConsidered: true,
  nonTextContrastConsidered: true,
  stateChangesConsidered: true,
};

// Contrast requirements differ depending on the type of content and the
// WCAG success criterion being evaluated.
//
// Contrast should therefore be evaluated against the applicable WCAG
// criterion rather than using one universal ratio for everything.

// ---------------------------------------------------------------------
// 29. Motion and animation
// ---------------------------------------------------------------------

export interface MotionAccessibility {
  readonly animationNecessaryForMeaning: boolean;
  readonly motionCanBeReducedWhenRequired: boolean;
}

export const motionAccessibility: MotionAccessibility = {
  animationNecessaryForMeaning: false,
  motionCanBeReducedWhenRequired: true,
};

// Some users are sensitive to motion or animation.
//
// Interfaces should respect applicable reduced-motion requirements and
// avoid unnecessary motion.

// ---------------------------------------------------------------------
// 30. Forms
// ---------------------------------------------------------------------

export interface AccessibleFormField {
  readonly label: string;
  readonly inputId: string;
  readonly describedBy: string | undefined;
  readonly required: boolean;
}

export const accessibleFormField: AccessibleFormField = {
  label: "Email address",
  inputId: "email",
  describedBy: "email-help",
  required: true,
};

// A form control should have a programmatically associated label.
//
// Additional instructions or error information should also be associated
// with the control when applicable.

// ---------------------------------------------------------------------
// 31. Form example
// ---------------------------------------------------------------------

export const AccessibleForm = (): ReactElement => {
  return (
    <form>
      <div>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" aria-describedby="email-help" autoComplete="email" />
        <p id="email-help">Enter the address associated with your account.</p>
      </div>

      <button type="submit">Continue</button>
    </form>
  );
};

// The label identifies the control.
//
// The description provides additional instructions without replacing the
// label.

// ---------------------------------------------------------------------
// 32. Error messages
// ---------------------------------------------------------------------

export interface FormError {
  readonly field: string;
  readonly message: string;
}

export const formError: FormError = {
  field: "email",
  message: "Enter a valid email address.",
};

// Error information should identify the problem and, where appropriate,
// help the user understand how to correct it.

// ---------------------------------------------------------------------
// 33. Predictable behavior
// ---------------------------------------------------------------------

export interface PredictableInteraction {
  readonly behaviorConsistent: boolean;
  readonly unexpectedContextChangesAvoided: boolean;
}

export const predictableInteraction: PredictableInteraction = {
  behaviorConsistent: true,
  unexpectedContextChangesAvoided: true,
};

// Components should not unexpectedly change context merely because a user
// interacts with them in a way they could reasonably expect to be safe.

// ---------------------------------------------------------------------
// 34. Headings and document structure
// ---------------------------------------------------------------------

export const headingStructure = ["h1: Page or primary content heading", "h2: Major section", "h3: Subsection"] as const;

// Heading levels communicate document structure.
//
// Visual size alone does not provide equivalent structural semantics.

// ---------------------------------------------------------------------
// 35. Page landmarks
// ---------------------------------------------------------------------

export const landmarkElements = ["header", "nav", "main", "aside", "footer"] as const;

// Landmarks can help assistive technology users understand and navigate
// major regions of a page.

// ---------------------------------------------------------------------
// 36. Dynamic content
// ---------------------------------------------------------------------

export interface DynamicContentAccessibility {
  readonly updateHasAccessibleCommunication: boolean;
  readonly focusMovedOnlyWhenNecessary: boolean;
  readonly importantStatusIsProgrammaticallyAvailable: boolean;
}

export const dynamicContentAccessibility: DynamicContentAccessibility = {
  updateHasAccessibleCommunication: true,
  focusMovedOnlyWhenNecessary: true,
  importantStatusIsProgrammaticallyAvailable: true,
};

// Dynamic interfaces need deliberate accessibility behavior.
//
// Updating the DOM visually does not automatically mean that every user
// will understand that something changed.

// ---------------------------------------------------------------------
// 37. Accessible status message
// ---------------------------------------------------------------------

export interface StatusMessageProps {
  readonly message: string;
}

export const StatusMessage = ({ message }: StatusMessageProps): ReactElement => {
  return <p role="status">{message}</p>;
};

// A status message can communicate non-critical updates without requiring
// focus to move to the message.

// ---------------------------------------------------------------------
// 38. Authentication accessibility
// ---------------------------------------------------------------------

export interface AccessibleAuthentication {
  readonly passwordManagerFriendly: boolean;
  readonly alternativeAuthenticationMethodsConsidered: boolean;
  readonly unnecessaryCognitiveTestAvoided: boolean;
}

export const accessibleAuthentication: AccessibleAuthentication = {
  passwordManagerFriendly: true,
  alternativeAuthenticationMethodsConsidered: true,
  unnecessaryCognitiveTestAvoided: true,
};

// WCAG 2.2 includes success criteria specifically addressing accessible
// authentication.
//
// Authentication flows should not unnecessarily require users to solve
// cognitive challenges that create accessibility barriers.

// ---------------------------------------------------------------------
// 39. Redundant entry
// ---------------------------------------------------------------------

export interface RedundantEntry {
  readonly previouslyProvidedInformationReused: boolean;
  readonly userCanConfirmOrModifyWhenAppropriate: boolean;
}

export const redundantEntry: RedundantEntry = {
  previouslyProvidedInformationReused: true,
  userCanConfirmOrModifyWhenAppropriate: true,
};

// WCAG 2.2 addresses unnecessary repeated entry of information that has
// already been supplied within the same process.

// ---------------------------------------------------------------------
// 40. Target size
// ---------------------------------------------------------------------

export interface TargetSize {
  readonly pointerTargetAdequatelySized: boolean;
  readonly exceptionsConsidered: boolean;
}

export const targetSize: TargetSize = {
  pointerTargetAdequatelySized: true,
  exceptionsConsidered: true,
};

// WCAG 2.2 includes Target Size (Minimum), with defined exceptions.
//
// The requirement should be evaluated against the actual WCAG criterion,
// not an arbitrary universal pixel rule.

// ---------------------------------------------------------------------
// 41. Dragging alternatives
// ---------------------------------------------------------------------

export interface DraggingInteraction {
  readonly draggingRequired: boolean;
  readonly alternativeInputProvided: boolean;
}

export const draggingInteraction: DraggingInteraction = {
  draggingRequired: false,
  alternativeInputProvided: true,
};

// WCAG 2.2 addresses interactions that require dragging movements.
//
// Where applicable, an equivalent non-dragging operation should be
// available.

// ---------------------------------------------------------------------
// 42. Consistent help
// ---------------------------------------------------------------------

export interface ConsistentHelp {
  readonly helpMechanismExists: boolean;
  readonly locationConsistent: boolean;
}

export const consistentHelp: ConsistentHelp = {
  helpMechanismExists: true,
  locationConsistent: true,
};

// WCAG 2.2 adds requirements concerning the consistency of certain help
// mechanisms when they are provided across pages in a set.

// ---------------------------------------------------------------------
// 43. Accessibility is more than visual appearance
// ---------------------------------------------------------------------

export const accessibilityDimensions = [
  "Visual presentation",
  "Programmatic semantics",
  "Keyboard interaction",
  "Pointer interaction",
  "Focus behavior",
  "Screen reader output",
  "Cognitive load",
  "Content structure",
] as const;

// A page can look accessible while its programmatic structure or keyboard
// interaction remains inaccessible.

// ---------------------------------------------------------------------
// 44. Assistive technology
// ---------------------------------------------------------------------

export const assistiveTechnologyExamples = [
  "Screen readers",
  "Screen magnification software",
  "Speech input software",
  "Alternative keyboards",
  "Switch devices",
] as const;

// Accessibility should be considered from the perspective of how users
// actually interact with the interface, not only how the source code looks.

// ---------------------------------------------------------------------
// 45. Automated accessibility testing
// ---------------------------------------------------------------------

export interface AutomatedAccessibilityTesting {
  readonly useful: boolean;
  readonly complete: boolean;
  readonly humanEvaluationStillNeeded: boolean;
}

export const automatedAccessibilityTesting: AutomatedAccessibilityTesting = {
  useful: true,
  complete: false,
  humanEvaluationStillNeeded: true,
};

// Automated tools can detect many structural and rule-based issues.
//
// They cannot determine every question about meaning, usability,
// interaction, or whether an accessible implementation actually serves
// the intended task.

// ---------------------------------------------------------------------
// 46. Manual keyboard testing
// ---------------------------------------------------------------------

export const keyboardTestSteps = [
  "Reach every interactive control.",
  "Move through controls in a logical order.",
  "Identify the current focus.",
  "Activate controls without a pointer.",
  "Open and close interactive overlays.",
  "Verify that focus does not become trapped unexpectedly.",
] as const;

// Keyboard testing exposes interaction problems that static source
// inspection may not reveal.

// ---------------------------------------------------------------------
// 47. Screen reader testing
// ---------------------------------------------------------------------

export const screenReaderTestAreas = [
  "Page title",
  "Headings",
  "Landmarks",
  "Accessible names",
  "Form labels",
  "Error messages",
  "Dynamic status messages",
  "Dialog names",
] as const;

// Screen reader testing can reveal problems in the programmatic structure
// and communication of an interface.

// ---------------------------------------------------------------------
// 48. Accessibility testing is contextual
// ---------------------------------------------------------------------

export interface AccessibilityTestingContext {
  readonly automatedTests: boolean;
  readonly manualTests: boolean;
  readonly assistiveTechnologyTests: boolean;
  readonly UserTesting: boolean;
}

export const accessibilityTestingContext: AccessibilityTestingContext = {
  automatedTests: true,
  manualTests: true,
  assistiveTechnologyTests: true,
  UserTesting: true,
};

// Different testing methods reveal different classes of accessibility
// problems.
//
// Testing should reflect the interface and the users who need to use it.

// ---------------------------------------------------------------------
// 49. Conformance versus usability
// ---------------------------------------------------------------------

export interface ConformanceAndUsability {
  readonly conformanceTesting: boolean;
  readonly usabilityTesting: boolean;
}

export const conformanceAndUsability: ConformanceAndUsability = {
  conformanceTesting: true,
  usabilityTesting: true,
};

// WCAG conformance testing determines whether applicable requirements are
// satisfied.
//
// Usability testing can provide additional information about how well
// people can actually use the interface.

// ---------------------------------------------------------------------
// 50. Accessibility testing with users
// ---------------------------------------------------------------------

export interface UserTestingWithDisabilities {
  readonly disabledUsersIncluded: boolean;
  readonly realTasksUsed: boolean;
  readonly FindingsUsedForImprovement: boolean;
}

export const userTestingWithDisabilities: UserTestingWithDisabilities = {
  disabledUsersIncluded: true,
  realTasksUsed: true,
  FindingsUsedForImprovement: true,
};

// Testing with people with disabilities can reveal practical interaction
// problems that automated or developer-only testing may miss.

// ---------------------------------------------------------------------
// 51. Accessibility is an engineering concern
// ---------------------------------------------------------------------

export const accessibilityEngineeringAreas = [
  "Requirements",
  "Component design",
  "Implementation",
  "Content",
  "Testing",
  "Code review",
  "Regression prevention",
] as const;

// Accessibility is more reliable when it is considered throughout the
// development lifecycle rather than added only immediately before release.

// ---------------------------------------------------------------------
// 52. Accessible component design
// ---------------------------------------------------------------------

export interface AccessibleComponentContract {
  readonly accessibleNameDefined: boolean;
  readonly keyboardBehaviorDefined: boolean;
  readonly focusBehaviorDefined: boolean;
  readonly stateCommunicationDefined: boolean;
}

export const accessibleComponentContract: AccessibleComponentContract = {
  accessibleNameDefined: true,
  keyboardBehaviorDefined: true,
  focusBehaviorDefined: true,
  stateCommunicationDefined: true,
};

// A reusable component should define its accessibility behavior as part of
// its component contract.

// ---------------------------------------------------------------------
// 53. Example accessible button
// ---------------------------------------------------------------------

export interface ActionButtonProps {
  readonly label: string;
  readonly onActivate: () => void;
}

export const ActionButton = ({ label, onActivate }: ActionButtonProps): ReactElement => {
  return (
    <button type="button" onClick={onActivate}>
      {label}
    </button>
  );
};

// A native button already provides appropriate keyboard and activation
// behavior for ordinary button interactions.
//
// A custom div-based button would require substantially more work to
// reproduce native semantics and behavior correctly.

// ---------------------------------------------------------------------
// 54. Avoid replacing native controls unnecessarily
// ---------------------------------------------------------------------

export const nativeControlGuidance = [
  "Use button for actions.",
  "Use a for navigation.",
  "Use input for text entry.",
  "Use select for native selection.",
  "Use label for form control labels.",
] as const;

// Native controls should generally be preferred when their built-in
// semantics and behavior match the required interaction.

// ---------------------------------------------------------------------
// 55. Accessible links and buttons are different
// ---------------------------------------------------------------------

export interface LinkVsButton {
  readonly linkPurpose: string;
  readonly buttonPurpose: string;
}

export const linkVsButton: LinkVsButton = {
  linkPurpose: "Navigate to another resource or location.",
  buttonPurpose: "Perform an action.",
};

// Choosing the correct native element communicates the intended interaction
// and provides appropriate browser behavior.

// ---------------------------------------------------------------------
// 56. Accessibility and progressive enhancement
// ---------------------------------------------------------------------

export interface ProgressiveAccessibility {
  readonly coreContentAvailable: boolean;
  readonly coreInteractionDoesNotDependOnlyOnScript: boolean;
  readonly enhancedInteractionPreservesAccessibility: boolean;
}

export const progressiveAccessibility: ProgressiveAccessibility = {
  coreContentAvailable: true,
  coreInteractionDoesNotDependOnlyOnScript: true,
  enhancedInteractionPreservesAccessibility: true,
};

// Client-side enhancement should preserve the underlying accessibility of
// the content and interaction model.

// ---------------------------------------------------------------------
// 57. Accessibility regression prevention
// ---------------------------------------------------------------------

export interface AccessibilityRegressionProtection {
  readonly automatedChecks: boolean;
  readonly keyboardChecks: boolean;
  readonly componentReviews: boolean;
  readonly manualVerificationForCriticalFlows: boolean;
}

export const accessibilityRegressionProtection: AccessibilityRegressionProtection = {
  automatedChecks: true,
  keyboardChecks: true,
  componentReviews: true,
  manualVerificationForCriticalFlows: true,
};

// Accessibility can regress when components, styles, content, or
// interaction logic change.
//
// Regression prevention therefore belongs in the normal development
// workflow.

// ---------------------------------------------------------------------
// 58. WCAG checklist
// ---------------------------------------------------------------------

export const wcagChecklist = [
  "Use meaningful semantic HTML.",
  "Provide appropriate text alternatives.",
  "Ensure interactive controls have accessible names.",
  "Make required interactions available from the keyboard.",
  "Maintain a visible and usable focus indicator.",
  "Do not communicate information through color alone.",
  "Meet applicable contrast requirements.",
  "Associate form controls with labels.",
  "Communicate applicable errors and status changes.",
  "Keep interaction behavior predictable.",
  "Provide accessible alternatives to applicable dragging interactions.",
  "Consider target-size requirements for pointer targets.",
  "Respect applicable motion and timing requirements.",
  "Test dynamic content with assistive technology where appropriate.",
  "Test critical flows manually.",
  "Use automated accessibility checks as one part of testing.",
  "Evaluate the complete page when assessing conformance.",
] as const;

// This checklist is a practical starting point, not a replacement for
// evaluating the applicable WCAG success criteria.

// ---------------------------------------------------------------------
// 59. Integrated WCAG example
// ---------------------------------------------------------------------

export interface AccessibleProfileProps {
  readonly name: string;
  readonly email: string;
  readonly status: string;
}

export const AccessibleProfile = ({ name, email, status }: AccessibleProfileProps): ReactElement => {
  return (
    <main>
      <header>
        <h1>Profile</h1>
        <p role="status">{status}</p>
      </header>

      <section aria-labelledby="profile-details">
        <h2 id="profile-details">Profile details</h2>

        <dl>
          <div>
            <dt>Name</dt>
            <dd>{name}</dd>
          </div>

          <div>
            <dt>Email address</dt>
            <dd>{email}</dd>
          </div>
        </dl>

        <button type="button">Save changes</button>
      </section>
    </main>
  );
};

// This example combines several accessibility foundations:
//
// - semantic landmarks
// - heading structure
// - descriptive content
// - programmatic relationships
// - native controls
// - a status message
//
// Each individual feature still needs to be evaluated in the context of
// the complete application.

// ---------------------------------------------------------------------
// 60. What WCAG does not mean
// ---------------------------------------------------------------------

export const wcagMisconceptions = [
  "Passing an automated scanner does not prove complete accessibility.",
  "Using ARIA does not automatically make a component accessible.",
  "Level A does not mean every accessibility issue is solved.",
  "WCAG does not prescribe one visual design.",
  "Semantic HTML alone does not guarantee complete WCAG conformance.",
  "Conformance is not the same thing as universal usability.",
] as const;

// WCAG provides testable requirements, but accessible engineering also
// requires understanding content, interaction, assistive technology, and
// actual user needs.

// ---------------------------------------------------------------------
// 61. Accessibility implementation model
// ---------------------------------------------------------------------

export interface AccessibilityImplementation {
  readonly semanticStructure: boolean;
  readonly accessibleInteraction: boolean;
  readonly understandableContent: boolean;
  readonly assistiveTechnologyCompatibility: boolean;
  readonly conformanceTesting: boolean;
  readonly usabilityTesting: boolean;
}

export const accessibilityImplementation: AccessibilityImplementation = {
  semanticStructure: true,
  accessibleInteraction: true,
  understandableContent: true,
  assistiveTechnologyCompatibility: true,
  conformanceTesting: true,
  usabilityTesting: true,
};

// A robust accessibility process combines:
//
// semantic implementation
//        +
// interaction design
//        +
// content design
//        +
// assistive technology compatibility
//        +
// conformance testing
//        +
// usability testing

// ---------------------------------------------------------------------
// 62. Final WCAG model
// ---------------------------------------------------------------------

export const wcagModel = {
  principles: ["Perceivable", "Operable", "Understandable", "Robust"],
  conformanceLevels: ["A", "AA", "AAA"],
  process: ["Implement", "Test", "Evaluate", "Improve", "Prevent regressions"],
} as const;

// WCAG provides the framework for evaluating accessibility requirements.
//
// Good accessibility implementation combines WCAG requirements with
// semantic HTML, appropriate interaction design, assistive technology
// compatibility, testing, and ongoing maintenance.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - WCAG stands for Web Content Accessibility Guidelines and is developed by W3C WAI.
// - WCAG 2.2 organizes accessibility requirements around four principles: Perceivable, Operable, Understandable, and Robust.
// - WCAG principles contain guidelines, and guidelines contain testable success criteria.
// - WCAG success criteria have three conformance levels: A, AA, and AAA.
// - Level A is the minimum conformance level.
// - Level AA includes all applicable Level A and Level AA requirements.
// - Level AAA includes all applicable Level A, AA, and AAA requirements.
// - WCAG conformance applies to the complete page and its applicable content.
// - WCAG 2.2 adds nine success criteria compared with WCAG 2.1 and removes 4.1.1 Parsing as an applicable requirement.
// - Accessibility is broader than visual appearance and includes semantics, keyboard interaction, focus, forms, dynamic content, and assistive technology compatibility.
// - Native HTML provides important semantics and interaction behavior and should generally be preferred over unnecessary custom controls.
// - ARIA supplements native semantics; using ARIA does not automatically make a component accessible.
// - Accessible names communicate the purpose of controls to users and assistive technologies.
// - Informative images need appropriate text alternatives, while decorative images can use an empty alt attribute when appropriate.
// - Keyboard users need to be able to reach and operate applicable interactive controls.
// - Focus should remain usable and visible, including the WCAG 2.2 requirements concerning focus visibility and obstruction.
// - Information should not depend exclusively on color.
// - Applicable contrast requirements should be evaluated according to the relevant WCAG success criteria.
// - Forms should provide programmatically associated labels and appropriate descriptions and error information.
// - Dynamic updates may require deliberate accessibility communication so users understand what changed.
// - WCAG 2.2 includes requirements concerning accessible authentication, redundant entry, consistent help, dragging alternatives, and target size.
// - Automated accessibility testing is useful but cannot establish complete accessibility by itself.
// - Manual keyboard testing and appropriate assistive technology testing are important parts of accessibility evaluation.
// - WCAG conformance testing and usability testing answer different questions and can complement each other.
// - Testing with people with disabilities can reveal practical accessibility problems that automated checks may miss.
// - React does not remove accessibility responsibilities because the resulting browser interface still needs appropriate semantics and interaction behavior.
// - Accessible component design should define names, keyboard behavior, focus behavior, and state communication as part of the component contract.
// - Accessibility should be treated as an engineering concern throughout requirements, implementation, review, testing, and maintenance.
// - WCAG provides testable requirements, but conformance alone should not be treated as a guarantee of universal usability.

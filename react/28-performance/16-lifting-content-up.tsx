/**
 * Lifting Content Up
 * ==================
 *
 * Lifting content up is a React performance pattern where frequently changing state is moved
 * into a wrapper while relatively expensive or stable content is passed into that wrapper as
 * children. Because the child elements are created by the parent, the wrapper's state update does
 * not necessarily require that already-created content subtree to render again.
 */

import { useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. A state update normally re-renders the component that owns the state
// ---------------------------------------------------------------------

const BasicStateExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("BasicStateExample rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
    </section>
  );
};

// When count changes, BasicStateExample renders again.
// This is normal React behavior and is not inherently a performance problem.

// ---------------------------------------------------------------------
// 2. Parent state can cause descendants to render again
// ---------------------------------------------------------------------

const ExpensiveContent: FC = (): ReactElement => {
  console.log("ExpensiveContent rendered");

  return (
    <article>
      <h2>Expensive content</h2>
      <p>This subtree represents content that may require meaningful rendering work.</p>
    </article>
  );
};

const ParentStateExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("ParentStateExample rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ExpensiveContent />
    </section>
  );
};

// ParentStateExample owns count.
// When count changes, the parent renders again and produces a new element for ExpensiveContent.
// The descendant may therefore render again as part of the parent's update.

// ---------------------------------------------------------------------
// 3. Passing content as children changes where the element is created
// ---------------------------------------------------------------------

interface StateWrapperProps {
  readonly children: ReactNode;
}

const StateWrapper: FC<StateWrapperProps> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("StateWrapper rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      {children}
    </section>
  );
};

const ChildrenExample: FC = (): ReactElement => {
  console.log("ChildrenExample rendered");

  return (
    <StateWrapper>
      <ExpensiveContent />
    </StateWrapper>
  );
};

// ExpensiveContent is created by ChildrenExample, not by StateWrapper.
// Updating count causes StateWrapper to render again, but its children prop can still refer to
// the same already-created React element because ChildrenExample did not render again.

// ---------------------------------------------------------------------
// 4. The state owner can wrap stable content
// ---------------------------------------------------------------------

interface CounterWrapperProps {
  readonly children: ReactNode;
}

const CounterWrapper: FC<CounterWrapperProps> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <div>{children}</div>
    </section>
  );
};

const StableContentExample: FC = (): ReactElement => {
  return (
    <CounterWrapper>
      <article>
        <h2>Stable content</h2>
        <p>The content is supplied to the wrapper instead of being created inside it.</p>
      </article>
    </CounterWrapper>
  );
};

// CounterWrapper owns the changing state.
// The article element is created by StableContentExample and passed through children.

// ---------------------------------------------------------------------
// 5. Children are a prop
// ---------------------------------------------------------------------

interface ContentWrapperProps {
  readonly children: ReactNode;
}

const ContentWrapper: FC<ContentWrapperProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

const ChildrenAsPropExample: FC = (): ReactElement => {
  return (
    <ContentWrapper>
      <p>Content supplied by the parent.</p>
    </ContentWrapper>
  );
};

// JSX placed between a component's opening and closing tags becomes its children prop.
// children is therefore ordinary React data passed from one component to another.

// ---------------------------------------------------------------------
// 6. State can be localized around changing controls
// ---------------------------------------------------------------------

interface PanelProps {
  readonly children: ReactNode;
}

const InteractivePanel: FC<PanelProps> = ({ children }): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Close" : "Open"}
      </button>
      {open && <div>{children}</div>}
    </section>
  );
};

const LocalizedStateExample: FC = (): ReactElement => {
  return (
    <InteractivePanel>
      <article>
        <h2>Panel content</h2>
        <p>This content is passed into the component that owns the panel state.</p>
      </article>
    </InteractivePanel>
  );
};

// The state belongs to the interactive panel.
// The content is owned by the component above it and supplied as children.
// This can avoid unnecessary re-rendering of that content when only the panel state changes.

// ---------------------------------------------------------------------
// 7. Passing named content props follows the same pattern
// ---------------------------------------------------------------------

interface LayoutProps {
  readonly header: ReactNode;
  readonly content: ReactNode;
}

const Layout: FC<LayoutProps> = ({ header, content }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <header>{header}</header>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <main>{content}</main>
    </section>
  );
};

const NamedContentExample: FC = (): ReactElement => {
  const header = <h2>Product details</h2>;
  const content = (
    <article>
      <p>Product information goes here.</p>
    </article>
  );

  return <Layout header={header} content={content} />;
};

// children is only one way to pass React elements.
// Named ReactNode props can provide the same ownership relationship when several content regions exist.

// ---------------------------------------------------------------------
// 8. Content can include multiple elements
// ---------------------------------------------------------------------

const MultipleChildrenExample: FC = (): ReactElement => {
  return (
    <StateWrapper>
      <header>
        <h2>Account</h2>
      </header>
      <article>
        <p>Account information.</p>
      </article>
      <footer>
        <p>Account actions.</p>
      </footer>
    </StateWrapper>
  );
};

// children can represent an entire subtree rather than a single element.
// The wrapper does not need to know how that subtree is structured.

// ---------------------------------------------------------------------
// 9. Lifting content up is about ownership, not moving JSX text
// ---------------------------------------------------------------------

interface SidebarProps {
  readonly children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }): ReactElement => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside>
      <button type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? "Collapse" : "Expand"}
      </button>
      {expanded && children}
    </aside>
  );
};

const ContentOwnershipExample: FC = (): ReactElement => {
  return (
    <Sidebar>
      <nav>
        <a href="#overview">Overview</a>
        <a href="#details">Details</a>
      </nav>
    </Sidebar>
  );
};

// The important relationship is which component creates the content elements.
// The wrapper owns the interactive state, while its parent owns the content subtree.

// ---------------------------------------------------------------------
// 10. The pattern does not require React.memo
// ---------------------------------------------------------------------

interface WrapperProps {
  readonly children: ReactNode;
}

const NonMemoizedWrapper: FC<WrapperProps> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("NonMemoizedWrapper rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      {children}
    </section>
  );
};

const WithoutMemoExample: FC = (): ReactElement => {
  return (
    <NonMemoizedWrapper>
      <ExpensiveContent />
    </NonMemoizedWrapper>
  );
};

// React.memo is not required for the ownership pattern itself.
// The potentially useful property is that the children element was created outside the state-owning wrapper.

// ---------------------------------------------------------------------
// 11. React elements are values
// ---------------------------------------------------------------------

const ElementValueExample: FC = (): ReactElement => {
  const content = (
    <article>
      <h2>Content</h2>
      <p>This JSX produces a React element value.</p>
    </article>
  );

  return <StateWrapper>{content}</StateWrapper>;
};

// JSX produces React element objects.
// Passing those objects as props allows one component to provide already-created content
// to another component that controls the surrounding layout or state.

// ---------------------------------------------------------------------
// 12. A state update does not automatically mean every descendant renders
// ---------------------------------------------------------------------

const ChildObservation: FC = (): ReactElement => {
  console.log("ChildObservation rendered");

  return <p>Observe this component in the console.</p>;
};

const StateOwner: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("StateOwner rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      <ChildObservation />
    </section>
  );
};

// React's rendering behavior depends on the update, component tree, props, context,
// memoization, and reconciliation.
// A state update in a parent does not justify assuming that every descendant always performs
// the same amount of work, so performance should be measured rather than inferred from tree depth alone.

// ---------------------------------------------------------------------
// 13. Lifting content can reduce parent-driven rendering work
// ---------------------------------------------------------------------

const ContentProducer: FC = (): ReactElement => {
  console.log("ContentProducer rendered");

  return (
    <article>
      <h2>Large content subtree</h2>
      <p>This subtree represents work that should not need to follow an unrelated counter update.</p>
    </article>
  );
};

const ContentConsumer: FC<{ readonly children: ReactNode }> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  console.log("ContentConsumer rendered");

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      {children}
    </section>
  );
};

const LiftedContentExample: FC = (): ReactElement => {
  return (
    <ContentConsumer>
      <ContentProducer />
    </ContentConsumer>
  );
};

// ContentProducer is rendered by LiftedContentExample.
// ContentConsumer can update its own state without requiring LiftedContentExample to render again.
// Its children prop can therefore continue referring to the same React element.

// ---------------------------------------------------------------------
// 14. The parent must actually remain unchanged
// ---------------------------------------------------------------------

const ParentChangingContentExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  const content = <ExpensiveContent />;

  return (
    <StateWrapper>
      <div data-count={count}>{content}</div>
    </StateWrapper>
  );
};

// If the component that creates the content also changes its own state, it renders again.
// The content may then be recreated as part of that render.
// Lifting content up is useful when the content's owner does not need to participate in the frequent update.

// ---------------------------------------------------------------------
// 15. State should be placed near the interaction that changes it
// ---------------------------------------------------------------------

interface ToolbarProps {
  readonly children: ReactNode;
}

const Toolbar: FC<ToolbarProps> = ({ children }): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setActive((value) => !value)}>
        {active ? "Active" : "Inactive"}
      </button>
      {children}
    </section>
  );
};

const StatePlacementExample: FC = (): ReactElement => {
  return (
    <Toolbar>
      <article>
        <h2>Report</h2>
        <p>The report content does not own or depend on the toolbar state.</p>
      </article>
    </Toolbar>
  );
};

// Localizing state can reduce the number of components that need to participate in an update.
// Passing stable content into the state owner is one way to achieve that separation.

// ---------------------------------------------------------------------
// 16. Lifting content is different from lifting state
// ---------------------------------------------------------------------

interface FormStateProps {
  readonly children: ReactNode;
}

const FormStateOwner: FC<FormStateProps> = ({ children }): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <section>
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Enter a value" />
      <p>Value: {value}</p>
      {children}
    </section>
  );
};

const StateAndContentExample: FC = (): ReactElement => {
  return (
    <FormStateOwner>
      <article>
        <h2>Additional information</h2>
        <p>This content is supplied by the parent rather than rendered inside the state owner.</p>
      </article>
    </FormStateOwner>
  );
};

// Lifting state means moving shared state to a common owner.
// Lifting content up means arranging component ownership so frequently changing state
// does not unnecessarily encompass content that does not depend on that state.
// The two patterns address different architectural concerns.

// ---------------------------------------------------------------------
// 17. Children can be conditional
// ---------------------------------------------------------------------

interface ConditionalWrapperProps {
  readonly children: ReactNode;
}

const ConditionalWrapper: FC<ConditionalWrapperProps> = ({ children }): ReactElement => {
  const [visible, setVisible] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide" : "Show"}
      </button>
      {visible && children}
    </section>
  );
};

const ConditionalContentExample: FC = (): ReactElement => {
  return (
    <ConditionalWrapper>
      <article>
        <h2>Conditional content</h2>
        <p>The wrapper controls whether this content is included in the rendered output.</p>
      </article>
    </ConditionalWrapper>
  );
};

// The content can still be passed as children even when the wrapper controls whether it is rendered.
// Visibility and ownership are separate concerns.

// ---------------------------------------------------------------------
// 18. The pattern can be composed through multiple wrappers
// ---------------------------------------------------------------------

interface SectionWrapperProps {
  readonly children: ReactNode;
}

const SectionWrapper: FC<SectionWrapperProps> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      {children}
    </section>
  );
};

const ComposedContentExample: FC = (): ReactElement => {
  return (
    <SectionWrapper>
      <ContentWrapper>
        <article>
          <h2>Composed content</h2>
          <p>Multiple components can participate in the ownership structure.</p>
        </article>
      </ContentWrapper>
    </SectionWrapper>
  );
};

// Composition lets state-owning components provide behavior and layout
// without necessarily owning the content subtree they render.

// ---------------------------------------------------------------------
// 19. Do not use this pattern without a measurable reason
// ---------------------------------------------------------------------

const SimpleContent: FC = (): ReactElement => {
  return <p>Small content.</p>;
};

const SimpleWrapper: FC<{ readonly children: ReactNode }> = ({ children }): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increment
      </button>
      {children}
    </section>
  );
};

const UnnecessaryPatternExample: FC = (): ReactElement => {
  return (
    <SimpleWrapper>
      <SimpleContent />
    </SimpleWrapper>
  );
};

// The pattern can be useful, but adding extra component boundaries only for a tiny subtree
// may increase indirection without producing a meaningful performance improvement.
// Use profiling and the actual component structure to determine whether it is worthwhile.

// ---------------------------------------------------------------------
// 20. Integrated example
// ---------------------------------------------------------------------

interface DashboardShellProps {
  readonly children: ReactNode;
}

const DashboardShell: FC<DashboardShellProps> = ({ children }): ReactElement => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main>
      <header>
        <h1>Dashboard</h1>
        <button type="button" onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "Close panel" : "Open panel"}
        </button>
      </header>

      <p>Panel: {isOpen ? "Open" : "Closed"}</p>

      {isOpen && children}
    </main>
  );
};

const DashboardContent: FC = (): ReactElement => {
  console.log("DashboardContent rendered");

  return (
    <section>
      <h2>Dashboard content</h2>
      <p>This content is supplied to the state-owning shell instead of being created inside it.</p>
      <ul>
        <li>Overview</li>
        <li>Recent activity</li>
        <li>Account information</li>
      </ul>
    </section>
  );
};

const LiftingContentUpDemo: FC = (): ReactElement => {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
};

export default LiftingContentUpDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Lifting content up is a composition pattern that separates frequently changing state from relatively stable content.
// - A component can own interactive state while receiving the content it renders through children or ReactNode props.
// - JSX passed as children is a React element value created by the component that supplies it.
// - When the state-owning wrapper updates, its children prop can continue referring to the same already-created React elements.
// - This can reduce unnecessary parent-driven rendering work for expensive or stable content subtrees.
// - The pattern does not require React.memo.
// - The pattern works because of component ownership and element identity, not because children are automatically memoized.
// - Named ReactNode props can provide the same ownership relationship when a component has multiple content regions.
// - Localizing state near the interaction that changes it can reduce the amount of the tree affected by frequent updates.
// - Lifting content is different from lifting state: one concerns composition and ownership, while the other concerns shared state ownership.
// - The content's owning component must remain unchanged for the same child element identity to be preserved.
// - Lifting content does not eliminate all rendering work and does not guarantee that a descendant will never render.
// - The pattern should be used when the component structure and measured rendering cost justify the additional composition boundary.

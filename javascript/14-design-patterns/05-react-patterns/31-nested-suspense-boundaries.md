# Nested Suspense Boundaries

Nested Suspense boundaries are a rendering pattern in which multiple Suspense boundaries are placed at different levels
of a component tree so that independently suspending subtrees can reveal their content progressively rather than forcing
an entire page or parent region to wait for the slowest descendant.

The essential idea is to define multiple rendering recovery points for suspended content. An outer boundary establishes
a coarse fallback for a larger region, while inner boundaries establish finer-grained fallbacks for portions of that
region.

## Intent

Use nested Suspense boundaries when different parts of a UI have different readiness characteristics and should be
allowed to reveal independently.

Typical examples include:

* a page shell that should appear before its data
* a profile header that can appear before a slower activity feed
* a dashboard containing independently loading panels
* a product page where the primary content should appear before recommendations
* a route whose primary content should appear before secondary content
* progressively revealing expensive or asynchronous subtrees
* preserving already-ready content while a deeper subtree remains suspended

The pattern is primarily about rendering granularity and fallback ownership.

## Basic Pattern

An outer Suspense boundary can provide a fallback for a larger region while inner boundaries provide more specific
fallbacks.

```tsx
function Dashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton/>}>
            <DashboardHeader/>

            <Suspense fallback={<ActivitySkeleton/>}>
                <ActivityFeed/>
            </Suspense>

            <Suspense fallback={<RecommendationsSkeleton/>}>
                <Recommendations/>
            </Suspense>
        </Suspense>
    );
}
```

The outer boundary protects the complete dashboard region.

The inner boundaries allow `ActivityFeed` and `Recommendations` to have their own loading states once the surrounding
tree can render far enough to reach them.

The exact reveal behavior depends on what suspends and which boundary is the nearest applicable ancestor.

## Boundary Hierarchy

Suspense boundaries form a hierarchy in the React tree.

An inner boundary is nested inside an outer boundary.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Page>
        <Suspense fallback={<ProfileSkeleton/>}>
            <Profile/>
        </Suspense>
    </Page>
</Suspense>
```

The outer boundary represents the broader rendering region.

The inner boundary represents a smaller region with a more specific fallback.

This hierarchy establishes fallback ownership. A suspension is handled by the nearest appropriate Suspense boundary that
can display its fallback.

The outer boundary therefore acts as a broader safety net rather than automatically controlling every inner loading
state.

## Why Nest Boundaries

A single large Suspense boundary can unnecessarily couple unrelated content.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Profile/>
    <ActivityFeed/>
    <Recommendations/>
</Suspense>
```

If one descendant suspends, the fallback may replace the entire boundary's content according to Suspense semantics.

Nested boundaries allow the UI to express more precise relationships.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Profile/>

    <Suspense fallback={<ActivitySkeleton/>}>
        <ActivityFeed/>
    </Suspense>

    <Suspense fallback={<RecommendationsSkeleton/>}>
        <Recommendations/>
    </Suspense>
</Suspense>
```

Now the readiness of one secondary region does not necessarily have to determine the fallback representation of every
sibling region.

The goal is not to maximize the number of boundaries. The goal is to align boundary boundaries with meaningful UI
regions.

## Progressive Reveal

Nested Suspense boundaries are particularly useful when the desired experience is progressive reveal.

A page can expose stable structure first and then reveal progressively finer-grained content.

```tsx
function ProductPage() {
    return (
        <Suspense fallback={<ProductPageSkeleton/>}>
            <ProductHeader/>

            <Suspense fallback={<ProductDetailsSkeleton/>}>
                <ProductDetails/>
            </Suspense>

            <Suspense fallback={<ReviewsSkeleton/>}>
                <Reviews/>
            </Suspense>
        </Suspense>
    );
}
```

This lets the component tree express that product details and reviews are independent readiness units.

The UI does not need to treat the entire page as a single indivisible loading state.

## Boundary Placement

Boundary placement should follow meaningful UI regions rather than arbitrary component nesting.

Good boundaries often correspond to:

* independently understandable sections
* independently loaded data
* independently rendered components
* sections with distinct skeletons
* content with different latency characteristics
* optional secondary content
* areas that can meaningfully appear later

A boundary around every component is usually excessive.

```tsx
<Suspense fallback={<Skeleton/>}>
    <Button/>
</Suspense>
```

A button that cannot meaningfully suspend independently generally does not benefit from its own boundary.

The boundary should correspond to a user-perceivable rendering unit.

## Coarse and Fine-Grained Boundaries

An outer boundary can be coarse-grained while inner boundaries are fine-grained.

```tsx
<Suspense fallback={<ApplicationShellSkeleton/>}>
    <ApplicationShell>
        <Suspense fallback={<NavigationSkeleton/>}>
            <Navigation/>
        </Suspense>

        <Suspense fallback={<ContentSkeleton/>}>
            <MainContent/>
        </Suspense>
    </ApplicationShell>
</Suspense>
```

The outer boundary establishes a fallback for the broad application region.

The inner boundaries refine that behavior for specific regions.

This produces a hierarchy of readiness rather than a single global loading state.

## Sibling Boundaries

Sibling Suspense boundaries are useful when sections are independent.

```tsx
function Dashboard() {
    return (
        <>
            <Suspense fallback={<RevenueSkeleton/>}>
                <Revenue/>
            </Suspense>

            <Suspense fallback={<UsersSkeleton/>}>
                <Users/>
            </Suspense>

            <Suspense fallback={<OrdersSkeleton/>}>
                <Orders/>
            </Suspense>
        </>
    );
}
```

Each boundary owns its own fallback.

A slow `Orders` subtree does not inherently require `Revenue` and `Users` to display the same fallback.

Sibling boundaries are therefore appropriate when the UI itself treats those regions as independent.

## Nested Versus Sibling Boundaries

Nested and sibling boundaries express different relationships.

Nested boundaries express containment.

```tsx
<Suspense fallback={<PageFallback/>}>
    <Suspense fallback={<SectionFallback/>}>
        <Section/>
    </Suspense>
</Suspense>
```

Sibling boundaries express independent regions.

```tsx
<>
    <Suspense fallback={<SectionAFallback/>}>
        <SectionA/>
    </Suspense>

    <Suspense fallback={<SectionBFallback/>}>
        <SectionB/>
    </Suspense>
</>
```

Choose nesting when the inner region is conceptually part of the outer region's readiness boundary.

Choose siblings when the regions should be independently controlled.

## Outer Boundaries as Fallback Safety Nets

An outer boundary can protect a larger area even when inner boundaries handle expected suspensions.

```tsx
<Suspense fallback={<PageFallback/>}>
    <Page>
        <Suspense fallback={<HeaderFallback/>}>
            <Header/>
        </Suspense>

        <Suspense fallback={<ContentFallback/>}>
            <Content/>
        </Suspense>
    </Page>
</Suspense>
```

The outer boundary provides broader fallback coverage.

This can be useful when a descendant unexpectedly suspends outside an intended inner boundary or when the application
wants a general fallback for the entire region.

However, an outer boundary should not be treated as a replacement for deliberate inner boundary placement.

## Fallback Ownership

Each boundary owns the fallback for its protected subtree.

```tsx
<Suspense fallback={<ProfileSkeleton/>}>
    <Profile/>
</Suspense>
```

The fallback should represent the region that the boundary protects.

A page-level fallback is often inappropriate for a small nested region because it can replace far more UI than the user
expects.

```tsx
<Suspense fallback={<EntirePageSkeleton/>}>
    <Recommendations/>
</Suspense>
```

If only recommendations are suspended, a recommendation-specific fallback is generally more semantically appropriate.

## Avoiding Fallback Replacement of Stable UI

One of the primary reasons to use nested boundaries is to prevent a small suspended region from replacing a larger
stable UI region.

```tsx
function ProfilePage() {
    return (
        <main>
            <ProfileHeader/>

            <Suspense fallback={<ActivitySkeleton/>}>
                <ActivityFeed/>
            </Suspense>
        </main>
    );
}
```

The profile header does not need to disappear merely because the activity feed is not ready.

This allows the boundary to isolate the transient state to the region that actually requires it.

## Designing Fallbacks

Fallbacks should preserve the structural expectations of the content they replace.

For a table:

```tsx
<Suspense fallback={<TableSkeleton rows={8}/>}>
    <UserTable/>
</Suspense>
```

For a sidebar:

```tsx
<Suspense fallback={<SidebarSkeleton/>}>
    <Sidebar/>
</Suspense>
```

For a detail panel:

```tsx
<Suspense fallback={<DetailsSkeleton/>}>
    <Details/>
</Suspense>
```

The fallback is part of the rendering design, not merely a generic loading indicator.

A good fallback communicates what region is unavailable while preserving useful surrounding context.

## Boundary Granularity and User Experience

Too-coarse boundaries can produce excessive fallback replacement.

Too-fine boundaries can produce fragmented loading states.

For example, a page with dozens of independent skeletons can make the UI appear visually unstable even though every
boundary is technically correct.

The appropriate granularity is usually determined by the user's perception of the interface.

A user generally thinks in terms of meaningful regions rather than individual React components.

## Nested Boundaries and Data Dependencies

Nested boundaries are useful when descendant rendering depends on different asynchronous resources.

```tsx
function AccountPage() {
    return (
        <Suspense fallback={<AccountPageSkeleton/>}>
            <AccountHeader/>

            <Suspense fallback={<BalanceSkeleton/>}>
                <AccountBalance/>
            </Suspense>

            <Suspense fallback={<TransactionsSkeleton/>}>
                <Transactions/>
            </Suspense>
        </Suspense>
    );
}
```

The boundaries communicate that the balance and transactions are separate readiness regions.

They do not themselves define the data-fetching or resource-cache architecture.

A data cache may determine whether a resource is already available, reused, deduplicated, or stale. Suspense determines
how rendering responds when a subtree is not ready.

These responsibilities should remain separate.

## Nested Boundaries and Suspense Resources

A subtree may suspend because it reads a resource that is not yet available.

```tsx
function ProfileSection() {
    const profile = profileResource.read();

    return <Profile profile={profile}/>;
}
```

The boundary determines which fallback is shown when that read suspends.

Nested boundaries therefore allow different resource dependencies to have different rendering ownership.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <ProfileSection/>

    <Suspense fallback={<PostsSkeleton/>}>
        <PostsSection/>
    </Suspense>
</Suspense>
```

The resource itself remains responsible for resource lifecycle and caching semantics.

The boundary remains responsible for rendering fallback behavior.

## Boundary Placement and Fetch Waterfalls

Nested boundaries do not automatically eliminate request waterfalls.

Poor dependency structure can still serialize asynchronous work.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <Parent/>
    <Suspense fallback={<ChildSkeleton/>}>
        <Child/>
    </Suspense>
</Suspense>
```

If `Child` cannot begin its work until `Parent` has completed and rendered it, the nested boundary may still reveal the
child later.

Suspense controls rendering readiness; it does not automatically optimize the underlying dependency graph.

Avoid confusing finer-grained fallback behavior with parallel data acquisition.

Where appropriate, initiate independent work early and allow separate boundaries to reveal the resulting content
independently.

## Nested Boundaries and Component Composition

Suspense boundaries are components in the rendered tree and can therefore be composed around reusable components.

```tsx
function DashboardSection({children}: { children: ReactNode }) {
    return (
        <section>
            {children}
        </section>
    );
}

function Dashboard() {
    return (
        <DashboardSection>
            <Suspense fallback={<SectionSkeleton/>}>
                <Analytics/>
            </Suspense>
        </DashboardSection>
    );
}
```

A reusable component can also establish its own internal boundary when that boundary is intrinsic to the component's
contract.

```tsx
function ActivityPanel() {
    return (
        <section>
            <ActivityHeader/>

            <Suspense fallback={<ActivitySkeleton/>}>
                <ActivityList/>
            </Suspense>
        </section>
    );
}
```

Whether the boundary belongs inside or outside a component is an architectural decision.

A boundary should generally be owned by the layer that understands the appropriate fallback and failure semantics.

## Boundary Ownership and Reusable Components

A reusable component should not automatically impose a Suspense boundary merely because one descendant can suspend.

If the parent needs to decide how loading should appear, the parent may own the boundary.

```tsx
<Suspense fallback={<DashboardSectionSkeleton/>}>
    <ActivityPanel/>
</Suspense>
```

If the component has an intrinsic loading representation that is part of its contract, it can own the boundary
internally.

```tsx
function ActivityPanel() {
    return (
        <section>
            <Suspense fallback={<ActivitySkeleton/>}>
                <ActivityList/>
            </Suspense>
        </section>
    );
}
```

Boundary ownership should therefore follow responsibility for the user-facing fallback.

## Nested Boundaries and Error Boundaries

Suspense and Error Boundaries solve different problems and can be combined.

```tsx
<ErrorBoundary fallback={<PageError/>}>
    <Suspense fallback={<PageSkeleton/>}>
        <Page/>
    </Suspense>
</ErrorBoundary>
```

They can also be nested around independent regions.

```tsx
<ErrorBoundary fallback={<DashboardError/>}>
    <Suspense fallback={<DashboardSkeleton/>}>
        <Dashboard>
            <ErrorBoundary fallback={<ActivityError/>}>
                <Suspense fallback={<ActivitySkeleton/>}>
                    <Activity/>
                </Suspense>
            </ErrorBoundary>
        </Dashboard>
    </Suspense>
</ErrorBoundary>
```

Suspense handles rendering readiness.

Error boundaries handle rendering errors.

Combining them allows an application to distinguish "not ready yet" from "failed to render."

## Nested Boundaries and Transitions

Transitions can affect how React handles updates that cause suspended content to change.

```tsx
startTransition(() => {
    setPage(nextPage);
});
```

The Suspense boundaries determine where fallback UI can appear.

The transition determines the priority and scheduling semantics of the update.

These concerns should not be conflated.

A nested boundary is a rendering containment mechanism; a transition is an update scheduling mechanism.

## Nested Boundaries and Deferred Values

Deferred values can cause a component to continue receiving an older value while newer content is prepared.

```tsx
const deferredQuery = useDeferredValue(query);

return (
    <Suspense fallback={<ResultsSkeleton/>}>
        <SearchResults query={deferredQuery}/>
    </Suspense>
);
```

Nested boundaries can then isolate the rendering readiness of individual regions.

The deferred value controls which value a subtree consumes.

Suspense controls what happens when that subtree is not ready to render.

## Nested Boundaries and Component Identity

Suspense boundaries participate in the rendered tree and therefore interact with component identity.

Moving a component across a boundary or changing the surrounding tree can affect its identity depending on the resulting
element structure.

Boundary placement should not be changed casually when preserving component state is important.

The relevant question is whether React continues to see the same component identity at the same logical tree position.

## Nested Boundaries and State Preservation

Suspension is not equivalent to ordinary conditional rendering.

```tsx
<Suspense fallback={<Skeleton/>}>
    <Editor/>
</Suspense>
```

A component being temporarily unable to render because it suspends should not be treated as though the application
explicitly removed it with:

```tsx
{
    ready ? <Editor/> : null
}
```

These mechanisms have different semantics.

Suspense allows React to coordinate rendering of a not-yet-ready subtree.

Conditional rendering explicitly chooses whether the subtree is present in the returned element tree.

Do not use conditional rendering merely to imitate Suspense behavior when the underlying operation is naturally modeled
as suspension.

## Nested Boundaries and Server Rendering

Nested Suspense boundaries can be particularly useful in server-rendered applications because they provide meaningful
rendering units for progressive delivery.

An outer boundary can represent a broad page region while inner boundaries represent secondary regions that become ready
later.

```tsx
<Suspense fallback={<PageSkeleton/>}>
    <PageHeader/>

    <Suspense fallback={<ContentSkeleton/>}>
        <Content/>
    </Suspense>

    <Suspense fallback={<SidebarSkeleton/>}>
        <Sidebar/>
    </Suspense>
</Suspense>
```

The exact server rendering, streaming, and hydration behavior depends on the React rendering environment and framework.

The architectural principle remains the same: boundaries establish independent rendering regions.

## Nested Boundaries and Hydration

Suspense boundaries can also affect how independently ready regions participate in client-side rendering and hydration.

Boundary placement should therefore account for whether a region:

* depends on server-rendered content
* becomes interactive later
* has client-only dependencies
* contains expensive client-side work
* can meaningfully operate independently

Suspense should not be confused with a client component boundary or hydration boundary. Those concepts determine where
code executes and where server-rendered markup becomes client-owned, whereas Suspense determines how React represents
rendering that is not currently ready.

## Nested Boundaries and Route Rendering

A route can contain nested boundaries for primary and secondary content.

```tsx
function SettingsPage() {
    return (
        <Suspense fallback={<SettingsSkeleton/>}>
            <SettingsHeader/>

            <Suspense fallback={<ProfileSettingsSkeleton/>}>
                <ProfileSettings/>
            </Suspense>

            <Suspense fallback={<SecuritySettingsSkeleton/>}>
                <SecuritySettings/>
            </Suspense>
        </Suspense>
    );
}
```

This allows the route to define a hierarchy of readiness rather than a single all-or-nothing loading state.

Route-level loading behavior and nested component-level loading behavior should nevertheless remain conceptually
distinct. The route boundary usually represents navigation-level state, while nested boundaries represent regions inside
the route.

## Avoiding Boundary Proliferation

Adding a Suspense boundary to every asynchronous component can produce excessive fragmentation.

```tsx
function Page() {
    return (
        <>
            <Suspense fallback={<Skeleton/>}>
                <A/>
            </Suspense>
            <Suspense fallback={<Skeleton/>}>
                <B/>
            </Suspense>
            <Suspense fallback={<Skeleton/>}>
                <C/>
            </Suspense>
            <Suspense fallback={<Skeleton/>}>
                <D/>
            </Suspense>
        </>
    );
}
```

This may be technically functional while producing an undesirable user experience.

Prefer boundaries that correspond to meaningful loading groups.

If `A`, `B`, `C`, and `D` are conceptually one region, a single boundary may be more appropriate.

If they are genuinely independent regions, separate boundaries may be justified.

## Common Misuse

A common misuse is assuming that nested boundaries automatically make all asynchronous operations execute concurrently.
They do not.

Another is creating boundaries around components that cannot meaningfully suspend. This adds structural complexity
without providing useful fallback semantics.

Another is using the same generic fallback for every boundary. This can make the UI lose its semantic structure and
produce a page full of indistinguishable loading indicators.

Another is placing a boundary at an arbitrary implementation layer rather than where the fallback responsibility
belongs.

Another is treating Suspense as a replacement for data caching. Suspense can coordinate rendering around unavailable
resources, but caching, deduplication, invalidation, freshness, and eviction remain separate concerns.

Another is using nested boundaries to conceal poor asynchronous dependency design. If a child cannot start until its
parent finishes, simply adding another boundary does not make the underlying work parallel.

## Advantages

Nested Suspense boundaries allow rendering readiness to be expressed at multiple levels of granularity.

They can prevent a small suspended region from replacing a larger stable interface.

They allow independent sections to use semantically appropriate fallbacks.

They support progressive reveal and can improve perceived responsiveness when the application's rendering architecture
supports it.

They also provide explicit ownership boundaries for loading representations.

## Disadvantages

Too many boundaries can fragment the interface and create excessive fallback transitions.

Poorly chosen boundaries can cause stable content to disappear unnecessarily.

Nested boundaries can make the rendering tree harder to reason about if their ownership and fallback semantics are
unclear.

They also do not solve data-fetching architecture, request waterfalls, caching, or dependency problems by themselves.

## When to Use

Use nested Suspense boundaries when:

* different UI regions have independent readiness requirements
* a page should reveal stable structure before slower descendants
* secondary content should not block primary content
* different regions require different fallbacks
* a component contains an intrinsically asynchronous subsection
* the UI benefits from progressive reveal
* an outer boundary should provide broad fallback coverage while inner boundaries refine it

## When Not to Use

Do not add nested boundaries merely because a component performs asynchronous work.

Do not use boundaries to compensate for poor data dependency architecture.

Do not create one boundary per component without a user-facing reason.

Do not use Suspense as a substitute for error handling.

Do not use Suspense as a substitute for authorization, caching, cancellation, or state management.

Do not assume that nested boundaries guarantee parallel execution or eliminate network waterfalls.

## Relationship to Other Patterns

Nested Suspense boundaries are a refinement of the Suspense Boundary pattern. The basic Suspense boundary defines
fallback behavior for a suspended subtree; nested boundaries define multiple levels of fallback ownership.

They complement Error Boundaries by separating rendering readiness from rendering failure.

They complement resource caches and server-state mechanisms by allowing asynchronous resource availability to affect
rendering without making the boundary responsible for resource lifecycle.

They complement component composition because boundaries can be placed around reusable components or inside components
when the fallback responsibility belongs there.

They interact with component identity because boundary placement contributes to the rendered tree in which component
instances are reconciled.

They interact with conditional rendering but are not equivalent to it. Conditional rendering explicitly selects whether
a subtree is rendered; Suspense handles a subtree that cannot currently complete rendering because it has suspended.

They interact with transitions and deferred values but have different responsibilities. Suspense controls rendering
fallback for suspended content, while transitions and deferred values influence update scheduling and value
availability.

They interact with Server Components, streaming, client component boundaries, and hydration boundaries in environments
that support those features, but none of those concepts should be collapsed into Suspense itself.

## Design Rules

Place boundaries around meaningful user-facing regions.

Use an outer boundary for broad fallback coverage and inner boundaries where finer-grained readiness matters.

Give each boundary a fallback appropriate to the region it protects.

Prefer sibling boundaries when regions are genuinely independent.

Prefer nested boundaries when an inner region is conceptually part of a broader rendering region.

Do not assume that boundary granularity determines data-fetching concurrency.

Keep resource acquisition, caching, invalidation, and cancellation separate from fallback ownership.

Avoid boundary proliferation.

Consider component state and identity when changing boundary placement.

Design fallback behavior together with accessibility, layout stability, and perceived responsiveness.

Use Error Boundaries separately when failure containment is required.

## Summary

Nested Suspense boundaries create a hierarchy of rendering readiness.

An outer boundary can protect a broad region, while inner boundaries isolate smaller regions with their own fallbacks.
Sibling boundaries can independently represent unrelated regions.

The purpose is not to add Suspense everywhere. The purpose is to align fallback ownership with meaningful UI regions so
that a slow or suspended subtree does not unnecessarily determine the rendering state of unrelated content.

The most important design decision is boundary placement: determine which content should appear together, which content
may appear independently, which fallback represents each region, and which asynchronous dependencies actually need
independent rendering treatment.

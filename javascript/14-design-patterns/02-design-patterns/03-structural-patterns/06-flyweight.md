# Flyweight

The Flyweight pattern reduces memory consumption by sharing objects that contain common, reusable state instead of
storing an independent copy of that state in every object.

Flyweight is fundamentally about **sharing intrinsic state across many logical objects while keeping context-specific
extrinsic state outside the shared object**.

The pattern is useful when an application represents a very large number of logically distinct objects whose internal
state contains substantial duplication. Rather than creating a complete object for every logical occurrence, shared
state is stored once and reused by many clients.

The key distinction is between **intrinsic state**, which is stable and shareable, and **extrinsic state**, which
depends on the individual use of the object and must be supplied externally.

## Intent

Flyweight uses sharing to support large numbers of fine-grained objects efficiently.

The central idea is:

**Store common state once and provide varying context-specific state separately when the object is used.**

A flyweight therefore does not normally represent one complete logical entity. It represents the reusable portion of
many logically distinct entities.

For example, a document containing one million characters may contain only a small number of distinct character
representations. Instead of storing the font, glyph information, and other shared properties separately for every
character occurrence, those properties can be stored in shared flyweight objects while each occurrence retains only its
position and character reference.

## Problem

Large object populations can consume significant memory when every object independently stores identical data.

Consider a text editor representing every character as an object:

```js
class Character {
    constructor(char, font, size, color) {
        this.char = char;
        this.font = font;
        this.size = size;
        this.color = color;
    }
}
```

A document containing hundreds of thousands of characters may create hundreds of thousands of objects containing
repeated font, size, and color information.

The actual variation may be much smaller than the number of objects.

For example, many character objects may share:

```text
font = "Inter"
size = 16
color = "black"
```

while only the character value and position differ.

Storing those properties independently creates unnecessary duplication.

Flyweight addresses this by identifying which state can be shared and moving context-specific state outside the
flyweight.

## Intrinsic State

**Intrinsic state** is state that is independent of the particular context in which a flyweight is used.

It can therefore be safely shared among multiple logical objects.

Typical intrinsic state includes:

* immutable configuration;
* character or glyph data;
* rendering metadata;
* shared formatting;
* immutable descriptors;
* static resource definitions;
* common type information;
* reusable templates.

For example:

```js
class CharacterFlyweight {
    constructor(char, font, size) {
        this.char = char;
        this.font = font;
        this.size = size;
    }
}
```

If multiple character occurrences have the same character, font, and size, they can safely reference the same flyweight.

Intrinsic state should generally be immutable or treated as immutable once shared.

If one consumer can modify intrinsic state and affect all other consumers, the sharing model becomes unsafe.

## Extrinsic State

**Extrinsic state** depends on the individual occurrence or context.

It cannot be stored inside the shared flyweight because different consumers need different values.

Typical extrinsic state includes:

* position;
* coordinates;
* selection state;
* current owner;
* request-specific information;
* object identity;
* local lifecycle state;
* per-instance metadata.

For a text document:

```js
const occurrence = {
    flyweight: characterFlyweight,
    position: 120
};
```

The character representation is shared while the position remains specific to the occurrence.

This separation is the core of Flyweight.

## Sharing State

A flyweight represents reusable state:

```js
class CharacterFlyweight {
    constructor(char, font, size) {
        this.char = char;
        this.font = font;
        this.size = size;
    }

    render(position) {
        drawCharacter(
            this.char,
            this.font,
            this.size,
            position
        );
    }
}
```

The position is supplied externally:

```js
flyweight.render(120);
```

The same flyweight can therefore be used repeatedly:

```js
flyweight.render(120);
flyweight.render(121);
flyweight.render(122);
```

The object does not need to store those positions.

## Flyweight Factory

A Flyweight Factory manages the shared instances.

Its purpose is to ensure that equivalent intrinsic state maps to the same flyweight instance.

```js
class CharacterFactory {
    constructor() {
        this.flyweights = new Map();
    }

    get(char, font, size) {
        const key = `${char}:${font}:${size}`;

        if (!this.flyweights.has(key)) {
            this.flyweights.set(
                key,
                new CharacterFlyweight(char, font, size)
            );
        }

        return this.flyweights.get(key);
    }
}
```

Clients request flyweights through the factory:

```js
const factory = new CharacterFactory();

const a1 = factory.get("A", "Inter", 16);
const a2 = factory.get("A", "Inter", 16);

console.log(a1 === a2); // true
```

The factory establishes the sharing policy.

Without such a mechanism, callers could accidentally create duplicate flyweights and lose much of the benefit of the
pattern.

## Canonicalization

The Flyweight Factory effectively performs canonicalization.

Different requests for equivalent intrinsic state resolve to one canonical shared object.

For example:

```js
factory.get("A", "Inter", 16);
factory.get("A", "Inter", 16);
factory.get("A", "Inter", 16);
```

can all return the same object.

This means object identity itself can represent equivalence of shared state.

The canonicalization key must therefore capture every property that determines whether two flyweights are semantically
interchangeable.

If the key omits a meaningful intrinsic property, incompatible state may accidentally be shared.

If the key includes unnecessary properties, sharing becomes less effective.

## Immutable Flyweights

Flyweights are safest when immutable.

```js
class CharacterFlyweight {
    constructor(char, font, size) {
        this.char = char;
        this.font = font;
        this.size = size;

        Object.freeze(this);
    }

    render(position) {
        drawCharacter(
            this.char,
            this.font,
            this.size,
            position
        );
    }
}
```

If the shared state cannot change, every consumer can safely reference the same object.

Mutable flyweights can still be implemented, but mutation requires synchronization and ownership rules.

A shared mutable object is no longer merely a memory optimization. It becomes shared state, which introduces correctness
and concurrency concerns.

## Context Objects

Extrinsic state can be represented explicitly by a context object.

```js
class CharacterContext {
    constructor(flyweight, position) {
        this.flyweight = flyweight;
        this.position = position;
    }

    render() {
        this.flyweight.render(this.position);
    }
}
```

A large collection of contexts can then share a relatively small number of flyweights.

```js
const a = factory.get("A", "Inter", 16);

const occurrences = [
    new CharacterContext(a, 10),
    new CharacterContext(a, 25),
    new CharacterContext(a, 40)
];
```

The contexts represent individual occurrences. The flyweight represents the shared intrinsic state.

## Explicit Extrinsic Parameters

A separate context object is not always necessary.

The extrinsic state can simply be passed to the operation:

```js
class Glyph {
    render(x, y, color) {
        drawGlyph(
            this.character,
            this.font,
            this.size,
            x,
            y,
            color
        );
    }
}
```

This can be preferable when the extrinsic state is short-lived and operation-specific.

The design question is whether the contextual state represents a persistent logical occurrence or merely temporary
information needed during one operation.

## Large Object Populations

Flyweight becomes valuable when the number of logical objects is very large.

Typical examples include:

* text documents;
* game worlds;
* map features;
* particles;
* trees in a forest;
* repeated graphical elements;
* spreadsheet cells;
* UI elements with shared definitions;
* AST nodes with shared metadata;
* network or protocol descriptors;
* large datasets with repeated categorical values.

The pattern is particularly useful when there are many occurrences but relatively few distinct intrinsic-state
combinations.

## Sharing Ratio

The effectiveness of Flyweight depends heavily on the ratio between logical objects and unique intrinsic states.

Suppose a system contains:

```text
1,000,000 logical objects
10,000 unique intrinsic states
```

There is significant opportunity for sharing.

If instead:

```text
1,000,000 logical objects
950,000 unique intrinsic states
```

the opportunity is much smaller.

The pattern is therefore most useful when many logical objects can reuse the same intrinsic representation.

A Flyweight implementation should be justified by the actual duplication characteristics of the data rather than by
object count alone.

## Memory Trade-Off

Flyweight does not eliminate the need to represent every logical object.

Extrinsic state still has to exist somewhere.

The memory reduction comes from moving repeated state into shared objects.

For example, instead of:

```js
{
    type: "tree",
        texture
:
    "...",
        color
:
    "...",
        position
: ...
}
```

for every tree, the application can represent:

```js
{
    type: sharedTreeType,
        position
: ...
}
```

The texture and other reusable properties exist once.

The pattern therefore trades duplicated object state for shared references and contextual state.

## Flyweight and Object Identity

Because multiple logical entities may share one flyweight, the flyweight's identity must not be confused with the
identity of the logical entity.

For example:

```js
const treeType = factory.get("oak");

const tree1 = {
    type: treeType,
    x: 10,
    y: 20
};

const tree2 = {
    type: treeType,
    x: 50,
    y: 80
};
```

Here:

```js
tree1 !== tree2
```

but:

```js
tree1.type === tree2.type
```

The two trees are distinct logical entities even though they share the same intrinsic representation.

This distinction is fundamental.

## Flyweight and State Ownership

The most important design question is:

**Who owns each piece of state?**

Shared state belongs to the flyweight.

Occurrence-specific state belongs to the external context.

For example, in a game:

Shared:

```text
mesh
texture
material
collision shape
```

Per entity:

```text
position
rotation
velocity
health
```

Putting position or health into a shared flyweight would make independent game entities interfere with each other.

The separation must therefore be semantic, not merely based on whether a property happens to have the same value today.

## Flyweight in JavaScript

JavaScript's object references make Flyweight straightforward.

```js
class Texture {
    constructor(name) {
        this.name = name;
        Object.freeze(this);
    }
}

class TextureFactory {
    constructor() {
        this.textures = new Map();
    }

    get(name) {
        if (!this.textures.has(name)) {
            this.textures.set(name, new Texture(name));
        }

        return this.textures.get(name);
    }
}
```

Entities can reference shared textures:

```js
class Sprite {
    constructor(texture, x, y) {
        this.texture = texture;
        this.x = x;
        this.y = y;
    }
}
```

Many sprites can therefore share one texture object.

```js
const factory = new TextureFactory();

const playerTexture = factory.get("player.png");

const player1 = new Sprite(playerTexture, 10, 20);
const player2 = new Sprite(playerTexture, 50, 80);
```

The sprites remain distinct while the texture representation is shared.

## Flyweight and JavaScript Primitives

JavaScript already shares or interns some primitive representations internally, depending on the engine and
implementation.

Strings are an obvious example of values that can be represented efficiently when repeated.

This does not make the Flyweight pattern unnecessary.

The pattern concerns **application-level state organization**. It allows developers to deliberately separate shared
semantic state from contextual state.

However, developers should not manually implement Flyweight merely to duplicate optimizations that the JavaScript engine
already performs automatically.

The benefit should come from the application's object model and memory behavior.

## Flyweight and Maps

`Map` is often a natural implementation mechanism for a Flyweight Factory.

```js
class FlyweightFactory {
    #flyweights = new Map();

    get(key, create) {
        let flyweight = this.#flyweights.get(key);

        if (!flyweight) {
            flyweight = create();
            this.#flyweights.set(key, flyweight);
        }

        return flyweight;
    }
}
```

The map provides canonical lookup.

The exact key structure depends on the domain.

For compound intrinsic state, a structured key may be preferable to naive string concatenation.

## Composite Keys

A factory with multiple intrinsic properties must distinguish all meaningful combinations.

For example:

```js
class GlyphFactory {
    constructor() {
        this.glyphs = new Map();
    }

    get(character, font, size) {
        const key = JSON.stringify([
            character,
            font,
            size
        ]);

        if (!this.glyphs.has(key)) {
            this.glyphs.set(
                key,
                new Glyph(character, font, size)
            );
        }

        return this.glyphs.get(key);
    }
}
```

The key strategy must be deterministic.

It must also avoid collisions.

A poorly designed key can cause unrelated objects to share state incorrectly, which is a correctness failure rather than
merely a performance issue.

## TypeScript

TypeScript can make the intrinsic/extrinsic distinction explicit.

```ts
interface Glyph {
    readonly character: string;
    readonly font: string;
    readonly size: number;

    render(x: number, y: number): void;
}
```

The flyweight contains intrinsic state:

```ts
class ConcreteGlyph implements Glyph {
    constructor(
        public readonly character: string,
        public readonly font: string,
        public readonly size: number
    ) {
    }

    render(x: number, y: number): void {
        drawGlyph(
            this.character,
            this.font,
            this.size,
            x,
            y
        );
    }
}
```

The coordinates remain extrinsic:

```ts
glyph.render(x, y);
```

The type system therefore makes it harder to accidentally introduce contextual state into the shared object.

## Generic Flyweight Factories

A reusable factory can abstract canonicalization:

```ts
class FlyweightFactory<TKey, TValue> {
    private readonly values = new Map<TKey, TValue>();

    get(
        key: TKey,
        create: () => TValue
    ): TValue {
        let value = this.values.get(key);

        if (value === undefined) {
            value = create();
            this.values.set(key, value);
        }

        return value;
    }
}
```

The domain can then define its own key and creation strategy.

```ts
const factory =
    new FlyweightFactory<string, Glyph>();

const glyph =
    factory.get(
        "A:Inter:16",
        () => new ConcreteGlyph("A", "Inter", 16)
    );
```

This separates the general canonicalization mechanism from domain-specific flyweight construction.

## Flyweight and Caching

Flyweight factories often resemble caches because they store previously created objects.

The purposes are different.

A **cache stores previously computed or retrieved results so they can be reused for performance**.

A **Flyweight Factory canonicalizes reusable shared objects so multiple logical entities can share their intrinsic
state**.

A cache may evict entries.

A Flyweight Factory may retain canonical instances for as long as the sharing model requires them.

A cache can contain values that are semantically independent even if they happen to have the same content. A flyweight
specifically exists because multiple logical entities can safely share the same representation.

A Flyweight Factory can use caching techniques internally, but Flyweight is fundamentally a state-sharing design.

## Flyweight and Object Pool

Object Pool reuses objects that are expensive to create.

Flyweight shares immutable or safely shareable state among multiple logical entities.

An object from a pool normally belongs to one consumer at a time:

```js
const connection = pool.acquire();

try {
    // Use connection.
} finally {
    pool.release(connection);
}
```

A flyweight can simultaneously be referenced by many consumers:

```js
const texture = textureFactory.get("tree");

tree1.texture = texture;
tree2.texture = texture;
tree3.texture = texture;
```

The ownership model is therefore fundamentally different.

Object Pool is about **temporal reuse of exclusive resources**.

Flyweight is about **simultaneous sharing of common state**.

## Flyweight and Singleton

Singleton guarantees a single instance for a particular globally defined abstraction or scope.

Flyweight can produce one instance per unique intrinsic-state key.

For example:

```js
factory.get("oak");
factory.get("pine");
factory.get("birch");
```

may produce three shared flyweights.

The number of flyweights depends on the distinct intrinsic states.

A Flyweight Factory therefore does not imply that there is only one flyweight.

Singleton answers a different question: whether access to an abstraction should resolve to one instance.

## Flyweight and Prototype

Prototype creates new objects by copying or cloning an existing object.

Flyweight avoids creating duplicate shared state in the first place.

Prototype:

```js
const copy = prototype.clone();
```

Flyweight:

```js
const shared = factory.get(key);
```

Prototype emphasizes object creation from an existing exemplar.

Flyweight emphasizes state sharing among many logical objects.

They can be combined, but they solve different problems.

## Flyweight and Composite

Composite represents hierarchical part-whole structures.

Flyweight represents reusable shared state.

A Composite can contain flyweights:

```js
const tree = new ForestNode();

tree.add(new TreeInstance(treeType, position));
```

The tree type can be a flyweight while the forest remains a Composite structure.

The patterns therefore operate on different concerns.

Composite answers how objects are structurally composed.

Flyweight answers how repeated state is represented and shared.

## Flyweight and Decorator

Decorator adds responsibilities to individual objects through wrapping.

Flyweight reduces duplication by sharing intrinsic state.

Decorating a flyweight requires care because adding mutable or contextual state to a shared object can violate the
sharing model.

If behavior is added to a flyweight, the added behavior must remain compatible with its shared-state semantics.

## Flyweight and Facade

Facade simplifies access to a subsystem.

Flyweight optimizes representation through shared state.

A subsystem can expose a facade while internally using flyweights, but the two patterns address entirely different
design concerns.

Facade reduces client complexity.

Flyweight reduces redundant object state.

## Flyweight and Adapter

Adapter translates one interface into another.

Flyweight does not primarily translate interfaces.

A flyweight can implement any appropriate interface, but its defining characteristic is shared intrinsic state.

The two patterns can coexist when a shared object also needs to satisfy a different client contract.

## Flyweight and Memoization

Memoization stores the result of a computation keyed by its inputs.

```js
const memoized = memoize(expensiveFunction);
```

Flyweight stores reusable objects keyed by intrinsic state.

Both use key-based reuse, but the semantic purpose differs.

Memoization answers:

**Have we already computed this result?**

Flyweight answers:

**Can these logical objects share the same representation?**

The distinction matters because memoized results may be discarded when no longer useful, whereas a flyweight represents
a canonical shared state model.

## Memory Management

Flyweight factories can retain references to every flyweight ever created.

This can become a memory leak when the key space is effectively unbounded.

For example:

```js
factory.get(randomUserGeneratedValue);
```

can cause the factory to grow indefinitely.

The factory should therefore have a well-defined lifecycle and key domain.

If flyweights are not required to remain canonical forever, alternatives include:

* bounded caches;
* weak references;
* explicit invalidation;
* scoped factories;
* lifecycle-based disposal.

The correct choice depends on whether identity sharing must remain stable.

## WeakMap and WeakRef

JavaScript provides weak-reference mechanisms that can sometimes support lifecycle-sensitive sharing.

For example, `WeakMap` can associate metadata with objects without preventing those objects from being garbage
collected.

However, `WeakMap` is not a general-purpose Flyweight Factory because it requires object keys and does not provide
ordinary value-keyed canonicalization.

`WeakRef` and `FinalizationRegistry` can support advanced memory-management strategies, but they should not be
introduced merely because a flyweight factory exists.

The primary Flyweight design should remain correct independently of garbage-collection behavior.

## Lifecycle

A flyweight's lifetime is normally longer than the individual logical entities that reference it.

This means ownership must be defined carefully.

A shared flyweight should not be destroyed merely because one consumer stops using it if other consumers still depend on
it.

Possible lifecycle models include:

* application-wide flyweights;
* module-scoped flyweights;
* request-scoped flyweights;
* document-scoped flyweights;
* scene-scoped flyweights;
* explicitly managed flyweight registries.

The appropriate scope depends on the lifetime of the data being shared.

## Concurrency

Shared state becomes more complicated when multiple execution contexts can mutate it.

Immutable flyweights largely avoid the problem because all consumers can safely read the same state.

Mutable flyweights require synchronization appropriate to the execution model.

In JavaScript, this may involve asynchronous interleaving within one agent or actual shared memory when mechanisms such
as `SharedArrayBuffer` are used.

The general rule remains the same: shared intrinsic state should be treated as immutable whenever practical.

## Serialization

A flyweight reference usually cannot be serialized as ordinary object identity.

Suppose:

```js
const tree = {
    type: treeType,
    x: 10,
    y: 20
};
```

The serialized representation may need to encode:

```json
{
  "type": "oak",
  "x": 10,
  "y": 20
}
```

On deserialization, the type must be resolved through the flyweight factory:

```js
const treeType = factory.get(data.type);

const tree = {
    type: treeType,
    x: data.x,
    y: data.y
};
```

The factory therefore acts as part of the reconstruction mechanism when canonical shared identity matters.

## Persistence

Flyweight identity is generally an implementation concern rather than a persistence identity.

A database should not normally store:

```text
flyweight object identity = 0x123456
```

Instead, it should store a stable domain key representing the intrinsic state:

```text
type = "oak"
```

The application can then resolve that key to the appropriate flyweight instance.

This keeps persistence independent from process-local object identity.

## Performance

Flyweight can reduce memory consumption and object allocation significantly when sharing opportunities are substantial.

Potential benefits include:

* fewer duplicated objects;
* reduced memory footprint;
* lower garbage-collection pressure;
* improved cache locality in some designs;
* centralized storage of large immutable resources.

However, Flyweight can also introduce costs:

* factory lookup;
* key construction;
* additional indirection;
* more complex object access;
* external management of extrinsic state.

The pattern should therefore be evaluated using measurements rather than assumed to be faster.

Memory reduction is usually the strongest justification.

## Data-Oriented Alternatives

For extremely large populations, a conventional object-oriented Flyweight design may not be the best representation.

A data-oriented design may instead use arrays or typed arrays:

```js
const positionsX = new Float32Array(count);
const positionsY = new Float32Array(count);
const typeIds = new Uint16Array(count);
```

Shared type information can then be stored separately:

```js
const types = [
    /* shared type definitions */
];
```

This achieves a similar conceptual separation:

```text
per-instance data
shared type data
```

but uses a data-oriented representation rather than a collection of flyweight objects.

Flyweight is therefore a conceptual state-sharing technique, not a requirement to literally create classes named
`Flyweight`.

## Flyweight in Game Development

Games frequently contain huge numbers of entities sharing common resources.

For example:

```js
class TreeType {
    constructor({
                    mesh,
                    texture,
                    material
                }) {
        this.mesh = mesh;
        this.texture = texture;
        this.material = material;
    }

    draw(x, y, rotation) {
        renderer.draw(
            this.mesh,
            this.texture,
            this.material,
            x,
            y,
            rotation
        );
    }
}
```

Individual tree instances contain only contextual state:

```js
class Tree {
    constructor(type, x, y, rotation) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
    }

    draw() {
        this.type.draw(
            this.x,
            this.y,
            this.rotation
        );
    }
}
```

Thousands of trees can share one `TreeType` object.

The tree instances remain independent because position and rotation are extrinsic.

## Flyweight in Text Processing

Text processing is a classic Flyweight use case.

A document may contain millions of character occurrences but relatively few combinations of:

```text
character
font
size
style
```

The reusable representation can be shared:

```js
const glyph =
    glyphFactory.get(
        character,
        font,
        size,
        style
    );
```

Each occurrence then retains its own position and other contextual properties.

This can substantially reduce duplicated formatting data.

## Flyweight in Maps

Large maps may contain enormous numbers of repeated elements.

Instead of storing complete data for every tree, building, terrain tile, or decoration, the application can store:

```js
{
    typeId: 7,
        x
:
    120,
        y
:
    450
}
```

while type `7` refers to shared immutable data:

```js
types[7]
```

This is Flyweight-like even when implemented through IDs and tables rather than object references.

The important property is that repeated intrinsic state exists once.

## Flyweight and Resource Handles

Sometimes the shared object represents a resource descriptor rather than the resource itself.

For example:

```js
class TextureHandle {
    constructor(id) {
        this.id = id;
    }
}
```

Multiple entities can share the same handle:

```js
sprite1.texture = textureFactory.get("player");
sprite2.texture = textureFactory.get("player");
```

The actual resource may be managed elsewhere.

This can separate logical sharing from resource lifecycle management.

The distinction is important because a flyweight does not inherently imply ownership of the underlying external
resource.

## Refactoring Toward Flyweight

A common signal for Flyweight is a large collection of objects with highly duplicated immutable state.

Suppose:

```js
const objects = [
    {
        type: "oak",
        texture: "oak.png",
        mesh: "oak.mesh",
        material: "wood",
        x: 10,
        y: 20
    },
    {
        type: "oak",
        texture: "oak.png",
        mesh: "oak.mesh",
        material: "wood",
        x: 40,
        y: 80
    }
];
```

The repeated properties can be extracted:

```js
const oakType = factory.get("oak");
```

and the instances can retain only contextual state:

```js
const objects = [
    {
        type: oakType,
        x: 10,
        y: 20
    },
    {
        type: oakType,
        x: 40,
        y: 80
    }
];
```

This refactoring should be performed when the repeated state is genuinely invariant across those objects.

## Recognizing Flyweight Opportunities

Look for collections where:

* object count is very large;
* many objects contain identical values;
* repeated state is immutable or safely shareable;
* the duplicated state is expensive in memory;
* objects differ primarily in a small amount of contextual data;
* equivalent objects can safely reference one shared representation.

A useful question is:

**Which properties identify the reusable type of this object, and which properties identify this particular
occurrence?**

The first group is a candidate for intrinsic state.

The second group is extrinsic state.

## Common Misuse

The most common misuse is introducing Flyweight without meaningful duplication.

If there are only a few objects, the additional factory and indirection may provide no benefit.

Another misuse is forcing mutable state into the flyweight.

For example:

```js
class BadFlyweight {
    constructor(type) {
        this.type = type;
        this.x = 0;
        this.y = 0;
    }
}
```

If multiple entities share the object, changing `x` or `y` changes the state seen by all of them.

Those properties are contextual and therefore do not belong in the shared flyweight.

## Unbounded Flyweight Registries

A factory can itself become a memory problem:

```js
class Factory {
    constructor() {
        this.values = new Map();
    }

    get(key) {
        if (!this.values.has(key)) {
            this.values.set(key, createFlyweight(key));
        }

        return this.values.get(key);
    }
}
```

If `key` can take an effectively unlimited number of values, the registry grows indefinitely.

A Flyweight Factory should therefore have a bounded or controlled key space whenever possible.

If the key space is unbounded, a cache with an eviction policy may be more appropriate.

## Over-Sharing

Not every repeated value should necessarily become intrinsic state.

Suppose two objects currently share:

```js
color = "blue"
```

but their colors can change independently later.

The value is not semantically intrinsic merely because it happens to be equal at the moment.

Flyweight requires **shareability**, not merely equality.

A property belongs in the flyweight when sharing it remains correct for the entire lifetime of the relevant objects.

## Hidden Mutable State

A flyweight can accidentally contain mutable nested objects:

```js
class Flyweight {
    constructor(config) {
        this.config = config;
    }
}
```

Even if the flyweight itself is not reassigned, `config` may be mutable.

```js
flyweight.config.theme = "dark";
```

Every consumer now observes the mutation.

Shared state must therefore be immutable throughout its reachable object graph when strong isolation is required.

Shallow `Object.freeze()` may not be sufficient for deeply nested mutable structures.

## Testing

Flyweight tests should verify both sharing correctness and behavioral correctness.

For example:

```js
const a = factory.get("oak");
const b = factory.get("oak");

expect(a).toBe(b);
```

The factory should return the same canonical instance for equivalent intrinsic state.

Different intrinsic states should remain distinct:

```js
const oak = factory.get("oak");
const pine = factory.get("pine");

expect(oak).not.toBe(pine);
```

Tests should also verify that extrinsic state does not leak between logical objects.

```js
const tree1 = new Tree(oak, 10, 20);
const tree2 = new Tree(oak, 50, 80);

tree1.x = 100;

expect(tree2.x).toBe(50);
```

The test demonstrates that the shared flyweight does not contain occurrence-specific state.

## Architectural Considerations

Flyweight is most useful when object populations are large enough for representation strategy to become an architectural
concern.

It can be applied within:

* rendering systems;
* parsers;
* compilers;
* document models;
* game engines;
* data processing systems;
* visualization systems;
* large UI models;
* protocol implementations.

At larger scales, Flyweight often becomes part of a broader data representation strategy rather than an isolated class
pattern.

The architectural objective remains the same: prevent repeated immutable state from being represented independently when
it can safely be shared.

## Dependency Injection

A Flyweight Factory can be injected into components that need shared state.

```ts
class TreeRepository {
    constructor(
        private readonly treeTypes: TreeTypeFactory
    ) {
    }

    createTree(input: TreeInput): Tree {
        const type =
            this.treeTypes.get(input.type);

        return new Tree(
            type,
            input.x,
            input.y
        );
    }
}
```

This avoids creating separate registries throughout the application.

The factory can have an explicit lifecycle corresponding to the scope in which sharing is required.

## Scope of Sharing

Sharing should occur at the smallest scope that provides meaningful reuse.

A globally shared registry can maximize reuse but also increases:

* lifecycle complexity;
* memory retention;
* coupling;
* testing difficulty;
* global state concerns.

A document-scoped factory may be preferable for document-specific flyweights.

A scene-scoped factory may be preferable for game resources.

A request-scoped factory may be appropriate when shared representations should exist only during one operation.

The scope is part of the Flyweight design.

## Benefits

Flyweight provides several benefits.

**Reduced memory usage.** Repeated intrinsic state is stored once.

**Lower allocation pressure.** Fewer complete objects need to be allocated.

**Reduced duplication.** Shared immutable state has one canonical representation.

**Centralized reusable resources.** Common descriptors and resources can be managed consistently.

**Potential performance improvements.** Smaller object representations can reduce memory pressure and garbage
collection.

**Explicit state separation.** The distinction between intrinsic and extrinsic state can clarify the domain model.

## Costs

Flyweight introduces its own complexity.

**Factory overhead.** Shared instances must be located or created.

**Indirection.** Logical objects reference shared state instead of containing it directly.

**Context management.** Extrinsic state must be maintained separately.

**Lifecycle complexity.** Shared objects may live longer than individual consumers.

**Key management.** Correct canonicalization requires reliable identity keys.

**Concurrency concerns.** Mutable shared state can create synchronization problems.

**Debugging complexity.** Object identity no longer corresponds directly to logical entity identity.

**Potential memory retention.** An unbounded registry can keep flyweights alive indefinitely.

The pattern is therefore justified primarily when the memory or representation benefits are meaningful.

## Decision Criteria

Use Flyweight when the primary design question is:

**How can many logically distinct objects share the same immutable or safely shareable state instead of storing
duplicate copies of that state?**

Consider Flyweight when:

* there are very many objects;
* intrinsic state is heavily duplicated;
* intrinsic state can be safely shared;
* extrinsic state can be represented separately;
* memory consumption is significant;
* a stable canonicalization key can be defined.

Do not introduce Flyweight merely because objects happen to have some equal properties.

## Summary

Flyweight reduces memory consumption by sharing intrinsic state among many logical objects while keeping extrinsic state
outside the shared object.

Its defining concepts are **intrinsic state, extrinsic state, canonical shared instances, and a mechanism for resolving
equivalent intrinsic state to the same representation**.

The Flyweight Factory commonly maintains the canonical instances and ensures that repeated requests for equivalent state
return the same flyweight.

Flyweight is distinct from Object Pool because flyweights are simultaneously shareable while pooled objects are normally
reused by one consumer at a time. It is distinct from Singleton because a factory can manage many flyweights. It is
distinct from Cache because the purpose is semantic state sharing rather than merely retaining previously computed
results. It is distinct from Prototype because it shares rather than clones state.

In JavaScript, Flyweight can be implemented with ordinary objects, maps, functions, IDs, tables, typed arrays, or other
data-oriented structures. The implementation mechanism is secondary to the state-sharing model.

The pattern is most effective when a very large number of logical objects contain a relatively small number of repeated,
safely shareable intrinsic states.

The central design principle is: **identify state that is invariant and shareable, store it once, and keep
occurrence-specific context outside the shared representation.**

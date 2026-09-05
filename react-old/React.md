# React

Extremely popular, **declarative**, **component-based**, **state-driven** **JavaScript library for building user interfaces** created by Facebook.

- **Components** are the **building blocks** of user interfaces in React.
- We build complex UIs by **building and combining multiple components**.
- **Declarative** telling React what a component should look like, based on current data/state.
- React is abstraction away from DOM: we never touch the DOM
- JSX is a syntax that combines HTML, CSS and JavaScript as well as referencing other components.

React reacts to State changes by re-rendering the UI.

- Rendering components on a webpage (UI) based on their current state.
- Keeping the UI in sync with state, by re-rendering (reacting) when state changes.

## What is JSX?

JSX is a syntax that combines HTML, CSS and JavaScript as well as referencing other components.

- JSX stands for JavaScript XML.
- Declarative syntax to describe what components look like and how they work
- Components must return a block of JSX
- Extension of JavaScript that allows us to embed JavaScript, CSS, and React components into HTML
- Each JSX element is converted to a React.createElement function call
- We could use React without JSX

### Imperative vs. Declarative

Imperative:

- Manual DOM element selections and DOM traversing
- Step-by-step DOM mutations until we reach the desired UI

Declarative:

- Describe what UI should look like using JSX, **based on current data**
- React is an **abstraction** away from DOM **we never touch the DOM**
- Instead, we think of the UI as a **reflection of the current data**

## Components

- React applications are entirely made out of **components**.
- **Building blocks** of user interfaces in React.
- Piece of UI that has its own **data**, **logic** and **appearance** (how it works and looks).
- We build complex UIs by building and combining components.
- Components can be **nested**, **reused** inside of each other, **configurable** by passing data between them.

Component structure:

- **Data** (Props / State)
- **JS Logic**
- **Appearance**: JSX (HTML, CSS, JS inside {})

Rendering List:

- Rendering multiple components at once using the Javascript **.map()** method

Conditional Rendering:

- Components can be conditionally rendered using JS tools: **&&,** **ternary** or **multiple return statements**.

Props:

- To pass data from parent to child components (immutable and one-way data binding)

## Three Tenets of Components

1. **Nesting** - A component can be shown inside of another
2. **Reusability** - We want to make components that can be easily reused through out application
3. **Configuration** - We should be able to configure a component when it is created

## Separation of Concerns

- One technology per file - **One component per file.**  
- Each component is concerned with one piece of the UI.

## React Props System

It is a **system for passing data from a parent component to a child component**. The goal is to customize or configure a child component:

- Customize how a component looks
- Customize how a component behaves

Props:

- Props are used to pass data from **parent components** to **child components** (down the component tree)
- Essential tool to **configure** and **customize** components (like function parameters)
- With props, parent components control how child components look and work
- **Anything** can be passed as props: single values, arrays, objects, functions, even other components
- Props are **read-only**, they are **immutable**! This is one of Data React’s strict rules.
- If you need to mutate props, you **actually need state**

  - Mutating props would affect parent, creating side effects (not pure)
  - Components have to be pure functions in terms of props and state
  - This allows React to optimize apps, avoid bugs, make apps predictable

### Data Binding

React uses one-way data binding (from parent to child components)

## State

- Data that a component **can hold over time**, necessary for information that it needs to **remember** throughout the app’s lifecycle
- **“Component’s memory”**
- **Component state**: Single local component variable (“Piece of state”, “state variable”)
- Updating **component state** triggers React to **re-render the component**
- Each component has and manages its own state, no matter how many times we render the same component

### PRACTICAL GUIDELINES ABOUT STATE

- Use a state variable for any data that the component should keep track of (“remember”) over time. **This is data that will change at some point**. In Vanilla JS, that’s a let variable, or an [] or {}
- Whenever you want something in the component to be **dynamic**, create a piece of state related to that “thing”, and update the state when the “thing” should change (aka “be dynamic”)
- If you want to change the way a component looks, or the data it displays, **update its state**. This usually happens in an **event handler** function.
- When building a component, imagine its view **as a reflection of state changing over time**
- For data that should not trigger component re-renders, **don’t use state**. Use a regular variable instead. This is a common beginner mistake.

### STATE vs PROPS

STATE:

- **Internal** data, owned by component
- Component “memory”
- Can be updated by the component itself
- Updating state causes component to re-render
- Used to make components interactive

PROPS:

- **External** data, owned by parent component
- Similar to function parameters
- Read-only
- **Receiving new props causes component to re-render.** Usually when the parent’s state has been updated
- Used by parent to configure child component (“settings”)

## Thinking in React

1. Break the desired UI into components and establish the component tree
-*********************************************

## React Component

A component is a **Function** or **Class** that produces HTML to show to the user (using JSX) and handles feedback from the user (using Event Handlers).

## Class Components

- Can produce JSX to show content to the user.
- Can use the LifeCycle Method system to run code at specific points in time.
- Can use the 'state' system to update content on the screen.

### Rules of Class Components

- Must be a JavaScript class
- Must extend (subclass) React.Component
- Must define a 'render' method that returns some amount of JSX

### Rules of State

- Only usable with class components
- "State" is a JS object that contains data relevant to a component
- Updating "state" on a component causes the component to (almost) instantly rerender
- State must be initialized when a component is created
- State can only be updated using the function 'setState'

### Life-Cycle Methods

- constructor
- componentDidMount
- componentDidUpdate
- componentWillReceiveProperties
- componentWillUnmount
- ...

## Functional Components

- Can produce JSX to show content to the user.
- Can use Hooks to run code at specific points in time.
- Can use Hooks to access state system and update content on the screen.

### Hooks

When using functional components we can simulate life-cycle methods using the useEffect hook:

#### useState()

```js
const [term, setTerm] = useState(''); // Initialization
term; // Reference
setTerm; // Updates
```

#### useEffect()

```js
useEffect(() => {
  // ... nothing - Runs at initial render & run after every rerender
});

useEffect(() => {
  // Runs at initial render
}, []);

useEffect(() => {
  // Runs at initial render & run after every rerender if deps has changed since last render
}, [term]);
```

### Debouncing

We can debounce the entered user inputs using useEffect + setTimeout:

1. First set the original term
2. Second use the debounced term for the request

```js
const [term, setTerm] = useState('programming');
const [debouncedTerm, setDebouncedTerm] = useState(term);

// Debounce the search term in a separate useEffect
useEffect(() => {
  const timeoutId = setTimeout(() => {
    setDebouncedTerm(term);
  }, 1000);

  return () => clearTimeout(timeoutId);
}, [term]);

// Use the debounced search term whenever the debounced term changes
useEffect(() => {
  const search = async () => {
    // ...
  };
  search();
}, [debouncedTerm]);
```

## Controlled vs. Uncontrolled Elements

We store the data instead of having to reach out to the DOM and get the new value.

## React Application

1. Import React and ReactDOM libraries
2. Get a reference to the div with ID root
3. Tell React to take control of that element
4. Create a component
5. Show the component on the screen

```js
// 1) Import React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom/client';

// 2) Get a reference to the div with ID root
const el = document.getElementById('root');

// 3) Tell React to take control of that element
const root = ReactDOM.createRoot(el);

// 4) Create a component
function App() {
  return <App />;
}

// 5) Show the component on the screen
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Summary

- Data management and Caching with React Query
- Global state management with Zustand
- Routing with React Router

### React Query

**useEffect** problems and limitations:

- no request cancellation
- no separation of concerns (the querying logic is leaked into the component - no modularity, no reuse)
- no retries
- no automatic refresh
- no caching (The process of storing data in a place where it can be accessed more quickly and efficiently in the future)

**React Query** provides additional features like the following:

- Caching
- Automatic retry
- Automatic refresh
- Paginated queries
- Infinite queries

Usually implementations involve

**Querying Data:**

- Fetch Data
- Handle Errors
- Implement pagination
- Implement infinite queries
- Debug queries with React Query Devtools

**Mutating Data:**

- Handle CRUD
- Implement optimistic updates
- Create custom hooks
- Create reusable services

Global state management (with these tools Redux is no longer needed)

- Reducers
- Context
- Providers
- Zustand

// ===================================================
// CONTROL FLOW
// Focus: Strict equality, immutability, early returns.
// ===================================================
// if statement
// if-else statement
// else-if chained
// switch statement
// ternary operator

const processUser = (user) => {
    // 1. if, if-else, else-if chained (Early Return Pattern)
    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === 'admin') {
        return 'Full Access';
    } else if (user.role === 'editor') {
        return 'Partial Access';
    }

    if (user.permission === "can:read") {
        return 'Read Permission';
    } else if (user.permission === "can:write") {
        return 'Write Permission';
    } else if (user.permission === "can:execute") {
        return 'Execute Permission';
    }

    // 2. switch statement (Strict type checking, block scoping)
    switch (user.status) {
        case 'active': {
            const activeScore = user.score || 0;
            return `Active: ${activeScore}`;
        }
        case 'suspended':
            return 'Suspended Account';
        default:
            return 'Unknown Status';
    }
}

// 3. ternary operator (Clean inline assignments)
const isPremium = true;
const accessLevel = isPremium ? 'Gold' : 'Standard';

// ===================================================
// LOOPS
// Focus: Iterator helpers, functional iteration, performance.
// ===================================================
// while
// do-while
// for
// for in
// for of
// forEach
// break
// continue
// labeled statements

const processItems = (items) => {
    // 1. Regular for loop when n is known
    for (let i = 0; i < items.length; i++) {
        console.log(items[i]);
    }

    // 2. for...of (Preferred for arrays/iterables)
    for (const item of items) {
        if (item.ignore) continue; // continue statement
        if (item.isFatal) break;   // break statement
        console.log(item.id);
    }

    // 3. forEach (Functional approach, side effects)
    items.forEach((item) => item.processed = true);

    // 4. for...in (Only for plain object property iteration, guarded)
    const config = {a: 1, b: 2};
    for (const key in config) {
        if (Object.hasOwn(config, key)) {
            console.log(key, config[key]);
        }
    }

    // 5. while & do-while (Used primarily for unknown iteration counts)
    const attemptConnection = () => true;
    let retries = 3;

    while (retries > 0) {
        const success = attemptConnection();
        if (success) break;
        retries--;
    }

    do {
        const success = attemptConnection();
        if (success) break;
        retries--;
    } while (retries > 0);

    // 6. labeled statements (Rare, used for breaking outer loops)
    const matrix = [[1, 2, 3], [4, null, 6], [7, 8, 9]];

    outerLoop: for (const row of matrix) {
        for (const cell of row) {
            if (cell === null) break outerLoop;
        }
    }
}

// ===================================================
// OBJECTS
// Focus: Shorthand syntax, deep cloning, optional chaining.
// ===================================================
// object creation
// object properties
// object methods
// getters and setters
// object copy
// object spread
// object destructuring
// optional chaining

// 1. object creation, properties, methods, getters/setters
const obj1 = {} // using object literal
const obj2 = Object.create(Object.prototype);
const obj3 = Object.create(null); // completely empty object - without object prototype pollution

// FACTORY FUNCTION - not constructor function
const createUser = (name, age) => ({
    // Data Properties (stored values directly in memory)
    name,       // Property shorthand
    age,        // Property shorthand
    _score: 0,  // Private convention (or use # in classes)

    // Accessor Properties (Getters and Setters)
    // Use different name for the underlying Data Property to avoid infinite call to self
    get score() {
        return this._score;
    },

    set score(value) {
        this._score = Math.max(0, value); // Validation
    },

    update() {  // Method shorthand
        this._score++;
    }
});

const userObj = createUser('John', 30);

// CONSTRUCTOR FUNCTION
function User(name, age) {
    // Data Properties (Instance-specific, stored directly on the object)
    this.name = name;
    this.age = age;
    this._score = 0; // Private convention indicator
}

// Accessor Properties (Getters and Setters)
// Attached to the prototype using Object.defineProperty to share across all instances
Object.defineProperty(User.prototype, 'score', {
    get: function () {
        return this._score;
    },

    set: function (value) {
        this._score = Math.max(0, value); // Validation
    },

    enumerable: false,   // Prevents 'score' from showing up in for...in loops
    configurable: true
});

// Methods
// Attached to the prototype for maximum memory efficiency
User.prototype.update = function () {
    this._score++;
};

// This ensures that no matter how many `User` instances you create,
// the engine only allocates memory for the `score` accessor and the `update` method exactly once.

// Must use the 'new' keyword to bind 'this' to the new object instance
const user = new User('John', 30);

// 2. object spread (Shallow copy / merge)
const updatedUser = {...userObj, location: 'Earth'};

// 3. object destructuring
const {name, age: userAge} = updatedUser; // extract properties, give different names
const {name, ...strippedUser} = updatedUser; // sanitize object by striping properties

// 4. object copy (Modern deep copy via structuredClone)
const shallowCopiedUser1 = {...updatedUser};
const shallowCopiedUser2 = Object.assign({}, updatedUser);
const deepCopiedUser1 = JSON.parse(JSON.stringify(updatedUser)); // works only with serializable properties
const deepCopiedUser2 = structuredClone(updatedUser);

// 5. optional chaining (?.) and nullish coalescing (??)
const zipCode = updatedUser.address?.zip ?? '00000';

// ===================================================
// BUILT-IN OBJECTS
// Focus: Memory efficiency, security, immutability.
// ===================================================
// Object
// Function
// Symbol
// Error
// number
// bigint
// math
// date
// temporal
// string
// regexp
// intl
// array
// typed array
// map
// set
// arraybuffer
// json
// iterator
// generator
// promises
// reflect
// proxy

// 1. Object (Using null-prototype and freeze for maximum security)
const secureConfig = Object.freeze(Object.create(null, {
    apiEndpoint: {value: '[https://api.example.com](https://api.example.com)', enumerable: true}
}));

// 2. Function (Using secure binding over dynamic evaluation)
const logAction = function(action) { console.log(`[${this.context}]${action}`); };
const boundLog = logAction.bind({ context: 'SecurityContext' });

// 3. Symbol (Guaranteed unique property keys preventing naming collisions)
const INTERNAL_ID = Symbol('Internal Identifier');
const user = { [INTERNAL_ID]: 1042, name: 'Alice' };

// 4. Error (Using error cause for tracing without losing original context)
try {
    throw new TypeError('Invalid input format');
} catch (err) {
    const appError = new Error('Data processing failed', { cause: err });
    throw appError;
}

// 5. number (Strict type checking avoiding global coercion)
const isValidId = Number.isSafeInteger(1042) && !Number.isNaN(1042);
const maxNumber = Number.MAX_VALUE;

// 6. bigint (Handling integers beyond Number.MAX_SAFE_INTEGER without precision loss)
const highPrecisionTimestamp = 1722792285000000000n; // Nanosecond precision

// 7. math (Using fast C++ bindings under the hood for optimization)
const optimizedRounding = Math.trunc(42.987); // Faster than floor/ceil for stripping decimals

// 8. date (Legacy time parsing - explicitly aligning to 2026 context)
const legacyDate = new Date('2026-08-04T19:24:45Z');
const currentUnix = Date.now(); // Maximum performance for timestamp generation

// 9. temporal (2026 Standard for time - replacing legacy Date)
const skopjeTime = Temporal.Now.zonedDateTimeISO('Europe/Skopje');
const specificDate = Temporal.PlainDate.from('2026-08-04');

// 10. string (Memory efficient substring checks and well-formedness validation)
const rawData = '  secure_payload_data  ';
const cleanData = rawData.trim();
const isSafe = cleanData.isWellFormed(); // Validates against malformed surrogates

// 11. regexp (Using 'v' flag for advanced unicode sets and strict security)
const usernameRegex = /^[\p{Script=Latin}\d_]{3,16}$/v;
const isUsernameValid = usernameRegex.test('John_Doe_2026');

// 12. intl (High-performance localized formatting based on Skopje/MKD context)
const mkdFormatter = new Intl.NumberFormat('mk-MK', {
    style: 'currency',
    currency: 'MKD'
});
const priceDisplay = mkdFormatter.format(1500.50);

// 13. array (Using immutable methods to prevent side effects)
const dataset = [10, 5, 20];
const sortedDataset = dataset.toSorted((a, b) => a - b); // Does not mutate original array

// 14. typed array (Maximum memory efficiency and performance for binary data)
const secureBuffer = new Uint8Array(32);
crypto.getRandomValues(secureBuffer); // Secure random generation into contiguous memory

// 15. map (Optimized key-value storage without Object prototype pollution)
const sessionCache = new Map();
sessionCache.set('session_id_42', { active: true });

// 16. set (O(1) lookups and modern composition methods)
const allowedRoles = new Set(['admin', 'editor']);
const userRoles = new Set(['editor', 'viewer']);
const validRoles = allowedRoles.intersection(userRoles); // Modern Set methodology

// 17. arraybuffer (Raw binary memory allocation)
const rawMemory = new ArrayBuffer(1024);
const dataView = new DataView(rawMemory);
dataView.setInt32(0, 42, true); // Little-endian writing directly to buffer

// 18. json (Safe parsing using a reviver function to strip sensitive data)
const jsonString = '{"token": "xyz123", "public": true}';
const safeData = JSON.parse(jsonString, (key, value) => {
    return key === 'token' ? undefined : value; // Strip token during parse step
});

// 19. iterator (Modern Iterator Helpers for memory-efficient lazy evaluation)
const numberIterable = [1, 2, 3, 4, 5].values();
const lazyMapped = Iterator.from(numberIterable).map(x => x * 2).take(3);

// 20. generator (Yielding large sequences without consuming RAM)
function* secureIdGenerator() {
    let id = 1000;
    while (true) yield id++; // Only calculates next ID when explicitly requested
}
const idGen = secureIdGenerator();


// 21. promises (Promise.withResolvers for flattened control flow)
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve('Task Completed in 2026'), 50);

// 22. reflect (Safer metaprogramming alternatives to Object methods)
const targetConfig = { timeout: 5000 };
Reflect.set(targetConfig, 'timeout', 2000);
const hasTimeout = Reflect.has(targetConfig, 'timeout');

// 23. proxy (Maximum security via interception and validation)
const proxyTarget = {};
const validatorProxy = new Proxy(proxyTarget, {
    set(target, property, value, receiver) {
        if (property === 'role' && value !== 'user') {
            throw new Error('Unauthorized role elevation attempt');
        }
        return Reflect.set(target, property, value, receiver);
    }
});

// ===================================================
// FUNCTIONS
// Focus: Pure functions, immutability, arrow syntax.
// ===================================================
// function params
// function return
// function execution
// function as objects
// function as methods
// function context (this)
// function scope
// function arrow
// function anonymous
// function callback
// function higher-order (hoc)
// side-effects
// pure functions
// impure functions
// factory functions
// recursive functions
// iife
// currying
// memoization

// 1. function params (Defaults, rest), execution, return
const calculateTax = (amount, rate = 0.18, ...discounts) => {
    const totalDiscount = discounts.reduce((sum, d) => sum + d, 0);
    return (amount - totalDiscount) * rate;
};

// 2. arrow functions, lexically bound `this`
const UIHandler = {
    element: 'Button',
    attach() {
        // Arrow function prevents loss of 'this' context
        document.addEventListener('click', () => console.log(this.element));
    }
};

// 3. higher-order functions (HOC), pure functions
// Pure: No side effects, deterministic
const withLogging = (fn) => (...args) => {
    console.timeStamp(`Calling function`);
    return fn(...args);
};

// 4. memoization (Performance optimization)
const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// 5. IIFE (Immediately Invoked Function Expression)
// Often replaced by modules, but still useful for isolated scopes.
(() => {
    const isolatedVar = true;
})();

// 6. currying
const multiply = (a) => (b) => (c) => a * b * c;

// ===================================================
// OOP & CLASSES
// Focus: Private fields (#), Composition over inheritance.
// ===================================================
// prototype
// prototype properties
// prototype methods
// prototype inheritance
// prototype inheritance patterns
// constructor function

// 1. prototype inheritance (Legacy pattern, typically avoid in favor of Classes/Composition)
function AnimalLegacy(name) {
    this.name = name;
}
AnimalLegacy.prototype.speak = function() { return this.name; };

// ===================================================
// Classes:
// class properties
// class methods
// class inheritance
// class composition
// class advanced features
// class design patterns

// 2. ES Classes (Modern approach)
class DatabaseConnection {
    // class properties (public and private)
    #connectionString; // Private field (Memory efficient & secure)
    static #instanceCounter = 0; // Static private

    constructor(uri) {
        this.#connectionString = uri;
        DatabaseConnection.#instanceCounter++;
    }

    // getters/setters
    get uri() {
        return this.#connectionString.replace(/:[^:]*@/, ':***@'); // Mask password
    }

    // class methods
    async connect() {
        // connection logic
        return true;
    }
}

// 3. class inheritance
class SecureDatabaseConnection extends DatabaseConnection {
    constructor(uri, cert) {
        super(uri);
        this.cert = cert;
    }
}

// 4. class composition (Preferred over deep inheritance hierarchies)
const CanLog = (Base) => class extends Base {
    log() { console.log(this.name); }
};

// ===================================================
// ERRORS
// Focus: Custom error hierarchies, Error causes (ES2022+).
// ===================================================
// error object
// throwing errors
// handling errors
// handling async errors
// custom errors
// error patterns

// 1. custom errors
class NetworkError extends Error {
    constructor(message, options) {
        super(message, options); // options can include 'cause'
        this.name = 'NetworkError';
        this.statusCode = options?.statusCode || 500;
    }
}

// 2. throwing & handling errors (including async)
const fetchDataSecure = async () => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            // 3. error object with cause
            throw new NetworkError('Failed to fetch', {
                cause: new Error('Server returned non-200'),
                statusCode: response.status
            });
        }
        return await response.json();
    } catch (error) {
        // 4. error patterns (Type checking)
        if (error instanceof NetworkError) {
            console.error(`Network fault: ${error.statusCode}`, error.cause);
        } else {
            console.error('Unknown application error', error);
        }
        // Re-throw or handle gracefully
        throw error;
    }
};

// ===================================================
// ASYNC FLOW
// Focus: Promise.withResolvers, async/await, avoiding unhandled rejections.
// ===================================================
// callback
// callback asynchronous
// callback problems (callback hell)
// callback patterns
// callback applications

// 1. callback (Legacy, avoid for control flow, use for event listeners)
document.addEventListener('click', (e) => { /* callback */ });

// ===================================================
// Promises:
// promise creation
// promise consuming
// promise chaining
// promise error handling
// promise utility methods
// promise patterns
// promise advanced patterns (promisify)

// 2. promise creation & Promise.withResolvers (ES2024 - Cleaner creation)
const { promise, resolve, reject } = Promise.withResolvers();
setTimeout(() => resolve('Done'), 1000);

// ===================================================
// Async-Await:
// async-await-fundamentals
// async-await-function-behavior
// async-await-control-flow
// async-await-error-handling
// async-await-patterns
// async-await-advanced-concepts

// 3. async-await-fundamentals & control flow
const processUserDataAsync = async (userId) => {
    try {
        // 4. promise advanced patterns (Promise.allSettled for robust concurrency)
        const [profileResult, permissionsResult] = await Promise.allSettled([
            fetch(`/api/users/${userId}`),
            fetch(`/api/permissions/${userId}`)
        ]);

        if (profileResult.status === 'rejected') {
            throw new Error('Critical profile load failure');
        }

        return {
            profile: profileResult.value,
            permissions: permissionsResult.status === 'fulfilled' ? permissionsResult.value : []
        };
    } catch (err) {
        // 5. async-await-error-handling
        console.error('Data processing halted:', err);
    }
};

// ===================================================
// NETWORKING
// Focus: Standard fetch, AbortController, Security Headers.
// ===================================================
// http methods
// http headers
// http error codes
// http error handling
// xhr
// fetch
// --------------
// http
// websocket
// sse
// webtransport
// --------------
// JSON
// XML
// FormData
// --------------
// cors
// csp
// tls
// cookies

const secureApiRequest = async (url, data) => {
    // 1. AbortController for memory efficiency and hanging prevention
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        // 2. fetch, http methods, headers, cors
        const response = await fetch(url, {
            method: 'POST', // HTTP Method
            mode: 'cors',   // CORS policy
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer <token>',
                'X-Content-Type-Options': 'nosniff'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        // 3. HTTP error codes handling
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json(); // JSON payload
    } finally {
        clearTimeout(timeoutId);
    }
};

// 4. WebSocket (Real-time bidirectional)
const ws = new WebSocket('wss://[secure.example.com/stream](https://secure.example.com/stream)');
ws.onmessage = (event) => console.log(event.data);

// 5. SSE (Server-Sent Events - Unidirectional)
const eventSource = new EventSource('/api/events');

// ===================================================
// BROWSER STORAGE
// Focus: IndexedDB for heavy data, Secure Cookies for auth.
// ===================================================
// localStorage
// sessionStorage
// indexed-db
// caches
// cookies

// 1. localStorage & sessionStorage (Synchronous, string-only - use sparingly)
sessionStorage.setItem('theme', 'dark');

// 2. Cookies (Always use Secure, HttpOnly, SameSite for security)
document.cookie = "sessionId=12345; Secure; SameSite=Strict; max-age=3600";

// 3. Indexed-db (Best for structured, offline-capable storage)
// (Usually accessed via wrapper libraries like idb for Promises)
const openDB = indexedDB.open('AppDB', 1);
openDB.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('users', { keyPath: 'id' });
};

// 4. Caches API (Service Worker context / Asset caching)
async function cacheAppShell() {
    const cache = await caches.open('app-shell-v1');
    await cache.addAll(['/index.html', '/styles.css', '/app.js']);
}

// ===================================================
// INPUT/OUTPUT
// Focus: Streams API for memory efficiency, File API.
// ===================================================
// file client side
// file server side
// file reader
// file uploads
// blob
// array buffer
// text encoder/decoder
// streams
// readable stream
// writeable stream
// transform stream

// 1. file client side, blob, file reader
const handleFileUpload = async (fileInput) => {
    const file = fileInput.files[0]; // File object (inherits from Blob)

    // 2. streams (ReadableStream processing chunk-by-chunk - maximum memory efficiency)
    const stream = file.stream();
    const reader = stream.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // value is a Uint8Array (chunk of the file)
        processChunk(value);
    }
};

// 3. text encoder/decoder (Handling binary string conversions)
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');
const uint8Array = encoder.encode('Secure String');
const decodedString = decoder.decode(uint8Array);

// 4. transform stream (Piping streams)
const transformStream = new TransformStream({
    transform(chunk, controller) {
        // Encrypt or modify chunk before enqueuing
        controller.enqueue(chunk);
    }
});

// ===================================================
// MODULES
// Focus: ES Modules (ESM), Dynamic Imports for code splitting.
// ===================================================
// commonjs
// es modules (esm)
// export
// import
// dynamic imports
// circular dependencies

// 1. ES modules export (mathUtils.js)
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

// 2. default export
export default class Calculator { /* ... */ }

// 3. ES modules import (app.js)
import Calculator, { add } from './mathUtils.js';

// 4. dynamic imports (Lazy loading for maximum optimization & performance)
const loadHeavyModule = async () => {
    try {
        const { heavyComputation } = await import('./heavyModule.js');
        heavyComputation();
    } catch (error) {
        console.error('Failed to load module', error);
    }
};

// 5. Circular dependencies handling:
// Best practice: Refactor shared logic into a third module that both depend on,
// rather than importing each other directly.

// =============================================================================
// structs.cpp — Structs, Enums, Scope, Pointers, and Structured Bindings
// =============================================================================
//
// STRUCT:
//   A struct groups related variables (members) under one named type.
//   Members are public by default — the only difference between struct and class
//   is that class defaults to private. Prefer struct for plain data (POD types),
//   class for types with invariants and encapsulation.
//
//   struct Car { string model; int year; };  // declaration (type definition)
//   Car audi = {"Audi", 2020};               // definition (variable, aggregate init)
//
// AGGREGATE INITIALIZATION (C++11):
//   Members are initialized in declaration order.
//   Missing trailing members are zero/default initialized.
//     Car audi = {"Audi", "Petrol", Color::WHITE, 2020, 4};  // all members
//     Car audi = {"Audi"};                                   // rest zero-initialized
//   C++20 designated initializers (clearer, order must match):
//     Car audi = {.model="Audi", .year=2020};
//
// SCOPE — WHERE YOU DECLARE MATTERS:
//   Global (external) scope  — before any function; visible to all functions in the file
//   Local (function) scope   — inside a function; visible only within that block
//   In multi-file projects: declare structs in .h headers for shared visibility.
//
// COPY vs POINTER:
//   Car copy = bmw;      — value copy; independent object, modifying copy leaves bmw unchanged
//   Car* ptr = &bmw;     — pointer to bmw's address; ptr->field modifies bmw directly
//   Car& ref = bmw;      — reference (alias); ref.field also modifies bmw directly
//
//   Pointer member access:
//     (*ptr).doors   — dereference then access (verbose)
//     ptr->doors     — arrow operator, identical but idiomatic
//
// PASSING STRUCTS TO FUNCTIONS:
//   void show(Car c)          — copy, safe but costly for large structs
//   void show(const Car& c)   — const ref, zero copy, read-only (PREFERRED for read)
//   void update(Car& c)       — ref, zero copy, allows mutation
//   void update(Car* c)       — pointer, same as ref but nullable (check for nullptr)
//
// ENUM vs ENUM CLASS:
//   enum Color { BLACK, WHITE };        // unscoped — BLACK pollutes the enclosing namespace
//   enum class Color { BLACK, WHITE };  // scoped   — must use Color::BLACK (PREFERRED)
//   Scoped enums also don't implicitly convert to int — safer, no accidental arithmetic.
//   Underlying type defaults to int; can be changed:
//     enum class Status : uint8_t { OK = 0, ERROR = 1 };
//
// STRUCTURED BINDINGS (C++17):
//   for (const auto& [model, engine, color, year, doors] : garage)
//   Binds each member by position to a named variable — essentially destructuring.
//   Names must match member order in the struct declaration, not the member names.
//   Using const auto& avoids copying each element.
//   Alternative (less precise but always works):
//     for (const auto& car : garage) { car.model; ... }
//
// ANONYMOUS STRUCTS:
//   struct { int x; int y; } point;   — type has no name, instance declared inline
//   Cannot be reused elsewhere — useful for one-off groupings or local temporaries.
//   Cannot be passed to functions by type name (no type to reference).
//
// NESTED STRUCTS:
//   struct Engine { string type; int hp; };
//   struct Car { string model; Engine engine; };
//   Car c = {"Audi", {"Petrol", 200}};
//   Access: c.engine.hp
//
// MEMORY LAYOUT — PADDING:
//   The compiler may insert padding bytes between members for alignment.
//   struct A { char c; int i; };  — likely 8 bytes, not 5 (3 bytes padding after c)
//   Reorder members largest-to-smallest to minimize padding:
//   struct A { int i; char c; };  — still 8 bytes but wastes less
//   Use __attribute__((packed)) or #pragma pack only when ABI/protocol requires it.
//
// POD (Plain Old Data) / TRIVIAL TYPES:
//   A struct with only primitive or trivially-copyable members is POD.
//   POD structs can be safely memcpy'd, zero-initialized, and used in C interop.
//   Adding constructors, destructors, or virtual functions makes a struct non-trivial.
//
// MEMBERWISE ASSIGNMENT:
//   Assigning one struct to another copies each member individually.
//     Car copy = bmw;   — each field of bmw copied into copy, fully independent after
//   Works automatically for any struct whose members are copyable.
//   SHALLOW COPY WARNING: if a member is a raw pointer, both structs point to the same
//   heap memory after assignment — modifying through one affects the other.
//   Use smart pointers or a custom copy constructor to handle ownership correctly.
//
// DEFINING VARIABLES AT STRUCT DECLARATION:
//   Variables can be created directly after the struct's closing brace:
//     struct Perks {
//         int  keyNumber;
//         char car[12];
//     } mrSmith, msJones;          — two Perks variables created inline
//
//   Can also initialize immediately:
//     } mrSmith = {42, "BMW"};     — declare + initialize in one shot
//
//   Useful for small local one-off groupings. For reusable types declare
//   the struct separately and define variables normally.
//
// STRING MEMBER vs CHAR ARRAY MEMBER:
//   struct Person {
//       std::string name;    — dynamic, safe, any length, heap-managed
//       char        tag[12]; — fixed, stack, max 11 chars + '\0', C interop
//   };
//   std::string member:
//     - No size limit, managed automatically, supports all string operations
//     - Makes the struct non-trivially-copyable (has a destructor)
//     - Cannot be used with memcpy safely
//   char array member:
//     - Fixed maximum size — buffer overrun if input exceeds it (use strncpy not strcpy)
//     - POD-compatible — safe for memcpy, C interop, binary serialization
//     - Must be null-terminated for string functions to work correctly
//
// ARRAY OF STRUCTS:
//   Car garage[2] = {audi, bmw};     — fixed-size stack array of structs
//   garage[0].model                  — access member of element
//   for (const auto& car : garage)   — range-for works naturally
//   std::vector<Car>                 — prefer for dynamic size (modern C++)
//
// BIT FIELDS:
//   A bit field declares a struct member that occupies a specific number of bits
//   rather than a full type's worth of bytes. Used to pack multiple flags or small
//   values into a single word — common in hardware registers, network protocols,
//   and memory-constrained systems.
//
//   Syntax:
//     struct Flags {
//         unsigned int isActive  : 1;  — 1 bit  (0 or 1)
//         unsigned int priority  : 3;  — 3 bits (0–7)
//         unsigned int errorCode : 4;  — 4 bits (0–15)
//     };                               — total: 8 bits, fits in 1 byte
//
//   Rules:
//     - Type must be integral (int, unsigned int, bool, uint8_t, etc.)
//     - Width must be > 0 and <= sizeof(type) * CHAR_BIT
//     - Unnamed bit field (: n) inserts n bits of padding/alignment gap
//     - Unnamed zero-width field (: 0) forces alignment to the next unit boundary
//     - Bit fields cannot have their address taken (&flags.isActive is illegal)
//     - Cannot be used in arrays: Flags arr[10] is fine, but arr[0].isActive++ is OK
//
//   Layout is implementation-defined:
//     - Bit ordering (LSB or MSB first) is not guaranteed by the standard
//     - The compiler may add padding between fields or at the end
//     - Do NOT use bit fields for serialization or cross-platform binary protocols
//       without verifying layout with your specific compiler and target platform
//     - For portable protocols use explicit masks and shifts on uint8_t/uint16_t instead
//
//   WHEN TO USE:
//     - Hardware register mapping (MCU/embedded, memory-mapped I/O)
//     - Packing many boolean flags into a single struct (saves memory vs bool array)
//     - Representing packed data that matches a known hardware layout on a fixed ABI
//
//   WHEN NOT TO USE:
//     - Cross-platform binary serialization — layout is not portable
//     - Performance-critical code — reading a bit field may generate more instructions
//       than reading a full int, and bit fields inhibit some compiler optimizations
//     - Any field that needs its address taken
//
// =============================================================================

#include <cstring>
#include <cstdint>
#include <iostream>
#include <string>
using namespace std;

// ─────────────────────────────────────────────────────────────────────────
// Scoped enum — Color::BLACK, not just BLACK (no namespace pollution)
// ─────────────────────────────────────────────────────────────────────────
enum class Color : uint8_t {
    BLACK,
    GRAY,
    WHITE,
};

string getColor(Color c); // prototype

// ─────────────────────────────────────────────────────────────────────────
// Global scope struct — visible to all functions in this file
// ─────────────────────────────────────────────────────────────────────────
struct Car {
    string model;
    string engine;
    Color color;
    int year;
    int doors;
};

// ─────────────────────────────────────────────────────────────────────────
// main
// ─────────────────────────────────────────────────────────────────────────
int main() {
    Car audi = {"Audi", "Petrol", Color::WHITE, 2020, 4};
    Car bmw = {"BMW", "Petrol", Color::BLACK, 2020, 4};

    Car garage[] = {audi, bmw};

    // Structured bindings (C++17) — destructure each Car by member order
    for (const auto &[model, engine, color, year, doors]: garage) {
        cout << "{\n";
        cout << "\tModel : " << model << "\n";
        cout << "\tEngine: " << engine << "\n";
        cout << "\tColor : " << getColor(color) << "\n";
        cout << "\tYear  : " << year << "\n";
        cout << "\tDoors : " << doors << "\n";
        cout << "},\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Copy — independent object, mutations don't affect the original
    // ─────────────────────────────────────────────────────────────────────────
    Car copy = bmw;
    copy.doors = 3;
    cout << "bmw.doors  (original): " << bmw.doors << "\n"; // 4 — unchanged
    cout << "copy.doors (modified): " << copy.doors << "\n\n"; // 3

    // ─────────────────────────────────────────────────────────────────────────
    // Pointer — points to original, mutations affect bmw directly
    // ─────────────────────────────────────────────────────────────────────────
    Car *ptr = &bmw;
    ptr->doors = 10; // same as (*ptr).doors = 10
    cout << "bmw.doors  (via ptr->): " << bmw.doors << "\n"; // 10
    cout << "ptr->doors (same obj) : " << ptr->doors << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Reference — alias, also modifies original (like pointer but non-nullable)
    // ─────────────────────────────────────────────────────────────────────────
    Car &ref = bmw;
    ref.doors = 4;
    cout << "bmw.doors  (via ref.) : " << bmw.doors << "\n\n"; // 4

    // ─────────────────────────────────────────────────────────────────────────
    // Local scope struct — visible only within main()
    // ─────────────────────────────────────────────────────────────────────────
    struct Bike {
        string model;
        Color color;
        int year;
    };

    Bike yamaha = {"Yamaha", Color::BLACK, 2025};
    Bike ducati = {"Ducati", Color::WHITE, 2025};
    cout << "Bikes: " << yamaha.model << ", " << ducati.model << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Anonymous struct — no type name, single instance, non-reusable
    // ─────────────────────────────────────────────────────────────────────────
    struct {
        int quantity = 10;
        int price = 20;
    } sales;

    cout << "Quantity: " << sales.quantity << "\n";
    cout << "Price   : " << sales.price << "\n";
    cout << "Total   : " << sales.quantity * sales.price << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Memberwise assignment — each field copied independently
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Memberwise Assignment ===\n";
    Car original = {"Toyota", "Hybrid", Color::WHITE, 2023, 4};
    Car assigned = original; // memberwise copy — fully independent
    assigned.model = "Honda";
    assigned.year = 2024;
    cout << "original.model: " << original.model << "\n"; // Toyota — unchanged
    cout << "assigned.model: " << assigned.model << "\n\n"; // Honda

    // ─────────────────────────────────────────────────────────────────────────
    // Define variables at struct declaration
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Define at Declaration ===\n";
    struct Perks {
        int keyNumber;
        char car[12];
    } mrSmith = {42, "BMW"}, msJones = {7, "Audi"}; // declare + initialize inline

    cout << "mrSmith: key=" << mrSmith.keyNumber << " car=" << mrSmith.car << "\n";
    cout << "msJones: key=" << msJones.keyNumber << " car=" << msJones.car << "\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // String member vs char array member
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== String vs Char Array Member ===\n";
    struct Person {
        std::string name; // dynamic, heap-managed, any length
        char tag[12]; // fixed, stack, max 11 chars + '\0'
        int age;
    };

    Person p1;
    p1.name = "Alexandra Longname"; // fine — string grows as needed
    strncpy(p1.tag, "STAFF", 11); // use strncpy not strcpy — bounds safe
    p1.tag[11] = '\0'; // always ensure null termination
    p1.age = 30;

    cout << "name (string) : " << p1.name << "\n";
    cout << "tag  (char[]) : " << p1.tag << "\n";
    cout << "sizeof(name)  : " << sizeof(p1.name) << " bytes (std::string object size)\n";
    cout << "sizeof(tag)   : " << sizeof(p1.tag) << " bytes (fixed array)\n\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Array of structs
    // ─────────────────────────────────────────────────────────────────────────
    cout << "=== Array of Structs ===\n";
    Car fleet[] = {
        {"Ford", "Diesel", Color::BLACK, 2021, 4},
        {"Nissan", "Petrol", Color::GRAY, 2022, 2},
        {"Kia", "Hybrid", Color::WHITE, 2023, 4},
    };

    int fleetSize = sizeof(fleet) / sizeof(fleet[0]);
    for (int i = 0; i < fleetSize; i++) {
        cout << fleet[i].model << " (" << fleet[i].year << ")\n";
    }
    cout << "\n";

    // range-for over array of structs
    for (const auto &car: fleet) {
        cout << car.model << " — " << getColor(car.color) << "\n";
    }
    cout << "\n";

    // ─────────────────────────────────────────────────────────────────────────
    // Bit fields — pack multiple small values into a single word
    // -------------------------------------------------------------------------
    cout << "=== Bit Fields ===\n";

    struct DeviceStatus {
        unsigned int isOn: 1; // 1 bit  — 0 or 1
        unsigned int hasError: 1; // 1 bit  — 0 or 1
        unsigned int mode: 2; // 2 bits — 0–3
        unsigned int errorCode: 4; // 4 bits — 0–15
        // total: 8 bits — fits in 1 byte (before any padding)
    };

    DeviceStatus dev = {}; // zero-initialize all fields
    dev.isOn = 1;
    dev.hasError = 0;
    dev.mode = 2;
    dev.errorCode = 5;

    cout << "isOn      : " << dev.isOn << "\n"; // 1
    cout << "hasError  : " << dev.hasError << "\n"; // 0
    cout << "mode      : " << dev.mode << "\n"; // 2
    cout << "errorCode : " << dev.errorCode << "\n"; // 5
    cout << "sizeof(DeviceStatus): " << sizeof(DeviceStatus) << " bytes\n\n";

    // Overflow wraps silently — bit field holds only N bits
    dev.mode = 5; // 5 = 0b101, but mode is 2 bits — stores 0b01 = 1
    cout << "mode after assigning 5 (2-bit field): " << dev.mode << "\n"; // 1, not 5
    cout << "\n";

    // Unnamed bit field — padding/alignment gap
    struct Packed {
        unsigned int a: 4;
        unsigned int : 4; // 4 bits of padding — skip to next nibble
        unsigned int b: 4;
    };
    cout << "sizeof(Packed) with padding field: " << sizeof(Packed) << " bytes\n";

    // Cannot take address of a bit field:
    // &dev.isOn;   // ERROR — bit fields have no addressable storage

    return 0;
}

// -------------------------------------------------------------------------
// getColor — enum class requires explicit scope (Color::)
// -------------------------------------------------------------------------
string getColor(Color c) {
    switch (c) {
        case Color::BLACK: return "BLACK";
        case Color::GRAY: return "GRAY";
        case Color::WHITE: return "WHITE";
        default: return "UNKNOWN";
    }
}

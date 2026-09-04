// =============================================================================
// dynamic_structures.cpp — Structures and Dynamic Structures (struct / -> / .)
// =============================================================================
//
// WHAT IS A STRUCTURE:
//
//   A structure (struct) is a user-defined compound type that groups
//   multiple variables of possibly different types into a single unit.
//
//   Example:
//
//     struct Person {
//         string name;
//         int age;
//         double height;
//     };
//
//   Person is now a new type.
//
//     =============================================================───────────────
// ACCESSING MEMBERS
//     =============================================================───────────────
//
//   Two operators are used to access structure members:
//
//   1. DOT OPERATOR (.)
//
//      Used when working with a structure object.
//
//        Person p;
//        p.name = "Alice";
//        p.age = 20;
//
//   2. ARROW OPERATOR (->)
//
//      Used when working with a pointer to a structure.
//
//        Person* ptr = &p;
//        ptr->age = 21;
//
//      This is equivalent to:
//
//        (*ptr).age = 21;
//
//      Parentheses are required because '.' has higher precedence.
//
//     =============================================================───────────────
// DYNAMIC STRUCTURE
//     =============================================================───────────────
//
//   A dynamic structure means the structure itself is allocated on the heap.
//
//     Person* p = new Person;
//
//   Access members with ->
//
//     p->name = "Bob";
//     p->age = 30;
//
//   Free memory with:
//
//     delete p;
//
//     =============================================================───────────────
// STACK vs HEAP STRUCTURE
//     =============================================================───────────────
//
//   Stack allocation:
//
//     Person p;
//
//   Heap allocation:
//
//     Person* p = new Person;
//
//   Heap objects require manual delete.
//
//     =============================================================───────────────
// ARRAY OF STRUCTURES
//     =============================================================───────────────
//
//   Structures can also be stored in arrays.
//
//     Person people[3];
//
//   Access:
//
//     people[0].age = 25;
//
//     =============================================================───────────────
// DYNAMIC ARRAY OF STRUCTURES
//     =============================================================───────────────
//
//   Allocate multiple structures dynamically:
//
//     Person* people = new Person[3];
//
//   Access using array indexing:
//
//     people[0].name = "Ana";
//
//   Free:
//
//     delete[] people;
//
// =============================================================================

#include <iostream>
#include <string>
using namespace std;

//     =============================================================───────────────
// Structure definition
//     =============================================================───────────────

struct Person {
    string name;
    int age;
    double height;
};

int main() {
    //     =============================================================───────────────
    // 1. Structure object (stack)
    //     =============================================================───────────────

    cout << "=== Structure on stack ===\n";

    Person p1;

    p1.name = "Alice";
    p1.age = 21;
    p1.height = 1.70;

    cout << p1.name << " " << p1.age << " " << p1.height << "\n\n";


    //     =============================================================───────────────
    // 2. Pointer to structure
    //     =============================================================───────────────

    cout << "=== Pointer to structure ===\n";

    Person *ptr = &p1;

    ptr->age = 22; // arrow operator
    (*ptr).height = 1.72; // equivalent syntax

    cout << p1.name << " " << p1.age << " " << p1.height << "\n\n";


    //     =============================================================───────────────
    // 3. Dynamic structure (heap)
    //     =============================================================───────────────

    cout << "=== Dynamic structure ===\n";

    Person *p2 = new Person;

    p2->name = "Bob";
    p2->age = 30;
    p2->height = 1.85;

    cout << p2->name << " " << p2->age << " " << p2->height << "\n";

    delete p2;
    p2 = nullptr;

    cout << "\n";


    //     =============================================================───────────────
    // 4. Array of structures
    //     =============================================================───────────────

    cout << "=== Array of structures ===\n";

    Person people[2];

    people[0].name = "Mark";
    people[0].age = 19;

    people[1].name = "Sara";
    people[1].age = 20;

    cout << people[0].name << " " << people[0].age << "\n";
    cout << people[1].name << " " << people[1].age << "\n\n";


    //     =============================================================───────────────
    // 5. Dynamic array of structures
    //     =============================================================───────────────

    cout << "=== Dynamic array of structures ===\n";

    Person *group = new Person[2];

    group[0].name = "John";
    group[0].age = 40;

    group[1].name = "Emma";
    group[1].age = 35;

    cout << group[0].name << " " << group[0].age << "\n";
    cout << group[1].name << " " << group[1].age << "\n";

    delete[] group;
    group = nullptr;

    return 0;
}

// =============================================================================
// KEY POINTS
// =============================================================================
//
//   p.member      → structure object
//   ptr->member   → pointer to structure
//   (*ptr).member → equivalent to ptr->member
//
//   new Type      → allocate single object
//   new Type[N]   → allocate array
//
//   delete        → free single object
//   delete[]      → free array
//
// =============================================================================

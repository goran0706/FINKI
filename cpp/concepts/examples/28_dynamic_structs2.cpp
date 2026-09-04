// =============================================================================
// dynamic_structures.cpp — Dynamic Data Structures (Pointers, Linked Lists)
// =============================================================================
//
// WHAT IS A DYNAMIC DATA STRUCTURE:
//
//   A dynamic data structure is a structure whose size can grow or shrink
//   during program execution. Memory is allocated from the heap as needed.
//
//   Unlike arrays (which require contiguous memory), dynamic structures
//   connect elements using pointers.
//
//   Examples:
//     Linked List
//     Stack (often implemented using a list or vector)
//     Queue
//     Tree
//     Graph
//
//   In this file we demonstrate the fundamental dynamic structure:
//
//     SINGLY LINKED LIST
//
//     =============================================================───────────────
// WHY LINKED LISTS EXIST
//     =============================================================───────────────
//
//   Arrays:
//     • contiguous memory
//     • fixed size (unless using vector)
//     • inserting in the middle requires shifting elements
//
//   Linked Lists:
//     • nodes allocated individually on heap
//     • elements connected by pointers
//     • fast insertion/deletion once location is known
//     • no shifting of elements
//
//   Trade-offs:
//
//     Advantage:
//       insertion/deletion O(1) once node is known
//
//     Disadvantages:
//       no random access
//       extra memory for pointers
//       worse cache locality
//
//     =============================================================───────────────
// NODE STRUCTURE
//     =============================================================───────────────
//
//   A linked list is built from nodes.
//
//   struct Node {
//       int data;
//       Node* next;
//   };
//
//   data  → stored value
//   next  → pointer to next node in list
//
//   last node points to nullptr.
//
//   Example:
//
//     [10 | *] -> [20 | *] -> [30 | *] -> nullptr
//
//     =============================================================───────────────
// BASIC OPERATIONS
//     =============================================================───────────────
//
//   insertFront()
//   insertBack()
//   print()
//   deleteFront()
//   deleteList()
//
//     =============================================================───────────────
// MEMORY MANAGEMENT
//     =============================================================───────────────
//
//   Nodes are created with:
//
//     Node* n = new Node;
//
//   Nodes must be destroyed with:
//
//     delete n;
//
//   Every new must have a corresponding delete to avoid memory leaks.
//
//     =============================================================───────────────
// SUMMARY
//     =============================================================───────────────
//
//   Structure        | Memory     | Access       | Insert/Delete
//   -----------------|------------|--------------|--------------
//   Array            | contiguous | O(1) random  | O(n)
//   vector           | contiguous | O(1) random  | amortized O(1) end
//   Linked List      | scattered  | O(n)         | O(1)
//
// =============================================================================

#include <iostream>
using namespace std;

//     =============================================================───────────────
// Node definition
//     =============================================================───────────────

struct Node {
    int data;
    Node *next;
};

//     =============================================================───────────────
// Insert at the front
//     =============================================================───────────────

void insertFront(Node *&head, int value) {
    Node *n = new Node;
    n->data = value;
    n->next = head;

    head = n;
}

//     =============================================================───────────────
// Insert at the end
//     =============================================================───────────────

void insertBack(Node *&head, int value) {
    Node *n = new Node;
    n->data = value;
    n->next = nullptr;

    if (head == nullptr) {
        head = n;
        return;
    }

    Node *current = head;

    while (current->next != nullptr)
        current = current->next;

    current->next = n;
}

//     =============================================================───────────────
// Delete first element
//     =============================================================───────────────

void deleteFront(Node *&head) {
    if (head == nullptr)
        return;

    Node *temp = head;
    head = head->next;

    delete temp;
}

//     =============================================================───────────────
// Print list
//     =============================================================───────────────

void printList(Node *head) {
    Node *current = head;

    while (current != nullptr) {
        cout << current->data << " -> ";
        current = current->next;
    }

    cout << "nullptr\n";
}

//     =============================================================───────────────
// Free entire list
//     =============================================================───────────────

void deleteList(Node *&head) {
    while (head != nullptr)
        deleteFront(head);
}

//     =============================================================───────────────
// MAIN
//     =============================================================───────────────

int main() {
    Node *head = nullptr;

    //     =============================================================───────────────
    // Insert elements
    //     =============================================================───────────────

    cout << "=== insertFront ===\n";

    insertFront(head, 30);
    insertFront(head, 20);
    insertFront(head, 10);

    printList(head);

    cout << "\n";

    //     =============================================================───────────────
    // Insert at back
    //     =============================================================───────────────

    cout << "=== insertBack ===\n";

    insertBack(head, 40);
    insertBack(head, 50);

    printList(head);

    cout << "\n";

    //     =============================================================───────────────
    // Delete first element
    //     =============================================================───────────────

    cout << "=== deleteFront ===\n";

    deleteFront(head);

    printList(head);

    cout << "\n";

    //     =============================================================───────────────
    // Delete entire list
    //     =============================================================───────────────

    cout << "=== deleteList ===\n";

    deleteList(head);

    printList(head);

    return 0;
}

// =============================================================================
// KEY TAKEAWAYS
// =============================================================================
//
//   • Dynamic structures allocate memory during runtime
//   • Nodes are connected via pointers
//   • Linked lists avoid element shifting but lose random access
//   • Memory must be manually released with delete
//
//   Linked lists are the conceptual foundation for:
//
//     stacks
//     queues
//     hash table chaining
//     adjacency lists in graphs
//     tree structures
//
// =============================================================================

#include <array>   // std::array
#include <vector>  // std::vector
#include <iostream>

int main() {
   using std::cout;
   using std::endl;

   // ─────────────────────────────────────────────────────────────
   // 1. Basic integer initialization
   // ─────────────────────────────────────────────────────────────
   int number_a = 10;    // copy initialization
   int number_b(20);     // direct initialization
   int number_c{30};     // direct-list initialization
   int number_d = {40};  // copy-list initialization
   int number_e{};       // value initialization (0)

   cout << "number_a = " << number_a << ", number_b = " << number_b
         << ", number_c = " << number_c << ", number_d = " << number_d << endl;


   // ─────────────────────────────────────────────────────────────
   // 2. Built-in arrays initialization
   // ─────────────────────────────────────────────────────────────
   constexpr int SIZE = 10;

   int arr_a[] = {1, 2, 3};      // copy-list initialization, size deduced (3)
   int arr_b[SIZE] = {1, 2, 3};  // copy-list initialization, remaining elements = 0
   int arr_c[SIZE] = {1};        // copy-list initialization, first = 1, rest = 0
   int arr_d[SIZE] = {0};        // copy-list initialization, all elements = 0
   int arr_e[SIZE] = {};         // copy-list initialization, all elements = 0
   int arr_f[SIZE]{1, 2, 3};     // direct-list initialization
   int arr_g[SIZE]{};            // direct-list initialization, all elements = 0

   // ─────────────────────────────────────────────────────────────
   // 3. std::array (fixed size container)
   // ─────────────────────────────────────────────────────────────
   std::array<int, SIZE> arr_h = {}; // all elements = 0

   // ─────────────────────────────────────────────────────────────
   // 4. std::vector (dynamic array)
   // ─────────────────────────────────────────────────────────────
   std::vector<int> arr_j = {};     // empty vector
   std::vector<int> arr_k{1, 2, 3}; // initialized with values

   // ─────────────────────────────────────────────────────────────
   // 5. Pointer initialization
   // ─────────────────────────────────────────────────────────────

   int *pointer_number_a = &number_a;  // pointer to integer variable
   int *pointer_arr_a = arr_a;         // pointer to first element of array

   cout << "First element of arr_a via pointer: " << *pointer_arr_a << endl;

   // ─────────────────────────────────────────────────────────────
   // TIP: Best practices for initialization
   // ─────────────────────────────────────────────────────────────
   /*
       1. Prefer direct-list initialization `{}` (T x{...}) where applicable.
          - Prevents narrowing conversions
          - Provides consistent initialization semantics

       2. For built-in arrays:
          - Uninitialized arrays have indeterminate values
          - Use list-initialization to ensure zero-initialization:
              int arr[N]{};        // direct-list initialization
              int arr[N] = {0};    // copy-list initialization

       3. For dynamic arrays:
          - Prefer std::vector over raw arrays
          - Provides automatic storage management and bounds-safe access

       4. Pointer initialization:
          - Always initialize pointers; uninitialized pointers have indeterminate value
          - Example:
              int* ptr = nullptr;

       5. Avoid mixing initialization forms without reason
          - Prefer direct-list initialization (`{}`) as the default form
          - Use other forms only when required by specific semantics
   */

   return 0;
}

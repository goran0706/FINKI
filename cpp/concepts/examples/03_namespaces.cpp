// There are several ways to access names from the std namespace after including the <iostream> header.
//
// Common approaches:
//
// 1. Use a using-directive in the global scope
//    using namespace std;
//    - Makes all names from std available everywhere in the file.
//    - Generally discouraged in large programs because it can cause name conflicts.
//
// 2. Use a using-directive inside a function (local scope)
//    using namespace std;
//    - Makes all std names available only inside that function.
//
// 3. Use using-declarations for specific names
//    using std::cout;
//    using std::cin;
//    - Imports only the needed identifiers.
//
// 4. Use the scope resolution operator (::)
//    std::cout << "Hello";
//    - Explicitly accesses a name inside the std namespace.
//    - This is the most explicit and safest approach.

#include <iostream>

// Global scope: bring all std names into this file
using namespace std;

// Global scope: bring only specific names
using std::cout;
using std::cin;

int main() {
    // Local scope: bring all std names into this function
    using namespace std;

    // Local scope: bring only specific names
    using std::cout;
    using std::cin;

    // Explicit namespace usage with the scope resolution operator
    std::cout << "Hello World" << std::endl;

    return 0;
}

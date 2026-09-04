// convert.cpp -- converts stone to pounds

#include <iostream>

// function prototype
int stoneToLb(int);

int main() {
    using namespace std;
    /*
    The current prevalent philosophy is that it’s preferable to be more discriminating
    and limit access to the std namespace to only those functions that need access.

    For example, only main() uses cout, so there is no need to make
    the std namespace available to the stonetolb() function.

    Thus, the using directive is placed inside the main() function only,
    limiting std namespace access to just that function.

    There several choices for making std namespace elements available to a program:

    - You can place the following above the function definitions in a file, making all the
    contents of the std namespace available to every function in the file:
        using namespace std;

    - You can place the following in a specific function definition, making all the
    contents of the std namespace available to that specific function:
        using namespace std;

    - Instead of using namespace std; you can place using declarations in a specific function definition
    and make a particular element, such as cout, available to that function:
        using std::cout;

    - You can omit the using directives and declarations entirely and use the std:: prefix
    whenever you use elements from the std namespace:
        std::cout << "I’m using cout and endl from the std namespace" << std::endl;
    */

    int stone;

    cout << "Enter the weight in stone: ";
    cin >> stone;

    int pounds = stoneToLb(stone);

    cout << stone << " stone = ";
    cout << pounds << " pounds." << endl;

    return 0;
}

// function definition
int stoneToLb(int sts) {
    return 14 * sts;
}

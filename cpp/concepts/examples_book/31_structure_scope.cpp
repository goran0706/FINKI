// structur.cpp -- a simple structure
#include <iostream>

// External Declaration - can be used in all functions in file
struct inflatable {
    char name[20];
    float volume;
    double price;
};

int main() {
    using namespace std;

    // Local Declaration - can be used only in this function
    struct local {
        int num;
    };

    inflatable guest = {
        "Glorious Gloria", // name value
        1.88, // volume value
        29.99 // price value
    }; // guest is a structure variable of type inflatable

    // It's initialized to the indicated values
    inflatable pal = {
        "Audacious Arthur",
        3.12,
        32.99
    }; // pal is a second variable of type inflatable

    cout << "Expand your guest list with " << guest.name;
    cout << " and " << pal.name << "!\n";

    // pal.name is the name member of the pal variable
    cout << "You can have both for $";
    cout << guest.price + pal.price << "!\n";



    return 0;
}

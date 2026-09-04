/*
    Објектно ориентирано програмирање

    Аудиториска вежба 8 (Апстрактни класи)
    1. Геометриски тела

    Да се дефинира апстрактна класа за репрезентација на едно геометриско тело.

    Секое геометриско тело има висина (децимален број) и основа која може да биде различна за различни геометриски фигури.

    За апстракната класа да се дефинираат функциите:

    - pecati() во која се печатат информациите за телото
    - volumen() која ќе го враќа волуменот на телото
    - getVisina() која ќе ја враќа висината на телото

    Од класата геометриско тело да се изведе класа за цилиндер, конус и квадар.

    За еден цилиндер и за еден конус покрај висината се чува и информација за радиусот на основата (децимален број).

    За квадарот се чуваат информации за страните а и b на основата (децимални броеви).
    
    Во main функцијата да се декларира и иницизијализра динамички алоцирана низа од покажувачи кон класата која претставува геометриско тело.

    Од оваа низа:

    Да се одреди телото со најголем волумен користејќи ја глобалната функција: void teloSoNajgolemVolumen(GeomTelo *niza[], int n);
    Оваа функција треба да ги отпечати информациите за телото од полето предадено како аргумент (niza - поле од покажувачи кон GeomTelo) кое има најголем волумен.

    Да се одреди бројот на геометриски тела кои немаат основа круг користејќи ја глобалната функција со потпис: double getRadius(GeomTelo *g);.
    Оваа функција која ќе го враќа радиусот на основата (ако основата на телото е круг), а -1 во спротивно.

*/
#include <iostream>
#include <cmath>

using namespace std;

// ==========================================
// 1. ABSTRACT BASE CLASS
// ==========================================
class GeometricBody {
protected:
    // 'protected' means derived classes (Cylinder, Cone) can access this directly if needed.
    // 'private' would hide it entirely from them.
    double height;

public:
    // Constructor with a default value (0).
    // Initializes the base part of any derived object.
    GeometricBody(double height = 0) {
        this->height = height;
    }

    // 'virtual' tells the compiler to use "Dynamic Binding".
    // Instead of locking in the function call at compile time, it checks the actual
    // object type (Cylinder, Cone) at runtime and calls the correct version.
    virtual void print() {
        cout << height;
    }

    // '= 0' makes this a "Pure Virtual Function".
    // 1. It makes GeometricBody an "Abstract Class" (you cannot do `new GeometricBody()`).
    // 2. It forces any derived class to implement this exact function, or they become abstract too.
    virtual double getVolume() = 0;

    double getHeight() const {
        return height;
    }

    // WHY THIS IS MANDATORY: If you delete a GeometricBody pointer that points to a Cylinder,
    // a non-virtual destructor will only destroy the GeometricBody part. The Cylinder part
    // stays in memory forever (Memory Leak). Making it 'virtual' forces the compiler to
    // trigger the Cylinder destructor first, then the GeometricBody destructor.
    virtual ~GeometricBody() = default;
};

// ==========================================
// 2. DERIVED CLASSES
// ==========================================
class Cylinder : public GeometricBody {
private:
    double radius;

public:
    // The syntax `: GeometricBody(height)` passes the height value up to the
    // base class constructor so it can initialize its own 'height' variable.
    Cylinder(double radius, double height) : GeometricBody(height) {
        this->radius = radius;
    }

    // 'override' forces the compiler to double-check that this function signature
    // exactly matches a virtual function in the base class. It catches typos instantly.
    void print() override {
        cout << "Cylinder with height ";
        GeometricBody::print(); // Calls the base class print to output the height
        cout << " and base radius " << radius << endl;
    }

    double getVolume() override {
        return M_PI * radius * radius * getHeight();
    }

    double getRadius() const {
        return radius;
    }
};

class Cone : public GeometricBody {
private:
    double radius;

public:
    Cone(double radius, double height) : GeometricBody(height) {
        this->radius = radius;
    }

    void print() override {
        cout << "Cone with height ";
        GeometricBody::print();
        cout << " and base radius " << radius << endl;
    }

    double getVolume() override {
        return (M_PI * radius * radius * getHeight()) / 3.0;
    }

    double getRadius() const {
        return radius;
    }
};

class Cuboid : public GeometricBody {
private:
    double a, b;

public:
    Cuboid(double a, double b, double height) : GeometricBody(height) {
        this->a = a;
        this->b = b;
    }

    void print() override {
        cout << "Cuboid with height ";
        GeometricBody::print();
        cout << " and base sides " << this->a << " and " << this->b << endl;
    }

    double getVolume() override {
        return a * b * getHeight();
    }
};

// ==========================================
// 3. GLOBAL FUNCTIONS
// ==========================================

// array[] is an array of base class pointers. Because we use virtual functions,
// we can call getVolume() on them without needing to know if they are Cylinders or Cones.
void bodyWithLargestVolume(GeometricBody *array[], int n) {
    // maxVolume must be a double because getVolume returns a double.
    // Using an int would truncate decimal values, messing up the comparison.
    double maxVolume = -1.0;
    int maxIndex = 0;

    for (int i = 0; i < n; i++) {
        // Automatically looks up the correct formula in the VTable (Virtual Table) at runtime
        if (array[i]->getVolume() > maxVolume) {
            maxVolume = array[i]->getVolume();
            maxIndex = i;
        }
    }
    cout << "The body with the largest volume is: ";
    array[maxIndex]->print();
}

// -------------------------------------------------------------------------
// ADDED EXPLANATION: WHY THIS USES A pointer (*g) AND NOT AN OBJECT OR REFERENCE:
//
// 1. Why not an object (GeometricBody g)?
//    It won't compile because GeometricBody is abstract. Even if it wasn't,
//    passing by value causes "Object Slicing", stripping away the Cylinder/Cone
//    properties completely before it gets inside the function.
//
// 2. Why not a reference (GeometricBody &g)?
//    References cannot be null. If a dynamic_cast to a reference fails, C++
//    throws a std::bad_cast exception which crashes the program unless caught in
//    ugly try-catch blocks. Pointers allow dynamic_cast to safely return nullptr on failure.
// -------------------------------------------------------------------------

// Used when the base class does NOT have the function we want (like getRadius).
// We have to manually check what the object actually is.
double getRadius(GeometricBody *g) {
    if (g == nullptr) return -1;

    // dynamic_cast attempts to treat the generic 'g' pointer as a 'Cylinder' pointer.
    Cylinder *c = dynamic_cast<Cylinder *>(g);

    // If 'g' is actually a Cone or Cuboid, the cast fails and returns a null pointer (nullptr).
    // We check for nullptr so we don't crash by trying to call c->getRadius() on nothing.
    if (c != nullptr) {
        return c->getRadius();
    }

    // If it wasn't a Cylinder, try converting it to a Cone.
    Cone *k = dynamic_cast<Cone *>(g);
    if (k != nullptr) {
        return k->getRadius();
    }

    // If it is neither (e.g., a Cuboid), return -1 as required by the assignment.
    return -1;
}

// ==========================================
// 4. MAIN EXECUTION
// ==========================================
int main() {
    // A double pointer. It acts as a dynamic array where every slot holds
    // a pointer to a GeometricBody. We cannot make an array of actual GeometricBody
    // objects because it is an abstract class.
    GeometricBody **bodySet;
    int n;
    cin >> n;

    // Allocate the array on the heap.
    bodySet = new GeometricBody *[n];

    for (int i = 0; i < n; i++) {
        double r, a, b, h;
        int type;
        cout << "Enter body type (1-Cylinder, 2-Cone, 3-Cuboid): " << endl;
        cin >> type;

        // 'new' allocates memory for the specific object on the heap and returns a pointer.
        // We store that pointer in our generic base-class array.
        if (type == 1) {
            cin >> r >> h;
            bodySet[i] = new Cylinder(r, h);
        } else if (type == 2) {
            cin >> r >> h;
            bodySet[i] = new Cone(r, h);
        } else if (type == 3) {
            cin >> a >> b >> h;
            bodySet[i] = new Cuboid(a, b, h);
        }
    }

    cout << "\n--- Result 1 ---" << endl;
    bodyWithLargestVolume(bodySet, n);

    cout << "\n--- Result 2 ---" << endl;
    int counter = 0;
    for (int i = 0; i < n; i++) {
        // If getRadius returns -1, it means the dynamic_cast failed for both
        // Cylinder and Cone, meaning it must be a Cuboid (no circular base).
        if (getRadius(bodySet[i]) == -1) {
            counter++;
        }
    }
    cout << "Number of bodies that do NOT have a circular base: " << counter << endl;

    // MANDATORY CLEANUP: 'new' was used, so 'delete' must be used.
    // First, loop through and delete every individual shape we created.
    for (int i = 0; i < n; i++) {
        delete bodySet[i];
    }
    // Then, delete the array structure itself.
    delete[] bodySet;

    return 0;
}

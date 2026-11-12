// =============================================================================
// C++ OOP Cheat Sheet — Complete Reference
// Standard : C++17
// Compile  : g++ -std=c++17 -Wall -Wextra -Wpedantic -o cheatsheet oop_cheatsheet.cpp
// =============================================================================

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <memory>
#include <utility>
#include <cstring>
#include <cmath>
#include <stdexcept>
#include <cassert>

using std::cout;
using std::ostream;
using std::string;
using std::vector;
using std::unique_ptr;
using std::shared_ptr;
using std::weak_ptr;
using std::make_unique;
using std::make_shared;
using std::move;
using std::swap;


// =============================================================================
// SECTION 1 — STRUCTS
// =============================================================================
//
//  struct  = passive data aggregate, members public by default.
//  class   = has invariants, private data, and behavior.
//
//  An invariant is a logical condition that defines a valid object state;
//  branching statements are the mechanism used to enforce it.
//  - Invariant: what must be true - (balance >= 0)
//  - Enforcement: how you ensure it stays true - if (balance < 0) throw ...
//
//  In C++ there is no need for typedef — the tag name IS the type name.
//  Use struct for simple data carriers; use class once you need encapsulation.
// =============================================================================

// --- 1a. Plain aggregate — no constructor needed ---
struct Point {
    double x{}; // in-class initialization (C++11): default-initialized to 0
    double y{};
};

// --- 1b. Aggregate with a member function ---
struct Rectangle {
    double width{};
    double height{};

    double area() const {
        return width * height;
    }

    void print() const {
        cout << "Rectangle(" << width << " x " << height << ")  area = " << area() << '\n';
    }
};

// --- 1c. Struct with C-style char arrays (exam-relevant legacy pattern) ---
//
//  char name[64]  — fixed-size, stack-allocated, no heap involved.
//  char* name     — pointer to heap or literal; requires manual management.
//
//  Both are shown below. In modern C++ use std::string for new code.

struct CLegacyStudent {
    char name[64]; // fixed char array — no dynamic allocation
    char *index; // owning raw pointer — must new/delete manually
    int year;
    float gpa;
};

void demo_struct() {
    // Aggregate init — positional
    Point p{3.0, 4.0};
    cout << "Point(" << p.x << ", " << p.y << ")\n";

    Rectangle r{5.0, 3.0};
    r.print();

    // C-style student (legacy pattern)
    CLegacyStudent cs;
    std::strcpy(cs.name, "Alice");
    cs.index = new char[8];
    std::strcpy(cs.index, "211001");
    cs.year = 2;
    cs.gpa = 9.5f;
    cout << "CLegacy: " << cs.name << " [" << cs.index << "]\n";
    delete[] cs.index;
}


// =============================================================================
// SECTION 2 — ENUMS
// =============================================================================
//
//  Plain enum   — unscoped, leaks names into surrounding scope,
//                 implicitly converts to int.  Avoid in new code.
//
//  enum class   — scoped, strongly typed, no implicit conversions.
//                 Always prefer this.
// =============================================================================

// --- 2a. Plain enum — shown only for recognition, do not write new ones ---
enum LegacyColour { LC_Red, LC_Green, LC_Blue };

// --- 2b. Scoped enum class — always use this ---
enum class Colour { Red, Green, Blue };

// --- 2c. Explicit underlying type ---
enum class Month : int {
    January = 1, February, March, April,
    May, June, July, August,
    September, October, November, December
};

// --- 2d. Bit-flag enum ---
enum class Permission : unsigned int {
    None = 0,
    Read = 1u << 0,
    Write = 1u << 1,
    Execute = 1u << 2
};

inline Permission operator|(Permission a, Permission b) {
    return static_cast<Permission>(
        static_cast<unsigned>(a) | static_cast<unsigned>(b)
    );
}

inline bool hasPermission(Permission set, Permission flag) {
    return (static_cast<unsigned>(set) & static_cast<unsigned>(flag)) != 0;
}

void demo_enum() {
    Colour c = Colour::Red;

    switch (c) {
        case Colour::Red: cout << "Red\n";
            break;
        case Colour::Green: cout << "Green\n";
            break;
        case Colour::Blue: cout << "Blue\n";
            break;
            // No default — compiler warns if a new enumerator is added and forgotten here
    }

    int raw = static_cast<int>(Month::March);
    cout << "March = " << raw << '\n';

    Permission p = Permission::Read | Permission::Write;
    cout << "Can read:    " << hasPermission(p, Permission::Read) << '\n';
    cout << "Can execute: " << hasPermission(p, Permission::Execute) << '\n';
}


// =============================================================================
// SECTION 3 — RULE OF ZERO
// =============================================================================
//
//  If every data member manages its own lifetime (string, vector, smart ptr),
//  the compiler-generated special members are already correct.
//  Define zero special members and let the compiler do the work.
//
//  Generated automatically when you define none of the five:
//    - Default constructor
//    - Copy constructor
//    - Copy-assignment operator
//    - Move constructor         (C++11)
//    - Move-assignment operator (C++11)
//    - Destructor
// =============================================================================

class Person {
private:
    // Fields listed here — close to the constructor that initializes them
    string name_;
    int age_;

public:
    // Single-arg constructors should be explicit to block silent conversions:
    //   Person p = "Alice";   // would compile without explicit — almost never intended
    explicit Person(string name, int age) : name_{move(name)}, age_{age} {
        if (age_ < 0) {
            throw std::invalid_argument{"Age cannot be negative"};
        }
    }

    // --- Accessors — all const, return by const-ref where cheap ---
    const string &name() const {
        return name_;
    }

    int age() const {
        return age_;
    }

    // --- Mutators ---
    void setName(string name) {
        name_ = move(name);
    }

    void setAge(int age) {
        if (age < 0) {
            throw std::invalid_argument{"Age cannot be negative"};
        }
        age_ = age;
    }

    // --- Utility ---
    void print() const {
        cout << "Person { name=" << name_ << ", age=" << age_ << " }\n";
    }

    bool operator==(const Person &other) const {
        return name_ == other.name_ && age_ == other.age_;
    }

    bool operator!=(const Person &other) const {
        return !(*this == other);
    }

    bool operator<(const Person &other) const {
        return name_ < other.name_;
    }

    friend ostream &operator<<(ostream &os, const Person &p) {
        return os << "Person { " << p.name_ << ", " << p.age_ << " }";
    }
};

void demo_rule_of_zero() {
    Person p1{"Alice", 22};
    Person p2 = p1; // copy constructor  — compiler-generated, correct
    Person p3{"Bob", 25};
    p3 = p2; // copy-assignment   — compiler-generated, correct
    Person p4 = move(p3); // move constructor  — compiler-generated, correct

    p1.print();
    cout << p1 << '\n';
    cout << "p1 == p2: " << (p1 == p2 ? "yes" : "no") << '\n';
    cout << "p1 <  Bob: " << (p1 < Person{"Bob", 25} ? "yes" : "no") << '\n';

    (void) p4;
}


// =============================================================================
// SECTION 4 — RULE OF THREE
// =============================================================================
//
//  When a class owns a raw resource (heap memory, file handle, socket…) the
//  compiler-generated copy and destructor are WRONG — they will shallow-copy
//  the pointer, causing double-free or dangling access.
//
//  You must define all three:
//    1. Destructor           — free the resource
//    2. Copy constructor     — deep-copy the resource
//    3. Copy-assignment      — free old resource, deep-copy new one
//
//  This is the minimum for correctness pre-C++11.
//  If you stop here, the class is NOT movable (move falls back to copy).
// =============================================================================

class StringBuffer {
private:
    char *data_;
    std::size_t size_;

public:
    StringBuffer() : data_{nullptr}, size_{0} {
        // anything extra goes here
    }

    explicit StringBuffer(const char *src) : data_{new char[std::strlen(src) + 1]}, size_{std::strlen(src)} {
        std::strcpy(data_, src);
    }

    // --- 1. Destructor ---
    ~StringBuffer() {
        delete[] data_;
    }

    // --- 2. Copy constructor — deep copy ---
    StringBuffer(const StringBuffer &other)
        : data_{other.size_ ? new char[other.size_ + 1] : nullptr}, size_{other.size_} {
        if (data_) {
            std::strcpy(data_, other.data_);
        }
    }

    // --- 3. Copy-assignment operator ---
    //
    //  Pattern: check self-assignment, free old, allocate new, copy.
    //  Returns *this so chained assignment works: a = b = c;
    StringBuffer &operator=(const StringBuffer &other) {
        // self-assignment guard
        if (this == &other) {
            return *this;
        }


        delete[] data_; // free old resource

        size_ = other.size_;
        data_ = other.size_ ? new char[size_ + 1] : nullptr;

        if (data_) {
            std::strcpy(data_, other.data_);
        }

        return *this;
    }

    // --- Interface ---
    const char *data() const {
        return data_ ? data_ : "";
    }

    std::size_t size() const {
        return size_;
    }

    bool empty() const {
        return size_ == 0;
    }

    void print() const {
        cout << "StringBuffer { \"" << data() << "\", size=" << size_ << " }\n";
    }

    friend ostream &operator<<(ostream &os, const StringBuffer &sb) {
        return os << (sb.data_ ? sb.data_ : "");
    }
};

void demo_rule_of_three() {
    StringBuffer a{"Hello"};
    StringBuffer b = a; // copy constructor
    StringBuffer c{"World"};
    c = a; // copy-assignment
    c = c; // self-assignment — must not crash

    a.print();
    b.print();
    c.print();
}


// =============================================================================
// SECTION 5 — RULE OF FIVE
// =============================================================================
//
//  C++11 added move semantics.  If your class owns a raw resource, and you
//  only define the Rule of Three, moves fall back to copies — expensive and
//  prevents the class from working efficiently with STL containers.
//
//  Add the two move members to make the class "Rule of Five" compliant:
//    4. Move constructor         — steal the resource, leave source empty
//    5. Move-assignment operator — free own resource, steal from source
//
//  Move operations should be noexcept so std::vector can use them during
//  reallocation instead of copying.
//
//  The copy-and-swap idiom is shown for copy-assignment — it is strongly
//  exception-safe and eliminates the self-assignment check.
// =============================================================================

class Buffer {
private:
    char *data_;
    std::size_t size_;

public:
    Buffer() : data_{nullptr}, size_{0} {
    }

    explicit Buffer(std::size_t size) : data_{new char[size]{}}, size_{size} {
    }

    // --- Destructor ---
    ~Buffer() {
        delete[] data_;
    }

    // --- Copy constructor — deep copy ---
    Buffer(const Buffer &other) : data_{other.size_ ? new char[other.size_] : nullptr}, size_{other.size_} {
        if (data_) {
            std::memcpy(data_, other.data_, size_);
        }
    }

    // --- Copy-assignment — copy-and-swap idiom ---
    //
    //  Takes const-ref explicitly — keeps the overload set unambiguous
    //  when a separate move-assignment operator also exists.
    //  We construct a local copy then swap; strongly exception-safe,
    //  and no self-assignment check is needed.
    Buffer &operator=(const Buffer &other) {
        Buffer copy{other}; // invoke copy constructor
        swap(*this, copy); // swap internals; copy now holds old data
        return *this; // copy destructs here, freeing old data
    }

    // --- Move constructor — steal resource, leave source in valid empty state ---
    Buffer(Buffer &&other) noexcept : data_{other.data_}, size_{other.size_} {
        other.data_ = nullptr;
        other.size_ = 0;
    }

    // --- Move-assignment — free own resource, steal from source ---
    Buffer &operator=(Buffer &&other) noexcept {
        if (this == &other) {
            return *this;
        }

        delete[] data_;

        data_ = other.data_;
        size_ = other.size_;

        other.data_ = nullptr;
        other.size_ = 0;

        return *this;
    }

    // --- Swap helper — required by copy-and-swap idiom ---
    //  Marked noexcept because pointer swaps cannot throw.
    friend void swap(Buffer &a, Buffer &b) noexcept {
        using std::swap;
        swap(a.data_, b.data_);
        swap(a.size_, b.size_);
    }

    // --- Interface ---
    std::size_t size() const {
        return size_;
    }

    bool empty() const {
        return size_ == 0;
    }

    char *data() {
        return data_;
    }

    const char *data() const {
        return data_;
    }

    char &operator[](std::size_t i) {
        return data_[i];
    }

    const char &operator[](std::size_t i) const {
        return data_[i];
    }

    void print() const {
        cout << "Buffer { size=" << size_ << " }\n";
    }
};

void demo_rule_of_five() {
    Buffer b1{16};
    b1[0] = 'A';
    b1[1] = 'B';
    b1[2] = 'C';

    Buffer b2 = b1; // copy constructor — deep copy, b1 unchanged
    Buffer b3{8};
    b3 = b1; // copy-assignment (copy-and-swap)
    b3 = b3; // self-assignment — safe

    Buffer b4 = move(b1); // move constructor — b1 now empty
    Buffer b5{4};
    b5 = move(b2); // move-assignment  — b2 now empty

    cout << "b1 (moved-from): ";
    b1.print();
    cout << "b2 (moved-from): ";
    b2.print();
    cout << "b3 (copy of b1): ";
    b3.print();
    cout << "b4 (moved b1):   ";
    b4.print();
    cout << "b5 (moved b2):   ";
    b5.print();
}


// =============================================================================
// SECTION 6 — STUDENT CLASS (Rule of Five with char* members — exam pattern)
// =============================================================================
//
//  Demonstrates Rule of Five applied to a class that uses both
//  char* (owning raw pointer) and char[] (fixed array).
//  This is the corrected version of the original cheat sheet's Student class.
// =============================================================================

class Student {
private:
    char *name_; // heap-allocated, owned
    char index_[10]; // fixed array, stack-allocated
    int year_;
    double gpa_;

public:
    Student() : name_{new char[8]}, year_{1}, gpa_{5.0} {
        std::strcpy(name_, "Unknown");
        std::strcpy(index_, "000000");
    }

    Student(const char *name, const char *index, int year, double gpa)
        : name_{new char[std::strlen(name) + 1]}, year_{year}, gpa_{gpa} {
        std::strcpy(name_, name);
        std::strcpy(index_, index);
    }

    // --- Destructor ---
    ~Student() {
        delete[] name_;
    }

    // --- Copy constructor ---
    Student(const Student &other)
        : name_{new char[std::strlen(other.name_) + 1]}, year_{other.year_}, gpa_{other.gpa_} {
        std::strcpy(name_, other.name_);
        std::strcpy(index_, other.index_);
    }

    // --- Copy-assignment ---
    Student &operator=(const Student &other) {
        if (this == &other) {
            return *this;
        }

        delete[] name_;
        name_ = new char[std::strlen(other.name_) + 1];
        std::strcpy(name_, other.name_);
        std::strcpy(index_, other.index_);
        year_ = other.year_;
        gpa_ = other.gpa_;

        return *this;
    }

    // --- Move constructor ---
    Student(Student &&other) noexcept
        : name_{other.name_}, year_{other.year_}, gpa_{other.gpa_} {
        std::strcpy(index_, other.index_);
        other.name_ = nullptr;
    }

    // --- Move-assignment ---
    Student &operator=(Student &&other) noexcept {
        if (this == &other) {
            return *this;
        }

        delete[] name_;
        name_ = other.name_;
        std::strcpy(index_, other.index_);
        year_ = other.year_;
        gpa_ = other.gpa_;

        other.name_ = nullptr;

        return *this;
    }

    // --- Accessors ---
    const char *name() const {
        return name_ ? name_ : "";
    }

    const char *index() const {
        return index_;
    }

    int year() const {
        return year_;
    }

    double gpa() const {
        return gpa_;
    }

    // --- Mutators ---
    void setName(const char *name) {
        delete[] name_;
        name_ = new char[std::strlen(name) + 1];
        std::strcpy(name_, name);
    }

    void setIndex(const char *index) {
        std::strcpy(index_, index);
    }

    void setYear(int year) {
        year_ = year;
    }

    void setGpa(double gpa) {
        gpa_ = gpa;
    }

    // --- Utility ---
    bool sameIndex(const Student &other) const {
        return std::strcmp(index_, other.index_) == 0;
    }

    void print() const {
        cout << "Student { " << name() << " [" << index_ << "] yr=" << year_ << " gpa=" << gpa_ << " }\n";
    }

    bool operator==(const Student &other) const {
        return std::strcmp(index_, other.index_) == 0;
    }

    bool operator<(const Student &other) const {
        return gpa_ > other.gpa_; // descending GPA for sort purposes
    }

    friend ostream &operator<<(ostream &os, const Student &s) {
        return os << s.name() << " [" << s.index_ << "]" << " yr" << s.year_ << " GPA:" << s.gpa_;
    }
};


// =============================================================================
// SECTION 7 — CONTAINER CLASS (Classroom)
// =============================================================================

class Classroom {
private:
    vector<Student> students_;

public:
    Classroom() = default;

    void add(const Student &s) {
        students_.push_back(s);
    }

    void add(Student &&s) {
        students_.push_back(move(s));
    }

    void remove(const char *index) {
        students_.erase(std::remove_if(students_.begin(), students_.end(), [&](const Student &s) {
            return std::strcmp(s.index(), index) == 0;
        }), students_.end());
    }

    const Student *find(const char *index) const {
        auto it = std::find_if(students_.begin(), students_.end(), [&](const Student &s) {
            return std::strcmp(s.index(), index) == 0;
        });
        return it != students_.end() ? &(*it) : nullptr;
    }

    std::size_t count() const {
        return students_.size();
    }

    double averageGpa() const {
        if (students_.empty()) {
            return 0.0;
        }

        double sum = 0.0;
        for (const auto &s: students_) {
            sum += s.gpa();
        }

        return sum / static_cast<double>(students_.size());
    }

    void sortByGpaDescending() {
        std::sort(students_.begin(), students_.end(), [](const Student &a, const Student &b) {
            return a.gpa() > b.gpa();
        });
    }

    void sortByName() {
        std::sort(students_.begin(), students_.end(), [](const Student &a, const Student &b) {
            return std::strcmp(a.name(), b.name()) < 0;
        });
    }

    void print() const {
        cout << "Classroom (" << students_.size() << " students):\n";
        for (const auto &s: students_) {
            cout << "  " << s << '\n';
        }
    }

    Classroom &operator+=(const Student &s) {
        add(s);
        return *this;
    }

    Classroom &operator-=(const char *index) {
        remove(index);
        return *this;
    }
};


// =============================================================================
// SECTION 8 — INHERITANCE & POLYMORPHISM
// =============================================================================
//
//  virtual               — marks a function overridable
//  = 0                   — pure virtual, makes class abstract
//  override              — compile-time check we are actually overriding
//  virtual ~Base()       — REQUIRED: without it, deleting via base pointer
//                          only calls the base destructor — resource leak/UB
//
//  Object slicing occurs when a derived object is copied into a base by value.
//  Always hold polymorphic objects through pointer or reference.
// =============================================================================

class Shape {
protected:
    string colour_;

public:
    explicit Shape(string colour = "black")
        : colour_{move(colour)} {
    }

    virtual ~Shape() = default;

    virtual double area() const = 0; // pure virtual — Shape is abstract
    virtual double perimeter() const = 0;

    virtual void draw() const {
        cout << "[Shape] colour=" << colour_ << " area=" << area() << '\n';
    }

    const string &colour() const {
        return colour_;
    }
};

class Circle : public Shape {
private:
    double radius_;

public:
    explicit Circle(double radius, string colour = "black")
        : Shape{move(colour)}, radius_{radius} {
        if (radius_ <= 0.0) {
            throw std::invalid_argument{"Radius must be positive"};
        }
    }

    double area() const override {
        return M_PI * radius_ * radius_;
    }

    double perimeter() const override {
        return 2.0 * M_PI * radius_;
    }

    void draw() const override {
        cout << "[Circle] r=" << radius_ << " area=" << area() << '\n';
    }

    double radius() const {
        return radius_;
    }
};

class Rect : public Shape {
private:
    double width_;
    double height_;

public:
    Rect(double width, double height, string colour = "black")
        : Shape{move(colour)}, width_{width}, height_{height} {
    }

    double area() const override {
        return width_ * height_;
    }

    double perimeter() const override {
        return 2.0 * (width_ + height_);
    }

    void draw() const override {
        cout << "[Rect] " << width_ << "x" << height_ << " area=" << area() << '\n';
    }
};

void demo_polymorphism() {
    // Hold polymorphic objects through pointer — prevents slicing
    vector<unique_ptr<Shape> > shapes;
    shapes.push_back(make_unique<Circle>(5.0, "red"));
    shapes.push_back(make_unique<Rect>(3.0, 4.0, "blue"));
    shapes.push_back(make_unique<Circle>(2.5));

    for (const auto &s: shapes) {
        s->draw(); // virtual dispatch — correct override called every time
    }

    // --- Object slicing demo ---
    Circle c{5.0};
    Shape &ref = c; // OK — reference preserves dynamic type
    ref.draw(); // calls Circle::draw

    // Shape bad = c;      // BAD — Circle is sliced down to Shape, area() lost
}


// =============================================================================
// SECTION 9 — OPERATOR OVERLOADING (complete reference)
// =============================================================================
//
//  Rules:
//    operator=, operator[], operator->, operator() — must be members
//    operator<<, operator>>                        — must be free (friend)
//    Symmetric binary (+, -, *, ==, <)             — prefer free functions
//    Compound assignment (+=, -=, *=)              — member, return *this
//    Binary arithmetic should delegate to compound:  a + b  =>  a += b copy
// =============================================================================

class Vec2 {
private:
    // No extra private fields — x and y are public (value type pattern)

public:
    double x{};
    double y{};

    Vec2() = default;

    Vec2(double x, double y) : x{x}, y{y} {
    }

    // --- Compound assignment (member) ---
    Vec2 &operator+=(const Vec2 &rhs) {
        x += rhs.x;
        y += rhs.y;
        return *this;
    }

    Vec2 &operator-=(const Vec2 &rhs) {
        x -= rhs.x;
        y -= rhs.y;
        return *this;
    }

    Vec2 &operator*=(double scalar) {
        x *= scalar;
        y *= scalar;
        return *this;
    }

    // --- Unary negation ---
    Vec2 operator-() const {
        return Vec2{-x, -y};
    }

    // --- Subscript — provide both const and non-const ---
    double &operator[](int i) {
        return i == 0 ? x : y;
    }

    const double &operator[](int i) const {
        return i == 0 ? x : y;
    }

    // --- Equality ---
    bool operator==(const Vec2 &rhs) const {
        return x == rhs.x && y == rhs.y;
    }

    bool operator!=(const Vec2 &rhs) const {
        return !(*this == rhs);
    }

    // --- Conversion operator — explicit blocks accidental implicit use ---
    explicit operator bool() const {
        return x != 0.0 || y != 0.0;
    }

    // --- Stream output — free function via friend ---
    friend ostream &operator<<(ostream &os, const Vec2 &v) {
        return os << "(" << v.x << ", " << v.y << ")";
    }

    double length() const {
        return std::sqrt(x * x + y * y);
    }
};

// --- Binary arithmetic as free functions — delegate to compound assignment ---
Vec2 operator+(Vec2 lhs, const Vec2 &rhs) { return lhs += rhs; }
Vec2 operator-(Vec2 lhs, const Vec2 &rhs) { return lhs -= rhs; }
Vec2 operator*(Vec2 v, double scalar) { return v *= scalar; }
Vec2 operator*(double scalar, Vec2 v) { return v *= scalar; } // scalar * vec


// =============================================================================
// SECTION 10 — TEMPLATES
// =============================================================================

// --- 10a. Function template ---
template<typename T>
T clamp(T value, T lo, T hi) {
    return value < lo ? lo : (value > hi ? hi : value);
}

// --- 10b. Generic swap ---
template<typename T>
void mySwap(T &a, T &b) {
    T temp = move(a);
    a = move(b);
    b = move(temp);
}

// --- 10c. Class template ---
template<typename T>
class Pair {
private:
    T first_;
    T second_;

public:
    Pair(T first, T second) : first_{move(first)}, second_{move(second)} {
    }

    const T &first() const {
        return first_;
    }

    const T &second() const {
        return second_;
    }

    friend ostream &operator<<(ostream &os, const Pair<T> &p) {
        return os << "(" << p.first_ << ", " << p.second_ << ")";
    }
};


// =============================================================================
// SECTION 11 — SORTING ALGORITHMS (manual — for exam reference)
// =============================================================================
//
//  In production always use std::sort (introsort, O(n log n)).
//  Manual sorts shown here for exam completeness.
// =============================================================================

// --- 11a. Selection sort O(n²) ---
void selectionSort(vector<int> &arr) {
    int n = static_cast<int>(arr.size());
    for (int i = 0; i < n - 1; ++i) {
        int minIdx = i;
        for (int j = i + 1; j < n; ++j) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}

// --- 11b. Bubble sort O(n²) with early-exit optimisation ---
void bubbleSort(vector<int> &arr) {
    int n = static_cast<int>(arr.size());
    for (int i = 0; i < n - 1; ++i) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; ++j) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}

// --- 11c. Insertion sort O(n²), best for nearly-sorted data ---
void insertionSort(vector<int> &arr) {
    int n = static_cast<int>(arr.size());
    for (int i = 1; i < n; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            --j;
        }
        arr[j + 1] = key;
    }
}

// --- 11d. STL sort with custom comparator ---
void sortStudentsByGpa(vector<Student> &students) {
    std::sort(students.begin(), students.end(), [](const Student &a, const Student &b) {
        return a.gpa() > b.gpa();
    });
}


// =============================================================================
// SECTION 12 — STATIC MEMBERS & CONST CORRECTNESS
// =============================================================================

// --- 12a. Static member: shared across all instances ---
class Counter {
private:
    static int count_; // declaration

public:
    Counter() { ++count_; }
    ~Counter() { --count_; }

    static int count() {
        return count_;
    }
};

int Counter::count_ = 0; // definition — must be outside the class


// --- 12b. Const correctness ---
class Box {
private:
    double side_;

public:
    explicit Box(double side)
        : side_{side} {
    }

    double volume() const // const: callable on const Box, does not modify state
    {
        return side_ * side_ * side_;
    }

    void resize(double s) // non-const: modifies state, cannot be called on const Box
    {
        side_ = s;
    }
};


// =============================================================================
// SECTION 13 — SMART POINTERS
// =============================================================================

void demo_smart_pointers() {
    // unique_ptr — single owner, zero overhead, auto-delete
    auto up = make_unique<Person>("Charlie", 30);
    up->print();

    // Transfer ownership with move
    auto up2 = move(up); // up is now null
    up2->print();

    // shared_ptr — shared ownership, reference-counted
    auto sp1 = make_shared<Person>("Diana", 28);
    auto sp2 = sp1; // both own the object; ref count = 2
    sp1->print();
    cout << "shared use count: " << sp1.use_count() << '\n';

    // weak_ptr — non-owning observer, breaks circular references
    weak_ptr<Person> wp = sp1;
    if (auto locked = wp.lock()) // lock() returns shared_ptr or null
        locked->print();
}


// =============================================================================
// SECTION 14 — COMMON PITFALLS (illustrated with correct code)
// =============================================================================

void demo_pitfalls() {
    // --- Pitfall 1: Object slicing (correct: use reference/pointer) ---
    Circle c{3.0};
    Shape &ref = c;
    ref.draw(); // calls Circle::draw — correct

    // Shape sliced = c;   // BAD — silently loses Circle state

    // --- Pitfall 2: Dangling pointer (correct: return by value or smart ptr) ---
    auto makeString = []() -> string {
        string s = "hello";
        return s; // RVO/NRVO — no copy, safe
    };
    string result = makeString();
    cout << result << '\n';

    // --- Pitfall 3: Forgetting delete[] on arrays (correct: use vector) ---
    vector<int> safe(10, 0); // automatic lifetime
    (void) safe;

    // --- Pitfall 4: Non-const method on const object (correct: mark const) ---
    const Box box{3.0};
    cout << "volume: " << box.volume() << '\n'; // OK — volume() is const
    // box.resize(5.0);   // compile error — resize() is not const

    // --- Pitfall 5: Using moved-from object ---
    string a = "hello";
    string b = move(a); // a is now in valid but unspecified state
    // cout << a;          // technically valid but meaningless
    cout << "b after move: " << b << '\n';
}


// =============================================================================
// MAIN
// =============================================================================

int main() {
    cout << "=== SECTION 1 — Structs ===\n";
    demo_struct();

    cout << "\n=== SECTION 2 — Enums ===\n";
    demo_enum();

    cout << "\n=== SECTION 3 — Rule of Zero ===\n";
    demo_rule_of_zero();

    cout << "\n=== SECTION 4 — Rule of Three (StringBuffer) ===\n";
    demo_rule_of_three();

    cout << "\n=== SECTION 5 — Rule of Five (Buffer) ===\n";
    demo_rule_of_five();

    cout << "\n=== SECTION 6 — Student (Rule of Five with char*) ===\n";
    {
        Student s1{"Alice", "211001", 2, 9.5};
        Student s2 = s1; // copy constructor
        Student s3{"Bob", "211002", 3, 8.0};
        s3 = s1; // copy-assignment
        Student s4 = move(s3); // move constructor
        s1.print();
        s2.print();
        s4.print();
        cout << "s1 == s2: " << (s1 == s2 ? "yes" : "no") << '\n';
    }

    cout << "\n=== SECTION 7 — Classroom ===\n";
    {
        Classroom room;
        room += Student{"Alice", "211001", 2, 9.5};
        room += Student{"Bob", "211002", 2, 8.0};
        room += Student{"Carol", "211003", 3, 9.8};
        room += Student{"Dave", "211004", 1, 7.5};
        room.print();

        room.sortByGpaDescending();
        cout << "--- sorted by GPA ---\n";
        room.print();

        room -= "211002";
        cout << "--- after removing 211002 ---\n";
        room.print();
        cout << "Average GPA: " << room.averageGpa() << '\n';
    }

    cout << "\n=== SECTION 8 — Polymorphism ===\n";
    demo_polymorphism();

    cout << "\n=== SECTION 9 — Vec2 Operators ===\n";
    {
        Vec2 a{1.0, 2.0};
        Vec2 b{3.0, 4.0};
        cout << "a     = " << a << '\n';
        cout << "b     = " << b << '\n';
        cout << "a+b   = " << (a + b) << '\n';
        cout << "a-b   = " << (a - b) << '\n';
        cout << "a*2   = " << (a * 2.0) << '\n';
        cout << "3*a   = " << (3.0 * a) << '\n';
        cout << "|b|   = " << b.length() << '\n';
        cout << "a==a  : " << (a == a) << '\n';
        cout << "a==b  : " << (a == b) << '\n';
        if (a) cout << "a is non-zero\n";
    }

    cout << "\n=== SECTION 10 — Templates ===\n";
    {
        cout << "clamp(15, 0, 10) = " << clamp(15, 0, 10) << '\n';
        cout << "clamp(5,  0, 10) = " << clamp(5, 0, 10) << '\n';
        Pair<double> pair{3.14, 2.71};
        cout << "Pair: " << pair << '\n';
    }

    cout << "\n=== SECTION 11 — Sorting ===\n";
    {
        vector<int> v1{5, 3, 8, 1, 9, 2, 7};
        vector<int> v2 = v1;
        vector<int> v3 = v1;

        bubbleSort(v1);
        selectionSort(v2);
        insertionSort(v3);

        auto printVec = [](const vector<int> &v, const char *label) {
            cout << label << ": ";
            for (int x: v)
                cout << x << ' ';
            cout << '\n';
        };

        printVec(v1, "bubble   ");
        printVec(v2, "selection");
        printVec(v3, "insertion");
    }

    cout << "\n=== SECTION 12 — Static / Const ===\n";
    {
        cout << "Counter: " << Counter::count() << '\n';
        {
            Counter c1, c2, c3;
            cout << "Counter: " << Counter::count() << '\n';
        }
        cout << "Counter: " << Counter::count() << '\n';
    }

    cout << "\n=== SECTION 13 — Smart Pointers ===\n";
    demo_smart_pointers();

    cout << "\n=== SECTION 14 — Pitfalls ===\n";
    demo_pitfalls();

    cout << "\nAll demos complete.\n";
    return 0;
}

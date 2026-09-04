// Да се напише класа Ingredient која ги содржи следните податоци за една состојка:
//
//     name - име на состојката, динамички алоцирана низа од карактери;
//     quantity - количина
//     calories - колку калории содржи состојката
//
// За класата да се напишат default конструктор, конструктор со аргументи, copy конструктор и десктруктор.
// Метод кој што ќе го враќа бројот на калории на состојката: quantity*calories
// Да се преоптовари операторот << за да ги печати објектите од класата во следниот формат: [name] [quantity]
// Да се преоптовари операторот = .
//
//
// Потоа да се дефинира класата Dish, која ги содржи следните податоци:
//     ingredients - динамички алоцирана низа од Ingredient објекти
//     dishName - динамички алоцирана низа од цели karakteri
//     ingredientCount - број на состојки во јадењето
//
// За класата да се дефинираат конструктор со параметри, copy конструктор, деструктор, како и следните методи:
//     Метод getTotalCaloreis кој што ќе го враќа бројот на калории на специјалитетот за сите состојки
//     оператор + кој како резултат дава ново јадење со состојки од двете јадења
//     оператор += кој во јадењето ќе додава нови состојки
//     оператор == кој ќе проверува дали две јадења имаат ист број на калории
//     оператор << за печатење на објектот во следниот формат:
//
// Dish: Pizza
// - Tomato: 200g/ml
// - Cheese: 50g/ml
// Total Calories: 6500
//
// Да не се менува main функцијата. Се признаваат и решенија без динамичка алокација на меморија.
//
// ------------------------------------------------------------------------------------------------------------
//
// Write a class Ingredient that contains the following data for one ingredient:
//
//     name - the name of the ingredient, dynamically allocated array of characters;
//     quantity - quantity;
//     calories - how many calories the ingredient contains.
//
// For the class, write a default constructor, a constructor with parameters, a copy constructor, and a destructor. Write a method that returns the number of calories for the ingredient: quantity * calories. Overload the << operator to print objects of the class in the following format: [name] [quantity]. Overload the = operator.
//
// Then define the class Dish, which contains the following data:
//
//     ingredients - dynamically allocated array of Ingredient objects;
//     dishName - dynamically allocated array of characters;
//     ingredientCount - the number of ingredients in the dish.
//
// For the class, define constructors with parameters, a copy constructor, a destructor, as well as the following methods:
//
//     A method getTotalCalories that returns the number of calories for the dish, considering all ingredients.
//     An operator+ that returns a new dish with ingredients from both dishes.
//     An operator+= that adds new ingredients to the dish.
//     An operator== that checks if two dishes have the same number of calories.
//     An operator<< for printing the object in the following format:
//          Dish: Pizza
//              - Tomato: 200g/ml
//              - Cheese: 50g/ml
//          Total Calories: 6500
//
// Do not modify the main function. Solutions without dynamic memory allocation are also accepted.
//
// Answer:(penalty regime: 0 %)

#include <cstring>
#include <iosfwd>
#include <iostream>
using namespace std;

class Ingredient {
private:
    char *name;
    int quantity;
    int calories;

public:
    explicit Ingredient(const char *name = "", const int quantity = 0, const int calories = 0) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        this->quantity = quantity;
        this->calories = calories;
    }

    Ingredient(const Ingredient &other) {
        this->name = new char[strlen(other.name) + 1];
        strcpy(this->name, other.name);
        this->quantity = other.quantity;
        this->calories = other.calories;
    }

    ~Ingredient() {
        delete[] name;
    }

    [[nodiscard]] char *getName() const {
        return name;
    }

    void setName(const char *newName) {
        delete[] name;
        name = new char[strlen(newName) + 1];
        strcpy(name, newName);
    }

    [[nodiscard]] int getQuantity() const {
        return quantity;
    }

    void setQuantity(const int newQuantity) {
        this->quantity = newQuantity;
    }

    [[nodiscard]] int getCalories() const {
        return calories;
    }

    void setCalories(const int newCalories) {
        this->calories = newCalories;
    }

    int totalCalories() const {
        return quantity * calories;
    }

    friend ostream &operator<<(ostream &out, const Ingredient &obj) {
        out << obj.name << " " << obj.quantity << '\n';
        return out;
    }

    Ingredient &operator=(const Ingredient &other) {
        if (this != &other) {
            delete[] name;
            this->name = new char[strlen(other.name) + 1];
            strcpy(this->name, other.name);
            this->quantity = other.quantity;
            this->calories = other.calories;
        }
        return *this;
    }
};

class Dish {
private:
    Ingredient *ingredients;
    char *dishName;
    int ingredientsCount;

public:
    explicit Dish(const char *dishName = "") {
        this->ingredientsCount = 0;
        this->ingredients = nullptr;
        this->dishName = new char[strlen(dishName) + 1];
        strcpy(this->dishName, dishName);
    }

    Dish(const Dish &other) {
        this->ingredientsCount = other.ingredientsCount;
        this->ingredients = new Ingredient[ingredientsCount];
        for (int i = 0; i < ingredientsCount; i++) {
            this->ingredients[i] = other.ingredients[i];
        }
        this->dishName = new char[strlen(other.dishName) + 1];
        strcpy(this->dishName, other.dishName);
    }

    ~Dish() {
        delete[] this->ingredients;
        delete[] this->dishName;
    }

    static int getTotalCaloreis(const Dish &dish) {
        int total = 0;
        for (int i = 0; i < dish.ingredientsCount; i++) {
            total += dish.ingredients[i].totalCalories();
        }
        return total;
    }

    Dish &operator+=(const Ingredient &ingredient) {
        const auto tmp = new Ingredient[ingredientsCount + 1];
        for (int i = 0; i < ingredientsCount; i++) {
            tmp[i] = ingredients[i];
        }
        tmp[ingredientsCount] = ingredient;

        delete[] ingredients;
        ingredients = tmp;
        ingredientsCount++;

        return *this;
    }

    friend ostream &operator<<(ostream &out, const Dish &obj) {
        out << "Dish: " << obj.dishName << "\n";
        for (int i = 0; i < obj.ingredientsCount; i++) {
            out << "- " << obj.ingredients[i].getName()
                    << ": " << obj.ingredients[i].getQuantity() << "g/ml\n";
        }
        out << "Total Calories: " << getTotalCaloreis(obj) << "\n";
        return out;
    }
};

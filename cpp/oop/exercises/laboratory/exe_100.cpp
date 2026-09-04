// Да се напише класа Ingredient која ги содржи следните податоци за една состојка:
//
// name - име на состојката, динамички алоцирана низа од карактери;
// quantity - количина
// calories - колку калории содржи состојката
//
// За класата да се напишат default конструктор, конструктор со аргументи, copy конструктор и десктруктор.
// Метод кој што ќе го враќа бројот на калории на состојката: quantity*calories
// Да се преоптовари операторот << за да ги печати објектите од класата во следниот формат: [name] [quantity]
// Да се преоптовари операторот = .
//
// Потоа да се дефинира класата Dish, која ги содржи следните податоци:
//
// ingredients - динамички алоцирана низа од Ingredient објекти
// dishName - динамички алоцирана низа од цели karakteri
// ingredientCount - број на состојки во јадењето

// За класата да се дефинираат конструктор со параметри, copy конструктор, деструктор, како и следните методи:
// Метод getTotalCaloreis кој што ќе го враќа бројот на калории на специјалитетот за сите состојки
// оператор + кој како резултат дава ново јадење со состојки од двете јадења
// оператор += кој во јадењето ќе додава нови состојки
// оператор == кој ќе проверува дали две јадења имаат ист број на калории
// оператор << за печатење на објектот во следниот формат:
// Dish: Pizza
// - Tomato: 200g/ml
// - Cheese: 50g/ml
// Total Calories: 6500

#include <iostream>
#include <cstring>
using namespace std;

class Ingredient {
private:
    char *name;
    int quantity;
    double calories;

public:
    Ingredient() {
        this->name = new char[1];
        name[0] = '\0';
        quantity = 0;
        calories = 0;
    }

    Ingredient(const char *name, int quantity, double calories) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        this->quantity = quantity;
        this->calories = calories;
    }

    Ingredient(const Ingredient &i) {
        this->name = new char[strlen(i.name) + 1];
        strcpy(this->name, i.name);
        this->quantity = i.quantity;
        this->calories = i.calories;
    }

    Ingredient &operator=(const Ingredient &i) {
        if (this != &i) {
            delete[] name;
            this->name = new char[strlen(i.name) + 1];
            strcpy(this->name, i.name);
            this->quantity = i.quantity;
            this->calories = i.calories;
        }
        return *this;
    }

    ~Ingredient() {
        delete[] name;
    }

    double total() const {
        return quantity * calories;
    }

    friend ostream &operator<<(ostream &os, const Ingredient &i) {
        os << "- " << i.name << ": " << i.quantity << "g/ml" << endl;
        return os;
    }
};

class Dish {
private:
    Ingredient *ingredients;
    char *dishName;
    int ingredientCount;

public:
    Dish() {
        this->ingredients = new Ingredient[0];
        this->dishName = new char[1];
        dishName[0] = '\0';
        ingredientCount = 0;
    }

    Dish(const char *dishName) {
        this->dishName = new char[strlen(dishName) + 1];
        strcpy(this->dishName, dishName);
        this->ingredients = new Ingredient[0];
        this->ingredientCount = 0;
    }

    Dish(const Dish &d) {
        this->dishName = new char[strlen(d.dishName) + 1];
        strcpy(this->dishName, d.dishName);
        this->ingredientCount = d.ingredientCount;
        this->ingredients = new Ingredient[ingredientCount];
        for (int i = 0; i < ingredientCount; i++) {
            this->ingredients[i] = d.ingredients[i];
        }
    }

    Dish &operator=(const Dish &d) {
        if (this != &d) {
            delete[] dishName;
            delete[] ingredients;
            this->dishName = new char[strlen(d.dishName) + 1];
            strcpy(this->dishName, d.dishName);
            this->ingredientCount = d.ingredientCount;
            this->ingredients = new Ingredient[ingredientCount];
            for (int i = 0; i < ingredientCount; i++) {
                this->ingredients[i] = d.ingredients[i];
            }
        }
        return *this;
    }

    ~Dish() {
        delete[] ingredients;
        delete[] dishName;
    }

    double getTotalCalories() const {
        double sum = 0;
        for (int i = 0; i < ingredientCount; i++) {
            sum += ingredients[i].total();
        }
        return sum;
    }

    Dish &operator+=(const Ingredient &i) {
        Ingredient *tmp = new Ingredient[ingredientCount + 1];
        for (int j = 0; j < ingredientCount; j++) {
            tmp[j] = ingredients[j];
        }
        tmp[ingredientCount++] = i;
        delete[] ingredients;
        ingredients = tmp;
        return *this;
    }

    Dish operator+(const Dish &other) const {
        Dish result(dishName);
        delete[] result.ingredients; // бидејќи по default има празна низа
        result.ingredientCount = this->ingredientCount + other.ingredientCount;
        result.ingredients = new Ingredient[result.ingredientCount];
        for (int i = 0; i < this->ingredientCount; i++) {
            result.ingredients[i] = this->ingredients[i];
        }
        for (int i = 0; i < other.ingredientCount; i++) {
            result.ingredients[i + this->ingredientCount] = other.ingredients[i];
        }
        return result;
    }

    bool operator==(const Dish &other) const {
        return this->getTotalCalories() == other.getTotalCalories();
    }

    friend ostream &operator<<(ostream &os, const Dish &d) {
        os << "Dish: " << d.dishName << endl;
        for (int i = 0; i < d.ingredientCount; i++) {
            os << d.ingredients[i];
        }
        os << "Total Calories: " << d.getTotalCalories() << endl;
        return os;
    }
};

int main() {
    char name[50];
    cin >> name;
    Ingredient tomato(name, 200, 20);

    cin >> name;
    Ingredient onion(name, 100, 30);

    cin >> name;
    Ingredient cheese(name, 50, 50);

    cin >> name;
    Dish salad(name);
    salad += tomato;
    salad += onion;

    cin >> name;
    Dish pizza(name);
    pizza += tomato;
    pizza += cheese;

    // Test + operator
    Dish combinedDish = salad + pizza;
    cout << combinedDish;

    cout << "---------------------" << endl;

    // Test = operator
    Ingredient ingredient = tomato;
    cout << ingredient;

    cout << "---------------------" << endl;

    // Test == operator
    if (salad == pizza) {
        cout << "Salad and Pizza have the same calories." << endl;
    } else {
        cout << "Salad and Pizza do not have the same calories." << endl;
    }

    cout << "---------------------" << endl;

    // Test << operator
    cout << "Salad:" << endl;
    cout << salad;

    cout << "Pizza:" << endl;
    cout << pizza;

    return 0;
}

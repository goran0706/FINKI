/*
    Во оваа задача треба да се внесат и испечатат податоци за автомобили.

    За еден автомобил (објект од класата Car) се чуваат следниве податоци:

    сопственик (објект од класата Person)
    датум на купување (објект од класата Date)
    цена (float price), предодредена вредност 0

    За класата Car потребно е да се напише метод за печатење print() и метод за добивање на цената getPrice().

    Класата Date содржи три цели броеви (int year, month, day) кои претставуваат датум.
    За неа треба да се напише метод за печатење print(), предодреден (default) конструктор, конструктор со параметри и конструктор за копирање.

    Класата Person содржи име и презиме (низи од максимум 20 знаци, со предодредени вредности not specified),
    предодреден конструктор, конструктор со параметри и метод за печатење print().

    Методот за печатење кај класата Person изгледа вака: [name] [lastName].
    Методот за печатење кај класата Date изгледа вака: [year].[month].[day].
    Методот за печатење кај класата Car изгледа вака:

    owner.print()
    date.print()
    Price: [price]

    Покрај тоа, потребно е да се напише метод cheaperThan(Car* cars, int numCars, float price) кој ќе ги испечати
    сите објекти Car од низата cars со големина numCars чија цена е помала од price.
*/

#include "iostream"
#include "cstring"
using namespace std;

class Date {
private:
    int year, month, day;

public:
    Date() {
    }

    Date(int year, int month, int day) {
        this->year = year;
        this->month - month;
        this->day = day;
    }

    Date(const Date &d) {
        this->year = d.year;
        this->month - d.month;
        this->day = d.day;
    }

    void print() {
        cout << year << "." << month << "." << day;
    }
};

class Person {
private:
    char name[21];
    char surname[21];

public:
    Person(char *name = "not specified", char *surname = "not specified") {
        strcpy(this->name, name);
        strcpy(this->surname, surname);
    }

    void print() {
        cout << name << " " << surname;
    }
};

class Car {
private:
    Person owner;
    Date date;
    float price;

public:
    Car() {
    }

    Car(Person owner, Date date, float price) {
        this->owner = owner;
        this->date = date;
        this->price = price;
    }

    void print() {
        owner.print();
        date.print();
        cout << "Price: " << price;
    }

    float getPrice() const {
        return price;
    }
};

void cheaperThan(Car *cars, int numCars, float price) {
    for (int i = 0; i < numCars; ++i) {
        if (price > cars[i].getPrice()) {
            cars[i].print();
        }
    }
}

int main() {
    char name[20];
    char lastName[20];
    int year;
    int month;
    int day;
    float price;

    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cin >> name;
        cin >> lastName;
        Person p(name, lastName);

        cin >> year;
        cin >> month;
        cin >> day;
        Date d(year, month, day);

        cin >> price;
        Car car(p, d, price);

        car.print();
    } else if (testCase == 2) {
        cin >> name;
        cin >> lastName;
        Person p(name, lastName);

        cin >> year;
        cin >> month;
        cin >> day;
        Date d(Date(year, month, day));

        cin >> price;
        Car car(p, d, price);
        car.print();
    } else {
        int numCars;
        cin >> numCars;

        Car cars[10];
        for (int i = 0; i < numCars; ++i) {
            cin >> name;
            cin >> lastName;
            Person p(name, lastName);

            cin >> year;
            cin >> month;
            cin >> day;
            Date d(year, month, day);

            cin >> price;
            cars[i] = Car(p, d, price);
        }
        float priceLimit;
        cin >> priceLimit;
        cheaperThan(cars, numCars, priceLimit);
    }

    return 0;
}

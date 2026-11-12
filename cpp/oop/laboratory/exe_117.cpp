// Да се имплементира класа Employee за која се чува:
// име (низа од карактери)
// години (цел број)
// Во класата да се имплементира виртуелна функција displayInfo() која на екран печати информации за вработениот.
//
// Потоа да се имплементира класа Payable за која се чува:
//
// плата (децимален број)
// За класата да се креира чисто виртуелна функција calculateSalary()
// Од овие класи потребно е да се изведат Developer и Manager.
// За класата Developer дополнително се чува и програмскиот јазик (низа од карактери).
// Потребно е да се препокријат соодветните функции. Платата се пресметува така што од основната плата се одзема данок од 10%.
// За класата Manager дополнително се чува и број на оддели за кои е одговорен.
// Потребно е да се препокријат соодветните функции.
// Платата се пресметува така што на основната плата се додава бонус од 5% за секој еден оддел.

#include "iostream"
#include "cstring"
using namespace std;

class Employee {
protected:
    char name[51];
    int age;

public:
    Employee(char *name = "", int year = 0) {
        strcpy(this->name, name);
        this->age = year;
    }

    virtual void displayInfo() {
        cout << "Name: " << name << endl;
        cout << "Age: " << age;
    }
};

class Payable {
protected:
    double salary;

public:
    Payable(double salary = 0) {
        this->salary = salary;
    }

    virtual double calculateSalary() const =0;
};

class Developer : public Employee, public Payable {
private:
    char lang[100];

public:
    Developer(char *name = "", int year = 0, double salary = 0,
              char *lang = "") : Employee(name, year), Payable(salary) {
        strcpy(this->lang, lang);
    }

    double calculateSalary() const override {
        return salary - (salary * 0.1);
    }

    void displayInfo() override {
        cout << "-- Developer Information --" << endl;
        Employee::displayInfo();
        cout << "Salary: $" << calculateSalary() << endl;
        cout << "Programming Language: " << lang << endl;
    }
};

class Manager : public Employee, public Payable {
private:
    int num;

public:
    Manager(char *name = "", int year = 0, double salary = 0, int num = 0) : Employee(name, age), Payable(salary) {
        this->num = num;
    }

    double calculateSalary() const override {
        return (num * 0.5) + salary;
    }
};

double biggestSalary(Payable *payable[], int n) {
    Payable *maxSalaryEmployee = payable[0];

    for (int i = 1; i < n; i++) {
        if (payable[i]->calculateSalary() > maxSalaryEmployee->calculateSalary()) {
            maxSalaryEmployee = payable[i];
        }
    }

    return maxSalaryEmployee->calculateSalary();
}

int main() {
    Payable *payable[5];
    Developer developers[5];
    Manager managers[5];
    int j = 0, k = 0;
    for (int i = 0; i < 5; i++) {
        char name[50];
        int age;
        double salary;
        cin >> name >> age >> salary;
        if (i % 2 == 0) {
            char programmingLanguage[50];
            cin >> programmingLanguage;
            developers[j] = Developer(name, age, salary, programmingLanguage);
            developers[j].displayInfo();
            payable[i] = &developers[j];
            j++;
        } else {
            int numberOfDepartments;
            cin >> numberOfDepartments;
            managers[k] = Manager(name, age, salary, numberOfDepartments);
            managers[k].displayInfo();
            payable[i] = &managers[k];
            k++;
        }
    }
    cout << endl << "Biggest Salary: " << biggestSalary(payable, 5);
    return 0;
}

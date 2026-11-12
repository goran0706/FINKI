// Потребно е да креирате систем за членство во една теретана.
// За таа цел, најпрво ќе креирате една класа Membership со информации за:
//
// име на членот - низа од максимум 50 знаци
// ден на зачленување - низа од максимум 11 знаци (2025-05-05)
// месечна членарина - цел број
// За основната класа треба да креирате:
//
// Default конструктор
// Конструктор со параметри
// Copy конструктор
// Оператор =
// Функција која ќе ја враќа вредноста на месечната членарина (getMonthlyFee)
// Функција print што ги печати информациите за членот во формат:
// [име и презиме] - [датум на зачленување]
//
// Понатаму потребно е да развиете две класи: BasicMembership и VIPMembership
//
// Класата BasicMembership треба да содржи информација isMorningMembership - boolean вредност за тоа дали членот смее да вежба само до 15:00.
//
// За оваа класа потребно е да креирате:
//
// Default конструктор
// Конструктор со параметри
// Функција што ќе ја враќа вредноста на месечната членарина (getMonthlyFee),
// пресметана така што доколку членот смее да вежба само до 15:00, добива 25% попуст на основната месечна членарина.
// Пример: Доколку месечната членарина е 2000 денари и членот вежба само наутро,
// оваа функција ќе врати вредност 1500 денари (2000-0.25*2000 = 1500), инаку се добива стандардната висина на месечната членарина.
// Функција print што ги печати информациите за членот во формат:
// [име и презиме] - [датум на зачленување] - [месечна членарина] - [вежба до 15:00 - yes/no]
//
// Вашата теретана е многу модерна и има спа која е пристаплива само за VIP членовите.
// Класата VIPMembership треба да содржи информации за:
// дали членот го користи спа просторот - boolean вредност
// колку часа членот вежбал со тренер - цел број
// За оваа класа потребно е да креирате:
//
// Default конструктор
// Конструктор со параметри
// Функција што ќе ја враќа вредноста на месечната членарина (getMonthlyFee),
// пресметана така што доколку членот го користи спа просторот, висината се зголемува за 1000 денари.
// Во пресметката се додава и бројот на часови со тренер. Цена на еден час е 150 денари.
// Пример: Основната членарина е 2000 денари.
// Членот го користи спа просторот и вежбал 10 часа со тренер: 2000 + 1000 + 10*150 = 4500 денари.
// Функција print што ги печати информациите за членот во формат:
// [име и презиме] - [датум на зачленување] - [месечна членарина] - [користи спа - yes/no] - [вкупна сума платена за тренер]
#include<iostream>
#include<cstring>
using namespace std;

class Membership {
protected:
    char name[50];
    char date[11];
    int price;
public:
    explicit Membership(const char* name = "", const char* date = "", const int price = 0) {
        strcpy(this->name, name);
        strcpy(this->date, date);
        this->price = price;
    }
    Membership(const Membership &other) {
        strcpy(this->name, other.name);
        strcpy(this->date, other.date);
        this->price = other.price;
    }
    virtual ~Membership() = default;
    Membership &operator=(const Membership &other) {
        if(this != &other) {
            strcpy(this->name, other.name);
            strcpy(this->date, other.date);
            this->price = other.price;
        }
        return *this;
    }
    virtual int getMonthlyFee() const {
        return price;
    }
    virtual void print() const {
        cout << name << " - " << date << endl;
    }
};

class BasicMembership final : public Membership {
private:
    bool isMorningMembership;
public:
    explicit BasicMembership(const char* name = "", const char* date = "", const int price = 0,
                             const bool isMorningMembership = false) : Membership(name, date, price) {
        this->isMorningMembership = isMorningMembership;
    }
    explicit BasicMembership(const Membership &other, const bool isMorningMembership = false) : Membership(other) {
        this->isMorningMembership = isMorningMembership;
    }
    BasicMembership(const BasicMembership &other) : Membership(other) {
        this->isMorningMembership = other.isMorningMembership;
    }
    ~BasicMembership() override = default;
    BasicMembership &operator=(const BasicMembership &other) {
        if(this != &other) {
            Membership::operator=(other);
            this->isMorningMembership = other.isMorningMembership;
        }
        return *this;
    }
    int getMonthlyFee() const override {
        return (isMorningMembership) ? Membership::getMonthlyFee() * 0.75 : Membership::getMonthlyFee();
    }
    void print() const override {
        cout << name << " - " << date << " - " << getMonthlyFee() << " - " << (isMorningMembership ? "yes" : "no") << endl;
    }
};

class VIPMembership final : public Membership {
private:
    bool usesSpa;
    int hours;
public:
    explicit VIPMembership(const char* name = "", const char* date = "", const int price = 0, const bool usesSpa = false,
                           const int hours = 0) : Membership(name, date, price) {
        this->usesSpa = usesSpa;
        this->hours = hours;
    }
    explicit VIPMembership(const Membership &other, const bool usesSpa = false, const int hours = 0) : Membership(other) {
        this->usesSpa = usesSpa;
        this->hours = hours;
    }
    VIPMembership(const VIPMembership &other) : Membership(other) {
        this->usesSpa = other.usesSpa;
        this->hours = other.hours;
    }
    ~VIPMembership() override = default;
    VIPMembership &operator=(const VIPMembership &other) {
        if(this != &other) {
            Membership::operator=(other);
            this->usesSpa = other.usesSpa;
            this->hours = other.hours;
        }
        return *this;
    }
    int getMonthlyFee() const override {
        return Membership::getMonthlyFee() + hours * 150 + (usesSpa ? 1000 : 0);
    }
    void print() const override {
        cout << name << " - " << date << " - " << getMonthlyFee() << " - " << (usesSpa ? "yes - " : "no - ") << hours * 150 << endl;
    }
};

int main()
{
    int n;
    cin >> n;
    char name[50];
    char dateJoined[11];
    int membershipPrice;

    for (int i = 0; i < n; i++)
    {
        cin >> name;
        cin >> dateJoined;
        cin >> membershipPrice;

        Membership m = Membership(name, dateJoined, membershipPrice);

        if (i % 2)
        {
            bool isMorningMembership;
            cin >> isMorningMembership;
            BasicMembership bm = BasicMembership(m, isMorningMembership);
            bm.print();
        }
        else
        {
            bool usesSpa;
            int numOfHoursWithTrainer;
            cin >> usesSpa >> numOfHoursWithTrainer;
            VIPMembership vm = VIPMembership(m, usesSpa, numOfHoursWithTrainer);
            vm.print();
        }
    }

    return 0;
}
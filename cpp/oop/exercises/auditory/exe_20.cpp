/*
    Објектно ориентирано програмирање

    Аудиториска вежба 7 (полиморфизам)
    1. Задачи
    1.1. Хотелска резервација

    Да се дефинира класа HotelReservation за хотелска резервација.

    За хотелската резервација се чува бројот на денови, бројот на лица, име и презиме на лицето за контакт.

    Да се земе дека цената на резервацијата за едно лице за еден ден е 25 евра.

    Во класата да се дефинира функција price() која враќа колкава е цената на резервацијата.

    Во класата да се дефинира функција price(int amount) која враќа колкава износ (кусур) треба да се врати од касата
    ако корисникот на резервацијата ја доставува дадената уплата.

    Да се изведе класа HalfBoardHotelReservation за полупансионска хотелска резервација за резервирање на хотелска соба со појадок.

    Цената на појадокот за едно лице за еден ден е 5 евра. Да се препокрие соодветно функцијата price(int amount).

    Да се дефинира класа Hotel со информации за името на хотелот и салдо на хотелот.

    Во класата да се дефинира функција int pay(HotelReservation &hr, int amount);

    Со оваа функција треба да се направи уплата за дадена хотелска резервација.
    Ако уплатата ја надминува бараната сума функцијататреба да врати колку пари треба да му се врати на корисникот кој ја прави уплатата.
    Уплатата треба да се додаде во салдото на хотелот.

    Што ќе се случеше ако аргументот не е референца?
*/
#include <iostream>
using namespace std;

class HotelReservation {
protected:
    int days_count;
    int guest_count;
    string name;
    string surname;

public:
    HotelReservation(int days = 0, int guests = 0, const string &name = "", const string &surname = "") {
        this->days_count = days;
        this->guest_count = guests;
        this->name = name;
        this->surname = surname;
    }

    virtual ~HotelReservation() = default;

    virtual int price() const {
        return days_count * guest_count * 25;
    }

    virtual int price(int amount) {
        if (amount >= price()) {
            return amount - price();
        } else {
            cout << "Reservation price: " << price() << endl;
            return -1;
        }
    }
};

class HalfBoardHotelReservation : public HotelReservation {
public:
    HalfBoardHotelReservation(int days, int guests, const string &name, const string &surname)
        : HotelReservation(days, guests, name, surname) {
    }

    //препокривање на price(int amount)
    int price(int amount) override {
        int _price = HotelReservation::price() + guest_count * 5; // call price from base class
        if (amount >= _price)
            return amount - _price;
        else {
            cout << "Reservation price: " << _price << endl;
            return -1;
        }
    }
};


class Hotel {
private:
    string name;
    int balance;

public:
    Hotel(const string &name) {
        this->name = name;
        balance = 0;
    }

    // референца кон основната класа може да референцира објекти и кон изведените класи
    int pay(HotelReservation &hr, int payment) {
        int change = hr.price(payment); // полиморфизам
        // која дефиниција на price ќе се повика?
        // важно: price е виртуелна функција
        if (change != -1) balance += payment - change;
        return change;
    }
};

int main() {
    Hotel h("Bristol");

    HotelReservation *hr1 = new HotelReservation(5, 5, "John", "Doe");
    HalfBoardHotelReservation *hr2 = new HalfBoardHotelReservation(5, 5, "Jane", "Smith");
    HotelReservation *hr3 = new HalfBoardHotelReservation(4, 2, "Bob", "Johnson");
    HalfBoardHotelReservation hr4(5, 3, "Alice", "Brown");

    int price;

    price = h.pay(*hr1, 1000);
    if (price != -1) cout << "Change : " << price << endl;

    price = h.pay(*hr2, 1000);
    if (price != -1) cout << "Change : " << price << endl;

    price = h.pay(*hr3, 100);
    if (price != -1) cout << "Change : " << price << endl;

    price = h.pay(hr4, 1000);
    if (price != -1) cout << "Change : " << price << endl;

    delete hr1;
    delete hr2;
    delete hr3;

    return 0;
}

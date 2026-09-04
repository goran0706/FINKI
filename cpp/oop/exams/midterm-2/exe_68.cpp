#include <iostream>
#include <cstring>
using namespace std;

class Library {
protected:
    string name;
    string city;
    float price;
    bool weekend;

public:
    Library(const string &name = "", const string &city = "", float price = 0, bool weekend = false) {
        this->name = name;
        this->city = city;
        this->price = price;
        this->weekend = weekend;
    }

    Library(const Library &library) {
        this->name = library.name;
        this->city = library.city;
        this->price = library.price;
        this->weekend = library.weekend;
    }

    Library &operator=(const Library &library) {
        if (this != &library) {
            this->name = library.name;
            this->city = library.city;
            this->price = library.price;
            this->weekend = library.weekend;
        }
        return *this;
    }

    ~Library() {
    }

    virtual void printDetail() = 0;

    virtual double calculateMembershipCardCost() = 0;
};

class AcademicLibrary : public Library {
private:
    bool something;
    int number;

public:
    AcademicLibrary(const string &name = "", const string &city = "", float price = 0, bool weekend = false,
                    bool something = false, int number = 0)
        : Library(name, city, price, weekend) {
        this->something = something;
        this->number = number;
    }

    AcademicLibrary(const AcademicLibrary &a) : Library(a) {
        this->something = a.something;
        this->number = a.number;
    }

    AcademicLibrary &operator=(const AcademicLibrary &a) {
        if (this != &a) {
            Library::operator=(a);
            this->something = a.something;
            this->number = a.number;
        }
        return *this;
    }

    ~AcademicLibrary() {
    }

    void printDetail() override {
        cout << name << " - (Academic) " << city << " " << number << " " << calculateMembershipCardCost() << endl;
    }

    //[Ime na biblioteka] - (Academic) [Grad] [Broj na spec. kolekcii] [Cena na clenarina]
    double calculateMembershipCardCost() override {
        double cost = price;
        if (something) {
            cost = cost * 1.24;
        }
        cost = cost + (number * 6);
        return cost;
    }
};

class NationalLibrary : public Library {
private:
    bool something;
    int number;

public:
    NationalLibrary(const string &name = "", const string &city = "", float price = 0, bool weekend = false,
                    bool something = false, int number = 0)
        : Library(name, city, price, weekend) {
        this->something = something;
        this->number = number;
    }

    NationalLibrary(const NationalLibrary &n) : Library(n) {
        this->something = n.something;
        this->number = n.number;
    }

    NationalLibrary &operator=(const NationalLibrary &n) {
        if (this != &n) {
            Library::operator=(n);
            this->something = n.something;
            this->number = n.number;
        }
        return *this;
    }

    ~NationalLibrary() {
    }

    void printDetail() override {
        cout << name << " - (National) " << city << " " << number << " " << calculateMembershipCardCost() << endl;
    }

    //[Ime na biblioteka] - (National) [Grad] [Broj na rakopisi] [Cena na clenarina]
    double calculateMembershipCardCost() override {
        double cost = price;
        if (something) {
            cost = cost * 0.93;
        }
        cost = cost + (number * 15);
        return cost;
    }

    bool getSomething() {
        return something;
    }
};

int findMostExpensiveNationalLibrary(Library **l, int n) {
    double max = 0;
    int index = -1;
    for (int i = 0; i < n; i++) {
        NationalLibrary *temp = dynamic_cast<NationalLibrary *>(l[i]);
        if (temp) {
            if (temp->calculateMembershipCardCost() > max) {
                max = temp->calculateMembershipCardCost();
                index = i;
            } else if (temp->calculateMembershipCardCost() == max && temp->getSomething()) {
                index = i;
            }
        }
    }
    return index;
}

int main() {
    int n, testCase, type;
    cin >> testCase >> n;
    cin.ignore();

    Library **m = new Library *[n];

    for (int i = 0; i < n; ++i) {
        string name;
        string city;
        float base_price;
        bool weekend_working;

        cin >> type;
        cin.ignore();
        getline(cin, name);
        getline(cin, city);
        cin >> base_price;
        cin.ignore();
        cin >> weekend_working;
        cin.ignore();

        if (type == 1) {
            bool open_cooperation;
            int specialized_articles;

            cin >> open_cooperation >> specialized_articles;
            cin.ignore();

            m[i] = new AcademicLibrary(name, city, base_price, weekend_working, open_cooperation, specialized_articles);
        } else {
            bool cultural_program;
            int national_articles;

            cin >> cultural_program >> national_articles;
            cin.ignore();

            m[i] = new NationalLibrary(name, city, base_price, weekend_working, cultural_program, national_articles);
        }
    }

    if (testCase == 1) {
        cout << "Abstract and child classes OK" << endl;
    } else if (testCase == 2) {
        for (int i = 0; i < n; i++) {
            cout << m[i]->calculateMembershipCardCost() << endl;
        }
        cout << "calculateMembershipCardCost method OK" << endl;
    } else if (testCase == 3) {
        for (int i = 0; i < n; i++) {
            m[i]->printDetail();
        }
        cout << "printDetail method OK" << endl;
    } else if (testCase == 4) {
        int most_expensive_nat_lib_index = findMostExpensiveNationalLibrary(m, n);
        if (most_expensive_nat_lib_index >= 0) {
            m[most_expensive_nat_lib_index]->printDetail();
        } else {
            cout << "National Library not found in the array!" << endl;
        }
        cout << "findMostExpensiveNationalLibrary method OK" << endl;
    }


    for (int i = 0; i < n; ++i) {
        delete m[i];
    }

    delete[] m;

    return 0;
}

--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-

//     #include <iostream>

// using namespace std;

// class Library {
// protected:
//     string name;
//     string city;
//     double price;
//     bool weekend;

// public:
//     Library(const string &name = "", const string &city = "", double price = 0, bool weekend = false) {
//         this->name = name;
//         this->city = city;
//         this->price = price;
//         this->weekend = weekend;
//     }

//     virtual void printDetail() = 0;

//     virtual double calculateMembershipCardCost() = 0;
// };

// //AcademicLibrary и NationalLibrary
// class AcademicLibrary : public Library {
// private:
//     bool something;
//     int number;

// public:
//     AcademicLibrary(const string &name = "", const string &city = "", double price = 0, bool weekend = false,
//                     bool something = false, int number = 0) : Library(name, city, price, weekend), number(number) {
//         this->something = something;
//         this->number = number;
//     }

//     double calculateMembershipCardCost() override {
//         double price = this->price;
//         if (something) {
//             price = price * 1.24;
//         }
//         price = price + (number * 6);
//         return price;
//     }

//     void printDetail() override {
//         //[Ime na biblioteka] - (Academic) [Grad] [Broj na spec. kolekcii] [Cena na clenarina]
//         cout << name << " - (Academic) " << city << " " << number << " " << calculateMembershipCardCost() << endl;
//     }
// };

// class NationalLibrary : public Library {
// private:
//     bool something;
//     int number;

// public:
//     NationalLibrary(const string &name = "", const string &city = "", double price = 0, bool weekend = false,
//                     bool something = false, int number = 0) : Library(name, city, price, weekend), number(number) {
//         this->something = something;
//         this->number = number;
//     }

//     double calculateMembershipCardCost() override {
//         double price = this->price;
//         if (something) {
//             price = price * 0.93;
//         }
//         price = price + (number * 15);
//         return price;
//     }

//     void printDetail() override {
//         //[Ime na biblioteka] - (National) [Grad] [Broj na rakopisi] [Cena na clenarina]
//         cout << name << " - (National) " << city << " " << number << " " << calculateMembershipCardCost() << endl;
//     }

//     bool getSomething() {
//         return something;
//     }
// };

// int findMostExpensiveNationalLibrary(Library **l, int n) {
//     int index = -1;
//     for (int i = 0; i < n; i++) {
//         NationalLibrary *temp = dynamic_cast<NationalLibrary *>(l[i]);
//         if (temp) {
//             if (index == -1) {
//                 index = i;
//             } else {
//                 if (l[index]->calculateMembershipCardCost() < temp->calculateMembershipCardCost()) {
//                     index = i;
//                 } else if (l[index]->calculateMembershipCardCost() == temp->calculateMembershipCardCost() && temp->
//                            getSomething()) {
//                     index = i;
//                 }
//             }
//         }
//     }
//     return index;
// }

// //Your code here

// int main() {
//     int n, testCase, type;
//     cin >> testCase >> n;
//     cin.ignore();

//     Library **m = new Library *[n];

//     for (int i = 0; i < n; ++i) {
//         string name;
//         string city;
//         float base_price;
//         bool weekend_working;

//         cin >> type;
//         cin.ignore();
//         getline(cin, name);
//         getline(cin, city);
//         cin >> base_price;
//         cin.ignore();
//         cin >> weekend_working;
//         cin.ignore();

//         if (type == 1) {
//             bool open_cooperation;
//             int specialized_articles;

//             cin >> open_cooperation >> specialized_articles;
//             cin.ignore();

//             m[i] = new AcademicLibrary(name, city, base_price, weekend_working, open_cooperation, specialized_articles);
//         } else {
//             bool cultural_program;
//             int national_articles;

//             cin >> cultural_program >> national_articles;
//             cin.ignore();

//             m[i] = new NationalLibrary(name, city, base_price, weekend_working, cultural_program, national_articles);
//         }
//     }

//     if (testCase == 1) {
//         cout << "Abstract and child classes OK" << endl;
//     } else if (testCase == 2) {
//         for (int i = 0; i < n; i++) {
//             cout << m[i]->calculateMembershipCardCost() << endl;
//         }
//         cout << "calculateMembershipCardCost method OK" << endl;
//     } else if (testCase == 3) {
//         for (int i = 0; i < n; i++) {
//             m[i]->printDetail();
//         }
//         cout << "printDetail method OK" << endl;
//     } else if (testCase == 4) {
//         int most_expensive_nat_lib_index = findMostExpensiveNationalLibrary(m, n);
//         if (most_expensive_nat_lib_index >= 0) {
//             m[most_expensive_nat_lib_index]->printDetail();
//         } else {
//             cout << "National Library not found in the array!" << endl;
//         }
//         cout << "findMostExpensiveNationalLibrary method OK" << endl;
//     }


//     for (int i = 0; i < n; ++i) {
//         delete m[i];
//     }

//     delete[] m;

//     return 0;
// }

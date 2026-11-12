#include <iostream>
using namespace std;

class Library {
protected:
    string name;
    string city;
    float basePrice;
    bool isWeekendWorking;

public:
    Library(string name = "", string city = "", float basePrice = 0, bool isWeekendWorking = false) {
        this->name = name;
        this->city = city;
        this->basePrice = basePrice;
        this->isWeekendWorking = isWeekendWorking;
    }

    virtual void printDetail() const = 0;

    virtual double calculateMembershipCardCost() const = 0;

    bool wekeendWorking() {
        return isWeekendWorking;
    }
};

class AcademicLibrary : public Library {
private:
    bool openCooperation;
    int specialArticles;

public:
    AcademicLibrary(string name = "", string city = "", float basePrice = 0, bool isWeekendWorking = false,
                    bool openCoorporation = false, int specialArticles = 0) : Library(
        name, city, basePrice, isWeekendWorking) {
        this->openCooperation = openCoorporation;
        this->specialArticles = specialArticles;
    }

    AcademicLibrary(const AcademicLibrary &c) : Library(c) {
        this->openCooperation = c.openCooperation;
        this->specialArticles = c.specialArticles;
    }

    double calculateMembershipCardCost() const override {
        float price = basePrice;
        if (openCooperation) {
            price *= 1.24;
        }
        price += (specialArticles * 6);
        return price;
    }

    void printDetail() const override {
        cout << name << " - (Academic) " << city << " " << specialArticles << " " << calculateMembershipCardCost() <<
                endl;
    }
};

class NationalLibrary : public Library {
private:
    bool culturicalProgram;
    int nationalArticles;

public:
    NationalLibrary(string name = "", string city = "", float basePrice = 0, bool isWeekendWorking = false,
                    bool culturicalProgram = false, int nationalArticles = 0) : Library(
        name, city, basePrice, isWeekendWorking) {
        this->culturicalProgram = culturicalProgram;
        this->nationalArticles = nationalArticles;
    }

    NationalLibrary(const NationalLibrary &c) : Library(c) {
        this->nationalArticles = c.nationalArticles;
        this->culturicalProgram = c.culturicalProgram;
    }

    double calculateMembershipCardCost() const override {
        float price = basePrice;
        if (culturicalProgram) {
            price -= (price * 0.07);
        }
        price += nationalArticles * 15;
        return price;
    }

    void printDetail() const override {
        cout << name << " - (National) " << city << " " << nationalArticles << " " << calculateMembershipCardCost() <<
                endl;
    }
};

int findMostExpensiveNationalLibrary(Library **l, int n) {
    int index = 0;
    bool flag = false;
    double max = 0;
    for (int i = 0; i < n; ++i) {
        NationalLibrary *nl = dynamic_cast<NationalLibrary *>(l[i]);
        if (nl != nullptr && nl->calculateMembershipCardCost() > max) {
            max = l[i]->calculateMembershipCardCost();
            index = i;
            flag = true;
        } else if (max == l[i]->calculateMembershipCardCost()) {
            if (l[i]->wekeendWorking()) {
                index = i;
            }
        }
    }
    if (flag) {
        return index;
    } else {
        return -1;
    }
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

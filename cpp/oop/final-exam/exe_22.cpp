#include <iostream>

using namespace std;

class Museum {
protected:
    string name;
    string city;
    float basePrice;
    int weekHours;

public:
    Museum(string name = "", string city = "", float basePrice = 0, int weekHours = 0) {
        this->name = name;
        this->city = city;
        this->basePrice = basePrice;
        this->weekHours = weekHours;
    }

    virtual void printDetail() = 0;

    virtual double calculateTicketCost() = 0;

    int week() {
        return weekHours;
    }
};

class ScientificMuseum : public Museum {
private:
    bool interactiveShows;
    int multimediaShows;

public:
    ScientificMuseum(string name = "", string city = "", float basePrice = 0, int weekHours = 0,
                     bool interactiveShows = false, int multimediaShows = 0)
        : Museum(name, city, basePrice, weekHours) {
        this->interactiveShows = interactiveShows;
        this->multimediaShows = multimediaShows;
    }

    double calculateTicketCost() override {
        float price = basePrice;
        if (interactiveShows) {
            price *= 1.12;
        }
        price += multimediaShows * 6;
        return price;;
    }

    void printDetail() override {
        cout << name << " - (Scientific) " << city << " " << multimediaShows << " " << calculateTicketCost() << endl;
    }
};

class ArtMuseum : public Museum {
private:
    bool amateur;
    int original;

public:
    ArtMuseum(string name = "", string city = "", float basePrice = 0, int weekHours = 0, bool amateur = false,
              int original = 0) : Museum(name, city, basePrice, weekHours) {
        this->amateur = amateur;
        this->original = original;
    }

    double calculateTicketCost() override {
        float price = basePrice;
        if (amateur) {
            price -= (price * 0.18);
        }
        price += original * 3;
        return price;
    }

    void printDetail() override {
        cout << name << " - (Art) " << city << " " << amateur << " " << calculateTicketCost() << endl;
    }
};

int findCheapestScientificMuseum(Museum **m, int n) {
    int index = 0;
    bool flag = false;
    double minium = 99999999999;
    for (int i = 0; i < n; ++i) {
        ScientificMuseum *sc = dynamic_cast<ScientificMuseum *>(m[i]);
        if (sc != nullptr && m[i]->calculateTicketCost() < minium) {
            minium = m[i]->calculateTicketCost();
            index = i;
            flag = true;
        } else if (minium == m[i]->calculateTicketCost()) {
            if (m[i]->week() > m[index]->week()) {
                index = i;
                flag = true;
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

    Museum **m = new Museum *[n];

    for (int i = 0; i < n; ++i) {
        string name;
        string city;
        float base_price;
        int working_hours;

        cin >> type;
        cin.ignore();
        getline(cin, name);
        getline(cin, city);
        cin >> base_price;
        cin.ignore();
        cin >> working_hours;
        cin.ignore();

        if (type == 1) {
            bool interactive_shows;
            int multimedia_pres;

            cin >> interactive_shows >> multimedia_pres;
            cin.ignore();

            m[i] = new ScientificMuseum(name, city, base_price, working_hours, interactive_shows, multimedia_pres);
        } else {
            bool amateur_shows;
            int original_artwork;

            cin >> amateur_shows >> original_artwork;
            cin.ignore();

            m[i] = new ArtMuseum(name, city, base_price, working_hours, amateur_shows, original_artwork);
        }
    }

    if (testCase == 1) {
        cout << "Abstract and child classes OK" << endl;
    } else if (testCase == 2) {
        for (int i = 0; i < n; i++) {
            cout << m[i]->calculateTicketCost() << endl;
        }
        cout << "calculateTicketCost method OK" << endl;
    } else if (testCase == 3) {
        for (int i = 0; i < n; i++) {
            m[i]->printDetail();
        }
        cout << "printDetail method OK" << endl;
    } else if (testCase == 4) {
        int cheapest_sci_museum_index = findCheapestScientificMuseum(m, n);
        if (cheapest_sci_museum_index >= 0) {
            m[cheapest_sci_museum_index]->printDetail();
        } else {
            cout << "Scientific Museum not found in the array!" << endl;
        }
        cout << "findCheapestOnlineOrder method OK" << endl;
    }


    for (int i = 0; i < n; ++i) {
        delete m[i];
    }

    delete[] m;

    return 0;
}

#include <iostream>
#include <cstring>
using namespace std;

class Koncert {
private:
    char name[20];
    char location[20];
    static float discount;
    float price;

public:
    Koncert(const char *name = "", const char *location = "", float price = 0) {
        strcpy(this->name, name);
        strcpy(this->location, location);
        this->price = price;
    }

    Koncert(const Koncert &k) {
        strcpy(this->name, k.name);
        strcpy(this->location, k.location);
        this->price = k.price;
    }

    Koncert &operator=(const Koncert &k) {
        if (this != &k) {
            strcpy(this->name, k.name);
            strcpy(this->location, k.location);
            this->price = k.price;
        }
        return *this;
    }

    ~Koncert() {
    }

    static void setSezonskiPopust(float n) {
        discount = n;
    }

    virtual float cena() {
        return price - (price * discount);
    }

    float getPrice() {
        return price;
    }

    char *getNaziv() {
        return name;
    }

    float getSezonskiPopust() {
        return discount;
    }
};

float Koncert::discount = 0.2;

class ElektronskiKoncert : public Koncert {
private:
    char *nameDJ;
    float time;
    bool day;

public:
    ElektronskiKoncert(const char *name = "", const char *location = "", float price = 0, const char *nameDJ = "",
                       float time = 0, bool day = false) : Koncert(name, location, price) {
        this->nameDJ = new char [strlen(nameDJ) + 1];
        strcpy(this->nameDJ, nameDJ);
        this->time = time;
        this->day = day;
    }

    ElektronskiKoncert(const ElektronskiKoncert &k) : Koncert(k) {
        this->nameDJ = new char [strlen(k.nameDJ) + 1];
        strcpy(this->nameDJ, k.nameDJ);
        this->time = k.time;
        this->day = k.day;
    }

    ElektronskiKoncert &operator=(const ElektronskiKoncert &k) {
        if (this != &k) {
            Koncert::operator=(k);
            this->nameDJ = new char [strlen(k.nameDJ) + 1];
            strcpy(this->nameDJ, k.nameDJ);
            this->time = k.time;
            this->day = k.day;
        }
        return *this;
    }

    ~ElektronskiKoncert() {
        delete [] nameDJ;
    }

    float cena() override {
        float n = Koncert::cena();
        if (time > 7) {
            n = n + 360;
        } else if (time > 5) {
            n = n + 150;
        }

        if (day) {
            n = n - 50;
        } else {
            n = n + 100;
        }
        return n;
    }
};


void najskapKoncert(Koncert **koncerti, int n) {
    double max = 0;
    int index = 0;
    int elektronski = 0;
    for (int i = 0; i < n; i++) {
        if (koncerti[i]->cena() >= max) {
            max = koncerti[i]->cena();
            index = i;
        }
        ElektronskiKoncert *temp = dynamic_cast<ElektronskiKoncert *>(koncerti[i]);
        if (temp) {
            elektronski++;
        }
    }
    cout << "Najskap koncert: " << koncerti[index]->getNaziv() << " " << koncerti[index]->cena() << endl;
    cout << "Elektronski koncerti: " << elektronski << " od vkupno " << n << endl;
}


bool prebarajKoncert(Koncert **koncerti, int n, char *naziv, bool elektronski) {
    if (elektronski) {
        for (int i = 0; i < n; i++) {
            ElektronskiKoncert *temp = dynamic_cast<ElektronskiKoncert *>(koncerti[i]);
            if (temp) {
                if (strcmp(naziv, temp->getNaziv()) == 0) {
                    cout << temp->getNaziv() << " " << temp->cena() << endl;
                    return true;
                }
            }
        }
    } else {
        for (int i = 0; i < n; i++) {
            if (strcmp(naziv, koncerti[i]->getNaziv()) == 0) {
                cout << naziv << " " << koncerti[i]->cena() << endl;
                return true;
            }
        }
    }
    return false;
}

int main() {
    int tip, n, novaCena;
    char naziv[100], lokacija[100], imeDJ[40];
    bool dnevna;
    float cenaBilet, novPopust;
    float casovi;

    cin >> tip;
    if (tip == 1) {
        //Koncert
        cin >> naziv >> lokacija >> cenaBilet;
        Koncert k1(naziv, lokacija, cenaBilet);
        cout << "Kreiran e koncert so naziv: " << k1.getNaziv() << endl;
    } else if (tip == 2) {
        //cena - Koncert
        cin >> naziv >> lokacija >> cenaBilet;
        Koncert k1(naziv, lokacija, cenaBilet);
        cout << "Osnovna cena na koncertot so naziv " << k1.getNaziv() << " e: " << k1.cena() << endl;
    } else if (tip == 3) {
        //ElektronskiKoncert
        cin >> naziv >> lokacija >> cenaBilet >> imeDJ >> casovi >> dnevna;
        ElektronskiKoncert s(naziv, lokacija, cenaBilet, imeDJ, casovi, dnevna);
        cout << "Kreiran e elektronski koncert so naziv " << s.getNaziv() << " i sezonskiPopust " << s.
                getSezonskiPopust() << endl;
    } else if (tip == 4) {
        //cena - ElektronskiKoncert
        cin >> naziv >> lokacija >> cenaBilet >> imeDJ >> casovi >> dnevna;
        ElektronskiKoncert s(naziv, lokacija, cenaBilet, imeDJ, casovi, dnevna);
        cout << "Cenata na elektronskiot koncert so naziv " << s.getNaziv() << " e: " << s.cena() << endl;
    } else if (tip == 5) {
        //najskapKoncert
    } else if (tip == 6) {
        //prebarajKoncert
        Koncert **koncerti = new Koncert *[5];
        int n;
        koncerti[0] = new Koncert("Area", "BorisTrajkovski", 350);
        koncerti[1] = new ElektronskiKoncert("TomorrowLand", "Belgium", 8000, "Afrojack", 7.5, false);
        koncerti[2] = new ElektronskiKoncert("SeaDance", "Budva", 9100, "Tiesto", 5, true);
        koncerti[3] = new Koncert("Superhiks", "PlatoUkim", 100);
        koncerti[4] = new ElektronskiKoncert("CavoParadiso", "Mykonos", 8800, "Guetta", 3, true);
        char naziv[100];
        najskapKoncert(koncerti, 5);
    } else if (tip == 7) {
        //prebaraj
        Koncert **koncerti = new Koncert *[5];
        int n;
        koncerti[0] = new Koncert("Area", "BorisTrajkovski", 350);
        koncerti[1] = new ElektronskiKoncert("TomorrowLand", "Belgium", 8000, "Afrojack", 7.5, false);
        koncerti[2] = new ElektronskiKoncert("SeaDance", "Budva", 9100, "Tiesto", 5, true);
        koncerti[3] = new Koncert("Superhiks", "PlatoUkim", 100);
        koncerti[4] = new ElektronskiKoncert("CavoParadiso", "Mykonos", 8800, "Guetta", 3, true);
        char naziv[100];
        bool elektronski;
        cin >> elektronski;
        if (prebarajKoncert(koncerti, 5, "Area", elektronski))
            cout << "Pronajden" << endl;
        else cout << "Ne e pronajden" << endl;

        if (prebarajKoncert(koncerti, 5, "Area", !elektronski))
            cout << "Pronajden" << endl;
        else cout << "Ne e pronajden" << endl;
    } else if (tip == 8) {
        //smeni cena
        Koncert **koncerti = new Koncert *[5];
        int n;
        koncerti[0] = new Koncert("Area", "BorisTrajkovski", 350);
        koncerti[1] = new ElektronskiKoncert("TomorrowLand", "Belgium", 8000, "Afrojack", 7.5, false);
        koncerti[2] = new ElektronskiKoncert("SeaDance", "Budva", 9100, "Tiesto", 5, true);
        koncerti[3] = new Koncert("Superhiks", "PlatoUkim", 100);
        koncerti[2]->setSezonskiPopust(0.9);
        najskapKoncert(koncerti, 4);
    }

    return 0;
}

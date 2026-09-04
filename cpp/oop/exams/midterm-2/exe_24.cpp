#include "iostream"
#include "cstring"
using namespace std;

class Koncert {
protected:
    char naziv[100];
    char lokacija[100];
    static float sezonskiPopust;
    float cenaBilet;

public:
    Koncert() {
        *naziv = '\0';
        *lokacija = '\0';
        cenaBilet = 0;
    }

    Koncert(char *naziv, char *lokacija, float cenaBilet) {
        strcpy(this->naziv, naziv);
        strcpy(this->lokacija, lokacija);
        this->cenaBilet = cenaBilet;
    }

    static void setSezonskiPopust(float s) {
        sezonskiPopust = s;
    }

    virtual double cena() {
        return cenaBilet * (1 - sezonskiPopust);
    }

    char *getNaziv() {
        return naziv;
    }

    static float getSezonskiPopust() {
        return sezonskiPopust;
    }
};

float Koncert::sezonskiPopust = 0.2;

class ElektronskiKoncert : public Koncert {
private:
    char *dj;
    float casovi;
    bool dnevna;

public:
    ElektronskiKoncert() : Koncert() {
        this->dj = new char[1];
        this->dj[0] = '\0';
        casovi = 0;
        dnevna = true;
    }

    ElektronskiKoncert(char *naziv, char *lokacija, float cenaBilet, char *dj, float casovi, bool dnevna) : Koncert(
        naziv, lokacija, cenaBilet) {
        this->dj = new char[strlen(dj) + 1];
        strcpy(this->dj, dj);
        this->casovi = casovi;
        this->dnevna = dnevna;
    }

    ElektronskiKoncert(const ElektronskiKoncert &e) : Koncert(e) {
        this->dj = new char[strlen(e.dj) + 1];
        strcpy(this->dj, e.dj);
        this->casovi = e.casovi;
        this->dnevna = e.dnevna;
    }

    ElektronskiKoncert &operator =(const ElektronskiKoncert &e) {
        if (this != &e) {
            delete[]dj;
            this->dj = new char[strlen(e.dj) + 1];
            strcpy(this->dj, e.dj);
            this->casovi = e.casovi;
            this->dnevna = e.dnevna;
        }
        return *this;
    }

    ~ElektronskiKoncert() {
        delete[]dj;
    }

    double cena() override {
        double price = Koncert::cena();
        if (casovi > 7) {
            price += 360;
        } else if (casovi > 5) {
            price += 150;
        }
        if (dnevna) {
            price -= 50;
        } else {
            price += 100;
        }
        return price;
    }
};

void najskapKoncert(Koncert **koncerti, int n) {
    double max = 0;
    int counter = 0;
    for (int i = 0; i < n; ++i) {
        if (koncerti[i]->cena() > max) {
            max = koncerti[i]->cena();
        }
        if (dynamic_cast<ElektronskiKoncert *>(koncerti[i]) != nullptr) {
            counter++;
        }
    }
    cout << "Najskap koncert: ";
    for (int i = 0; i < n; ++i) {
        if (max == koncerti[i]->cena()) {
            cout << koncerti[i]->getNaziv() << " " << koncerti[i]->cena() << endl;
        }
    }
    cout << "Elektronski koncerti: " << counter << " od vkupno " << n << endl;
}

bool prebarajKoncert(Koncert **koncerti, int n, char *naziv, bool elektronski) {
    for (int i = 0; i < n; ++i) {
        if (elektronski) {
            if (dynamic_cast<ElektronskiKoncert *>(koncerti[i])) {
                if (strcmp(koncerti[i]->getNaziv(), naziv) == 0) {
                    cout << koncerti[i]->getNaziv() << " " << koncerti[i]->cena() << endl;
                    return true;
                }
            }
        } else if (!elektronski) {
            if (dynamic_cast<Koncert *>(koncerti[i])) {
                if (strcmp(koncerti[i]->getNaziv(), naziv) == 0) {
                    cout << koncerti[i]->getNaziv() << " " << koncerti[i]->cena() << endl;
                    return true;
                }
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

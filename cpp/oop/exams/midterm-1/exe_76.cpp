#include<iostream>
#include<string.h>
using namespace std;

//ова е место за вашиот код


class Zichara {
private:
    char *mesto;
    int cenaNaDnevna;

public:
    Zichara(const char *mesto = "", int cenaNaDnevna = 0) {
        this->mesto = new char[strlen(mesto) + 1];
        strcpy(this->mesto, mesto);
        this->cenaNaDnevna = cenaNaDnevna;
    }

    Zichara(const Zichara &zichara) {
        this->mesto = new char[strlen(zichara.mesto) + 1];
        strcpy(this->mesto, zichara.mesto);
        this->cenaNaDnevna = zichara.cenaNaDnevna;
    }

    Zichara &operator=(const Zichara &zichara) {
        if (this != &zichara) {
            delete[] this->mesto;
            this->mesto = new char[strlen(zichara.mesto) + 1];
            strcpy(this->mesto, zichara.mesto);
            this->cenaNaDnevna = zichara.cenaNaDnevna;
        }
        return *this;
    }

    ~Zichara() {
        delete[] this->mesto;
    }

    void setMesto(const char *mesto) {
        delete[] this->mesto;
        this->mesto = new char[strlen(mesto) + 1];
        strcpy(this->mesto, mesto);
    }

    void setCenaNaDnevna(int cenaNaDnevna) {
        this->cenaNaDnevna = cenaNaDnevna;
    }

    char *getMesto() {
        return this->mesto;
    }

    int getCenaNaDnevna() {
        return this->cenaNaDnevna;
    }
};

class PlaninarskiDom {
private:
    char ime[15];
    int cena[2];
    char klasa;
    bool daliImaZicara;
    Zichara *zichara;

public:
    PlaninarskiDom(const char *ime = "", const int *cena = nullptr, char klasa = 'A', bool daliImaZicara = false,
                   Zichara *z = nullptr) {
        strncpy(this->ime, ime, 14);
        this->ime[14] = '\0';

        this->cena[0] = (cena ? cena[0] : 0);
        this->cena[1] = (cena ? cena[1] : 0);

        this->klasa = klasa;
        //Only set it to true if a Zichara is actually provided
        if (z) {
            this->daliImaZicara = true;
            this->zichara = new Zichara(*z);
        } else {
            this->daliImaZicara = false;
            this->zichara = nullptr;
        }
    }

    PlaninarskiDom(const PlaninarskiDom &plan) {
        strcpy(this->ime, plan.ime);
        this->cena[0] = plan.cena[0];
        this->cena[1] = plan.cena[1];
        this->klasa = plan.klasa;
        this->daliImaZicara = plan.daliImaZicara;

        if (plan.daliImaZicara && plan.zichara) {
            this->zichara = new Zichara(*plan.zichara);
        } else {
            this->zichara = nullptr;
        }
    }

    PlaninarskiDom &operator=(const PlaninarskiDom &plan) {
        if (this != &plan) {
            delete this->zichara;
            strcpy(this->ime, plan.ime);
            this->cena[0] = plan.cena[0];
            this->cena[1] = plan.cena[1];
            this->klasa = plan.klasa;
            this->daliImaZicara = plan.daliImaZicara;

            if (plan.daliImaZicara && plan.zichara) {
                this->zichara = new Zichara(*plan.zichara);
            } else {
                this->zichara = nullptr;
            }
        }
        return *this;
    }

    ~PlaninarskiDom() {
        delete this->zichara;
    }

    void setZichara(const Zichara &zichara) {
        delete this->zichara;
        this->zichara = new Zichara(zichara);
        this->daliImaZicara = true;
    }

    Zichara *getZichara() {
        return zichara;
    }

    void setIme(const char *ime) {
        strncpy(this->ime, ime, 14);
        this->ime[14] = '\0';
    }

    char *getIme() {
        return this->ime;
    }

    char getKlasa() {
        return this->klasa;
    }

    void setKlasa(char klasa) {
        this->klasa = klasa;
    }

    void setdaliImaZichara(bool daliImaZicara) {
        this->daliImaZicara = daliImaZicara;
    }

    bool getdaliImaZichara() {
        return this->daliImaZicara;
    }

    int *getCena() {
        return cena;
    }

    void setCena(int *cena) {
        this->cena[0] = cena[0];
        this->cena[1] = cena[1];
    }

    PlaninarskiDom &operator--() {
        if (klasa < 'F') {
            klasa++;
        }
        return *this;
    }

    bool operator<=(const char znak) {
        return klasa >= znak;
    }

    void presmetajDnevenPrestoj(int den, int mesec, int &cenaa) {
        int sum = 0;
        if ((den > 31 || den < 1) || (mesec > 12 || mesec < 1)) {
            //cout<<"Pogresen datum "<<endl;
            //return;
            throw 1;
        } else if (mesec >= 4 && mesec <= 9) {
            if (daliImaZicara) {
                sum = cena[0] + zichara[0].getCenaNaDnevna();
            } else {
                sum = cena[0];
            }
        } else {
            if (daliImaZicara) {
                sum = cena[1] + zichara[0].getCenaNaDnevna();
            } else {
                sum = cena[1];
            }
        }
        cenaa = sum;
        //Cenata za 3.3 e 51
        //cout<<"Cenata za "<<den<<"."<<mesec<<" e "<<sum<<endl;
    }
};

ostream &operator<<(ostream &os, PlaninarskiDom &plan) {
    os << plan.getIme() << " klasa:" << plan.getKlasa();
    if (plan.getdaliImaZichara()) {
        cout << " so Zichara" << endl;
    } else {
        cout << endl;
    }
    return os;
}

int main() {
    PlaninarskiDom p; //креирање на нов објект од класата планинарски дом

    //во следниот дел се вчитуваат информации за планинарскиот дом
    char imePlaninarskiDom[15], mestoZichara[30], klasa;
    int ceni[12];
    int dnevnakartaZichara;
    bool daliZichara;
    cin >> imePlaninarskiDom;
    for (int i = 0; i < 2; i++) cin >> ceni[i];
    cin >> klasa;
    cin >> daliZichara;

    //во следниот дел се внесуваат информации и за жичарата ако постои
    if (daliZichara) {
        p.setdaliImaZichara(true);
        cin >> mestoZichara >> dnevnakartaZichara;
        PlaninarskiDom pom(imePlaninarskiDom, ceni, klasa);
        Zichara r(mestoZichara, dnevnakartaZichara);
        pom.setZichara(r);
        p = pom;
    } else {
        PlaninarskiDom *pok = new PlaninarskiDom(imePlaninarskiDom, ceni, klasa);
        p = *pok;
    }

    //се намалува класата на планинарскиот дом за 2
    --p;
    --p;

    int cena;
    int den, mesec;
    cin >> den >> mesec;
    try {
        p.presmetajDnevenPrestoj(den, mesec, cena); //тука се користи функцијата presmetajDnevenPrestoj
        cout << "Informacii za PlaninarskiDomot:" << endl;
        cout << p;
        if (p <= 'D')
            cout << "Planinarskiot dom za koj se vneseni informaciite ima klasa poniska ili ista so D\n";

        cout << "Cenata za " << den << "." << mesec << " e " << cena; //се печати цената за дадениот ден и месец
    } catch (int) {
        cout << "Mesecot ili denot e greshno vnesen!";
    }
}

#include <iostream>
#include <cstring>
using namespace std;

class Ucesnik {
private:
    char *name;
    bool pol;
    int vozrast;

public:
    Ucesnik(char *n = "", bool pol = false, int vozrast = 0) {
        name = new char[strlen(n) + 1];
        strcpy(name, n);
        this->pol = pol;
        this->vozrast = vozrast;
    }

    Ucesnik(const Ucesnik &u) {
        name = new char[strlen(u.name) + 1];
        strcpy(name, u.name);
        this->pol = u.pol;
        this->vozrast = u.vozrast;
    }

    Ucesnik &operator=(const Ucesnik &u) {
        if (this != &u) {
            delete [] name;
            name = new char[strlen(u.name) + 1];
            strcpy(name, u.name);
            this->pol = u.pol;
            this->vozrast = u.vozrast;
        }
        return *this;
    }

    ~Ucesnik() {
        delete [] name;
    }

    Ucesnik &operator >(Ucesnik &u) {
        if (vozrast > u.vozrast) {
            return *this;
        } else {
            return u;
        }
    }

    char *getName() {
        return name;
    }

    int getVozrast() {
        return vozrast;
    }

    bool getPol() {
        return pol;
    }
};

ostream &operator <<(ostream &os, Ucesnik &u) {
    os << u.getName() << endl;
    if (u.getPol() == 1) {
        cout << "mashki" << endl;
    } else {
        cout << "zhenski" << endl;
    }
    os << u.getVozrast() << endl;
    return os;
}

class Maraton {
private:
    char lokacija[100];
    Ucesnik *u;
    int n;

public:
    Maraton(char *lokacija = "") {
        strcpy(this->lokacija, lokacija);
        n = 0;
        u = new Ucesnik [n];
    }

    Maraton(const Maraton &m) {
        strcpy(this->lokacija, m.lokacija);
        n = m.n;
        u = new Ucesnik [n];
        for (int i = 0; i < n; i++) {
            u[i] = m.u[i];
        }
    }

    Maraton &operator=(const Maraton &m) {
        if (this != &m) {
            delete [] u;
            this->n = m.n;
            strcpy(this->lokacija, m.lokacija);
            u = new Ucesnik [n];
            for (int i = 0; i < n; i++) {
                u[i] = m.u[i];
            }
        }
        return *this;
    }

    ~Maraton() {
        delete [] u;
    }

    Maraton &operator +=(const Ucesnik &m) {
        Ucesnik *temp = new Ucesnik [n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = u[i];
        }
        delete [] u;
        temp[n] = m;
        u = temp;
        n++;
        return *this;
    }

    float prosecnoVozrast() {
        float sum = 0;
        for (int i = 0; i < n; i++) {
            sum += u[i].getVozrast();
        }
        return sum / (n * 1.0);
    }

    void pecatiPomladi(Ucesnik &uce) {
        for (int i = 0; i < n; i++) {
            if (uce.getVozrast() > u[i].getVozrast()) {
                cout << u[i];
            }
        }
    }
};

int main() {
    char ime[100];
    bool maski;
    int vozrast, n;
    cin >> n;
    char lokacija[100];
    cin >> lokacija;
    Maraton m(lokacija);
    Ucesnik **u = new Ucesnik *[n];
    for (int i = 0; i < n; ++i) {
        cin >> ime >> maski >> vozrast;
        u[i] = new Ucesnik(ime, maski, vozrast);
        m += *u[i];
    }
    m.pecatiPomladi(*u[n - 1]);
    cout << m.prosecnoVozrast() << endl;
    for (int i = 0; i < n; ++i) {
        delete u[i];
    }
    delete [] u;
    return 0;
}

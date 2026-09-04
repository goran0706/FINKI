#include<iostream>
#include<cstring>
using namespace std;

class Patnik {
private:
    char name[100];
    int number;
    bool velosiped;

public:
    Patnik(const char *name = "", const int number = 0, bool velosiped = false) {
        strcpy(this->name, name);
        this->number = number;
        this->velosiped = velosiped;
    }

    Patnik(const Patnik &p) {
        strcpy(this->name, p.name);
        this->number = p.number;
        this->velosiped = p.velosiped;
    }

    ~Patnik() {
    }

    char *getName() {
        return name;
    }

    int getNumber() {
        return number;
    }

    bool getVelosiped() {
        return velosiped;
    }
};

ostream &operator<<(ostream &os, Patnik &p) {
    os << p.getName() << endl;
    os << p.getNumber() << endl;
    os << p.getVelosiped() << endl;
    return os;
}

class Voz {
private:
    char Dest[100];
    Patnik *patnik;
    int n;
    int NumAllowed;
    int entered = 0;
    int total;

public:
    Voz(const char *dest = "", int numAllowed = 0) {
        entered = 0;
        total = 0;
        strcpy(this->Dest, dest);
        this->n = 0; // Start with 0 Patrons initially
        this->NumAllowed = numAllowed;
        patnik = nullptr; // Initially no patrons
    }

    Voz(const Voz &p) {
        this->entered = p.entered;
        this->total = p.total;
        strcpy(this->Dest, p.Dest);
        this->n = p.n;
        this->NumAllowed = p.NumAllowed;
        patnik = new Patnik[n];
        for (int i = 0; i < n; i++) {
            patnik[i] = p.patnik[i];
        }
    }

    Voz &operator=(const Voz &p) {
        if (this != &p) {
            delete[] patnik;
            this->total = p.total;
            this->entered = p.entered;
            strcpy(this->Dest, p.Dest);
            this->n = p.n;
            this->NumAllowed = p.NumAllowed;
            patnik = new Patnik[n];
            for (int i = 0; i < n; i++) {
                patnik[i] = p.patnik[i];
            }
        }
        return *this;
    }

    ~Voz() {
        delete[] patnik;
    }

    Voz &operator+=(Patnik &p) {
        if (entered < NumAllowed || p.getVelosiped() == 0) {
            if (p.getVelosiped() == 0) {
                entered++;
            }
            Patnik *temp = new Patnik[n + 1]; // Increase the size by 1
            for (int i = 0; i < n; i++) {
                temp[i] = patnik[i]; // Copy the old patrons to the new array
            }
            temp[n] = p; // Add the new patron
            delete[] patnik;
            patnik = temp; // Update the pointer to the new array
            n++; // Increment the patron count
        }
        total++;
        return *this;
    }

    char *getDest() {
        return Dest;
    }

    Patnik *getPatnik() {
        return patnik;
    }

    int getN() {
        return n;
    }

    void patniciNemaMesto() {
        int first = 0, second = 0;
        for (int i = 0; i < n; i++) {
            if (patnik[i].getNumber() == 1 && patnik[i].getVelosiped() == 1) {
                first++;
            } else if (patnik[i].getNumber() == 2 && patnik[i].getVelosiped() == 1) {
                second++;
            }
        }
        //11 2
        //10
        if (first >= NumAllowed) {
            //cout<<"Brojot na patnici od 1-va klasa koi ostanale bez mesto e: "<<abs(NumAllowed-first)<<endl;
            cout << "Brojot na patnici od 1-va klasa koi ostanale bez mesto e: " << first - NumAllowed << endl;
        } else {
            cout << "Brojot na patnici od 1-va klasa koi ostanale bez mesto e: 0" << endl;
        }
        NumAllowed = NumAllowed - first;
        if (NumAllowed <= 0) {
            cout << "Brojot na patnici od 2-ra klasa koi ostanale bez mesto e: " << second << endl;
        } else if (second >= NumAllowed) {
            //cout<<"Brojot na patnici od 2-ra klasa koi ostanale bez mesto e: "<<abs(NumAllowed-second)<<endl;
            cout << "Brojot na patnici od 2-ra klasa koi ostanale bez mesto e: " << second - NumAllowed << endl;
        } else {
            cout << "Brojot na patnici od 2-ra klasa koi ostanale bez mesto e: 0" << endl;
        }
    }
};

ostream &operator<<(ostream &os, Voz &p) {
    os << p.getDest() << endl;
    for (int i = 0; i < p.getN(); i++) {
        os << p.getPatnik()[i] << endl;
    }
    return os;
}

int main() {
    Patnik p;
    char ime[100], destinacija[100];
    int n;
    bool velosiped;
    int klasa;
    int maxv;
    cin >> destinacija >> maxv;
    cin >> n;
    Voz v(destinacija, maxv);
    //cout<<v<<endl;
    for (int i = 0; i < n; i++) {
        cin >> ime >> klasa >> velosiped;
        Patnik p(ime, klasa, velosiped);
        //cout<<p<<endl;
        v += p;
    }
    cout << v;
    v.patniciNemaMesto();

    return 0;
}

#include <iostream>
#include <cstring>
using namespace std;

enum tip {
    pop,
    rap,
    rok
};

class Pesna {
private:
    char songName[50];
    int songTime;
    enum tip tip;
    friend class CD;

public:
    Pesna() {
        strcpy(songName, "");
        songTime = 0;
        tip = rap;
    }

    Pesna(const char *songName, const int songTime, enum tip tip) {
        strcpy(this->songName, songName);
        this->songTime = songTime;
        this->tip = tip;
    }

    Pesna(const Pesna &p) {
        strcpy(this->songName, p.songName);
        this->songTime = p.songTime;
        this->tip = p.tip;
    }

    ~Pesna() {
    }

    void setSongName(const char *songName) {
        strcpy(this->songName, songName);
    }

    void setSongTime(const int songTime) {
        this->songTime = songTime;
    }

    void setSongType(const enum tip tip) {
        this->tip = tip;
    }

    char *getSongName() {
        return songName;
    }

    int getSongTime() {
        return songTime;
    }

    enum tip getSongType() {
        return tip;
    }

    void pecati() {
        cout << "\"" << getSongName() << "\"" << "-" << getSongTime() << "min" << endl;
    }
};

class CD {
private:
    Pesna pesna[10];
    static int broj;
    int maxTime;

    static int time;
    static int index;

public:
    CD() {
    }

    CD(const int maxTime) {
        this->maxTime = maxTime;
    }

    CD(const CD &p) {
        this->broj = p.broj;
        this->maxTime = p.maxTime;
    }

    ~CD() {
    }

    void setPesna(const Pesna &p) {
        for (int i = 0; i < broj; i++) {
            pesna[i] = Pesna();
        }
    }

    void setnumberOfSongs(const int numberOfSongs) {
        this->broj = numberOfSongs;
    }

    void setmaxTime(const int maxTime) {
        this->maxTime = maxTime;
    }

    int getBroj() {
        return this->broj;
    }

    int getmaxTime() {
        return this->maxTime;
    }

    Pesna getPesna(int i) {
        return pesna[i];
    }

    void dodadiPesna(const Pesna &p) {
        time = time + p.songTime;
        if (broj < 10 && time < maxTime) {
            pesna[index] = p;
            index++;
            broj++;
        }
    }

    void pecatiPesniPoTip(int tip) {
        for (int i = 0; i < index; i++) {
            if (pesna[i].tip == tip) {
                pesna[i].pecati();
            }
        }
    }
};

int CD::time = 0;
int CD::index = 0;
int CD::broj = 0;


int main() {
    // se testira zadacata modularno
    int testCase;
    cin >> testCase;

    int n, minuti, kojtip;
    char ime[50];

    if (testCase == 1) {
        cout << "===== Testiranje na klasata Pesna ======" << endl;
        cin >> ime;
        cin >> minuti;
        cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
        Pesna p(ime, minuti, (tip) kojtip);
        p.pecati();
    } else if (testCase == 2) {
        cout << "===== Testiranje na klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < n; i++)
            (omileno.getPesna(i)).pecati();
    } else if (testCase == 3) {
        cout << "===== Testiranje na metodot dodadiPesna() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < omileno.getBroj(); i++)
            (omileno.getPesna(i)).pecati();
    } else if (testCase == 4) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((tip) kojtip);
    } else if (testCase == 5) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno(20);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime;
            cin >> minuti;
            cin >> kojtip; //se vnesuva 0 za POP,1 za RAP i 2 za ROK
            Pesna p(ime, minuti, (tip) kojtip);
            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((tip) kojtip);
    }

    return 0;
}

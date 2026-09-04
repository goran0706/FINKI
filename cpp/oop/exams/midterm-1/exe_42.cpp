// Дефинирајте ја класата Pesna во која се чуваат информации за:
// - Име на песната (char фиксна)
// - Траење на песната во минути (int или float променлива)
// - Тип на песна, кој може да биде: поп, рап или рок (enum)
//
// Обезбедете ги сите потребни методи за правилно функционирање на програмата, како што се конструктори, поставувачи и добивачи.
// Дополнително, дефинирајте го следниов метод за оваа класа:
// - pecati() - Функција која ги печати информациите за песната во следниот формат, одделени со цртичка (-):
// - Името на песната во наводници
// - Времетраењето на песната со постфикс „min“
//
// Пример излез: „Име на песна“ - 3,5 min
//
// Дефинирајте ја класата на ЦД во која се чуваат информациите за:
// - Низа песни снимени на ЦД-то (користете низа со фиксна големина до 10 предмети на Песна)
// - Број на песни снимени на ЦД-то (int)
// - Mаксимално времетраење на песните на ЦД-то (во минути, int или float)
//
// Обезбедете ги сите потребни методи за правилно функционирање на програмата, како што се конструктори и методи за управување со низата песни.
// Дополнително, дефинирајте ги следниве методи за оваа класа:
// - addSong(Pesna p): Ја додава песната p на ЦД-то, но само ако: Останува доволно простор на ЦД-то, имајќи го предвид неговото максимално дозволено времетраење
// и вкупното времетраење на песните моментално на ЦД-то & и ако на ЦД-то веќе има помалку од 10 песни.
// - printSongsByType(SongType t): Печати информации за сите песни од наведениот тип (t), користејќи го методот pecati() од класата Pesna.
#include "iostream"
#include "cstring"
using namespace std;

enum TipPesna { pop, rap, rock };

class Pesna {
private:
    char name[51];
    int duration;
    TipPesna tip;

public:
    Pesna() {
    }

    Pesna(char *name, int duration, TipPesna tip) {
        strcpy(this->name, name);
        this->duration = duration;
        this->tip = tip;
    }

    void pecati() {
        cout << "\"" << name << "\" - " << duration << "min" << endl;
    }

    void setMinuti(int duration) {
        Pesna::duration = duration;
    }

    void setTip(TipPesna tip) {
        Pesna::tip = tip;
    }

    void *setIme(char *ime) {
        strcpy(this->name, ime);
    }

    const char *getName() const {
        return name;
    }

    int getDuration() const {
        return duration;
    }

    TipPesna getTip() const {
        return tip;
    }
};

class CD {
    Pesna pesni[10];
    int brPesni;
    int maxDuration;
    int vkupnoVreme;

public:
    CD() {
    }

    CD(Pesna *pesni, int brPesni, int maxDuration) {
        this->brPesni = brPesni;
        this->maxDuration = maxDuration;
        for (int i = 0; i < brPesni; ++i) {
            this->pesni[i] = pesni[i];
        }
    }

    void dodadiPesna(const Pesna &p) {
        vkupnoVreme += p.getDuration();
        if (brPesni < 10 && vkupnoVreme <= maxDuration) {
            pesni[brPesni] = p;
            brPesni++;
            vkupnoVreme += p.getDuration();
        }
    }

    void pecatiPesniPoTip(TipPesna t) {
        for (int i = 0; i < brPesni; ++i) {
            if (pesni[i].getTip() == t) {
                pesni[i].pecati();
            }
        }
    }

    Pesna getPesna(int p) {
        return pesni[p];
    }

    int getBroj() const {
        return brPesni;
    }

    void setBrPesni(int brPesni) {
        CD::brPesni = brPesni;
    }

    int getMaxDuration() const {
        return maxDuration;
    }

    void setMaxMinuti(int maxDuration) {
        CD::maxDuration = maxDuration;
    }
};

int main() {
    int testCase;
    cin >> testCase;

    int n, minuti, kojtip;
    char ime[50];

    if (testCase == 1) {
        cout << "===== Testiranje na klasata Pesna ======" << endl;
        cin >> ime;
        cin >> minuti;
        cin >> kojtip;

        Pesna p;
        p.setIme(ime);
        p.setMinuti(minuti);
        p.setTip((TipPesna) kojtip);

        p.pecati();
    } else if (testCase == 2) {
        cout << "===== Testiranje na klasata CD ======" << endl;
        CD omileno;
        omileno.setMaxMinuti(20);

        cin >> n; // Number of songs
        for (int i = 0; i < n; i++) {
            cin >> ime >> minuti >> kojtip;

            Pesna p;
            p.setIme(ime);
            p.setMinuti(minuti);
            p.setTip((TipPesna) kojtip);

            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < omileno.getBroj(); i++) {
            omileno.getPesna(i).pecati();
        }
    } else if (testCase == 3) {
        cout << "===== Testiranje na metodot dodadiPesna() od klasata CD ======" << endl;
        CD omileno;
        omileno.setMaxMinuti(20);

        cin >> n; // Number of songs
        for (int i = 0; i < n; i++) {
            cin >> ime >> minuti >> kojtip;

            Pesna p;
            p.setIme(ime);
            p.setMinuti(minuti);
            p.setTip((TipPesna) kojtip);

            omileno.dodadiPesna(p);
        }
        for (int i = 0; i < omileno.getBroj(); i++) {
            omileno.getPesna(i).pecati();
        }
    } else if (testCase == 4) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno;
        omileno.setMaxMinuti(20);

        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> ime >> minuti >> kojtip;

            Pesna p;
            p.setIme(ime);
            p.setMinuti(minuti);
            p.setTip((TipPesna) kojtip);

            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((TipPesna) kojtip);
    } else if (testCase == 5) {
        cout << "===== Testiranje na metodot pecatiPesniPoTip() od klasata CD ======" << endl;
        CD omileno;
        omileno.setMaxMinuti(20);

        cin >> n; // Number of songs
        for (int i = 0; i < n; i++) {
            cin >> ime >> minuti >> kojtip;

            Pesna p;
            p.setIme(ime);
            p.setMinuti(minuti);
            p.setTip((TipPesna) kojtip);

            omileno.dodadiPesna(p);
        }
        cin >> kojtip;
        omileno.pecatiPesniPoTip((TipPesna) kojtip);
    }

    return 0;
};

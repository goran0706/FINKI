// Да се развие класа Nediviznina за коjа се чуваат следниве информации:
//
// адреса (динамички алоцирана низа од знаци)
// квадратура (цел боj)
// цена за квадрат (цел боj)
// За оваа класа да се имплементираат соодветните конструктори и следните методи:
//
// cena() коj ќе jа враќа цената на недвижнината (квадратура * цена-за-квадрат)
// pecati() коj ќе ги испечати сите информации за истата
// danokNaImot() коj го ваќа данокот што се плаќа за недвижнината, а истиот се пресметува како 5% од цената на недвижнината.
// Од оваа класа да се изведе класа Vila за коjа дополнително се чува данок на луксуз (цел боj, пр. 10%).
// За оваа класа да се преоптоварат методите:
// pecati()
// danokNaImot() со тоа што пресметаниот данок се зголемува процентуално за данокот на луксуз.
// И за двете класи треба да се преоптовари operator >>.

#include "iostream"
#include "cstring"
using namespace std;

class Nedviznina {
protected:
    char *adresa;
    int kvadratura;
    int cenaKvadrat;

public:
    Nedviznina() {
        this->adresa = new char [1];
        this->adresa[0] = '\0';
        this->kvadratura = 0;
        this->cenaKvadrat = 0;
    }

    Nedviznina(char *adresa, int kvadratura, int cenaKvadrat) {
        this->adresa = new char[strlen(adresa) + 1];
        strcpy(this->adresa, adresa);
        this->kvadratura = kvadratura;
        this->cenaKvadrat = cenaKvadrat;
    }

    Nedviznina(const Nedviznina &n) {
        this->adresa = new char[strlen(n.adresa) + 1];
        strcpy(this->adresa, n.adresa);
        this->kvadratura = n.kvadratura;
        this->cenaKvadrat = n.cenaKvadrat;
    }

    Nedviznina &operator =(const Nedviznina &n) {
        if (this != &n) {
            delete[]adresa;
            this->adresa = new char[strlen(n.adresa) + 1];
            strcpy(this->adresa, n.adresa);
            this->kvadratura = n.kvadratura;
            this->cenaKvadrat = n.cenaKvadrat;
        }
        return *this;
    }

    ~Nedviznina() {
        delete[]adresa;
    }

    char *getAdresa() {
        return adresa;
    }

    double cena() {
        return kvadratura * cenaKvadrat;
    }

    double danokNaImot() {
        return cena() * 0.05;
    }

    friend istream &operator >>(istream &in, Nedviznina &i) {
        in >> i.adresa >> i.kvadratura >> i.cenaKvadrat;
        return in;
    }

    void pecati() {
        cout << adresa << " , Kvadratura: " << kvadratura << " , Cena po Kvadrat: " << cenaKvadrat << endl;
    }
};

class Vila : public Nedviznina {
private:
    int danokLuksuz;

public:
    Vila(int danokLuksuz = 0) : Nedviznina() {
        this->danokLuksuz = danokLuksuz;
    }

    friend istream &operator >>(istream &in, Vila &i) {
        in >> i.adresa >> i.kvadratura >> i.cenaKvadrat >> i.danokLuksuz;
        return in;
    }

    double danokNaImot() {
        return cena() * (danokLuksuz + 5) / 100.0;
    }

    void pecati() {
        cout << adresa << " , Kvadratura: " << kvadratura << " , Cena po Kvadrat: " << cenaKvadrat <<
                " , Danok na luksuz: " << danokLuksuz << endl;
    }
};

int main() {
    Nedviznina n;
    Vila v;
    cin >> n;
    cin >> v;
    n.pecati();
    cout << "Danok za: " << n.getAdresa() << ", e: " << n.danokNaImot() << endl;
    v.pecati();
    cout << "Danok za: " << v.getAdresa() << ", e: " << v.danokNaImot() << endl;
    return 0;
}

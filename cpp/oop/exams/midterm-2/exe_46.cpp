#include <iostream>
#include <cstring>
using namespace std;

class FudbalskaEkipa {
protected:
    char trainer[100];
    int array[10];

public:
    FudbalskaEkipa(const char *trainer = "", const int *array = nullptr) {
        strcpy(this->trainer, trainer);
        for (int i = 0; i < 10; i++) {
            if (array) {
                this->array[i] = array[i];
            } else {
                this->array[i] = 0;
            }
        }
    }

    FudbalskaEkipa(const FudbalskaEkipa &f) {
        strcpy(this->trainer, f.trainer);
        for (int i = 0; i < 10; i++) {
            this->array[i] = f.array[i];
        }
    }

    FudbalskaEkipa &operator =(const FudbalskaEkipa &f) {
        if (this != &f) {
            strcpy(this->trainer, f.trainer);
            for (int i = 0; i < 10; i++) {
                this->array[i] = f.array[i];
            }
        }
        return *this;
    }

    ~FudbalskaEkipa() {
    }

    virtual FudbalskaEkipa &operator+=(int n) = 0;

    virtual int uspeh() = 0;

    virtual bool operator >(FudbalskaEkipa &f) = 0;

    friend ostream &operator<<(ostream &os, FudbalskaEkipa &f) {
        return f.print(os);
    }

    virtual ostream &print(ostream &os) = 0;
};

class Klub : public FudbalskaEkipa {
private:
    char name[100];
    int titles;

public:
    Klub(const char *trainer = "", const int *array = nullptr, const char *name = "", int titles = 0) : FudbalskaEkipa(
        trainer, array) {
        strcpy(this->name, name);
        this->titles = titles;
    }

    Klub(const Klub &k) : FudbalskaEkipa(k) {
        strcpy(this->name, k.name);
        this->titles = k.titles;
    }

    Klub &operator =(const Klub &f) {
        if (this != &f) {
            FudbalskaEkipa::operator =(f);
            strcpy(this->name, f.name);
            this->titles = f.titles;
        }
        return *this;
    }

    ~Klub() {
    }

    ostream &print(ostream &os) override {
        os << name << endl;
        os << trainer << endl;
        os << uspeh() << endl;
        return os;
    }

    // FudbalskaEkipa& operator+=(int n) override {
    //     for (int i = 9; i > 0; --i) {
    //         array[i] = array[i - 1];
    //     }
    //     array[0] = n;
    //     return *this;
    // }
    FudbalskaEkipa &operator+=(int n) override {
        array[0] = n;
        return *this;
    }

    int uspeh() override {
        int sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += array[i];
        }
        return (sum * 3) + (titles * 1000);
    }

    bool operator>(FudbalskaEkipa &f) override {
        return uspeh() > f.uspeh();
    }
};

class Reprezentacija : public FudbalskaEkipa {
private:
    char country[100];
    int apearences;

public:
    Reprezentacija(const char *trainer = "", const int *array = nullptr, const char *country = "",
                   int apearences = 0) : FudbalskaEkipa(trainer, array) {
        strcpy(this->country, country);
        this->apearences = apearences;
    }

    Reprezentacija(const Reprezentacija &r) : FudbalskaEkipa(r) {
        strcpy(this->country, r.country);
        this->apearences = r.apearences;
    }

    Reprezentacija &operator =(const Reprezentacija &r) {
        if (this != &r) {
            FudbalskaEkipa::operator =(r);
            strcpy(this->country, r.country);
            this->apearences = r.apearences;
        }
        return *this;
    }

    ~Reprezentacija() {
    }

    ostream &print(ostream &os) override {
        os << country << endl;
        os << trainer << endl;
        os << uspeh() << endl;
        return os;
    }

    // FudbalskaEkipa& operator+=(int n) override {
    //     for (int i = 9; i > 0; --i) {
    //         array[i] = array[i - 1];
    //     }
    //     array[0] = n;
    //     return *this;
    // }
    FudbalskaEkipa &operator+=(int n) override {
        array[0] = n;
        return *this;
    }

    int uspeh() override {
        int sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += array[i];
        }
        return (sum * 3) + (apearences * 50);
    }

    bool operator>(FudbalskaEkipa &f) override {
        return uspeh() > f.uspeh();
    }
};

void najdobarTrener(FudbalskaEkipa **array, int n) {
    int maxUspeh = 0;
    int index = 0;
    for (int i = 0; i < n; i++) {
        if (array[i]->uspeh() > maxUspeh) {
            maxUspeh = array[i]->uspeh();
            index = i;
        }
    }
    cout << *array[index];
}

int main() {
    int n;
    cin >> n;
    FudbalskaEkipa **ekipi = new FudbalskaEkipa *[n];
    char coach[100];
    int goals[10];
    char x[100];
    int tg;
    for (int i = 0; i < n; ++i) {
        int type;
        cin >> type;
        cin.getline(coach, 100);
        cin.getline(coach, 100);
        for (int j = 0; j < 10; ++j) {
            cin >> goals[j];
        }
        cin.getline(x, 100);
        cin.getline(x, 100);
        cin >> tg;
        if (type == 0) {
            ekipi[i] = new Klub(coach, goals, x, tg);
        } else if (type == 1) {
            ekipi[i] = new Reprezentacija(coach, goals, x, tg);
        }
    }
    cout << "===== SITE EKIPI =====" << endl;
    for (int i = 0; i < n; ++i) {
        cout << *ekipi[i];
    }
    cout << "===== DODADI GOLOVI =====" << endl;
    for (int i = 0; i < n; ++i) {
        int p;
        cin >> p;
        cout << "dodavam golovi: " << p << endl;
        *ekipi[i] += p;
    }
    cout << "===== SITE EKIPI =====" << endl;
    for (int i = 0; i < n; ++i) {
        cout << *ekipi[i];
    }
    cout << "===== NAJDOBAR TRENER =====" << endl;
    najdobarTrener(ekipi, n);
    for (int i = 0; i < n; ++i) {
        delete ekipi[i];
    }
    delete [] ekipi;
    return 0;
}

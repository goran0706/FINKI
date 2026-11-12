#include "iostream"
#include "fstream"
using namespace std;

class Date {
private:
    int day, month, year;

public:
    Date(int day = 0, int month = 0, int year = 0) {
        this->day = day;
        this->month = month;
        this->year = year;
    }

    bool compare(Date &date) {
        return year == date.year && month == date.month && day == date.day;
    }

    friend ostream &operator<<(ostream &out, const Date &d) {
        out << d.day << "/" << d.month << "/" << d.year;
        return out;
    }

    friend istream &operator>>(istream &in, Date &d) {
        in >> d.day >> d.month >> d.year;
        return in;
    }

    void read(ifstream &in) {
        in >> day >> month >> year;
        in.ignore();
    }
};

class Call {
private:
    string broj;
    int vreme;
    Date datum;

public:
    Call(string broj = "", int vreme = 0, Date datum = 0) {
        this->broj = broj;
        this->vreme = vreme;
        this->datum = datum;
    }

    friend ostream &operator<<(ostream &out, Call &c) {
        out << "Dialed number: " << c.broj << " " << c.vreme << " sec, " << c.datum;
        return out;
    }

    void read(ifstream &in) {
        datum.read(in);
        getline(in, broj);
        in >> broj;
        in.ignore();
    }

    Date getDatum() {
        return datum;
    }
};

class Log {
private:
    Call *calls;
    int n;

public:
    Log(Call *calls = nullptr, int n = 0) {
        this->n = n;
        this->calls = new Call[n];
        for (int i = 0; i < n; ++i) {
            this->calls[i] = calls[i];
        }
    }

    Log(const Log &l) {
        this->n = l.n;
        this->calls = new Call[l.n];
        for (int i = 0; i < l.n; ++i) {
            this->calls[i] = l.calls[i];
        }
    }

    Log &operator =(const Log &l) {
        if (this != &l) {
            delete[]calls;
            this->n = l.n;
            this->calls = new Call[l.n];
            for (int i = 0; i < l.n; ++i) {
                this->calls[i] = l.calls[i];
            }
        }
        return *this;
    }

    ~Log() {
        delete[]calls;
    }

    friend ostream &operator<<(ostream &out, Log &l) {
        for (int i = 0; i < l.n; ++i) {
            out << l.calls[i] << endl;
        }
        return out;
    }

    void read(ifstream &in) {
        in >> n;
        in.ignore();
        for (int i = 0; i < n; ++i) {
            calls[i].read(in);
        }
    }

    Log daily(Date d) {
        int counter = 0;
        Call *tmp = new Call [n];
        for (int i = 0; i < n; ++i) {
            if (calls[i].getDatum().compare(d)) {
                tmp[counter++] = calls[i];
            }
        }
        Log log(tmp, counter);
        return log;
    }
};

void wtf() {
    ofstream fout("prva.txt");
    string line;
    while (getline(std::cin, line)) {
        if (line == "----") {
            break;
        }
        fout << line << endl;
    }
}

void rff(string path) {
    ifstream fin(path);
    string line;
    while (getline(fin, line)) {
        cout << line << endl;
    }
}

int main() {
    wtf();

    ifstream fin("prva.txt");
    ofstream fout("vtora.txt");
    ofstream fout2("treta.txt");

    Log log;
    log.read(fin);
    fin.close();

    fout << log;
    fout.close();

    Date d;
    cin >> d;

    Log log1 = log.daily(d);
    fout2 << log1;
    fout2.close();

    cout << "All the data for the log:" << endl;
    rff("vtora.txt");
    cout << "Calls on date " << d << endl;
    rff("treta.txt");

    return 0;
}

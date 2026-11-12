#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class InvalidTimeException : exception {
    char message[100];

public:
    InvalidTimeException(char *message = "Invalid Time") {
        strcpy(this->message, message);
    }

    void print() {
        cout << message << endl;
    }
};

class Race {
protected:
    char name[40];
    int year;
    int month;
    float bestTime;
    float lenght;

public:
    Race(const char *name = "", int year = 0, int month = 0, float bestTime = 0, float length = 0) {
        strcpy(this->name, name);
        this->year = year;
        this->month = month;
        this->bestTime = bestTime;
        this->lenght = length;
    }

    Race(const Race &r) {
        strcpy(this->name, r.name);
        this->year = r.year;
        this->month = r.month;
        this->bestTime = r.bestTime;
        this->lenght = r.lenght;
    }

    Race &operator=(const Race &r) {
        if (this != &r) {
            strcpy(this->name, r.name);
            this->year = r.year;
            this->month = r.month;
            this->bestTime = r.bestTime;
            this->lenght = r.lenght;
        }
        return *this;
    }

    ~Race() {
    }

    virtual float complexity() {
        return bestTime / lenght;
    }

    friend ostream &operator<<(ostream &os, Race &r) {
        cout << r.name << " " << r.month << "." << r.year << " " << r.complexity() << endl;
        return os;
    }
};

class MotoGPRace : public Race {
private:
    float *array;
    int n;
    int laps;
    static float coef;

public:
    MotoGPRace(const char *name = "", int year = 0, int month = 0, float bestTime = 0, float length = 0,
               float *array = nullptr, int n = 0, int laps = 0) : Race(name, year, month, bestTime, length) {
        this->laps = laps;
        this->n = n;
        this->array = new float [n];
        for (int i = 0; i < n; i++) {
            this->array[i] = array[i];
        }
    }

    MotoGPRace(const MotoGPRace &r) {
        strcpy(this->name, r.name);
        this->laps = r.laps;
        this->n = r.n;
        this->array = new float [n];
        for (int i = 0; i < n; i++) {
            this->array[i] = r.array[i];
        }
        strcpy(this->name, r.name);
        this->year = r.year;
        this->month = r.month;
        this->bestTime = r.bestTime;
        this->lenght = r.lenght;
    }

    MotoGPRace &operator=(const MotoGPRace &r) {
        if (this != &r) {
            delete [] this->array;
            strcpy(this->name, r.name);
            this->laps = r.laps;
            this->n = r.n;
            this->array = new float [n];
            for (int i = 0; i < n; i++) {
                this->array[i] = r.array[i];
            }
            strcpy(this->name, r.name);
            this->year = r.year;
            this->month = r.month;
            this->bestTime = r.bestTime;
            this->lenght = r.lenght;
        }
        return *this;
    }

    ~MotoGPRace() {
        delete [] this->array;
    }

    float complexity() override {
        float average = 0;
        float sum = 0;
        for (int i = 0; i < n; i++) {
            sum += this->array[i];
        }
        average = sum / n;
        float initialcomp = bestTime / lenght;
        float complexity = (average * coef) + initialcomp;
        if (laps > 22) {
            complexity = complexity + ((complexity / 100) * 20);
        }
        return complexity;
    }

    MotoGPRace &operator++(int) {
        this->laps = this->laps + 1;
        return *this;
    }

    MotoGPRace &operator +=(float time) {
        if (time < 9.5) {
            throw InvalidTimeException();
        } else {
            float *temp = new float [n + 1];
            for (int i = 0; i < n; i++) {
                temp[i] = this->array[i];
            }
            temp[n] = time;
            delete [] this->array;
            this->array = temp;
            n++;
        }
        return *this;
    }

    static void setK(float k) {
        coef = k;
    }

    int getNumberLaps() {
        return laps;
    }

    void setNumberLaps(int n) {
        laps = n;
    }
};

float MotoGPRace::coef = 0.4;

int main() {
    // Race r = Race ("Prvatrka", 2010,1,15,10);
    // cout<<r<<endl;
    // float array[5]={1,2,3,4,5};
    // MotoGPRace r2 = MotoGPRace ("Prvatrka", 2010,1,15,10,array,5,22);
    // cout<<r2<<endl;
    //
    // r2++;
    // cout<<r2<<endl;
    // try {
    //     r2+=5;
    // } catch (InvalidTimeException& e) {
    //     e.print ();
    // }
    // cout<<r2<<endl;

    int testCase;
    cin >> testCase;
    char city[50];
    int year;
    int month;
    float bestTime;
    float length;
    float bestTimes[50];
    int n;
    int m;
    int choice;
    int numberLaps;

    if (testCase == 1) {
        cout << "===== Testing - classes ======" << endl;
        cin >> city;
        cin >> year;
        cin >> month;
        cin >> bestTime;
        cin >> length;
        Race t(city, year, month, bestTime, length);
        cout << t;
        cin >> city;
        cin >> year;
        cin >> month;
        cin >> bestTime;
        cin >> length;
        cin >> numberLaps;
        cin >> n;
        for (int j = 0; j < n; j++)
            cin >> bestTimes[j];
        MotoGPRace mgt(city, year, month, bestTime, length, bestTimes, n, numberLaps);
        cout << mgt;
        MotoGPRace mgt2;
    }
    if (testCase == 2) {
        cout << "===== Testing - operatorot += ======" << endl;
        Race **rArray;
        cin >> m;
        rArray = new Race *[m];
        for (int i = 0; i < m; i++) {
            cin >> choice;
            cin >> city;
            cin >> year;
            cin >> month;
            cin >> bestTime;
            cin >> length;
            if (choice == 1) {
                rArray[i] = new Race(city, year, month, bestTime, length);
            } else {
                cin >> numberLaps;
                cin >> n;
                for (int j = 0; j < n; j++)
                    cin >> bestTimes[j];
                rArray[i] = new MotoGPRace(city, year, month, bestTime, length, bestTimes, n, numberLaps);
            }
        }
        // print the races
        cout << "\nList of all races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];

        // add a new best time
        float best;
        cin >> best;
        int flag = 1;
        for (int i = 0; i < m; i++) {
            MotoGPRace *nn = dynamic_cast<MotoGPRace *>(rArray[i]);
            if (nn != 0) {
                flag = 0;
                (*nn) += best;
                break;
            }
        }

        // print the races
        cout << "\nLista na site Trki:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];
    }
    if (testCase == 3) {
        cout << "===== Testing - exceptions ======" << endl;
        cin >> city;
        cin >> year;
        cin >> month;
        cin >> bestTime;
        cin >> length;
        cin >> numberLaps;
        MotoGPRace mgt(city, year, month, bestTime, length);
        mgt.setNumberLaps(numberLaps);
        float time1, time2;
        cin >> time1 >> time2;
        try {
            mgt += time1;
        } catch (InvalidTimeException &e) {
            e.print();
        }
        try {
            mgt += time2;
        } catch (InvalidTimeException &e) {
            e.print();
        }

        cout << mgt;
    }
    if (testCase == 4) {
        cout << "===== Testing - operator++ ======" << endl;
        cin >> city;
        cin >> year;
        cin >> month;
        cin >> bestTime;
        cin >> length;
        cin >> numberLaps;
        cin >> n;
        for (int j = 0; j < n; j++)
            cin >> bestTimes[j];

        MotoGPRace mgt(city, year, month, bestTime, length, bestTimes, n, numberLaps);
        float v, koef2;
        cout << mgt.getNumberLaps() << endl;
        mgt++;
        cout << mgt;
        mgt++;
        cout << mgt;
    }
    if (testCase == 5) {
        cout << "===== Testing - coefficient ======" << endl;
        Race **rArray;
        cin >> m;
        rArray = new Race *[m];
        for (int i = 0; i < m; i++) {
            cin >> choice;
            cin >> city;
            cin >> year;
            cin >> month;
            cin >> bestTime;
            cin >> length;
            if (choice == 1) {
                rArray[i] = new Race(city, year, month, bestTime, length);
            } else {
                cin >> numberLaps;
                cin >> n;
                for (int j = 0; j < n; j++)
                    cin >> bestTimes[j];
                rArray[i] = new MotoGPRace(city, year, month, bestTime, length, bestTimes, n, numberLaps);
            }
        }
        // print the races
        cout << "\nList of all races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];

        MotoGPRace::setK(0.7);
        // print the races
        cout << "\nList of all races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];
    }

    if (testCase == 6) {
        cout << "===== Testing - full functionality ======" << endl;
        Race **rArray;
        cin >> m;
        rArray = new Race *[m];
        for (int i = 0; i < m; i++) {
            cin >> choice;
            cin >> city;
            cin >> year;
            cin >> month;
            cin >> bestTime;
            cin >> length;
            if (choice == 1) {
                rArray[i] = new Race(city, year, month, bestTime, length);
            } else {
                cin >> numberLaps;
                cin >> n;
                for (int j = 0; j < n; j++)
                    cin >> bestTimes[j];
                rArray[i] = new MotoGPRace(city, year, month, bestTime, length, bestTimes, n, numberLaps);
            }
        }
        // print the races
        cout << "\nList of all races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];
        float newCoef;
        cin >> newCoef;
        MotoGPRace::setK(newCoef);
        cout << "\nList of all races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];
        // print the races
        float newBest;
        cin >> newBest;
        int flag = 1;
        for (int i = 0; i < m; i++) {
            MotoGPRace *pok = dynamic_cast<MotoGPRace *>(rArray[i]);
            if (pok != 0) {
                (*pok)++;
                try {
                    (*pok) += newBest;
                } catch (InvalidTimeException &e) {
                    e.print();
                }
                if (flag == 1) {
                    flag = 0;
                    try {
                        *pok += 1.4;
                    } catch (InvalidTimeException &e) {
                        e.print();
                    }
                }
            }
        }
        cout << "\nList of the races:\n";
        for (int i = 0; i < m; i++)
            cout << *rArray[i];
    }
    return 0;
}

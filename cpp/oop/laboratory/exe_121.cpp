// Да се креира апстрактна класа Sensor која ги моделира сите сензори во една дистрибуирана средина.
// Класата треба да содржи два виртуелни методи:
// float calculateReadingWeight() - пресметка на важност на податокот
// void print() - ги печати сите информации за сензорот
//
// Податоци кои треба да се чуваат за сензорот:
// име на сензор - string
// основна важност на податокот од сензорот - float
// ID на сензорот, кој ќе биде генериран автоматски за секој нов сензор
// Потребно е да се изведат две класи: TemperatureSensor и MotionSensor

// За класата TemperatureSensor потребно е да се додадат следниве информации:
// точност на мерење - float (процент)
// дали е калибриран - boolean
//
// Пресметка на важност:
// Доколку сензорот има точност на мерење поголем од 90%, се додава 0.1.
// Доколку е калибриран се додава 0.3.
// Доколку точноста е поголема од 90% и е калибриран се додава 0.5.
//
// Формат на функцијата за печатење:
// ID: [ID]
// Name: [име на сензор]
// Calculation: [пресметаната важност]

// За класата MotionSensor потребно е да се додадат следниве информации:
// опсег на детекција - float (метри)
// низа од датуми на калибрација - динамички алоцирана низа од објекти од тип Date (да се креира функција void addDate(Date date))
// Пресметка на важност: Доколку сензорот има опсег на детекција помал од 10м, се додава 0.2.
// Доколку сензорот бил редовно калибриран на помалку од 3 дена, тогаш се додава 0.5.

// Формат на функцијата за печатење:
// ID: [ID]
// Name: [име на сензор]
// Calculation: [пресметаната важност]
// Last date of calibration: [последен датум на калибрација] - овој ред се печати само доколку има додадено датуми
// Да се дефинира глобална функција која Sensor *highestReadingWeight(Sensor **sensors, int n) која ќе го врати сензорот со највисока важност на податок.

#include <iostream>
#include <cmath>
#include <string>
using namespace std;

class Date {
public:
    int day, month, year;

    Date(int d = 1, int m = 1, int y = 2000) {
        day = d;
        month = m;
        year = y;
    }

    void print() const {
        cout << day << "." << month << "." << year << endl;
    }
};

class Sensor {
protected:
    string name;
    float baseWeight;
    int id;
    static int counter;

public:
    Sensor(string name, float baseWeight) {
        this->name = name;
        this->baseWeight = baseWeight;
        this->id = ++counter;
    }

    virtual float calculateReadingWeight() const = 0;

    virtual void print() const = 0;

    virtual ~Sensor() {
    }
};

int Sensor::counter = 0;

class TemperatureSensor : public Sensor {
private:
    float accuracy;
    bool calibrated;

public:
    TemperatureSensor(string name, float baseWeight, float accuracy, bool calibrated)
        : Sensor(name, baseWeight) {
        this->accuracy = accuracy;
        this->calibrated = calibrated;
    }

    float calculateReadingWeight() const override {
        float extra = 0.0;
        if (accuracy > 90 && calibrated)
            extra = 0.5;
        else if (accuracy > 90)
            extra = 0.1;
        else if (calibrated)
            extra = 0.3;
        return baseWeight + extra;
    }

    void print() const override {
        cout << "ID: " << id << endl;
        cout << "Name: " << name << endl;
        cout << "Calculation: " << calculateReadingWeight() << endl;
    }
};

class MotionSensor : public Sensor {
private:
    float range;
    Date *calibrationDates;
    int numDates;

public:
    MotionSensor(string name, float baseWeight, float range, Date *calibrationDates, int numDates)
        : Sensor(name, baseWeight) {
        this->range = range;
        this->numDates = numDates;
        this->calibrationDates = new Date[numDates];
        for (int i = 0; i < numDates; ++i)
            this->calibrationDates[i] = calibrationDates[i];
    }

    void addDate(Date d) {
        Date *tmp = new Date[numDates + 1];
        for (int i = 0; i < numDates; ++i)
            tmp[i] = calibrationDates[i];
        tmp[numDates++] = d;
        delete[] calibrationDates;
        calibrationDates = tmp;
    }

    float calculateReadingWeight() const override {
        float extra = 0.0;
        if (range < 10)
            extra += 0.2;
        if (numDates >= 2) {
            const Date &last = calibrationDates[numDates - 1];
            const Date &secondLast = calibrationDates[numDates - 2];
            int diff = abs(last.day - secondLast.day);
            if (diff < 3)
                extra += 0.5;
        }
        return baseWeight + extra;
    }

    void print() const override {
        cout << "ID: " << id << endl;
        cout << "Name: " << name << endl;
        cout << "Calculation: " << calculateReadingWeight() << endl;
        if (numDates > 0) {
            cout << "Last date of calibration: ";
            calibrationDates[numDates - 1].print();
        }
    }

    ~MotionSensor() {
        delete[] calibrationDates;
    }
};

Sensor *highestReadingWeight(Sensor **sensors, int n) {
    if (n == 0) return nullptr;
    Sensor *maxSensor = sensors[0];
    for (int i = 1; i < n; ++i) {
        if (sensors[i]->calculateReadingWeight() > maxSensor->calculateReadingWeight()) {
            maxSensor = sensors[i];
        }
    }
    return maxSensor;
}

int main() {
    int tc;
    cin >> tc;

    if (tc == 1) {
        cout << "Testing TemperatureSensor " << endl;
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            string name;
            float baseReadingWeight;
            int accuracy;
            bool isCalibrated;
            cin >> name >> baseReadingWeight >> accuracy >> isCalibrated;

            TemperatureSensor *ts = new TemperatureSensor(name, baseReadingWeight, accuracy, isCalibrated);
            ts->print();
            delete ts;
        }
    } else if (tc == 2) {
        cout << "Testing MotionSensor " << endl;
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            string name;
            float baseReadingWeight;
            int range;
            int m;
            cin >> name >> baseReadingWeight >> range >> m;

            Sensor *ms = new MotionSensor(name, baseReadingWeight, range, nullptr, 0);
            ms->print();
            delete ms;
        }
    } else if (tc == 3) {
        cout << "Testing Dynamic Allocation" << endl;
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            string name;
            float baseReadingWeight;
            int range;
            int m;
            cin >> name >> baseReadingWeight >> range >> m;

            Sensor *ms = new MotionSensor(name, baseReadingWeight, range, new Date[0], 0);
            ms->print();
            delete ms;
        }
    }
    return 0;
}

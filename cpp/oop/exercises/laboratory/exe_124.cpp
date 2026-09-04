// Да се креира класа WeatherData во која се чуваат податоци за временските услови за различни локации.
// Класата треба да ги содржи следните атрибути:
//
// string location_id; - Единствен идентификатор за локацијата
// string timestamp; - Кога се снимени временските податоци
// double temperature; - Температура во Целзиусови степени
// int humidity; - Процент на влажност
// double wind_speed; - Брзина на ветер во км/ч
// int precipitation; - Врнежи во милиметри
//
// Потребно е да се имплементираат:
//
// Default конструктор
// Конструктор со параметри
// Copy конструктор
// Оператор за доделување (=)
// Оператор за читање од влезен поток (>>)

// Оператор за печатење (<<) во следниот формат:
// Weather at location: <location_id>
// <timestamp> | Temp: <temperature>°C Humidity: <humidity>% Wind: <wind_speed> km/h Precip: <precipitation> mm

// Функцијата string WeatherAlert() која ги категоризира временските услови во три категории:
// Severe - temperature > 35.0 или temperature < -10.0 или humidity > 90 или wind_speed > 30.0 или precipitation > 50
// Warning - temperature > 30.0 или temperature < 0.0 или humidity > 80 или wind_speed > 20.0 или precipitation > 30
// Normal - сите останати услови
// Да се напише глобалната функција FilterByAlertLevel() која прима низа од WeatherData објекти,
// број на елементи и string параметар за нивото на алармирање.
// Како резултат функцијата враќа нова динамички алоцирана низа која ги содржи само временските податоци со специфицираното ниво на алармирање.
//
// Податоците се дадени во датотеката text.txt во форматот:
// прв ред - број на test case,
// втор ред - број на елементи,
// секој следен ред содржи податоци за една временска станица
// (за читање на податоци за една станица користете го istream операторот од класата).
// На почетокот во main() каде што има TODO да се вчитаат потребните податоци од датотека.

#include <iostream>
#include <string>
#include <fstream>
using namespace std;

void writeToFile() {
    ofstream file("text.txt");
    char c;
    while ((c = cin.get()) != '#') {
        file.put(c);
    }
    file.close();
}

class WeatherData {
private:
    string location_id;
    string timestamp;
    double temperature;
    int humidity;
    double wind_speed;
    int precipitation;
public:
    WeatherData(string location="", string timestamp = "", double temp = 0, int humidity = 0, double windSpeed = 0, int prep = 0 ){
        this->location_id = location;
        this->timestamp = timestamp;
        this->temperature = temp;
        this->humidity = humidity;
        this->wind_speed=windSpeed;
        this->precipitation = prep;
    }
    WeatherData(const WeatherData &w){
        this->location_id = w.location_id;
        this->timestamp = w.timestamp;
        this->temperature = w.temperature;
        this->humidity = w.humidity;
        this->wind_speed=w.wind_speed;
        this->precipitation = w.precipitation;
    }
    friend  ifstream &operator >> (ifstream  &in, WeatherData &w){
        getline(in,w.location_id);
        getline(in,w.timestamp);
        in>>w.temperature;
        in>>w.humidity;
        in>>w.wind_speed;
        in>>w.precipitation;
        in.ignore();
        return in;
    }
//    Weather at location: <location_id>
//    <timestamp> | Temp: <temperature>°C Humidity: <humidity>% Wind: <wind_speed> km/h Precip: <precipitation> mm
    friend ostream &operator << (ostream &out, const WeatherData &w){
        out<<"Weather at location: "<<w.location_id<<endl;
        out<<w.timestamp<<" | Temo: "<<w.temperature<<"°C Humidity: "<<w.humidity<<"% Wind:"
        <<w.wind_speed<<"km/h Precip: "<<w.precipitation<<"mm"<<endl;
        return out;
    }

    string  WeatherAlert() const {
        if (temperature > 35.0 ||
        temperature < -10.0 ||
        humidity > 90 ||
        wind_speed > 30.0 ||
        precipitation > 50){
            return "Severe";
        }
        if (temperature > 35.0 ||
        temperature < 0.0 ||
        humidity >80 ||
        wind_speed > 20.0 ||
        precipitation > 30){
            return "Warning";
        }
        return "Normal";
    }
};
WeatherData *FilterByAlertLevel(WeatherData *tmp, int n, string lvl){
    int counter=0;
    for (int i = 0; i < n; ++i) {
        if (tmp[i].WeatherAlert() == lvl){
            counter++;
        }
    }
    WeatherData *filter = new WeatherData[counter];
    int index =0;
    for (int i = 0; i < n; ++i) {
        if (tmp[i].WeatherAlert() == lvl){
            filter[index++] =  tmp[i];
        }
    }
    return filter;
}

int main() {
    writeToFile();
    ifstream fin("text.txt");
    if (!fin) {
        std::cerr << "Cannot open file\n";
        return 1;
    }

    // TODO: Вчитајте податоци од датотека (број на тест примери (testCase), број на WeatherData записи (n) и податоци за WeatherData)
    int testCase, n;
    fin>>testCase>>n;
    WeatherData *records = new WeatherData[n];
    for (int i = 0; i < n; ++i) {
        fin>>records[i];
    }

    // Остатокот од кодот останува непроменет

    if (testCase == 1) {
        cout << "===== Testing Constructor, Istream Operator & OstreamOperator =====" << endl;
        for (int i = 0; i < n; i++) {
            cout << records[i];
        }
    }

    if (testCase == 2) {
        cout << "===== Testing WeatherAlert Function =====" << endl;
        for (int i = 0; i < n; i++) {
            cout << records[i].WeatherAlert() << endl;
        }
    }
    if (testCase == 3) {
        cout << "===== Testing FilterByAlertLevel Global Function =====" << endl;
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].WeatherAlert() == "Normal") {
                count++;
            }
        }
        WeatherData *filtered = FilterByAlertLevel(records, n, "Normal");
        cout << "Normal Weather Conditions:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
        delete[] filtered;
    }

    if (testCase == 4) {
        cout << "===== Testing FilterByAlertLevel Global Function =====" << endl;
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].WeatherAlert() == "Warning") {
                count++;
            }
        }
        WeatherData *filtered = FilterByAlertLevel(records, n, "Warning");
        cout << "Warning Weather Conditions:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
        delete[] filtered;
    }

    if (testCase == 5) {
        cout << "===== Testing FilterByAlertLevel Global Function =====" << endl;
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (records[i].WeatherAlert() == "Severe") {
                count++;
            }
        }
        WeatherData *filtered = FilterByAlertLevel(records, n, "Severe");
        cout << "Severe Weather Conditions:" << endl;
        for (int i = 0; i < count; i++) {
            cout << filtered[i];
        }
        delete[] filtered;
    }

    delete[] records;
    return 0;
}
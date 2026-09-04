// Да се креира апстрактна класа Weather во кој се чува податок за температурата.
// Класата треба да ги содржи следните два виртуелни методи:
//
// bool isDangeours() – кажува дали е ризично да се излегува надвор
// void displayWeatherInfo() – печати информации за времето
// Од оваа класа треба да се изведат класите SunnyWeather, RainyWeather и WindyWeather.
//
// Во класата SunnyWeather дополнително се чуваат информации за:
// УВ индексот (uv) – децимален број
// Да се преоптоварат функции:
// bool isDangeours() – враќа true доколку ув индексот е поголем од 8:
// void displayWeatherInfo() – која печати информации за времето во следниот формат:
// The weather is sunny, temperature: [temperature]°C, UV index: [uv], not recommended to go out (се печати само доколку isDangeorus() враќа true)
//
// Во класата RainyWeather дополнително се чуваат информации за:
//
// Количината на дожд (millimeter) – децимален број
// Дали е невреме (isStortm) – булеан
// Да се преоптоварат функции:
// bool isDangeours() – враќа true доколку e невреме и количината е поголема од 10 милиметри
// void displayWeatherInfo() – која печати информации за времето во следниот формат:
// The weather is rainy, temperature: [temperature]°C, amount of rain: [millimeter]mm, not recommended to go out (се печати само доколку isDangeorus() враќа true)
//
// Во класата WindyWeather дополнително се чуваат информации за:
// Брзина на ветер (speed) – децимален број
// Дали е ураган (isHurricane) – булеан
// Да се преоптоварат функции:
// bool isDangeours() – враќа true доколку e ураган или брзината на ветеро е поглема од 80km/h
// void displayWeatherInfo() – која печати информации за времето во следниот формат:
// The weather is windy, temperature: [temperature]°C, wind speed: [speed]km/h,
// not recommended to go out (се печати само доколку isDangeorus() враќа true) , there is a hurricane (се печати само ако е ураган)
//
// Да се напише глобалната функција displayDangerousWeather() која прима низа од покажувачи Weather и број на елемент,
// како резултат враќа нова низа која ги содржи само објектите за кој isDangerous() враќа вредност true.
// (Низата која ја враќа функцијата треба да биде динамички алоцирана и ги содржи соодветните елементи)
#include <iostream>
using namespace std;

class Weather {
protected:
    double temp;

public:
    Weather(double temp = 0) {
        this->temp = temp;
    }

    virtual bool isDangeours() const = 0;

    virtual void displayWeatherInfo() const = 0;

    virtual ~Weather() {
    }
};

class SunnyWeather : public Weather {
private:
    double uv;

public:
    SunnyWeather(double temp = 0, double uv = 0) : Weather(temp) {
        this->uv = uv;
    }

    bool isDangeours() const override {
        return uv > 8;
    }

    void displayWeatherInfo() const override {
        cout << "The weather is sunny, temperature: " << temp << "°C, UV index: " << uv;
        if (isDangeours()) {
            cout << ", not recommended to go out";
        }
        cout << endl;
    }
};

class RainyWeather : public Weather {
private:
    double mm;
    bool isStorm;

public:
    RainyWeather(double temp = 0, double mm = 0, bool isStorm = false) : Weather(temp) {
        this->mm = mm;
        this->isStorm = isStorm;
    }

    bool isDangeours() const override {
        return isStorm && mm > 10;
    }

    void displayWeatherInfo() const override {
        cout << "The weather is rainy, temperature: " << temp << "°C, amount of rain: " << mm << "mm";
        if (isDangeours()) {
            cout << ", not recommended to go out";
        }
        cout << endl;
    }
};

class WindyWeather : public Weather {
private:
    double speed;
    bool isHurricane;

public:
    WindyWeather(double temp = 0, double speed = 0, bool isHurricane = false) : Weather(temp) {
        this->speed = speed;
        this->isHurricane = isHurricane;
    }

    bool isDangeours() const override {
        return isHurricane || speed > 80;
    }

    void displayWeatherInfo() const override {
        cout << "The weather is windy, temperature: " << temp << "°C, wind speed: " << speed << "km/h";
        if (isDangeours()) {
            cout << ", not recommended to go out";
            if (isHurricane) {
                cout << ", there is a hurricane";
            }
        }
        cout << endl;
    }
};

Weather **getDangerousWeather(Weather **weathers, int n, int &dangerousCount) {
    dangerousCount = 0;
    for (int i = 0; i < n; ++i) {
        if (weathers[i]->isDangeours()) {
            ++dangerousCount;
        }
    }
    Weather **result = new Weather *[dangerousCount];
    int index = 0;
    for (int i = 0; i < n; ++i) {
        if (weathers[i]->isDangeours()) {
            result[index++] = weathers[i];
        }
    }
    return result;
}

int main() {
    Weather *weathers[5];
    int testCase;

    cin >> testCase;

    if (testCase == 1) {
        cout << "TEST CASE 1: TESTING SUNNY WEATHER CLASS" << endl;
        for (int i = 0; i < 5; i++) {
            double temp, uv;
            cin >> temp >> uv;
            weathers[i] = new SunnyWeather(temp, uv);
            weathers[i]->displayWeatherInfo();
        }
    } else if (testCase == 2) {
        cout << "TEST CASE 2: TESTING RAINY WEATHER CLASS" << endl;
        for (int i = 0; i < 5; i++) {
            double temp, mm;
            bool isStorm;
            cin >> temp >> mm >> isStorm;
            weathers[i] = new RainyWeather(temp, mm, isStorm);
            weathers[i]->displayWeatherInfo();
        }
    } else if (testCase == 3) {
        cout << "TEST CASE 3: TESTING WINDY WEATHER CLASS" << endl;
        for (int i = 0; i < 5; i++) {
            double temp, speed;
            bool isHurricane;
            cin >> temp >> speed >> isHurricane;
            weathers[i] = new WindyWeather(temp, speed, isHurricane);
            weathers[i]->displayWeatherInfo();
        }
    } else if (testCase == 4) {
        cout << "TEST CASE 4: TESTING ALL CLASSES" << endl;
        for (int i = 0; i < 5; i++) {
            if (i % 3 == 0) {
                double temp, uv;
                cin >> temp >> uv;
                weathers[i] = new SunnyWeather(temp, uv);
            } else if (i % 3 == 1) {
                double temp, mm;
                bool isStorm;
                cin >> temp >> mm >> isStorm;
                weathers[i] = new RainyWeather(temp, mm, isStorm);
            } else {
                double temp, speed;
                bool isHurricane;
                cin >> temp >> speed >> isHurricane;
                weathers[i] = new WindyWeather(temp, speed, isHurricane);
            }
            weathers[i]->displayWeatherInfo();
        }
    } else if (testCase == 5) {
        cout << "TEST CASE 5: TESTING displayDangerousWeather()" << endl;
        for (int i = 0; i < 5; i++) {
            if (i % 3 == 0) {
                double temp, uv;
                cin >> temp >> uv;
                weathers[i] = new SunnyWeather(temp, uv);
            } else if (i % 3 == 1) {
                double temp, mm;
                bool isStorm;
                cin >> temp >> mm >> isStorm;
                weathers[i] = new RainyWeather(temp, mm, isStorm);
            } else {
                double temp, speed;
                bool isHurricane;
                cin >> temp >> speed >> isHurricane;
                weathers[i] = new WindyWeather(temp, speed, isHurricane);
            }
        }

        int dangerousCount = 0;
        Weather **dangerousWeathers = getDangerousWeather(weathers, 5, dangerousCount);

        for (int i = 0; i < dangerousCount; ++i) {
            dangerousWeathers[i]->displayWeatherInfo();
        }

        delete[] dangerousWeathers;
    }

    for (int i = 0; i < 5; i++) {
        delete weathers[i];
    }

    return 0;
}

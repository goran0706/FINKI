// Напиши програма која ќе пресметува и анализира податоци за температури во повеќе градови во рамки на повеќе денови.
// Корисникот треба да внесе број на градови и број на денови за кои ќе се внесуваат температурите (температурите се реални броеви).
// Програмата треба да ги пресмета и испечати следните информации:
// - Просечната температура за секој град во формат како што е прикажан во примерот.
// - Редниот број на градот кој имал најниска просечна температура (градовите се нумерираат почнувајќи од реден број 1).
// - Вкупниот број на денови во било кој град во кои температурата била над 30°C
// (ако два града имаат температура над 30°C во ист ден, денот се брои два пати, односно вкупниот број на денови би бил 2).

#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    // Матрица за температури (град x ден)
    double temp[n][m];

    // Внесување на температурите
    for (int city = 0; city < n; city++) {
        for (int day = 0; day < m; day++) {
            cin >> temp[city][day];
        }
    }

    // Низа за просек по град
    double averageTemp[n];

    // Пресметка на просек за секој град
    for (int city = 0; city < n; city++) {
        double sum = 0;

        for (int day = 0; day < m; day++) {
            sum += temp[city][day];
        }

        averageTemp[city] = sum / m;
        cout << "City " << city + 1 << " average: " << averageTemp[city] << endl;
    }

    // Наоѓање град со најниска просечна температура
    double lowestTemp = averageTemp[0];
    int lowestCity = 1;

    for (int city = 1; city < n; city++) {
        if (averageTemp[city] < lowestTemp) {
            lowestTemp = averageTemp[city];
            lowestCity = city + 1;
        }
    }

    cout << "Lowest average temperature in city: " << lowestCity << endl;

    // Броење денови со температура над 30°C
    int countHotDays = 0;

    for (int city = 0; city < n; city++) {
        for (int day = 0; day < m; day++) {
            if (temp[city][day] > 30) {
                countHotDays++;
            }
        }
    }

    cout << "Days with temperature above 30: " << countHotDays << endl;

    return 0;
}


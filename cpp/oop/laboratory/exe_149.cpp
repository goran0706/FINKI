// Класа Score чува поени и бонус.
//
// float points
// float bonus
// конструктор со default вредности 0 за двете
// set(float p, float b) – ги поставува вредностите
// applyBonus() – на points му додава процентуално зголемување според bonus (пример: ако поените се 50 и бонус е 10, тогаш стануваат 55)
// print() – ги печати поените со 2 децимали

#include "iostream"
using namespace std;

class Score {
private:
    float points;
    float bonus;

public:
    Score(float points = 0, float bonus = 0) {
        this->points = points;
        this->bonus = bonus;
    }

    void set(float points, float b) {
        Score::points = points;
        Score::bonus = b;
    }

    void applyBonus() {
        points += (points * bonus / 100);
    }

    void print() {
        cout << points;
    }
};

int main() {
    Score s;
    int n;
    cin >> n;
    int cmd;
    float a, b;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> a >> b;
                s.set(a, b);
                s.print();
                break;
            case 2:
                s.applyBonus();
                s.print();
                break;
        }
    }
}

// Да се дефинира класа Score со приватна променлива float score.

// За класата да се дефинираат:
// Сетер за score
// Метод bonus(float percent) кој го зголемува score за даден процент.
// Ако резултатот е поголем од 100, се поставува на 100 и се печати "Score capped at 100".
// Метод print() кој ја печати вредноста на score и set метод за score

#include <iostream>
using namespace std;

class Score {
private:
    float score;

public:
    explicit Score(float score = 0) {
        this->score = score;
    }

    void bonus(float percent) {
        score += percent;
        if (score >= 100) {
            score = 100;
            cout << "Score capped at 100" << endl;
        }
    }

    void print() {
        cout << score;
    }

    void set(float score) {
        Score::score = score;
    }
};

int main() {
    Score obj;
    int n;
    cin >> n;
    int cmd;
    float k;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> k;
                obj.set(k);
                obj.print();
                break;
            case 2:
                cin >> k;
                obj.bonus(k);
                obj.print();
                break;
            default:
                obj.print();
                break;
        }
    }
}

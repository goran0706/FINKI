// Креирај класа Counter со приватни членови:
//
// int count (вредност на бројачот)
// int max (максимална дозволена вредност)
// конструктор со два параметра: count и max
// increase(int value) – ја зголемува вредноста на count за value.
// Ако новата вредност ја надмине max, постави count = max и испечати "Limit reached"
// reset() – ја враќа count на 0
// print() – ја печати моменталната вредност на count
#include "iostream"
using namespace std;

class Counter {
private:
    int count;
    int max;

public:
    Counter(int count, int max) {
        this->count = count;
        this->max = max;
    }

    void increase(int value) {
        count += value;
        if (count > max) {
            count = max;
            cout << "Limit reached" << endl;
        }
    }

    void reset() {
        count = 0;
    }

    void print() {
        cout << count;
    }
};

int main() {
    int n, cmd, a, b;
    cin >> n;
    Counter obj(0, 10);
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                cin >> a;
                obj.increase(a);
                obj.print();
                break;
            case 2:
                obj.reset();
                obj.print();
                break;
        }
    }
}

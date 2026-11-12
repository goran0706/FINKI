// Да се дефинира класа Counter која содржи целобројна променлива count.
// За класата да се дефинираат:
//
// Потребни конструктори (default вредност: 0)
// Метод increment() кој го зголемува count за 1
// Метод decrement() кој го намалува count за 1, но ако count е веќе 0, се печати "Cannot decrement" и count останува 0
// Гетер за count

#include <iostream>
using namespace std;

class Counter {
private:
    int count;

public:
    explicit Counter(int count = 0) {
        this->count = count;
    }

    void increment() {
        count++;
    }

    void decrement() {
        if (count == 0) {
            cout << "Cannot decrement";
            count = 0;
        } else {
            count--;
        }
    }

    int get() const {
        return count;
    }
};

int main() {
    Counter obj;
    int n;
    cin >> n;
    int cmd;
    for (int i = 0; i < n; i++) {
        cin >> cmd;
        switch (cmd) {
            case 1:
                obj.increment();
                cout << obj.get() << endl;
                break;
            case 2:
                obj.decrement();
                cout << obj.get() << endl;
                break;
            default:
                cout << obj.get() << endl;
                break;
        }
    }
}

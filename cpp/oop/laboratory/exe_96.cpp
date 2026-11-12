/*
    Да се имплементира класа List во којашто ќе се чуваат информации за:

    броеви што се дел од листата (динамички алоцирана низа од цели броеви)
    бројот на броеви што се дел од листата
    За класата да се дефинираат следните методи:

    конструктор (со аргументи),
    copy-конструктор,
    деструктор,
    оператор =

    void pecati()метод што ќе ги печати информациите за листата во форматот:
        [број на елементи во листата]: x1 x2 .. xn sum: [сума] average: [просек]
    int sum() метод што ја враќа сумата на елементите во листата
    double average() метод што ќе го враќа просекот на броевите во листата

    Дополнително, креирајте класата ListContainer, во која што ќе се чуваат информации за:

    низа од листи (динамички алоцирана низа од објекти од класата List)
    број на елементи во низата од листи (цел број)
    број на обиди за додавање на листа во контејнерот (цел број првично поставен на нула)

    За класата потребно е да ги дефинирате следните методи:

    конструктор (default), copy-конструктор, деструктор, оператор =
    void pecati() метод што ќе ги печати информациите за контејнерот во форматот:
        List number: [реден број на листата] List info: [испечатени информации за листата со методот List::pecati()] \n sum: [сума] average: [просек]
    доколку контејнерот е празен се печати само порака The list is empty.
    void addNewList(List l) метод со којшто се додава листа во контејнерот

    Напомена: една листа се додава во контејнерот ако и само ако има различна сума од сите листи што се веќе додадени во контејнерот
    int sum() метод што ја враќа сумата на сите елементи во сите листи
    double average() метод што го враќа просекот на сите елементи во сите листи во контејнерот
*/

#include "iostream"
using namespace std;

class List {
    int *numbers;
    int n;

public:
    List() {
    }

    List(int *numbers, int n) {
        this->n = n;
        this->numbers = new int [this->n];
        for (int i = 0; i < this->n; ++i) {
            this->numbers[i] = numbers[i];
        }
    }

    List(const List &l) {
        this->n = l.n;
        this->numbers = new int [this->n];
        for (int i = 0; i < this->n; ++i) {
            this->numbers[i] = l.numbers[i];
        }
    }

    ~List() {
        delete[]numbers;
    }

    List &operator =(const List &l) {
        if (this != &l) {
            delete[]numbers;
            this->n = l.n;
            this->numbers = new int [this->n];
            for (int i = 0; i < this->n; ++i) {
                this->numbers[i] = l.numbers[i];
            }
        }
        return *this;
    }

    int sum() {
        int suma = 0;
        for (int i = 0; i < n; ++i) {
            suma += numbers[i];
        }
        return suma;
    }

    double average() {
        return sum() / n;
    }

    //    x1 x2 .. xn sum: [сума] average: [просек]
    void pecati() {
        for (int i = 0; i < n; ++i) {
            cout << numbers[i] << " ";
        }
        cout << "sum: " << sum() << " average: " << average();
    }

    int getN() {
        return n;
    }
};

class ListContainer {
private:
    List *listi;
    int numListi;
    int obidi;

public:
    ListContainer() {
        listi = nullptr;
        numListi = 0;
        obidi = 0;
    }

    ListContainer(const ListContainer &l) {
        this->listi = new List[l.numListi];
        for (int i = 0; i < l.numListi; ++i) {
            this->listi[i] = l.listi[i];
        }
        this->numListi = l.numListi;
        this->obidi = l.obidi;
    }

    ~ListContainer() {
        delete[]listi;
    }

    ListContainer &operator =(const ListContainer &l) {
        if (this != &l) {
            delete[]listi;
            this->listi = new List[l.numListi];
            for (int i = 0; i < l.numListi; ++i) {
                this->listi[i] = l.listi[i];
            }
            this->numListi = l.numListi;
            this->obidi = l.obidi;
        }
        return *this;
    }

    //    List number: [реден број на листата] List info: [испечатени информации за листата со методот List::pecati()]
    void print() {
        if (numListi == 0) {
            cout << "The list is empty";
        } else {
            for (int i = 1; i <= numListi; ++i) {
                cout << "List number: " << i << "List info: ";
                listi[i].pecati();
            }
        }
    }

    void addNewList(List l) {
        for (int i = 0; i < numListi; ++i) {
            if (listi[i].sum() == l.sum()) {
                return;
            }
        }
        listi[numListi] = l;
        numListi++;
    }

    int sum() {
        int suma = 0;
        for (int i = 0; i < numListi; ++i) {
            suma += listi[i].sum();
        }
        return suma;
    }

    double average() {
        int avg = 0;
        for (int i = 0; i < numListi; ++i) {
            avg += listi[i].getN();
        }
        return sum() / avg;
    }
};

int main() {
    ListContainer lc;
    int N;
    cin >> N;

    for (int i = 0; i < N; i++) {
        int n;
        int niza[100];

        cin >> n;

        for (int j = 0; j < n; j++) {
            cin >> niza[j];
        }

        List l = List(niza, n);

        lc.addNewList(l);
    }


    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "Test case for operator =" << endl;
        ListContainer lc1;
        lc1.print();
        cout << lc1.sum() << " " << lc.sum() << endl;
        lc1 = lc;
        lc1.print();
        cout << lc1.sum() << " " << lc.sum() << endl;
        lc1.sum();
        lc1.average();
    } else {
        lc.print();
    }
}

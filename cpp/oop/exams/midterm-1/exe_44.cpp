#include "iostream"
using namespace std;

class List {
private:
    int *n;
    int brN;

public:
    List(int *n = nullptr, int brN = 0) {
        this->brN = brN;
        this->n = new int[brN];
        for (int i = 0; i < brN; ++i) {
            this->n[i] = n[i];
        }
    }

    List(const List &l) {
        this->brN = l.brN;

        this->n = new int[brN];
        for (int i = 0; i < brN; ++i) {
            this->n[i] = l.n[i];
        }
    }

    ~List() {
        delete[]n;
    }

    List &operator =(const List &l) {
        if (this != &l) {
            delete[]n;
            this->n = new int[brN];
            for (int i = 0; i < brN; ++i) {
                this->n[i] = l.n[i];
            }
            this->brN = l.brN;
        }
        return *this;
    }

    int sum() {
        int s = 0;
        for (int i = 0; i < brN; ++i) {
            s += n[i];
        }
        return s;
    }

    double average() {
        return sum() / brN;
    }

    void pecati() {
        for (int i = 0; i < brN; ++i) {
            cout << n[i] << " ";
        }
        cout << "sum: " << sum() << " average: " << average();
    }
};

class ListContainer {
private:
    List *listi;
    int brListi;
    int obidi;

public:
    ListContainer(int brListi = 0, int obidi = 0) {
        this->brListi = brListi;
        this->obidi = obidi;
    }

    ListContainer(const ListContainer &lc) {
        this->brListi = lc.brListi;
        this->obidi = lc.obidi;
        for (int i = 0; i < lc.brListi; ++i) {
            this->listi[i] = lc.listi[i];
        }
    }

    ListContainer &operator=(const ListContainer &lc) {
        if (this != &lc) {
            delete[]listi;
            this->brListi = lc.brListi;
            this->obidi = lc.obidi;
            for (int i = 0; i < lc.brListi; ++i) {
                this->listi[i] = lc.listi[i];
            }
        }
        return *this;
    }

    ~ListContainer() {
        delete[]listi;
    }

    void print() {
        cout << "List number: ";
        for (int i = 0; i < brListi; ++i) {
            cout << i;
        }
        cout << " List info: ";
        for (int i = 0; i < brListi; ++i) {
            listi[i].pecati();
        }
        cout << endl;
        cout << "Sum: " << sum() << " Average: " << average();
    }

    int sum() {
        int s = 0;
        for (int i = 0; i < brListi; ++i) {
            s += listi[i].sum();
        }
        return s;
    }

    double average() {
        return sum() / brListi;
    }

    void addNewList(List l) {
        obidi++;
        for (int i = 0; i < brListi; ++i) {
            if (listi[i].sum() == l.sum()) {
                return;
            }
        }
        List *tmp = new List[brListi + 1];
        for (int i = 0; i < brListi; ++i) {
            tmp[i] = listi[i];
        }
        tmp[brListi] = l;
        delete[]listi;
        listi = tmp;
        brListi++;
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

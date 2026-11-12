#include <iostream>
using namespace std;

class List {
private:
    int *array;
    int size;

public:
    List(int *array = 0, int size = 0) {
        this->size = size;
        this->array = new int[size];
        for (int i = 0; i < size; i++) {
            this->array[i] = array[i];
        }
    }

    List(const List &other) {
        this->size = other.size;
        this->array = new int[size];
        for (int i = 0; i < size; i++) {
            this->array[i] = other.array[i];
        }
    }

    List &operator=(const List &other) {
        if (this != &other) {
            delete [] this->array;
            this->size = other.size;
            this->array = new int[size];
            for (int i = 0; i < size; i++) {
                this->array[i] = other.array[i];
            }
        }
        return *this;
    }

    ~List() {
        delete [] array;
    }

    void pecati() {
        int sum = 0;
        cout << size << ": ";
        for (int i = 0; i < size; i++) {
            cout << array[i] << " ";
            sum += array[i];
        }
        cout << "sum: " << sum << " ";
        cout << "average: " << (float) sum / size << endl;
    }

    int sum() {
        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += array[i];
        }
        return sum;
    }

    double average() {
        double sum = 0;
        for (int i = 0; i < size; i++) {
            sum += array[i];
        }
        return sum / size;
    }

    int getSize() {
        return size;
    }
};

class ListContainer {
private:
    List *lists;
    int size;
    int number;
    int fail;
    int success;

public:
    ListContainer(int size = 0, int number = 0) {
        fail = success = 0;
        this->size = size;
        this->number = number;
        lists = new List[size];
    }

    ListContainer(const ListContainer &other) {
        this->fail = other.fail;
        this->success = other.success;
        this->size = other.size;
        this->number = other.number;
        lists = new List[size];
        for (int i = 0; i < number; i++) {
            lists[i] = other.lists[i];
        }
    }

    ListContainer &operator=(const ListContainer &other) {
        if (this != &other) {
            delete [] lists;
            this->fail = other.fail;
            this->success = other.success;
            this->size = other.size;
            this->number = other.number;
            lists = new List[size];
            for (int i = 0; i < number; i++) {
                lists[i] = other.lists[i];
            }
        }
        return *this;
    }

    ~ListContainer() {
        delete [] lists;
    }

    void addNewList(List &list) {
        for (int i = 0; i < number; i++) {
            if (list.sum() == lists[i].sum()) {
                fail++;
                return;
            }
        }


        if (number >= size) {
            int newSize = (size == 0) ? 1 : size * 2;
            List *temp = new List[newSize];
            for (int i = 0; i < number; i++) {
                temp[i] = lists[i];
            }
            delete[] lists;
            lists = temp;
            size = newSize;
        }

        lists[number] = list;
        number++;
        success++;
    }

    int sum() {
        int summ = 0;
        for (int i = 0; i < number; i++) {
            summ += lists[i].sum();
        }
        return summ;
    }

    double average() {
        if (number == 0) return 0;
        double totalSum = sum();
        int totalElements = 0;
        for (int i = 0; i < number; i++) {
            totalElements += lists[i].getSize();
        }
        return totalSum / totalElements;
    }

    void print() {
        if (number > 0) {
            for (int i = 0; i < number; i++) {
                cout << "List number: " << i + 1 << " ";
                cout << "List info: ";
                lists[i].pecati();
            }
            cout << "Sum: " << sum() << " Average: " << average() << endl;
            cout << "Successful attempts: " << success << " Failed attempts: " << fail << endl;
        } else {
            cout << "The list is empty" << endl;
        }
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
    return 0;
}

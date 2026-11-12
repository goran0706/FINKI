/*
    Објектно ориентирано програмирање

    Аудиториска вежба 5 (operator overloading, dynamic allocation)
    1. Задачи
    1.1 Динамички алоцирана низа

    Да се напише класа Array за работа со еднодимензионални полиња од целобројни елементи.
    За полето се чуваат информации за неговиот вкупен капцитет, тековниот број на елементи.
    Резервацијата на меморијата да се врши динамички.

    Во класата да се преоптоварат следните оператори:

    - += за додавање нови броеви во полето и притоа ако е исполнет капацитетот на полето (низата) да се зголеми за 100%.
    - -= која ги брише сите појавувања на целоброниот аргумент во полето, а притоа капацитетот да не се промени.
    - << за печатење на елементите од полето.
    - >> за читање на елементи во полето.
    - [] за пристап до елемент и промена на вредноста на елемент од полето.
    - == за споредба на два објекти од класата Array.
    - + за спојување на два објекти од класата Array и враќање на нов објект кој ги содржи сите елементи од двата објекта.
     + за додавање на цел број на сите елементи од полето и враќање на нов објект кој ги содржи резултатите од додавањето.

    Да се тестира класата во main функција.

*/
#include <iostream>
using namespace std;

class Array {
public:
    Array() {
        fields = new int[0];
        count = 0;
        capacity = 0;
    }

    Array(const int *src, int count, int capacity) {
        this->fields = new int[capacity];
        this->count = count;
        this->capacity = capacity;
        for (int i = 0; i < count; i++)
            this->fields[i] = src[i];
    }

    Array(const Array &other) {
        fields = new int[other.capacity];
        count = other.count;
        capacity = other.capacity;
        for (int i = 0; i < other.count; i++)
            fields[i] = other.fields[i];
    }

    Array &operator=(const Array &other) {
        if (this == &other) return *this;
        delete[] fields;
        fields = new int[other.capacity];
        count = other.count;
        capacity = other.capacity;
        for (int i = 0; i < other.count; i++)
            fields[i] = other.fields[i];
        return *this;
    }

    ~Array() {
        delete[] fields;
    }

    Array &operator+=(int x) {
        if (count == capacity) {
            int newCap = (capacity == 0) ? 1 : capacity * 2;
            int *tmp = new int[newCap];
            for (int i = 0; i < count; i++)
                tmp[i] = fields[i];
            delete[] fields;
            fields = tmp;
            capacity = newCap;
        }
        fields[count++] = x;
        return *this;
    }

    Array &operator-=(int x) {
        int write = 0;
        for (int i = 0; i < count; i++)
            if (fields[i] != x)
                fields[write++] = fields[i];
        count = write;
        return *this;
    }

    int &operator[](int index) { return fields[index]; }
    int operator[](int index) const { return fields[index]; }

    bool operator==(const Array &other) const {
        if (count != other.count) return false;
        for (int i = 0; i < count; i++)
            if (fields[i] != other.fields[i]) return false;
        return true;
    }

    friend ostream &operator<<(ostream &os, const Array &obj) {
        for (int i = 0; i < obj.count; i++)
            os << obj.fields[i] << " ";
        return os;
    }

    friend istream &operator>>(istream &is, Array &obj) {
        if (obj.count == obj.capacity) return is;
        is >> obj.fields[obj.count++];
        return is;
    }

    friend Array operator+(const Array &l, const Array &r) {
        Array a;
        delete[] a.fields;
        a.capacity = l.capacity + r.capacity;
        a.count = l.count + r.count;
        a.fields = new int[a.capacity];
        int write = 0;
        for (int i = 0; i < l.count; i++)
            a.fields[write++] = l.fields[i];
        for (int i = 0; i < r.count; i++)
            a.fields[write++] = r.fields[i];
        return a;
    }

private:
    int *fields;
    int count;
    int capacity;
};

int main() {
    Array a;
    for (int i = 1; i <= 10; i++)
        a += i;
    cout << a << "\n";

    a -= 3;
    cout << a << "\n";

    int nums[] = {1, 2, 3, 4, 5};
    Array a1(nums, 5, 10);
    cin >> a1 >> a1 >> a1 >> a1 >> a1;

    Array a2 = a + a1;
    cout << a2 << "\n";

    cout << (a == a1) << "\n";

    return 0;
}

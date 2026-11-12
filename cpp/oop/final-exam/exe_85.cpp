#include <iostream>
#include <cstring>
using namespace std;

class Pair {
private:
    char *key;
    int n;

public:
    Pair(const char *key = "", const int n = 0) {
        this->key = new char[strlen(key) + 1];
        strcpy(this->key, key);
        this->n = n;
    }

    Pair(const Pair &p) {
        this->key = new char[strlen(p.key) + 1];
        strcpy(this->key, p.key);
        this->n = p.n;
    }

    Pair &operator=(const Pair &p) {
        if (this != &p) {
            delete [] this->key;
            this->key = new char[strlen(p.key) + 1];
            strcpy(this->key, p.key);
            this->n = p.n;
        }
        return *this;
    }

    ~Pair() {
        delete[] this->key;
    }

    //operator for printing on the SO << in format '[key]' -> [value]
    friend ostream &operator<<(ostream &os, Pair &p) {
        os << "'" << p.key << "' -> " << p.n << endl;
        return os;
    }

    //operator -- in prefix and postfix that decreases the value for -1
    Pair &operator--() {
        --n;
        return *this;
    }

    Pair &operator--(int) {
        --n;
        return *this;
    }

    //operator * for multiplying two objects of this class and returns new object where the key is the shorter (in length) of the keys of the two objects that are multiplying,
    //and the value is a product of the values of the two objects. If both objects has keys with same length take the right object's key in the multiply operation.
    // Pair &operator* (Pair &p) {
    //     int temp=this->n*p.n;
    //     if (strcmp(this->key, p.key) == -1) {
    //         Pair temp2 (p.key,temp);
    //     }
    //     else {
    //         Pair temp2 (p.key,temp);
    //         return temp2;
    //     }
    // }
    Pair operator*(const Pair &p) {
        int product = this->n * p.n;

        // Compare the lengths of the keys to decide which one to use
        if (strlen(this->key) < strlen(p.key)) {
            return Pair(this->key, product); // If this key is shorter, use it
        } else {
            return Pair(p.key, product); // If the other key is shorter, or they are equal, use the right object's key
        }
    }

    int getN() const {
        return this->n;
    }
};

class Collection {
private:
    Pair *array;
    int size;

public:
    Collection() {
        array = nullptr;
        size = 0;;
    }

    Collection(const Collection &c) {
        this->size = c.size;
        array = new Pair[size];
        for (int i = 0; i < size; i++) {
            array[i] = c.array[i];
        }
    }

    Collection &operator=(const Collection &c) {
        if (this != &c) {
            delete[] array;
            array = new Pair[size];
            for (int i = 0; i < size; i++) {
                array[i] = c.array[i];
            }
        }
        return *this;
    }

    ~Collection() {
        delete[] array;
    }

    //operator += for adding new object of the class Pair in the array
    Collection &operator+=(const Pair &p) {
        Pair *temp = new Pair [size + 1];
        for (int i = 0; i < size; i++) {
            temp[i] = array[i];
        }
        delete[] array;
        temp[size] = p;
        array = temp;
        size++;
        return *this;
    }

    //operator for printing on the SO << that prints the number of elements in the array, and then each object in a new line
    friend ostream &operator<<(ostream &os, Collection &c) {
        cout << "Size: " << c.size << endl;
        for (int i = 0; i < c.size; i++) {
            os << c.array[i];
        }
        return os;
    }

    //operator < for comparing two objects of this class using the value of the product of all pairs in the collection
    bool operator <(Collection &c) {
        int size1 = 0, size2 = 0;
        for (int i = 0; i < c.size; i++) {
            size1 = size1 + c.array[i].getN();
        }
        for (int i = 0; i < size; i++) {
            size2 = size2 + array[i].getN();
        }
        if (size1 > size2) {
            return true;
        } else {
            return false;
        }
    }

    //method int greater(int value) that returns the count of the pairs that have value greater then the passed argument value.
    int greater(int value) {
        int count = 0;
        for (int i = 0; i < size; i++) {
            if (array[i].getN() > value) {
                count++;
            }
        }
        return count;
    }
};

int main() {
    char key[50];
    float value;
    cout << "----- class Pair -----" << endl;
    cin >> key;
    cin.get();
    cin >> value;
    cout << "----- constructor -----" << endl;
    Pair p1(key, value);
    cin >> key;
    cin.get();
    cin >> value;
    Pair p2(key, value);
    Pair p3(p1);
    cout << "----- operator << -----" << endl;
    cout << p1;
    cout << p2;
    cout << "----- operator --(int) -----" << endl;
    cout << p1;
    p1--;
    cout << p1;
    cout << "----- operator -- -----" << endl;
    cout << --p2;
    cout << "----- operator * -----" << endl;
    Pair p = p1 * p2;
    cout << "----- operator = -----" << endl;
    p3 = p;
    cout << p3;

    cout << "----- class Collection -----" << endl;
    cout << "----- constructor -----" << endl;
    Collection k;
    cout << "----- operator += -----" << endl;
    k += p1;
    k += p2;
    k += p3;
    cout << "----- operator << -----" << endl;
    cout << k;
    cout << "----- copy constructor -----" << endl;
    Collection k2(k);
    cout << "----- operator < -----" << endl;
    if (k < k2) {
        cout << "k < k2" << endl;
    } else {
        cout << "k >= k2" << endl;
    }
    k2 += p1;
    if (k < k2) {
        cout << "k < k2" << endl;
    } else {
        cout << "k >= k2" << endl;
    }
    cout << "----- greater -----" << endl;
    int x;
    cin >> x;
    int pp = k.greater(x);
    cout << pp;
    return 0;
}

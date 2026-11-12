#include <iostream>
#include <cstring>
using namespace std;

class ArrayOfCharacters {
private:
    char *array;
    int size;

public:
    ArrayOfCharacters(const char *array = "") {
        this->size = strlen(array);
        this->array = new char [strlen(array) + 1];
        strcpy(this->array, array);
    }

    ArrayOfCharacters(const ArrayOfCharacters &other) {
        this->size = other.size;
        this->array = new char [strlen(other.array) + 1];
        strcpy(this->array, other.array);
    }

    ArrayOfCharacters &operator=(const ArrayOfCharacters &other) {
        if (this != &other) {
            delete [] this->array;
            this->size = other.size;
            this->array = new char [strlen(other.array) + 1];
            strcpy(this->array, other.array);
        }
        return *this;
    }

    ~ArrayOfCharacters() {
        delete[] array;
    }

    void print() {
        cout << this->array << endl;
    }

    int getSize() {
        return this->size;
    }

    char *getArray() {
        return this->array;
    }

    //Index '32' is out of bounds
    char &operator [](int index) {
        if (index < 0 || index >= this->size) {
            cout << "s[" << index << "] = " << "Index '" << index << "' is out of bounds" << endl;
            static char dummy = ' ';
            return dummy;
        } else {
            return this->array[index];
        }
    }
};

class ArrayOfStrings {
private:
    char *array;
    int size;
    int capacity;
    int totalSize;

public:
    ArrayOfStrings(const int capacity = 0) {
        array = nullptr;
        size = 0;
        totalSize = 0;
        this->capacity = capacity;
    }

    ArrayOfStrings(const ArrayOfStrings &other) {
        this->capacity = other.capacity;
        this->size = other.size;
        this->totalSize = other.totalSize;
        array = new char [strlen(other.array) + 1];
        strcpy(array, other.array);
    }

    ArrayOfStrings &operator=(const ArrayOfStrings &other) {
        if (this != &other) {
            delete [] this->array;
            this->totalSize = other.totalSize;
            this->capacity = other.capacity;
            this->size = other.size;
            array = new char [strlen(other.array) + 1];
            strcpy(array, other.array);
        }
        return *this;
    }

    ~ArrayOfStrings() {
        delete [] this->array;
    }

    ArrayOfStrings &operator+=(ArrayOfCharacters &other) {
        totalSize = totalSize + other.getSize();
        if (totalSize >= this->capacity - 1) {
            this->capacity = this->capacity * 2;
            if (totalSize >= this->capacity - 1) {
                //this->capacity = this->capacity + (totalSize-this->capacity);
                //int diff = totalSize - this->capacity;
                this->capacity = capacity / 2 + other.getSize();
            }
        }
        char *temp = new char [capacity];
        if (array) {
            strcpy(temp, array);
            delete [] array;
        } else {
            temp[0] = '\0';
        }
        array = new char [capacity];
        array = temp;
        strcat(array, other.getArray());
        return *this;
    }

    friend ostream &operator<<(ostream &os, ArrayOfStrings &other) {
        // // os<<other.array<<endl;
        // // os<<other.totalSize<<endl;
        // // os<<other.capacity<<endl;
        // if (other.capacity==80) {
        //     cout<<"Capacity: 84"<<endl;
        // }
        // else {
        //     cout<<"Capacity: "<<other.capacity<<endl;
        // }
        cout << "Capacity: " << other.capacity << endl;
        cout << "Size: " << other.totalSize << endl;
        cout << "Contents: " << other.array << endl;
        return os;
    }
};

int main() {
    int n;
    cin >> n;
    ArrayOfStrings sb(n);
    cin >> n;
    for (int i = 0; i < n; ++i) {
        char input[100];
        cin >> input;
        ArrayOfCharacters s(input);
        int x;
        cin >> x;
        char result = s[x];
        if (result != ' ') {
            cout << "s[" << x << "] = " << result << endl;
        }


        sb += s;
    }
    cout << sb;
    return 0;
}

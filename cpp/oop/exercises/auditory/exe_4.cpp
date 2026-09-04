/*
    1.3 Complex Numbers
*/
#include<iostream>
using namespace std;


struct ComplexNumber {
    float real;
    float imag;

    ComplexNumber add(ComplexNumber other) {
        return {real + other.real, imag + other.imag};
    }

    ComplexNumber subtract(ComplexNumber other) {
        return {real - other.real, imag - other.imag};
    }

    ComplexNumber multiply(ComplexNumber other) {
        return {
            real * other.real - imag * other.imag,
            real * other.imag + imag * other.real
        };
    }

    void print() {
        cout << real;
        if (imag >= 0) {
            cout << "+";
        }
        cout << imag << "i" << endl;
    }
};

void read(ComplexNumber &cn) {
    cin >> cn.real >> cn.imag;
}


int main() {
    ComplexNumber a, b, c;
    read(a);
    read(b);
    a.print();
    b.print();

    cout << "a + b" << endl;
    c = a.add(b);
    c.print();

    cout << "a - b" << endl;
    a.subtract(b).print();
    
    cout << "a * b" << endl;
    a.multiply(b).print();

    return 0;
}

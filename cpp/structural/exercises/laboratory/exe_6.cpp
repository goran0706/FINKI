// TASK 6:
// Да се напише програма каде од тастатура се внесува одреден износ на пари кој корисник го има на својата трансакциска сметка.
// Потоа, во нов ред се внесува сумата на еден производ кој го купил, на кој дополнително треба да плати и ДДВ(18% од таа сума).
// Програмата печати 1 доколку после плаќањето на ДДВ корисникот има барем 1 денар на својата сметка, а 0 во спротивно.
// input: 25600 10000 output: 1

#include <iostream>
using namespace std;

int main() {
    constexpr int TAX_RATE = 18;
    int balance, price;
    cin >> balance >> price;

    int totalPrice = price + (price * TAX_RATE / 100);

    if (balance > totalPrice) {
        cout << 1 << endl;
    } else {
        cout << 0 << endl;
    }
}

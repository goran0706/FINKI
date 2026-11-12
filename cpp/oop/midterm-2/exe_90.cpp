// Investment fund company has a need of a new program that will automate and help the process. For this purpose you need to implement the following classes. The class InvestmentPlan with the following data:
//
//     name of the investor (char array max 80)
//     the plan or the sum of investment (real number)
//     shares number (real number)
//     bool variable representing if the plan is from the current day. (true - current day payment, false - old payment)
//
// Additionally, you need to implement abstract class InvestmentFund with the following data members:
//
//     name of the fund (char array max 50)
//     dynamically allocated array of investment plans (objects of the classInvestmentPlan).
//     number of investment plans (integer representing the size of the investment plans array)
//     price of share (real number) (5 points)
//
// For classes InvestmentFund and InvestmentPlan define the needed constructors, destructors and и get() or set() methods. For the class InvestmentFund you need to implement pure virtual function double profit() that will compute the daily profit of the investment fund. (10 points).
//
// The fund manages more funds that can belong in one of two types: money fund and shares fund. Design the classes MoneyFund and ActionFund (5 points)
//
// For the money fund keep one static variable:
//
//     yearly provision in percents (real number in the range 0-100). The initial value is 1%, and can not be changed.
//
// For the action fund keep two static variables:
//
//     yearly provision in percents (real number in the range 0-100). The initial value is 1.5%, and can not be changed.
//     entry provision in percents (real number in the range 0-100). The initial value is 3%, and can not be changed.
//
// The daily profit for the money funds is computed by the formula:
//
// (total sum of investments * provision / 100) / 365 (10 points)
//
// Daily profit from the action funds is the sum of the profit from the yearly provision and the entry provision computed by the following formula:
//
// (total sum of investments * provision / 100) / 365 + value of new plans * entry provision / 100` (15 points)
//
// The total sum of investments of a fund is computed as a sum of all investments in that fund multiplied by the price of the share. In the formula in the action funds, the value of the new plans is computed as a sum of all investments where the value of the bool variable is true.
//
// Implement separate function double totalProfit(InvestmentFund** funds, int n) that as arguments accepts array of pointers to investment funds array and size of the array, and as a result should return the total daily profit of the fund. It is computed as a sum of daily profits of all funds. (5 points).
//
// For example:
// Input 	Result
//
// 2
// KBPublikum
// 4
// Aleksandar
// 1500000
// 3000
// Marko
// 1500000
// 2000
// Atanas
// 2000000
// 4000
// Suzana
// 2000000
// 3000
// 110
// KBInvest
// 3
// Tankica
// 500000
// 500
// Elena
// 600000
// 1000
// Natasha
// 300000
// 800
// 120
//
//
//
// 18047.5

#include<iostream>
#include<cstring>
using namespace std;

//your code here


int main() {
    char investitor[80], ime[50];
    double plan, brUdeli, udel;
    bool flag = false;
    int n, m;
    cin >> n;
    InvestmentFund **fondovi = new InvestmentFund *[n];
    for (int i = 0; i < n; i++) {
        cin >> ime;
        cin >> m;
        InvestmentPlan *ip = new InvestmentPlan[m];
        for (int j = 0; j < m; j++) {
            cin >> investitor >> plan >> brUdeli;
            if (j % 2) flag = true;
            else flag = false;
            InvestmentPlan IP(investitor, plan, brUdeli, flag);
            ip[j] = IP;
        }
        cin >> udel;
        if (i % 2) {
            fondovi[i] = new ActionFund(ime, ip, m, udel);
        } else {
            fondovi[i] = new MoneyFund(ime, ip, m, udel);
        }
    }
    cout << totalProfit(fondovi, n);
    return 0;
}

// Во компанија за јавен превоз, се чуваат информации за патниците (Passenger) и билетите што ги купуваат (Ticket) за различни автобуски линии. Треба да ги дефинирате соодветните класи и функции за правилна имплементација на системот.
//
// ⚠️ Не го менувајте дадениот код.
//
// Дефинирајте класа Ticket, класата треба да ги содржи следниве приватни членови на податоци:
//
//     routeCode – код на автобуската линија (низа од знаци)
//     price– цена на билетот (цел број)
//     totalSoldTickets – вкупен број на продадени билети на сите патници (цел број)
//
// Класата треба да содржи:
//
//     default constructor
//     constructor with arguments
//     copy constructor
//
// Имплементирајте ги следните функции:
//
//     print()– го печати кодот на линијата и цената на билетот во нов ред
//     registerSale() – ја зголемува вредноста на totalSoldTickets за 1
//
// ⚠️ Не користете методи get/set.
//
// Дефинирајте класа Passenger, класата треба да ги содржи следниве приватни членови на податоци:
//
//     name – име на патникот (низа од знаци)
//     tickets– низа од купени билети (максимална големина 50)
//     n – број на купени билети (првично 0)
//
// Класата треба да содржи:
//
//     default constructor
//     constructor with arguments
//
// Имплементирајте ги следните функции:
//
//     print()– го печати името на патникот проследено со сите купени билети во форматот даден во тест примерите
//     void buyTicket(const Ticket& ticket) – го додава билетот во низата tickets и ја повикува функцијата registerSale()
//
// Напишете функција:
//
// void showRouteStatistics(Passenger passengers[], int n, Ticket tickets[], int m)
//
// Функцијата треба директно да пристапува до приватните членови на двете класи Ticket & Passenger.
//
// За секоја рута во системот:
//
//     печати го кодот на рутата
//     печати ја цената на билетот
//     печати го процентот на патници кои купиле билет за таа рута
//
// На крајот печати просечна покриеност на билети: totalSoldTickets * 100.0 / (n * m)
//
// Форматот за печатење е даден во тест примерите.
//
// For example:
// Input 	Result
//
// 3
// Ana
// 2
// R1
// 50
// R2
// 60
// Marko
// 1
// R1
// 50
// Elena
// 0
// 2
// R1
// 50
// R2
// 60
//
//
//
// R1 50 66.67%
// R2 60 33.33%
// Average ticket coverage: 50.00%
//
// 0
// 2
// R1
// 10
// R2
// 20
//
//
//
// R1 10 0.00%
// R2 20 0.00%
// Average ticket coverage: 0.00%
//
// 2
// A
// 1
// R1
// 10
// B
// 1
// R1
// 10
// 0
//
//
//
// Average ticket coverage: 0.00%

#include <iostream>
#include <cstring>
using namespace std;


// Your code here...


// Don't modify
int main() {
    int n;
    cin >> n;
    cin.ignore();

    Passenger passengers[100];

    for (int i = 0; i < n; i++) {
        char pname[50];
        cin.getline(pname, 50);
        passengers[i] = Passenger(pname);

        int k;
        cin >> k;
        cin.ignore();

        for (int j = 0; j < k; j++) {
            char rc[30];
            int price;

            cin.getline(rc, 30);
            cin >> price;
            cin.ignore();

            Ticket t(rc, price);
            passengers[i].addTicket(t);
        }
    }

    int m;
    cin >> m;
    cin.ignore();

    Ticket allTickets[100];

    for (int i = 0; i < m; i++) {
        char rc[30];
        int price;
        cin.getline(rc, 30);
        cin >> price;
        cin.ignore();
        allTickets[i] = Ticket(rc, price);
    }

    showRouteStatistics(passengers, n, allTickets, m);

    return 0;
}

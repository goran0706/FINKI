// #include <iostream>
// #include <cstring>
// using namespace std;

// struct Transaction {
//     int day;
//     int month;
//     int year;
//     int amount;
//     char currency[10];
// };

// int main () {
//     int n;
//     cin>>n;

//     Transaction transaction[n];

//     for (int i=0; i<n; i++) {
//         int amount=0;
//         int day,month,year;
//         char currency[10];
//         cin>>currency>>amount;
//         cin>>day;
//         cin.ignore();
//         cin>>month;
//         cin.ignore();
//         cin>>year;
//         transaction[i].day=day;
//         transaction[i].month=month;
//         transaction[i].year=year;
//         transaction[i].amount=amount;
//         strcpy(transaction[i].currency,currency);
//     }
//     int counter=1,total=0;
//     for (int i=0; i<n; i++) {
//         if (strcmp (transaction[i].currency, "USD") == 0) {
//             if (transaction[i].amount <= 5000) {
//                 if (transaction[i].month <=3 ) {
//                     if (transaction[i].day<10 && transaction[i].month<10) {
//                         cout<<counter<<". 0"<<transaction[i].day<<"/0"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<" "<<transaction[i].currency<<endl;
//                     }
//                     else if (transaction[i].day<10) {
//                         cout<<counter<<". 0"<<transaction[i].day<<"/"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<" "<<transaction[i].currency<<endl;
//                     }
//                     else if (transaction[i].month<10) {
//                         cout<<counter<<". "<<transaction[i].day<<"/0"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<" "<<transaction[i].currency<<endl;
//                     }
//                     else {
//                       cout<<counter<<". "<<transaction[i].day<<"/"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<" "<<transaction[i].currency<<endl;
//                     }
//                     total=total+transaction[i].amount;
//                     counter++;
//                 }
//             }
//         }
//     }
//     cout<<"Total: "<<total<<" "<<"USD"<<endl;
//     return 0;
// }

#include <stdio.h>
#include <string.h>

struct Transaction {
    int day;
    int month;
    int year;
    int amount;
    char currency[10];
};

int main() {
    int n;
    scanf("%d", &n);

    struct Transaction transaction[n];

    for (int i = 0; i < n; i++) {
        int amount = 0;
        int day, month, year;
        char currency[10];
        scanf("%s %d", currency, &amount);
        scanf("%d", &day);
        getchar(); // To handle the newline character after day input
        scanf("%d", &month);
        getchar(); // To handle the slash ("/") character between month and year
        scanf("%d", &year);

        transaction[i].day = day;
        transaction[i].month = month;
        transaction[i].year = year;
        transaction[i].amount = amount;
        strcpy(transaction[i].currency, currency);
    }

    int counter = 1, total = 0;
    for (int i = 0; i < n; i++) {
        if (strcmp(transaction[i].currency, "USD") == 0) {
            if (transaction[i].amount <= 5000) {
                if (transaction[i].month <= 3) {
                    if (transaction[i].day < 10 && transaction[i].month < 10) {
                        printf("%d. 0%d/0%d/%d %d %s\n", counter, transaction[i].day, transaction[i].month,
                               transaction[i].year, transaction[i].amount, transaction[i].currency);
                    } else if (transaction[i].day < 10) {
                        printf("%d. 0%d/%d/%d %d %s\n", counter, transaction[i].day, transaction[i].month,
                               transaction[i].year, transaction[i].amount, transaction[i].currency);
                    } else if (transaction[i].month < 10) {
                        printf("%d. %d/0%d/%d %d %s\n", counter, transaction[i].day, transaction[i].month,
                               transaction[i].year, transaction[i].amount, transaction[i].currency);
                    } else {
                        printf("%d. %d/%d/%d %d %s\n", counter, transaction[i].day, transaction[i].month,
                               transaction[i].year, transaction[i].amount, transaction[i].currency);
                    }
                    total = total + transaction[i].amount;
                    counter++;
                }
            }
        }
    }

    printf("Total: %d USD\n", total);

    return 0;
}

#include <stdio.h>
#include <stdlib.h>
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
    scanf("%d", &n); // Read number of transactions

    // Allocate memory dynamically
    struct Transaction *transaction = (struct Transaction *) malloc(n * sizeof(struct Transaction));
    if (transaction == NULL) {
        printf("Memory allocation failed\n");
        return 1;
    }

    // Read transactions
    for (int i = 0; i < n; i++) {
        int amount = 0, day, month, year;
        char currency[10];

        // Read date parts separately
        scanf("%d", &day);
        getchar(); // Consume the newline or space
        scanf("%d", &month);
        getchar(); // Consume the newline or space
        scanf("%d", &year);

        // Read amount and currency
        scanf("%d %9s", &amount, currency);

        // Store values in struct
        transaction[i].day = day;
        transaction[i].month = month;
        transaction[i].year = year;
        transaction[i].amount = amount;
        strcpy(transaction[i].currency, currency);
    }

    int counter = 1, total = 0;

    // Process transactions
    for (int i = 0; i < n; i++) {
        if (strcmp(transaction[i].currency, "MKD") == 0) {
            if (transaction[i].amount >= 1000) {
                if (transaction[i].year >= 2013 && transaction[i].year <= 2015) {
                    // Print formatted output
                    printf("%d. ", counter);
                    if (transaction[i].day < 10) printf("0");
                    printf("%d/", transaction[i].day);
                    if (transaction[i].month < 10) printf("0");
                    printf("%d/%d %d %s\n", transaction[i].month, transaction[i].year,
                           transaction[i].amount, transaction[i].currency);

                    total += transaction[i].amount;
                    counter++;
                }
            }
        }
    }

    // Print total sum
    printf("Total: %d MKD\n", total);

    // Free dynamically allocated memory
    free(transaction);

    return 0;
}

// #include <iostream>
// #include <cstring>
// using namespace std;
//
// struct Transaction {
//     int day;
//     int month;
//     int year;
//     int amount;
//     char currency[10];
// };
//
// int main () {
//     int n;
//     cin>>n;
//
//     Transaction transaction[n];
//
//     for (int i=0; i<n; i++) {
//         int amount=0;
//         int day,month,year;
//         char currency[10];
//         cin>>day;
//         cin.ignore();
//         cin>>month;
//         cin.ignore();
//         cin>>year;
//         cin>>amount>>currency;
//         transaction[i].day=day;
//         transaction[i].month=month;
//         transaction[i].year=year;
//         transaction[i].amount=amount;
//         strcpy(transaction[i].currency,currency);
//     }
//     int counter=1,total=0;
//     for (int i=0; i<n; i++) {
//         if (strcmp (transaction[i].currency, "MKD") == 0) {
//             if (transaction[i].amount >= 1000) {
//                 if (transaction[i].year >= 2013 && transaction[i].year <= 2015) {
//                     if (transaction[i].day<10 && transaction[i].month<10) {
//                         cout<<counter<<". 0"<<transaction[i].day<<"/0"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<transaction[i].currency<<endl;
//                     }
//                     else if (transaction[i].day<10) {
//                         cout<<counter<<". 0"<<transaction[i].day<<"/"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<transaction[i].currency<<endl;
//                     }
//                     else if (transaction[i].month<10) {
//                         cout<<counter<<". "<<transaction[i].day<<"/0"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<transaction[i].currency<<endl;
//                     }
//                     else {
//                       cout<<counter<<". "<<transaction[i].day<<"/"<<transaction[i].month<<"/"<<transaction[i].year<<" "<<transaction[i].amount<<transaction[i].currency<<endl;
//                     }
//                     total=total+transaction[i].amount;
//                     counter++;
//                 }
//             }
//         }
//     }
//     cout<<"Total: "<<total<<" "<<"MKD"<<endl;
//     return 0;
// }

// #include <iostream>
// #include <cstring>
// using namespace std;
// int main () {
//     char date[20];
//     cin>>date;
//     cout<<date<<endl;
//
//     int day,month,year;
//     cin>>day;
//     cin.ignore();
//     cin>>month;
//     cin.ignore();
//     cin>>year;
//     cout<<day<<" "<<month<<" "<<year<<endl;
//     return 0;
//  }

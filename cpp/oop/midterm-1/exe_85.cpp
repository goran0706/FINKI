#include <iostream>
#include <cstring>
using namespace std;

struct Proizvod {
    char code[20];
    int price;
    int numberInStorage;
    int numberOrdered;
};

struct Narachka {
    char name[50];
    Proizvod proizvod[10];
    int n;
};

void pecatiFaktura(Narachka nar) {
    int check = 1;
    cout << "Faktura za " << nar.name << endl;

    for (int i = 0; i < nar.n; i++) {
        if (nar.proizvod[i].numberOrdered > nar.proizvod[i].numberInStorage) {
            check = 0;
            break;
        }
    }

    if (check == 1) {
        for (int i = 0; i < nar.n - 1; i++) {
            for (int j = i + 1; j < nar.n; j++) {
                if (strcmp(nar.proizvod[i].code, nar.proizvod[j].code) > 0) {
                    // char *temp=strcpy (temp,nar.proizvod[i].code);
                    // int temp1=nar.proizvod[i].price, temp2=nar.proizvod[i].numberInStorage;
                    // strcpy(nar.proizvod[i].code,nar.proizvod[j].code),
                    // nar.proizvod[i].price=nar.proizvod[j].price;
                    // nar.proizvod[i].numberInStorage=nar.proizvod[j].numberInStorage;
                    // strcpy(nar.proizvod[j].code,temp),
                    // nar.proizvod[j].price=temp1;
                    // nar.proizvod[j].numberInStorage=temp2;
                    swap(nar.proizvod[i].code, nar.proizvod[j].code);
                    swap(nar.proizvod[i].price, nar.proizvod[j].price);
                    swap(nar.proizvod[i].numberInStorage, nar.proizvod[j].numberInStorage);
                    break;
                }
            }
        }

        int sum = 0;
        for (int i = 0; i < nar.n; i++) {
            cout << nar.proizvod[i].code << " " << nar.proizvod[i].price << " " << nar.proizvod[i].numberOrdered << " "
                    << nar.proizvod[i].numberOrdered * nar.proizvod[i].price << endl;
            nar.proizvod[i].numberInStorage = nar.proizvod[i].numberInStorage - nar.proizvod[i].numberOrdered;
            sum = sum + (nar.proizvod[i].numberOrdered * nar.proizvod[i].price);
        }
        cout << "Vkupnata suma na fakturata e " << sum << endl;
    } else {
        cout << "Fakturata ne moze da se izgotvi " << endl;
    }
}

int main() {
    Narachka narachka;

    cin >> narachka.name;
    cin >> narachka.n;

    for (int i = 0; i < narachka.n; i++) {
        cin >> narachka.proizvod[i].code;
        cin >> narachka.proizvod[i].price;
        cin >> narachka.proizvod[i].numberInStorage;
    }

    for (int i = 0; i < narachka.n; i++) {
        cin >> narachka.proizvod[i].numberOrdered;
    }

    pecatiFaktura(narachka);

    return 0;
}

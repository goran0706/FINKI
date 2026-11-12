#include <iostream>
#include<stdio.h>
#include <iomanip>
using namespace std;

struct Pacient {
    char ime[100];
    int pregledi;
    bool zdrastveno;
};

struct doktor {
    char ime[100];
    int br_pac;
    Pacient niza[200];
    float cena;

    int pregledi() {
        int broj = 0;
        for (int i = 0; i < br_pac; i++) {
            if (niza[i].zdrastveno == 0) {
                broj = broj + (niza[i].pregledi);
            }
        }
        return broj;
    }

    int pregledii() {
        int broj = 0;
        for (int i = 0; i < br_pac; i++) {
            broj = broj + (niza[i].pregledi);
        }
        return broj;
    }
};

void najuspesen_doktor(doktor *mat, int n) {
    int sum = 0, summax = 0, index = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < mat[i].br_pac; j++) {
            if (mat[i].niza[j].zdrastveno == 0) {
                sum = sum + (mat[i].cena * mat[i].niza[j].pregledi);
            }
        }
        if (sum > summax) {
            summax = sum;
            index = i;
        }
        if (sum == summax) {
            if (mat[i].pregledii() > mat[index].pregledii()) {
                index = i;
            }
        }
        sum = 0;
    }
    cout << mat[index].ime << " " << fixed << setprecision(2) << mat[index].pregledi() * mat[index].cena << " " << mat[
        index].pregledii() << endl;
}

int main() {
    int i, j, n, broj;
    doktor md[200];
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        //ime na doktor
        scanf("%s", &md[i].ime);
        //broj na pacienti
        scanf("%d", &md[i].br_pac);
        //cena na pregled
        scanf("%f", &md[i].cena);

        for (j = 0; j < md[i].br_pac; j++) {
            scanf("%s", &md[i].niza[j].ime);
            scanf("%d", &md[i].niza[j].zdrastveno);
            scanf("%d", &md[i].niza[j].pregledi);
        }
    }
    najuspesen_doktor(md, n);

    return 0;
}

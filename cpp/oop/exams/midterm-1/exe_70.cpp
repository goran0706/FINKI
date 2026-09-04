#include <iostream>
#include <cstring>
#include <iomanip>
using namespace std;

struct Vozenje {
    char ime[100];
    int traenje;
    float cena;
    bool daliPopust;
};

struct ZabavenPark {
    char ime[100];
    char lokacija[100];
    Vozenje niza[100];
    int n;
};

void pecati(ZabavenPark *zp, int n) {
    for (int i = 0; i < n; i++) {
        cout << zp[i].ime << " " << zp[i].lokacija << endl;
        for (int j = 0; j < zp[i].n; j++) {
            //[Ime1] [Vremetraenje1] [Cena1]
            cout << zp[i].niza[j].ime << " " << zp[i].niza[j].traenje << " " << fixed << setprecision(2) << zp[i].niza[
                j].cena << endl;
        }
    }
}

void najdobar_park(ZabavenPark *niza, int n) {
    int disscount = 0, maxd = 0, min = 0, mind = 0, index1 = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < niza[i].n; j++) {
            min = min + niza[i].niza[j].traenje;
            if (niza[i].niza[j].daliPopust == 1) {
                disscount++;
            }
        }
        if (disscount >= maxd && min > mind) {
            maxd = disscount;
            mind = min;
            index1 = i;
        }
        disscount = 0;
        min = 0;
    }
    //Najdobar park: TivoliGardens Copenhagen
    cout << "Najdobar park: " << niza[index1].ime << " " << niza[index1].lokacija << endl;
}

int main() {
    int i, j, n, broj;
    //kreiraj niza od maksimum 100 zabavni parkovi
    ZabavenPark ff[100];
    scanf("%d", &n);
    //citanje na podatocite
    for (i = 0; i < n; i++) {
        //ime na festivalot
        scanf("%s", ff[i].ime);
        //mesto
        scanf("%s", ff[i].lokacija);
        //broj na filmovi
        scanf("%d", &ff[i].n);

        for (j = 0; j < ff[i].n; j++) {
            scanf("%s", ff[i].niza[j].ime); /* Ime na filmot */
            scanf("%d", &ff[i].niza[j].traenje); /* Vremetraenje   */
            scanf("%f", &ff[i].niza[j].cena); /* Cena */
            scanf("%d", &ff[i].niza[j].daliPopust); /* Popust */
        }
    }
    pecati(ff, n);
    najdobar_park(ff, n);

    return 0;
}

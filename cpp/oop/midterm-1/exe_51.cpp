#include "iostream"
using namespace std;

struct Igrac {
    char name[15];
    int nivo;
    int poeni;
};

struct KompjuterskaIgra {
    char ime[20];
    Igrac i[30];
    int n;
};

void najdobarIgrac(KompjuterskaIgra *lista, int n) {
    int igraci = 0;
    for (int i = 0; i < n; ++i) {
        if (lista[i].n > lista[igraci].n) {
        }
        igraci = i;
    }

    KompjuterskaIgra popular = lista[igraci];
    int index = 0;
    for (int i = 0; i < popular.n; ++i) {
        if (popular.i[i].poeni > popular.i[index].poeni) {
            index = i;
        } else if (popular.i[i].poeni == popular.i[index].poeni) {
            if (popular.i[i].nivo > popular.i[index].nivo) {
                index = i;
            }
        }
    }
    cout << "Najdobar igrac e igracot so korisnicko ime ";
    cout << popular.i[index].name;
    cout << " koj ja igra igrata ";
    cout << popular.ime;
}

int main() {
    int n;
    cin >> n;
    KompjuterskaIgra igri[100];
    for (int i = 0; i < n; ++i) {
        KompjuterskaIgra nova;
        cin >> nova.ime >> nova.n;
        for (int j = 0; j < nova.n; ++j) {
            Igrac nov;
            cin >> nov.name >> nov.nivo >> nov.poeni;
            nova.i[j] = nov;
        }
        igri[i] = nova;
    }
    najdobarIgrac(igri, n);


    return 0;
}

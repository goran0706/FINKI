// Во програмскиот јазик С++ да се креира класа Vozenje за опишување на адреналински возења во забавен парк. Класата треба да содржи: (5 поени)
//
// Име на возењето ( низа од 100 знаци)
// Времетраење во минути (цел број)
// Цена (децимален број)
// Дали има студентски попуст (1-да, 0-не)
//
// Да се креира класа ZabavenPark, што содржи: (10 поени)
//
// Име на забавниот парк (низа од 100 знаци)
// Локација (низа од 100 знаци)
// Низа од адреналински возења во паркот (низа од максимум 100 елементи од класата Vozenje)
// Број на елементи во низата (цел број)
//
// Да се креира функција print за печатење на информациите за сите возења во забавниот парк во формат: (10 поени)
//
// [Ime na parkot] [Lokacija]
// [Ime1] [Vremetraenje1] [Cena1]
// [Ime2] [Vremetraenje2] [Cena2]
// [Ime3] [Vremetraenje3] [Cena3]
// ...
//
// Да се креира функција najdobar_park, што прима низа од објекти од типот ZabavenPark и го печати името и локацијата на паркот кој е најефтин за посета од страна на студенти. Најефтин парк е оној што содржи најголем број возења со студентски попуст. Ако повеќе паркови ги делат овие карактеристики, да се испечати паркот со најголемото времетраење од сите возења.* (20 поени)*
//
// Да се дополни функцијата main (5 поени).
//
// For example:
// Input 	Result
//
// 2
// Disneyland
// Paris
// 2
// BigThunderMountain
// 15
// 10
// 1
// Shark
// 22
// 13
// 0
// TivoliGardens
// Copenhagen
// 3
// Devil
// 16
// 11
// 1
// FlyMountain
// 35
// 19
// 1
// Nemo
// 8
// 7
// 0
//
//
//
// Disneyland Paris
// BigThunderMountain 15 10.00
// Shark 22 13.00
// TivoliGardens Copenhagen
// Devil 16 11.00
// FlyMountain 35 19.00
// Nemo 8 7.00
// Najdobar park: TivoliGardens Copenhagen

#include<iostream>

using namespace std;

int main()
{
    int i, j, n, broj;
    //kreiraj niza od maksimum 100 zabavni parkovi
    ZabavenPark ff[100];
    cin >> n
    //citanje na podatocite
    for (i = 0; i < n; i++){
        //TODO
    }
    pecati(ff,n);
    najdobar_park(ff,n);

    return 0;
}

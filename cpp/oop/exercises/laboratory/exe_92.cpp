// Да се дефинира класа TableTennisPlayer која ќе чува информации за:
// name (име на игра, низа од 50 знаци)
// country (држава на играчот, низа од 50 знаци)
//
// За класата да се обезбедат потребните конструктори, како и соодветни get,set методи
// Да се имплементира метод print() што печати инфо. во следниот формат:
// [име на играч] ([држава])
//
// Да се дефинира класа TableTennisMatch која ќе чува информации за:
// player1 (објект од класата TableTennisPlayer за првиот играч)
// player2 (објект од класата TableTennisPlayer за вториот играч)
// pointsPlayer1 (број на поени од првиот играч, цел број)
// pointsPlayer2 (број на поени од вториот играч, цел број)
// matchDate (датум на натпреварот, низа од 10 знаци во формат dd.mm.yyyy)
//
// За класата да се обезбедат потребните конструктори, како и соодветни get,set методи
// Да се имплементира метод print() што печати инфо. во следниот формат:
// Match Date: [датум на натпреварот]
// Match Details:
// [име на првиот играч] ([држава]) - Points: [поени на првиот играч]
// [име на вториот играч] ([држава]) - Points: [поени на вториот играч]
//
// Во рамките на main функцијата да се чита цел број n (max 100), а потоа и информации за тие n натпревари.
// Читањето на еден натпревар е во следниот формат:
// datum
// ime_na_prv_igrach
// drzhava_na_prv_igrach
// poeni_na_prv_igrach
// ime_na_vtor_igrach
// drzhava_na_vtor_igrach
// poeni_na_vtor_igrach

#include <iostream>
#include <cstring>
using namespace std;

class TableTennisPlayer {
    char name[51];
    char country[51];

public:
    TableTennisPlayer(const char *name = "", const char *country = "") {
        strcpy(this->name, name);
        strcpy(this->country, country);
    }

    void print() const {
        cout << name << " (" << country << ")";
    }
};

class TableTennisMatch {
    TableTennisPlayer p1;
    TableTennisPlayer p2;
    int pts1;
    int pts2;
    char date[11];

public:
    TableTennisPlayer getPlayer1() const {
        return p1;
    }

    TableTennisPlayer getPlayer2() const {
        return p2;
    }

    TableTennisMatch(TableTennisPlayer p1 = {}, TableTennisPlayer p2 = {}, int pts1 = 0, int pts2 = 0,
                     const char *date = "") {
        this->p1 = p1;
        this->p2 = p2;
        this->pts1 = pts1;
        this->pts2 = pts2;
        strcpy(this->date, date);
    }

    void print() const {
        cout << "Match Date: " << date << endl;
        cout << "Match Details:" << endl;
        p1.print();
        cout << " - Points: " << pts1 << endl;
        p2.print();
        cout << " - Points: " << pts2 << endl;
    }
};

int main() {
    int n;
    cin >> n;
    TableTennisMatch ttm[100];
    char name1[51], name2[51], country1[51], country2[51];
    int pts1, pts2;
    char date[11];
    for (int i = 0; i < n; i++) {
        cin >> date;
        cin.ignore();
        cin.getline(name1, 51);
        cin.getline(country1, 51);
        cin >> pts1;
        cin.ignore();
        cin.getline(name2, 51);
        cin.getline(country2, 51);
        cin >> pts2;
        TableTennisPlayer p1(name1, country1);
        TableTennisPlayer p2(name2, country2);
        ttm[i] = TableTennisMatch(p1, p2, pts1, pts2, date);
        ttm[i].print();
        cout << endl;
    }
    return 0;
}

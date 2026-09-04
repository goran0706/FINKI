// Да се дефинира класа Ekipa за која се чуваат следниве информации:
//
// името на екипата (низа од најмногу 15 знаци)
// број на порази
// број на победи
// За оваа класа да се дефинира метод pecati() коjа ги печати податоците за екипата.
// Од оваа класа да се изведе нова класа, FudbalskaEkipa.
//
// За фудбалската екипа дополнително се чуваат информации за:
//
// вкупниот број на црвени картони
// вкупниот број жолти картони
// бројот на нерешени натпревари
// За фудбалската екипа да се преоптовари методот pecati(), така што покрај останатите информации,
// ќе се испечатат и бројот на нерешени резултати и вкупен број на поени во формат:
// Име на екипа, број на победи, број на порази, број на нерешени натпревари и вкупен број на поени
// (за победа фудбалската екипа добива 3 поени, додека за нерешен резултата, 1 поен);

#include "iostream"
#include "cstring"
using namespace std;
class Ekipa{
protected:
    char ime[15];
    int porazi;
    int pobedi;
public:
    Ekipa(char *name="",int pobedi=0, int porazi=0 ){
        strcpy(this->ime,name);
        this->pobedi=pobedi;
        this->porazi=porazi;
    }
    void pecati(){
        cout << "Ime: " << ime << " Pobedi: " << pobedi << " Porazi: " << porazi;
    }
};
class FudbalskaEkipa:public Ekipa{
private:
    int crveni;
    int zholti;
    int neresheni;
public:
    FudbalskaEkipa(char *name="",int pobedi=0, int porazi=0,int crveni=0,int zholti=0,int neresheni=0):Ekipa(ime,pobedi,porazi){
        crveni=0;
        zholti=0;
        neresheni=0;
    }
    void pecati(){
        Ekipa::pecati();
        cout << " Nereseni: " << neresheni << " Poeni: " << pobedi * 3 + neresheni << endl;
    }
};
int main()
{
    char ime[15];
    int pob, por, ck, zk, ner;
    cin >> ime >> pob >> por >> ck >> zk >> ner;
    FudbalskaEkipa f1(ime, pob, por, ck, zk, ner);
    f1.pecati();
    return 0;
}
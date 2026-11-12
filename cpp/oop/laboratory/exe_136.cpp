// Да се дефинира класа Book во која ќе се чуваат информации за:
//
// Насловот на книгата (тип: string, со default вредност "TEST BOOK")
// Бројот на страници кои се прочитани (тип: integer, со default вредност 0)
// За класата да се дефинираат:
//
// Конструктори (согласно кодот во main методот)
// readPages(int pages) - метод кој додава број на прочитани страници.
// Да се внимава прочитаните страници да не го надминат вкупниот број на страници за 200.
// print() - метод кој ги печати информациите за книгата во следниот формат:
// TITLE - READ_PAGES/200 - STATUS, каде што статус може да биде:
// IN PROGRESS (ако се прочитани помалку од 100 страници)
// ALMOST DONE (ако се прочитани 100 или повеќе страници, но помалку од 200)
// FINISHED (ако се прочитани сите 200 страници)

#include<iostream>
#include <cstring>
using namespace std;
class Book{
private:
    string title;
    int pages;
public:
    Book(const string &title="TEST_BOOK", int pages=0) {
        this->title=title;
        this->pages=pages;
    }
    void readPages(int stranici){
        if (pages > 200){
            return;
        }else{
            pages+=stranici;
            if (pages>200){
                pages=200;
            }
        }
    }
    void print(){
        cout<<title<<" - "<<pages<<"/200 - ";
        if (pages==200){
            cout<<"FINISHED"<<endl;
        }else if (pages<100){
            cout<<"IN PROGRESS"<<endl;
        }else if (pages < 200){
            cout<<"ALMOST DONE"<<endl;
        }
    }
};

int main() {
    string command;
    Book s;
    string name;
    int pagesRead;

    while (cin >> command) {
        if (command == "constructor1") {
            cin >> name >> pagesRead;
            s = Book(name, pagesRead);
        } else if (command == "constructor2") {
            cin >> name;
            s = Book(name);
        } else if (command == "readPages") {
            cin >> pagesRead;
            s.readPages(pagesRead);
        } else if (command == "print") {
            s.print();
        }
    }


    return 0;
}
// Да се дефинира класа SMS, во која ќе се чуваат информации за датумот на пораката (објект од класа Date), с
// одржина на пораката (низа од 150 карактери) и два телефонски броја (текстуални низи од 10 цифри за број кој испраќа и број кој прима). (10 поени)
// Класата Date треба да содржи три цели броеви за ден, месец и година. (5 поени)
//
// Да се напише main функција во која се чита цел броj N (max 500), a потоа информации за N пораки.
// Читањето на една порака е во следниот формат:
//
// dd mm yyyy број_што_праќа број_што_прима содржина. (10 поени)
//
// Потоа, треба да се прочита уште еден датум кој означува почеток на временскиот период од тој датум до денес.
//
// Пример влез:
//
// 18 03 2016 070211123 071300400 I'll call you back
// .... пораки
// 18 12 2017 070211123 071300400 hahah
// 11 11 2015
//
// На екран да се испечатат сите пораки кои се пократки од 70 карактери и се направени после внесен датум
// (не вклучувајќи ги и пораките направени на самиот тој датум).
// Да се искористи посебна функција која како аргументи прима: низа од објекти од класата SMS,
// големина на низата со пораки (цел број) и датум (објект од класата Date) кој означува почеток на временскиот период.
// Доколку не постојат пораки со бараниот услов, да се испечати соодветна порака (15 поени).
//
// Форматот на печатење да се види од тест примерите.
//
// ПОМОШ: Да се вклучи библиотеката #include за датумите да се испечатат со наредбата
// cout << setfill('0') << setw(2) << day << "/" << setfill('0') << setw(2) << month << "/" << year

#include "iostream"
#include "cstring"
#include "iomanip"
using namespace std;

class Date {
    int day, month, year;

public:
    Date(int day = 0, int month = 0, int year = 0) {
        this->day = day;
        this->month = month;
        this->year = year;
    }

    Date(const Date &d) {
        this->day = d.day;
        this->month = d.month;
        this->year = d.year;
    }

    void print() {
        cout << setfill('0') << setw(2) << day << "/" << setfill('0') << setw(2) << month << "/" << year;
    }

    bool isAfter(Date &other) {
        if (this->year > other.year) {
            return true;
        } else if (this->year < other.year) {
            return false;
        } else {
            //this->y == other.y pr 2014 == 2014
            if (this->month > other.month) {
                return true;
            } else if (this->month < other.month) {
                return false;
            } else {
                //this->y == other.y && this->m == other.m 02.2014==02.2014
                return this->day > other.day;
            }
        }
    }
};


class SMS {
    Date date;
    char content[150];
    char sender[11];
    char recevier[11];

public:
    SMS() {
    }

    SMS(Date date, char *content, char *sender, char *recevier) {
        this->date = date;
        strcpy(this->content, content);
        strcpy(this->sender, sender);
        strcpy(this->recevier, recevier);
    }

    void print() {
        date.print();
        cout << " " << sender << " " << recevier << " " << content << endl;
    }

    Date &getDate() {
        return date;
    }

    int getContentLenghts() {
        return strlen(content);;
    }

    const char *getSender() const {
        return sender;
    }

    const char *getRecevier() const {
        return recevier;
    }
};

void filterMessages(SMS messages[100], int n, Date &filter) {
    bool flag;
    int counter = 0;
    for (int i = 0; i < n; ++i) {
        if (messages[i].getContentLenghts() < 70 && messages[i].getDate().isAfter(filter)) {
            messages[i].print();
            flag = true;
            counter++;
        }
    }
    if (counter == 0) {
        cout << "No SMS satisfy the given condition.";
    }
}

int main() {
    int n;
    cin >> n;
    int day, month, year;
    char content[150];
    char sender[11];
    char recevier[11];
    SMS poraki[100];

    for (int i = 0; i < n; ++i) {
        cin >> day >> month >> year;

        cin >> sender >> recevier;
        cin.ignore();
        cin.getline(content, 150);
        Date d(day, month, year);

        poraki[i] = SMS(d, content, sender, recevier);
    }
    cin >> day >> month >> year;
    Date filter(day, month, year);
    filterMessages(poraki, n, filter);


    return 0;
}

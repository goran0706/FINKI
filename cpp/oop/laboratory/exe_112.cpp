// Треба да се имплементираат класи за универзитетски настани.
// Во рамките на почетниот код се дадени класите и основните атрибути и конструктори. Вие треба да ги довршите.
//
// Да се имплементира основната класа UniversityEvent за која ќе се чуваат:
// name (динамички алоцирана низа од карактери)
// universityHost (динамички алоцирана низа од карактери)
// date (динамички алоцирана низа од карактери)
// entryFee (int)
// За потребите на класата да се дефинираат:
//
// default конструктор и конструктор со аргументи
// copy constructor и преоптоварување на операторот за =
// виртуелен деструктор
// виртуелен метод getEntryFee() кој ја враќа цената
// метод registerEvent() кој претставува чист виртуелен метод (pure virtual method) кој ќе се имплементира понатаму во наследените класи.
// (овој метод е веќе даден во почетниот код)
// виртуелен метод print() кој печати во формат:
// Event: [name]
// Hosted by: [university_host]
// Date: [date]
// Entry Fee: [entryFee] den.
//
// Да се имплементира класата OnSiteEvent, која наследува од основната класа, за која дополнително се чуваат:
//
// participants (int)
// capacity (int)
// За потребите на класата да се дефинираат:
//
// default конструктор и конструктор со аргументи (без participants во аргументите, тој атрибут го иницијализираме на 0 по default)
// copy constructor и преоптоварување на операторот за =
// деструктор
// препокривање на методот  registerEvent() кој го зголемува бројот на учесници доколку се повика и печати:
// You have successfully registered on the OnSiteEvent , you have to pay [entryFee] den. (Доколку има слободно место)
// We are sorry, but unfortunately, the capacity is full. (Доколку нема слободно место)
// препокривање на методот print() кој покрај основните информации ќе печати и:
// Participants: [participants]
//
// Да се имплементира класата OnlineEvent, која наследува од основната класа, за која дополнително се чува:
//
// bbbLink (динамички алоцирана низа од карактери)
// За потребите на класата да се дефинираат:
// default конструктор и конструктор со аргументи
// copy constructor и преоптоварување на операторот за =
// деструктор
// препокривање на методот getEntryFee() кој че врати 50% од цената бидејќи е онлајн.
// препокривање на методот  registerEvent() кој печати:
// You have successfully registered on the OnlineEvent , you have to pay [entryFee] den.
// препокривање на методот print() кој покрај основните информации ќе печати и:
// Link: [bbbLink]

#include <iostream>
#include <cstring>
using namespace std;

class UniversityEvent {
protected:
    char *name;
    char *universityHost;
    char *date;
    int entryFee;

    void copy(const UniversityEvent &other) {
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);

        universityHost = new char[strlen(other.universityHost) + 1];
        strcpy(universityHost, other.universityHost);

        date = new char[strlen(other.date) + 1];
        strcpy(date, other.date);

        entryFee = other.entryFee;
    }

public:
    UniversityEvent() {
        name = new char[1]{'\0'};
        universityHost = new char[1]{'\0'};
        date = new char[1]{'\0'};
        entryFee = 0;
    }

    UniversityEvent(const char *name, const char *host, const char *date, int fee) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);

        this->universityHost = new char[strlen(host) + 1];
        strcpy(this->universityHost, host);

        this->date = new char[strlen(date) + 1];
        strcpy(this->date, date);

        this->entryFee = fee;
    }

    UniversityEvent(const UniversityEvent &other) {
        copy(other);
    }

    UniversityEvent &operator=(const UniversityEvent &other) {
        if (this != &other) {
            delete[] name;
            delete[] universityHost;
            delete[] date;
            copy(other);
        }
        return *this;
    }

    int getEntryFee() const {
        return entryFee;
    }

    virtual void registerEvent() = 0;

    virtual void print() const {
        cout << "Event: " << name << endl;
        cout << "Hosted by: " << universityHost << endl;
        cout << "Date: " << date << endl;
        cout << "Entry Fee: " << getEntryFee() << " den." << endl;
    }

    virtual ~UniversityEvent() {
        delete[] name;
        delete[] universityHost;
        delete[] date;
    }
};

class OnSiteEvent : public UniversityEvent {
private:
    int participants;
    int capacity;

public:
    OnSiteEvent() : UniversityEvent() {
        participants = 0;
        capacity = 0;
    }

    OnSiteEvent(const char *name, const char *host, const char *date, int fee, int capacity)
        : UniversityEvent(name, host, date, fee) {
        this->participants = 0;
        this->capacity = capacity;
    }

    OnSiteEvent(const OnSiteEvent &other) : UniversityEvent(other) {
        this->participants = other.participants;
        this->capacity = other.capacity;
    }

    OnSiteEvent &operator=(const OnSiteEvent &other) {
        if (this != &other) {
            UniversityEvent::operator=(other);
            this->participants = other.participants;
            this->capacity = other.capacity;
        }
        return *this;
    }

    void registerEvent() override {
        if (participants < capacity) {
            participants++;
            cout << "You have successfully registered on the OnSiteEvent, you have to pay "
                    << getEntryFee() << " den." << endl;
        } else {
            cout << "We are sorry, but unfortunately, the capacity is full." << endl;
        }
    }

    void print() const override {
        UniversityEvent::print();
        cout << "Participants: " << participants << endl;
    }

    int getEntryFee() const {
        return entryFee;
    }
};

class OnlineEvent : public UniversityEvent {
private:
    char *bbbLink;

    void copyLink(const char *link) {
        bbbLink = new char[strlen(link) + 1];
        strcpy(bbbLink, link);
    }

public:
    OnlineEvent() : UniversityEvent() {
        bbbLink = new char[1]{'\0'};
    }

    OnlineEvent(const char *name, const char *host, const char *date, int fee, const char *link)
        : UniversityEvent(name, host, date, fee) {
        copyLink(link);
    }

    OnlineEvent(const OnlineEvent &other) : UniversityEvent(other) {
        copyLink(other.bbbLink);
    }

    OnlineEvent &operator=(const OnlineEvent &other) {
        if (this != &other) {
            UniversityEvent::operator=(other);
            delete[] bbbLink;
            copyLink(other.bbbLink);
        }
        return *this;
    }

    void registerEvent() override {
        cout << "You have successfully registered on the OnlineEvent, you have to pay "
                << getEntryFee() << " den." << endl;
    }

    int getEntryFee() const {
        return entryFee / 2;
    }

    void print() const override {
        UniversityEvent::print();
        cout << "Link: " << bbbLink << endl;
    }

    ~OnlineEvent() override {
        delete[] bbbLink;
    }
};

// DO NOT CHANGE THE MAIN FUNCTION
int main() {
    int n;
    cin >> n;

    UniversityEvent **events = new UniversityEvent *[n];

    char name[100];
    char universityHost[100];
    char date[100];
    int entryFee;

    for (int i = 0; i < n; i++) {
        cin >> name;
        cin >> universityHost;
        cin >> date;
        cin >> entryFee;

        if (i % 2 == 0) {
            int capacity;
            cin >> capacity;
            events[i] = new OnSiteEvent(name, universityHost, date, entryFee, capacity);
        } else {
            char bbbLink[200];
            cin >> bbbLink;
            events[i] = new OnlineEvent(name, universityHost, date, entryFee, bbbLink);
        }
    }

    for (int i = 0; i < n; i++) {
        events[i]->print();
        events[i]->registerEvent();
        cout << "-------------------------\n";
    }

    // Test OnSiteEvent.registerEvent() edge cases using first event dynamically
    cout << "\n--- Dynamic OnSiteEvent Capacity Test ---\n";
    OnSiteEvent *testEvent = dynamic_cast<OnSiteEvent *>(events[0]);
    for (int i = 0; i < 10; ++i) {
        testEvent->registerEvent();
    }

    cout << "\n--- OnSiteEvent print() after dynamic test ---\n";
    testEvent->print();

    // Test operator=
    cout << "\n--- OnSiteEvent Operator= Test (dynamic) ---\n";
    OnSiteEvent assignedEvent;
    assignedEvent = *testEvent;
    assignedEvent.print();

    // Cleanup
    for (int i = 0; i < n; i++) delete events[i];
    delete[] events;

    return 0;
}

#include <iostream>
#include <cstring>
#include <stdexcept>
using namespace std;

class except : exception {
private:
    char message[100];

public:
    except(const char *message = "") {
        strcpy(this->message, message);
    }

    void print() {
        cout << message << endl;
    }
};

class DonationAction {
private:
    char *name;
    char *id;
    int collected;
    int needed;

public:
    DonationAction(const char *name = "", const char *id = "", const int needed = 0) {
        if (moreDigits(id) && notDigits(id)) {
            throw except("The id number has more than 9 characters");
        }
        if (moreDigits(id)) {
            throw except("The id number has more than 9 characters");
        }
        if (notDigits(id)) {
            throw except("The id number has a non-digit character");
        }
        this->name = new char [strlen(name) + 1];
        this->id = new char [strlen(id) + 1];
        strcpy(this->name, name);
        strcpy(this->id, id);
        this->needed = needed;
        this->collected = 0;
    }

    DonationAction(const DonationAction &d) {
        this->name = new char [strlen(d.name) + 1];
        this->id = new char [strlen(d.id) + 1];
        strcpy(this->name, d.name);
        strcpy(this->id, d.id);
        this->needed = d.needed;
        this->collected = d.collected;
    }

    DonationAction &operator=(const DonationAction &d) {
        if (this != &d) {
            delete [] this->name;
            delete [] this->id;
            this->name = new char [strlen(d.name) + 1];
            this->id = new char [strlen(d.id) + 1];
            strcpy(this->name, d.name);
            strcpy(this->id, d.id);
            this->needed = d.needed;
            this->collected = d.collected;
        }
        return *this;
    }

    ~DonationAction() {
        delete [] this->name;
        delete [] this->id;
    }

    friend ostream &operator<<(ostream &os, const DonationAction &d) {
        if (d.collected >= d.needed) {
            os << d.id << " " << d.name << " collected" << endl;
        } else {
            int remaining = d.needed - d.collected;
            os << d.id << " " << d.name << " " << remaining << " more denars are needed" << endl;
        }
        return os;
    }

    DonationAction &operator+=(const int sum) {
        collected += sum;
        return *this;
    }

    bool operator<(const DonationAction &d) {
        int diff1 = needed - collected;
        int diff2 = d.needed - d.collected;
        if (diff1 != diff2) {
            return diff1 < diff2;
        }
        return strcmp(this->id, d.id) < 0;
    }

    bool notDigits(const char *id) {
        for (int i = 0; i < strlen(id); i++) {
            if (!isdigit(id[i])) {
                return true;
            }
        }
        return false;
    }

    bool moreDigits(const char *id) {
        if (strlen(id) > 9) {
            return true;
        }
        return false;
    }

    char *getId() const {
        return id;
    }

    void takeDonation(int sum) {
        collected += sum;
    }
};

class DonationSociety {
private:
    char name[30];
    DonationAction *array;
    int number;

public:
    DonationSociety(const char *name = "") {
        strcpy(this->name, name);
        array = nullptr;
        number = 0;
    }

    DonationSociety(const DonationSociety &d) {
        strcpy(this->name, d.name);
        this->number = d.number;
        array = new DonationAction [number];
        for (int i = 0; i < number; i++) {
            array[i] = d.array[i];
        }
    }

    DonationSociety &operator=(const DonationSociety &d) {
        if (this != &d) {
            delete [] array;
            strcpy(this->name, d.name);
            this->number = d.number;
            array = new DonationAction [number];
            for (int i = 0; i < number; i++) {
                array[i] = d.array[i];
            }
        }
        return *this;
    }

    ~DonationSociety() {
        delete [] array;
    }

    bool takeDonation(char id[], int donatedFund) {
        for (int i = 0; i < number; i++) {
            if (strcmp(array[i].getId(), id) == 0) {
                array[i].takeDonation(donatedFund);
                return true;
            }
        }
        return false;
    }

    DonationSociety &operator+=(const DonationAction &d) {
        for (int i = 0; i < number; i++) {
            if (strcmp(array[i].getId(), d.getId()) == 0) {
                return *this;
            }
        }
        DonationAction *temp = new DonationAction [number + 1];
        for (int i = 0; i < number; i++) {
            temp[i] = array[i];
        }
        delete [] array;
        temp[number] = d;
        array = temp;
        number++;
        return *this;
    }

    friend ostream &operator<<(ostream &os, const DonationSociety &d) {
        for (int i = 0; i < d.number - 1; i++) {
            for (int j = i + 1; j < d.number; j++) {
                if (d.array[i] < d.array[j]) {
                    swap(d.array[i], d.array[j]);
                }
            }
        }
        for (int i = 0; i < d.number; i++) {
            os << d.array[i];
        }
        cout << "President:" << d.name << endl;
        return os;
    }
};

int main() {
    DonationSociety donacii("Velko Velkovski");
    int n;
    char naziv[50], id[50];
    int potrebnasuma, doniranasuma;
    cin >> n;

    for (int i = 0; i < n; i++) {
        cin.get();
        cin.getline(naziv, 50);
        cin >> id >> potrebnasuma;
        try {
            DonationAction edna(naziv, id, potrebnasuma);
            donacii += edna;
        } catch (except &e) {
            e.print();
        }
    }

    //donation
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> id >> doniranasuma;

        if (!donacii.takeDonation(id, doniranasuma))
            cout << "The donation is not taken. Wrong ID." << endl;
    }
    cout << "===============" << endl;
    cout << donacii;
}

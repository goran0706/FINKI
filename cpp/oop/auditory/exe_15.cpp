/*
    1.3 Студенти (static)

    Да се напише класа Student која треба да чува информации за:

    - името на студентот,
    - број на индекс и
    - просек.

    Да се дефинираат статички членови кои ќе даваат информации за бројот на студенти и вкупниот просек.

    Да се имплементираат статички функции кои ќе го враќаат вкупниот просек и бројот на студенти.

    Секогаш кога ќе се креира објект, статичките членови треба да се ажурираат.

    Во главната програма да се внесат информации за n студенти, да се испечати список со сите студенти и вредностите од статичките членови.

    Дополнително барање: Да се обезбеди секвенцијално генереирање на id на студентот, кога тој се креира.
    Првиот студент има id 230001, потоа 230002,230003…
*/
#include <cstring>
#include <iostream>
using namespace std;

enum {
    NameLen = 50,
    IdLen = 10,
};

class Student {
private:
    char name[NameLen]{};
    char id[IdLen]{};
    float GPA;

    static int totalStudents;
    static float totalGPA;
    static int nextId;

    static void updateStats(float gpaValue) {
        totalStudents++;
        totalGPA += gpaValue;
    }

    void generateId() {
        int temp = nextId++;
        int index = IdLen - 1;
        id[index] = '\0';

        while (temp > 0) {
            id[--index] = (char) ((temp % 10) + '0');
            temp /= 10;
        }

        int i = 0;
        while (id[index] != '\0') {
            id[i++] = id[index];
            index++;
        }
        id[i] = '\0';
    }

public:
    Student() {
        name[0] = '\0';
        id[0] = '\0';
        GPA = 0.0;
    }

    Student(const char *name, const float GPA) {
        strncpy(this->name, name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        this->GPA = GPA;

        generateId();
        updateStats(GPA);
    }

    Student(const Student &other) {
        strncpy(this->name, other.name, NameLen - 1);
        this->name[NameLen - 1] = '\0';
        strncpy(this->id, other.id, IdLen - 1);
        this->id[IdLen - 1] = '\0';
        this->GPA = other.GPA;

        updateStats(other.GPA);
    }

    ~Student() = default;

    static int getTotalStudents() {
        return totalStudents;
    }

    static float getAverageGPA() {
        if (totalStudents == 0) return 0.0;
        return totalGPA / (float) totalStudents;
    }

    void print() const {
        cout << id << " " << name << " " << GPA << endl;
    }
};

int Student::totalStudents = 0;
float Student::totalGPA = 0.0;
int Student::nextId = 230001;

int main() {
    int n;
    cin >> n;

    Student *students = new Student[n];

    for (int i = 0; i < n; i++) {
        char name[NameLen];
        float gpa;
        cin >> name >> gpa;

        students[i] = Student(name, gpa);
    }

    for (int i = 0; i < n; i++) {
        students[i].print();
    }

    cout << Student::getTotalStudents() << endl;
    cout << Student::getAverageGPA() << endl;

    delete [] students;
}

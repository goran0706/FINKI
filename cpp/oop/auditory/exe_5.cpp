/*
    1.4 Студенти

    Од стандарден влез се читаат податоци за непознат број студенти (не повеќе од 100).

    Податоците се внесуваат така што во секој ред се состои од:

    - името
    - презимето
    - бројот на индекс (формат xxyzzzz)
    - четири броја (поени од секоја задача)

    со произволен број празни места или табулатори меѓу нив.

    Да се напише програма која ќе испечати список на студенти, каде во секој ред ќе има:

    - презиме,
    - име,
    - број на индекс,
    - вкупен број на бодови сортиран според бројот на бодови.

    При тоа имињата и презимињата да се напишат со голема почетна буква.
*/
#include <iostream>
using namespace std;

struct Student {
    char firstName[50];
    char lastName[50];
    int number;
    int totalPoints;

    void print_student() const {
        cout << lastName << " " << firstName << " " << number << " " << totalPoints << endl;
    }
};

void capital_case(char str[]) {
    if (str[0] != '\0') {
        str[0] = toupper(str[0]);
    }
}

void sort_students(Student students[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (students[j].totalPoints > students[j + 1].totalPoints) {
                Student temp = students[j];
                students[j] = students[j + 1];
                students[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}

void readStudent(Student &s) {
    cin >> s.firstName;
    cin >> s.lastName;
    cin >> s.number;
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    s.totalPoints = a + b + c + d;
}

int main() {
    int n;
    cin >> n;
    Student students[100];

    for (int i = 0; i < n; i++) {
        readStudent(students[i]);
    }

    sort_students(students, n);

    cout << "\n--- Списокот на студенти ---" << endl;
    for (int i = 0; i < n; i++) {
        students[i].print_student();
    }
}

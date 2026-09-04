#include <iostream>
#include <cstring>

using namespace std;

//YOUR CODE HERE!
class Student {
private:
    char ime[51];
    char prezime[51];
    char fakultet[51];
    float prosek;
    static int vkupnoAplicirale;
    static int finkashiAplicirale;
    friend class Scholarship;

public:
    Student() {
    }

    Student(char *ime, char *prezime, char *fakultet, float prosek) {
        strcpy(this->ime, ime);
        strcpy(this->prezime, prezime);
        strcpy(this->fakultet, fakultet);
        this->prosek = prosek;
        //        vkupnoAplicirale++;
    }

    bool finkiStudent() {
        if (strcmp(fakultet, "FINKI") == 0 && prosek > 9) {
            return true;
        }
        return false;
    }

    float getProsek() const {
        return prosek;
    }

    void print() {
        cout << ime << " " << prezime << " " << fakultet << " " << prosek << endl;
    }

    static int getVkupnoAplicirale() {
        return vkupnoAplicirale;
    }

    static int getFinkashiAplicirale() {
        return finkashiAplicirale;
    }
};

int Student::finkashiAplicirale = 0;
int Student::vkupnoAplicirale = 0;

class Scholarship {
private:
    char imeKompanija[51];
    Student studenti[100];
    static float srednaVrednost;
    friend class Student;

    friend void studentsWithScholarship(Scholarship &scholarship, int num_students);

public:
    Scholarship(char *imeKompanija = "") {
        strcpy(this->imeKompanija, imeKompanija);
    }

    void addStudent(Student student) {
        int broj = Student::vkupnoAplicirale;
        studenti[broj] = student;
        if (student.finkiStudent()) {
            Student::finkashiAplicirale++;
            srednaVrednost = srednaVrednost + student.getProsek();
        }
        Student::vkupnoAplicirale++;
    }

    //    Scholarship name: ITCompany, total applicants: 1
    void print() {
        cout << "Scholarship name: " << imeKompanija << ", total applicants: " << Student::vkupnoAplicirale << endl;
    }
};

void studentsWithScholarship(Scholarship &scholarship, int num_students) {
    for (int i = 0; i < num_students; ++i) {
        for (int j = 0; j < num_students - i - 1; ++j) {
            if (scholarship.studenti[j].getProsek() < scholarship.studenti[j + 1].getProsek()) {
                Student tmp = scholarship.studenti[j];
                scholarship.studenti[j] = scholarship.studenti[j + 1];
                scholarship.studenti[j + 1] = tmp;
            }
        }
    }
    cout << "FINKI students with a scholarship" << endl;
    int counter = 0;
    for (int i = 0; i < num_students; ++i) {
        if (scholarship.studenti[i].finkiStudent() && counter < 3) {
            scholarship.studenti[i].print();
            counter++;
        }
    }
    cout << "Scholarship data shows that " << Student::getFinkashiAplicirale() / (Student::getVkupnoAplicirale() * 1.0)
            * 100
            << "% of applicants are from FINKI, with an average grade of "
            << Scholarship::srednaVrednost / (Student::getFinkashiAplicirale() * 1.0);
    //    Scholarship data shows that 60% of applicants are from FINKI, with an average grade of 9.68333
}

float Scholarship::srednaVrednost = 0;
//DO NOT CHANGE THE MAIN FUNCTION!
int main() {
    char name[50], surname[50], faculty[50], scholarship_name[50];
    float average_grade;
    int n, case_;
    cin >> case_;
    if (case_ == 0)
    //Testing Student constructor
    {
        cout << "--Testing finkiStudent method--" << endl;
        Student s("Ana", "Denkova", "BAS", 9.89);
        cout << s.finkiStudent();
    } else if (case_ == 1) {
        //Testing addStudent and print method
        cout << "--Testing addStudent and print method--" << endl;
        Scholarship sc("ITCompany");
        Student s("Ana", "Denkova", "BAS", 9.89);
        sc.addStudent(s);
        sc.print();
    } else if (case_ == 2) {
        cin >> scholarship_name;
        Scholarship sc(scholarship_name);
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> name >> surname >> faculty >> average_grade;
            Student s = Student(name, surname, faculty, average_grade);
            sc.addStudent(s);
        }
        sc.print();
        studentsWithScholarship(sc, n);
    }
    return 0;
}

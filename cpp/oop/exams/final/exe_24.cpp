#include <iostream>
#include <fstream>

using namespace std;

class StudentFailedException {
private:
    string id;

public:
    StudentFailedException(string id) {
        this->id = id;
    }

    void message() {
        cout << "Student with id " << id << " failed the course" << endl;
    }
};

class Student {
private:
    string index, name, surname;
    int points;

public:
    Student(string index = "", string name = "", string surname = "", int points = 0) {
        this->index = index;
        this->name = name;
        this->surname = surname;
        this->points = points;
    }

    int grade() {
        if (points >= 90 && points <= 100) {
            return 10;
        } else if (points >= 80 && points <= 89) {
            return 9;
        } else if (points >= 70 && points <= 79) {
            return 8;
        } else if (points >= 60 && points <= 69) {
            return 7;
        } else if (points >= 50 && points <= 59) {
            return 6;
        } else {
            return 5;
        }
    }

    friend ostream &operator<<(ostream &out, Student &s) {
        out << s.index << " " << s.name << " " << s.surname << " " << s.points << " Grade: " << s.grade() << endl;
        return out;
    }

    friend ifstream &operator>>(ifstream &in, Student &s) {
        in >> s.index >> s.name >> s.surname >> s.points;
        return in;
    }

    int getPoints() {
        return points;
    }

    string getIndex() {
        return index;
    }
};

class Results {
private:
    Student *students;
    int n;

public:
    Results() {
        students = nullptr;
        n = 0;
    }

    Results(Student *students, int n) {
        this->n = n;
        this->students = new Student[n];
        for (int i = 0; i < n; ++i) {
            this->students[i] = students[i];
        }
    }

    Results(const Results &r) {
        this->n = r.n;
        this->students = new Student[r.n];
        for (int i = 0; i < r.n; ++i) {
            this->students[i] = r.students[i];
        }
    }

    Results &operator=(const Results &r) {
        if (this != &r) {
            delete[]students;
            this->n = r.n;
            this->students = new Student[r.n];
            for (int i = 0; i < r.n; ++i) {
                this->students[i] = r.students[i];
            }
        }
        return *this;
    }

    ~Results() {
        delete[]students;
    }

    Results &operator+=(Student &s) {
        if (s.getPoints() < 50) {
            throw StudentFailedException(s.getIndex());
        }

        Student *tmp = new Student[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = students[i];
        }
        tmp[n++] = s;
        delete[]students;
        students = tmp;
        return *this;
    }

    Results withGrade(int grade) {
        Results r;
        for (int i = 0; i < n; ++i) {
            if (students[i].grade() == grade) {
                r += students[i];
            }
        }
        return r;
    }

    friend ofstream &operator<<(ofstream &out, const Results &r) {
        if (r.students == 0) {
            out << "None" << endl;
        } else {
            for (int i = 0; i < r.n; ++i) {
                out << r.students[i];
            }
        }
        return out;
    }
};

void wtf() {
    ofstream fout("input.txt");
    string line;
    while (getline(std::cin, line)) {
        if (line == "----") {
            break;
        }
        fout << line << endl;
    }
}

void rff(string path) {
    ifstream fin(path);
    string line;
    while (getline(fin, line)) {
        cout << line << endl;
    }
}


int main() {
    wtf();

    Results results;
    //TODO your code here
    //TODO Read the students from the file and add them in `results`
    ifstream fin("input.txt");
    ofstream fout("output1.txt");
    ofstream fout2("output2.txt");
    Student s;
    while (fin >> s) {
        try {
            results += s;
        } catch (StudentFailedException &e) {
            e.message();
        }
    }
    fin.close();
    fout << results;
    fout.close();
    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
    int grade;
    cin >> grade;
    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files output1.txt and output2.txt after this line
    fout2 << results.withGrade(grade);
    fout2.close();


    //DO NOT MODIFY THE CODE BELLOW

    cout << "All students:" << endl;
    rff("output1.txt");
    cout << "Grade report for grade " << grade << ": " << endl;
    rff("output2.txt");


    return 0;
}

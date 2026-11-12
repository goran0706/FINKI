#include <iostream>
#include <cstring>
#include <fstream>
#include <vector>


using namespace std;

class StudentFailedException : exception {
private:
    string id;

public:
    StudentFailedException(const string &id = "") {
        this->id = id;
    }

    //Student with id {ID} failed the course
    void print() {
        cout << "Student with id " << id << " failed the course" << endl;
    }
};

class Student {
protected:
    string id;
    string name;
    string surname;
    int pts;

public:
    Student(const string &id = "", const string &name = "", const string &surname = "", const int pts = 0) {
        this->id = id;
        this->name = name;
        this->surname = surname;
        this->pts = pts;
    }

    Student(const Student &student) {
        this->id = student.id;
        this->name = student.name;
        this->surname = student.surname;
        this->pts = student.pts;
    }

    Student &operator=(const Student &student) {
        if (this != &student) {
            this->id = student.id;
            this->name = student.name;
            this->surname = student.surname;
            this->pts = student.pts;
        }
        return *this;
    }

    ~Student() {
    }

    //151020 Stefan Andonov 89 Grade: 9
    friend ostream &operator<<(ostream &os, const Student &student) {
        os << student.id << " " << student.name << " " << student.surname << " " << student.pts << " Grade: " << student
                .grade() << endl;
        return os;
    }

    //0-49 (5), 50-59 (6), 60-69 (7), 70-79 (8), 80-89 (9), 90-100 (10))
    int grade() const {
        if (pts <= 49) {
            return 5;
        }
        if (pts <= 59) {
            return 6;
        }
        if (pts <= 69) {
            return 7;
        }
        if (pts <= 79) {
            return 8;
        }
        if (pts <= 89) {
            return 9;
        }
        if (pts <= 100) {
            return 10;
        } else {
            return -1;
        }
    }

    string get_id() const {
        return id;
    }
};

class Results {
private:
    Student *array;
    int n;

public:
    Results(const Student *array = nullptr, const int n = 0) {
        this->n = n;
        this->array = new Student[n];
        for (int i = 0; i < n; i++) {
            if (array) {
                this->array[i] = array[i];
            } else {
                this->array[i] = Student();
            }
        }
    }

    Results(const vector<Student> &students) {
        n = students.size();
        array = new Student[n];
        for (int i = 0; i < n; ++i) {
            array[i] = students[i];
        }
    }

    Results(const Results &student) {
        this->n = student.n;
        this->array = new Student[student.n];
        for (int i = 0; i < student.n; i++) {
            this->array[i] = student.array[i];
        }
    }

    Results &operator=(const Results &student) {
        if (this != &student) {
            delete [] this->array;
            this->n = student.n;
            this->array = new Student[student.n];
            for (int i = 0; i < student.n; i++) {
                this->array[i] = student.array[i];
            }
        }
        return *this;
    }

    ~Results() {
        delete [] this->array;
    }

    int getN() {
        return this->n;
    }

    Results &operator +=(const Student &student) {
        if (student.grade() == 5) {
            throw StudentFailedException(student.get_id());
        }
        Student *temp = new Student [n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = this->array[i];
        }
        temp[n] = student;
        delete [] this->array;
        this->array = temp;
        n++;
        return *this;
    }

    friend ostream &operator<<(ostream &os, const Results &student) {
        for (int i = 0; i < student.n; i++) {
            os << student.array[i];
        }
        return os;
    }

    //solved without using vectors
    // Results withGrade(int grade) {
    //     int counter = 0;
    //     Student *temp = new Student [n];
    //     for (int i = 0; i < n; i++) {
    //         if (this->array[i].grade() == grade) {
    //             temp[counter++] = this->array[i];
    //         }
    //     }
    //     if (counter == 0) {
    //         delete [] temp;
    //     }
    //     return {temp,counter};
    // }
    //solved with using vectors, but we need an extra constructor so we can return vector otherwise we would need to copy the vector
    //to array of students and then return the array of students like in the method without vectors
    Results withGrade(int grade) {
        vector<Student> students;
        for (int i = 0; i < n; i++) {
            if (this->array[i].grade() == grade) {
                students.push_back(this->array[i]);
            }
        }
        return {students};
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

    if (!fin.is_open()) {
        return 0;
    }
    string id;
    while (fin >> id) {
        if (id == "----") {
            break;
        }
        string name;
        string surname;
        int pts;
        fin >> name;
        fin >> surname;
        fin >> pts;
        Student student = Student(id, name, surname, pts);
        try {
            results += student;
        } catch (StudentFailedException &e) {
            e.print();
        }
    }

    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
    int grade;
    cin >> grade;
    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files output1.txt and output2.txt after this line

    ofstream fout("output1.txt");
    fout << results;

    ofstream fout2("output2.txt");
    Results temp;
    temp = results.withGrade(grade);
    if (temp.getN() == 0) {
        fout2 << "None" << endl;
    } else {
        fout2 << temp;
    }

    //DO NOT MODIFY THE CODE BELLOW

    cout << "All students:" << endl;
    rff("output1.txt");
    cout << "Grade report for grade " << grade << ": " << endl;
    rff("output2.txt");


    return 0;
}

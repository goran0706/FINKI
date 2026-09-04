#include <iostream>
#include <cstring>

using namespace std;

class Student {
private:
    char* name;
    int age;
    char* major;

public:
    Student(){}
    Student(const char* name, int age, const char* major) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        this->age = age;
        this->major = new char[strlen(major) + 1];
        strcpy(this->major, major);
    }
    Student(const Student& other) {
        name = new char[strlen(other.name) + 1];
        strcpy(name, other.name);
        age = other.age;
        major = new char[strlen(other.major) + 1];
        strcpy(major, other.major);
    }
    ~Student() {}
    void print() {
        cout<<name<<" "<<"("<<age<<", "<<major<<")"<<endl;

    }
    char* getName() {
        return name;
    }
    int getAge() {
        return age;
    }

};


class Classroom {
private:
    Student* students;
    int n;
    int capacity;

public:
    Classroom() {
        students = nullptr;
        n = 0;
        capacity = 0;
    }

    Classroom(const Classroom &s) {
        n = s.n;
        capacity = s.capacity;
        students = new Student[capacity];
        for (int i = 0; i < n; i++) {
            students[i] = s.students[i];
        }
    }


    void add(const Student& student) {
        if (n == capacity) {
            int newCapacity = capacity + 5;
            Student* temp = new Student[newCapacity];
            for (int i = 0; i < n; i++) {
                temp[i] = students[i];
            }
            delete[] students;
            students = temp;
            capacity = newCapacity;
        }

        students[n] = student;
        n++;
    }
    void remove(const char* name) {
        int ind = -1;
        for (int i = 0; i < n; i++) {
            if (strcmp(students[i].getName(), name) == 0) {
                ind = i;
                break;
            }
        }
        if (ind != -1) {
            for (int i = ind; i < n - 1; i++) {
                students[i] = students[i+1];
            }
            n--;
        }
    }
    void printStudents() {
        for (int i = 0; i < n; i++) {
            students[i].print();
        }
        cout<<endl;
    }

    Student *getS() const{
        return students;
    }

    int getN() const{
        return n;
    }
};
double findMedianAge(const Classroom &c) {
    Student  *students = c.getS();
    int N = c.getN();
    double medijana = 0.0;
    if (N > 0) {
        for (int i = 0; i < N-1; i++) {
            for (int j = i+1; j < N; j++) {
                if (students[i].getAge() > students[j].getAge()) {
                    Student temp = students[i];
                    students[i] = students[j];
                    students[j] = temp;
                }
            }
        }

        if (N % 2 == 0) {
            medijana = (students[N/2-1].getAge() + students[N/2].getAge()) / 2.0;
        } else {
            medijana = students[N/2].getAge();
        }
    }
    return medijana;
}

int main() {
    int numClassrooms, numStudents;
    cin >> numClassrooms;
    Classroom classrooms[100];
    Student students[100];

    // Testing add method
    for (int i = 0; i < numClassrooms; i++) {
        cin >> numStudents;
        for (int j = 0; j < numStudents; j++) {
            char name[100], major[100];
            int age;
            cin >> name >> age >> major;
            Student student(name, age, major);
            classrooms[i].add(student);
            students[i*numStudents + j] = student;
        }
        cout<<"Classroom "<<i<<endl;
        classrooms[i].printStudents();
    }


    // Testing findMedianAge method
    int targetClassroom;
    cin >> targetClassroom;
    double medianAge = findMedianAge(classrooms[targetClassroom]);
    cout << "The median age in classroom " << targetClassroom << " is: " << medianAge << endl;
    cout<<"After removing the elements:"<<endl; /// Added
    // Testing remove method
    cin >> numStudents;
    for (int j = 0; j < numStudents; j++) {
        char name[100];
        cin >> name;
        for (int i = 0; i < numClassrooms; i++) {
            classrooms[i].remove(name);
        }
    }
    for (int i = 0; i < numClassrooms; i++) {
        cout<<"Classroom "<<i<<endl;
        classrooms[i].printStudents();
    }

    return 0;
}
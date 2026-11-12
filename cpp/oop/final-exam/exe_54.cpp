#include <iostream>
using namespace std;

class Course {
protected:
    string code;
    int credits;

public:
    Course(const string code = "CS101", int credits = 6) {
        this->code = code;
        this->credits = credits;
    }

    Course(const Course &course) {
        this->code = course.code;
        this->credits = course.credits;
    }

    Course &operator=(const Course &course) {
        if (this != &course) {
            this->code = course.code;
            this->credits = course.credits;
        }
        return *this;
    }

    ~Course() {
    }
};

class OnlineCourse : public Course {
private:
    int bonus;

public:
    OnlineCourse(const string code = "CS101", int credits = 6, int bonus = 1) : Course(code, credits) {
        if (bonus > 0 && bonus < 3) {
            this->bonus = bonus;
        } else {
            this->bonus = 1;
        }
    }

    OnlineCourse(const OnlineCourse &course) {
        this->code = course.code;
        this->credits = course.credits;
        this->bonus = course.bonus;
    }

    OnlineCourse &operator=(const OnlineCourse &course) {
        if (this != &course) {
            this->code = course.code;
            this->credits = course.credits;
            this->bonus = course.bonus;
        }
        return *this;
    }

    ~OnlineCourse() {
    }

    int calculateMaxCourseCredits() {
        return credits + bonus;
    }

    void display() {
        cout << code << " " << credits << " " << bonus << endl;
    }
};


OnlineCourse *createOnlineCourses(int n) {
    OnlineCourse *onlineCourses = new OnlineCourse[n];
    string code;
    int credits, bonusCredits;
    for (int i = 0; i < n; i++) {
        cin >> code >> credits >> bonusCredits;
        onlineCourses[i] = OnlineCourse(code, credits, bonusCredits);
    }
    return onlineCourses;
}

int main() {
    int testCase;
    cin >> testCase;

    switch (testCase) {
        case 1: {
            OnlineCourse onlineCourse;
            onlineCourse.display();
            break;
        }
        case 2: {
            OnlineCourse onlineCourse("CS101", 6, 1);
            onlineCourse.display();
            OnlineCourse onlineCourse1("CS102", 4, 2);
            onlineCourse1.display();
            break;
        }
        case 3: {
            OnlineCourse onlineCourse("CS101", 5, 5);
            onlineCourse.display();
            OnlineCourse onlineCourse1("CS102", 6, 0);
            onlineCourse1.display();
            break;
        }
        case 4: {
            OnlineCourse onlineCourse("CS101", 7, 2);
            cout << onlineCourse.calculateMaxCourseCredits();
            break;
        }
        case 5: {
            int n;
            cin >> n;
            OnlineCourse *onlineCourses = createOnlineCourses(n);
            for (int i = 0; i < n; i++) {
                onlineCourses[i].display();
            }
            delete [] onlineCourses;
            break;
        }
        default: {
            int n;
            cin >> n;

            OnlineCourse *onlineCourses = createOnlineCourses(n);
            for (int i = 0; i < n; i++) {
                onlineCourses[i].display();
            }
            for (int i = 0; i < n; i++) {
                cout << onlineCourses[i].calculateMaxCourseCredits() << endl;
            }
            delete [] onlineCourses;
            break;
        }
    }
    return 0;
}

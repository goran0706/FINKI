#include <cstring>
/*
    2. Квиз

    Да се дефинира апстрактна класа QuizAttempt со две чисто виртуелни функции:

    - double score()
    - void print()

    Во класата QuizAttempt да се чува информација за бројот на индексот на студентот (низа од 6 знаци).

    Од класата Quiz да се изведат две класи:

    - MCQuizAttempt (за претставување на обид на студент на квиз во кој има само прашања со избор на еден од повеќе понудени одговори) и
    - TFQuizAttempt (за претставување на обид на студент на квиз во кој има само прашања за потврдување на вистинитост на некој изказ - точно/неточно).

    Во класата MCQuizAttempt дополнително да се чуваат две низи од точно 10 знаци кои се однесуваат на:

    - Точните одговори на 10-те прашања во квизот
    - Одговорите кои студентот ги дал на 10-те прашања.

    Во класата TFQuizAttempt дополнително да се чуваат две низи од точно 10 bool променливи кои се однесуваат на:

    - Точната вистинитост на 10-те T/F прашања во квизот
    - Одговорите кои студентот ги дал на 10-те прашања.

    За класите да се имплементираат потребните конструктори.

    Да се имплементира методот score() во двете класи на следниот начин:

    - Во класата MCQuizAttempt, студентот добива по 1 поен за секој точен одговор, а по -0.25 за секој неточен одговор
    - Во класата TFQuizAttempt, студентот добива по 1 поен за секој точен одговор, а по -0.5 за секој неточен одговор.

    - Да се имплементира методот print() во двете класи, согласно форматот даден во првите 2 тест примери.
    - Да се имплементира оператор >= за споредба на два обиди на квизови (од кој било тип) според бројот на освоените поени.
    - Да се имплементира глобална функција double averagePointsOfPassedStudents (QuizAttempt ** attempts, int n) која
    како резултат ќе го врати просечниот број на освоени поени од обидите на квизот кои се сметаат за положени (имаат најмалку 5.0 поени од вкупно 10.0).
*/
#include <iostream>
#include <cstring>

using namespace std;

// ==========================================
// 1. ABSTRACT BASE CLASS
// ==========================================
class QuizAttempt {
protected:
    char studentID[7]; // 6 characters + 1 for null terminator '\0'

public:
    QuizAttempt(const char *id) {
        strcpy(this->studentID, id);
    }

    // Virtual destructor guarantees that deleting a QuizAttempt*
    // correctly calls the derived class (~MCQuizAttempt / ~TFQuizAttempt) destructors first.
    virtual ~QuizAttempt() = default;

    // Pure virtual functions make this class abstract.
    // Derived classes are forced to implement their specific versions.
    virtual void print() = 0;

    virtual double score() = 0;

    // References are used here (&attempt) because we are comparing existing objects.
    // Polymorphism works with references, preventing object slicing.
    bool operator>=(QuizAttempt &attempt) {
        return this->score() >= attempt.score();
    }
};

// ==========================================
// 2. DERIVED CLASSES
// ==========================================
class MCQuizAttempt : public QuizAttempt {
private:
    char correctAnswers[11]; // 10 answers + '\0'
    char studentAnswers[11]; // 10 answers + '\0'

public:
    MCQuizAttempt(const char *id, const char *correct, const char *answers) : QuizAttempt(id) {
        strcpy(this->correctAnswers, correct);
        strcpy(this->studentAnswers, answers);
    }

    void print() override {
        for (int i = 0; i < 10; i++) {
            cout << i + 1 << ". Correct: " << correctAnswers[i]
                    << " Answer: " << studentAnswers[i]
                    << " Points: " << (correctAnswers[i] == studentAnswers[i] ? 1.0 : -0.25) << endl;
        }
        cout << "Total score: " << score() << endl;
    }

    double score() override {
        double total = 0;
        for (int i = 0; i < 10; i++) {
            if (correctAnswers[i] == studentAnswers[i]) {
                total += 1.0;
            } else {
                total -= 0.25;
            }
        }
        return total;
    }
};

class TFQuizAttempt : public QuizAttempt {
private:
    bool correctAnswers[10];
    bool studentAnswers[10];

public:
    TFQuizAttempt(const char *id, const bool *correct, const bool *answers) : QuizAttempt(id) {
        for (int i = 0; i < 10; i++) {
            this->correctAnswers[i] = correct[i];
            this->studentAnswers[i] = answers[i];
        }
    }

    void print() override {
        for (int i = 0; i < 10; i++) {
            cout << i + 1 << ". Correct: " << (correctAnswers[i] ? "True" : "False")
                    << " Answer: " << (studentAnswers[i] ? "True" : "False")
                    // FIXED: Changed "Correct" to "True" to match format logic
                    << " Points: " << (correctAnswers[i] == studentAnswers[i] ? 1.0 : -0.5) << endl;
        }
        cout << "Total score: " << score() << endl;
    }

    double score() override {
        double total = 0;
        for (int i = 0; i < 10; i++) {
            if (correctAnswers[i] == studentAnswers[i]) {
                total += 1.0;
            } else {
                total -= 0.5;
            }
        }
        return total;
    }
};

// =========================================================================
// DEEP-DIVE: WHY IS THE DOUBLE POINTER (QuizAttempt **attempts) USED?
// =========================================================================
//
// 1. AN ARRAY OF OBJECTS IS IMPOSSIBLE:
//    You cannot create `new QuizAttempt[n]` because QuizAttempt is abstract.
//    C++ cannot allocate memory for an object that has incomplete (= 0) functions.
//
// 2. TYPES HAVE DIFFERENT MEMORY SIZES:
//    `MCQuizAttempt` contains char arrays, while `TFQuizAttempt` contains bool arrays.
//    They take up different amounts of space in RAM. A normal contiguous array requires
//    every single element to be the exact same size.
//
// 3. THE SOLUTION: AN ARRAY OF POINTERS (**):
//    A pointer is always a fixed size (typically 8 bytes on a 64-bit system),
//    regardless of what it points to.
//    `QuizAttempt **` allocates a dynamic array where each slot holds a fixed-size pointer.
//    Each pointer then points to a completely different location in memory holding either
//    an `MCQuizAttempt` or a `TFQuizAttempt`. This enables Heterogeneous Collections (Polymorphism).
// =========================================================================

double averagePointsOfPassedStudents(QuizAttempt **attempts, int n) {
    double sum = 0;
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (attempts[i]->score() >= 5.0) {
            sum += attempts[i]->score();
            count++;
        }
    }

    if (count == 0) return 0.0;
    return sum / count;
}

// Helper allocation functions returning base class pointers to fill our pointer array.
QuizAttempt *readMCQuizAttempt() {
    char id[7];
    char correct[11];
    char answers[11];
    cin >> id >> correct >> answers;
    return new MCQuizAttempt(id, correct, answers);
}

QuizAttempt *readTFQuizAttempt() {
    char id[7];
    bool correct[10];
    bool answers[10];
    cin >> id;
    for (int i = 0; i < 10; i++) {
        cin >> correct[i];
    }
    for (int i = 0; i < 10; i++) {
        cin >> answers[i];
    }
    return new TFQuizAttempt(id, correct, answers);
}

// ==========================================
// 4. MAIN EXECUTION
// ==========================================
int main() {
    int testCase;
    cin >> testCase;

    if (testCase == 1) {
        cout << "Test MCQuizAttempt" << endl;
        QuizAttempt *attempt = readMCQuizAttempt();
        cout << "Score: " << attempt->score() << endl;
        attempt->print();
        delete attempt; // Cleanup memory
    } else if (testCase == 2) {
        cout << "Test TFQuizAttempt" << endl;
        QuizAttempt *attempt = readTFQuizAttempt();
        cout << "Score: " << attempt->score() << endl;
        attempt->print();
        delete attempt; // Cleanup memory
    } else if (testCase == 3) {
        cout << "Test operator >=" << endl;
        int n;
        cin >> n;

        // Dynamic array of pointers
        QuizAttempt **attempts = new QuizAttempt *[n];
        for (int i = 0; i < n; i++) {
            int type;
            cin >> type;
            if (type == 1) {
                attempts[i] = readMCQuizAttempt();
            } else {
                attempts[i] = readTFQuizAttempt();
            }
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) {
                    // Dereferencing the pointers (*attempts[i]) converts them to references
                    // so they can be securely passed into operator>= without object slicing.
                    if ((*attempts[i]) >= (*attempts[j])) {
                        cout << i << " >= " << j << endl;
                    } else {
                        cout << i << " < " << j << endl;
                    }
                }
            }
        }

        // FIXED: Added exam memory cleanup to prevent memory leaks
        for (int i = 0; i < n; i++) delete attempts[i];
        delete[] attempts;
    } else {
        int n;
        cin >> n;

        QuizAttempt **attempts = new QuizAttempt *[n];
        for (int i = 0; i < n; i++) {
            int type;
            cin >> type;
            if (type == 1) {
                attempts[i] = readMCQuizAttempt();
            } else {
                attempts[i] = readTFQuizAttempt();
            }
            attempts[i]->print();
            cout << endl;
        }

        cout << "Average score of passed students is: " << averagePointsOfPassedStudents(attempts, n) << endl;

        // FIXED: Added exam memory cleanup to prevent memory leaks
        for (int i = 0; i < n; i++) delete attempts[i];
        delete[] attempts;
    }

    return 0;
}

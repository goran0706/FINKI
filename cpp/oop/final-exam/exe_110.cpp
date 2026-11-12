/*
Да се дефинира класа ExamResult за претставување на резултат од испит на даден студент.

Во класата да се чуваат следните информации:

    индекс на студентот (string)

    име на студентот (string)

    поени од прв колоквиум (int)

    поени од втор колоквиум (int)

За класата да се имплементираат:

    Потребните конструктори

    Виртуелен метод int finalPoints() const кој го враќа вкупниот број на освоени поени според формулата:

    (поени_к1 + поени_к2) / 2

    Виртуелен метод bool passed() const кој враќа true доколку студентот го положил испитот (има најмалку 50 поени), во спротивно враќа false

    Виртуелен метод void print() const за печатење на информациите во формат даден во тест примерите

    Виртуелен метод void writeReport(ofstream &out) const кој запишува извештај за студентот во излезна датотека. Форматот е ист како и во методот print().

Да се дефинира класа ProjectAndExamResult која наследува од ExamResult и претставува резултат од испит кој покрај колоквиумите содржи и студентски проект.

Во класата дополнително да се чуваат:

    поени од проект (int)

    процент на сличност на проектот со други проекти (int од 0 до 100)

За класата да се имплементираат:

    Потребните конструктори

    Метод finalPoints() кој ги пресметува вкупните поени според формулата:

    (поени_к1 + поени_к2) * 0.35 + поени_проект

    Метод passed() кој враќа true доколку:

        процентот на сличност е помал или еднаков на 30

        вкупните поени се најмалку 50

        поените од проектот се најмалку 10

    Во спротивно методот враќа false.

Да се имплементираат следните функции:

    ExamResult* readExamResult(ifstream &in)

    Функцијата чита податоци за резултат од испит на еден студент од еден ред од отворена датотека и враќа покажувач кон ExamResult.

    Форматот на податоците е:

        E – обичен испит

        P – испит со проект

    Пример:

    E 231001 Stefan 24 31
    P 231002 Ana 20 28 18 10

    Функцијата треба да фрли исклучок од тип InvalidStudentIDException доколку студентскиот индекс не е валиден.

    Индексот е валиден доколку:

        содржи точно 6 знаци

        сите знаци се цифри

    ExamResult** readExamResults(ifstream &in, int &n)

    Функцијата чита податоци за резултати од испити за повеќе студенти од отворена датотека и враќа динамички алоцирана низа од покажувачи кон ExamResult.

    Во референцата n треба да се запише бројот на успешно прочитани резултати.

    Во датотеката најпрво е запишан бројот N – број на резултати, а потоа во нов ред следуваат информациите за резултатите во форматот дефиниран во претходната функција.

    За читањето на секој студент задолжително да се користи функцијата readExamResult.

    Доколку се фати исклучок, потребно е:

        да се испечати пораката:

        {ID} is not valid index

        резултатот за тој студент да се игнорира и да не се додаде во низата

    void writePassedStudentsReport(ExamResult **results, int n, const string & filename)

    Функцијата креира излезна датотека filename и во неа ги запишува сите студенти кои го положиле испитот.

Define a class ExamResult for representing an exam result for a student.

The class should store the following information:

    student index (string)

    student name (string)

    points from the first midterm (int)

    points from the second midterm (int)

Implement the following:

    Appropriate constructors

    Virtual method int finalPoints() const which returns the total number of points according to the formula:

    (midterm1 + midterm2) / 2

    Virtual method bool passed() const which returns true if the student has passed the exam (at least 50 points), otherwise returns false

    Virtual method void print() const for printing the information in the format shown in the test examples

    Virtual method void writeReport(ofstream &out) const which writes a student report to an output file

Define a class ProjectAndExamResult which inherits from ExamResult and represents an exam result that also includes a student project.

The class should additionally store:

    project points (int)

    project similarity percentage (int from 0 to 100)

Implement the following:

    Appropriate constructors

    Method finalPoints() which calculates the total number of points according to the formula:

    (midterm1 + midterm2) * 0.35 + project_points

    Method passed() which returns true if:

        the similarity percentage is less than or equal to 30

        the total number of points is at least 50

        the project points are at least 10

    Otherwise, the method should return false.

Implement the following global functions:

    ExamResult* readExamResult(ifstream &in)

    The function reads exam result data for a single student from an open file and returns a pointer to ExamResult.

    Input format:

        E – regular exam

        P – exam with project

    Example:

    E 231001 Stefan 24 31
    P 231002 Ana 20 28 18 10

    The function should throw an exception of type InvalidStudentIDException if the student index is invalid.

    A valid index:

        contains exactly 6 characters

        all characters are digits

    ExamResult** readExamResults(ifstream &in, int &n)

    The function reads exam results for multiple students from an open file and returns a dynamically allocated array of pointers to ExamResult.

    The reference parameter n should contain the number of successfully read results.

    The file first contains N – the total number of results, followed by one line per result in the format defined previously.

    The function readExamResult must be used for reading each student.

    If an exception is caught:

        print the message:

        {ID} is not valid index

        ignore that student's result and do not add it to the array

    void writePassedStudentsReport(ExamResult **results, int n, const string & filename)

    The function creates an output file filename and writes all students who passed the exam into it.

For example:

Test 	Input 	Result
----------------------------------
ExamResult e("231001", "Stefan", 60, 80);
cout << e.finalPoints() << endl;


70
----------------------------------
ExamResult e("231001", "Stefan", 50, 60);
cout << e.passed() << endl;


1
----------------------------------
ExamResult e("231001", "Stefan", 30, 40);
cout << e.passed() << endl;


0
----------------------------------
ExamResult e("231001", "Stefan", 60, 80);
e.print();


231001 Stefan 70 PASSED
----------------------------------
ProjectAndExamResult p("231002", "Ana", 70, 80, 20, 10);
cout << p.passed() << endl;


1
----------------------------------
ProjectAndExamResult p("231002", "Ana", 70, 80, 20, 40);
cout << p.passed() << endl;


0
----------------------------------
ProjectAndExamResult p("231002", "Ana", 90, 90, 8, 10);
cout << p.passed() << endl;


0
----------------------------------
ProjectAndExamResult p("231002", "Ana", 60, 80, 20, 10);
p.print();


231002 Ana 69 20 10% PASSED
----------------------------------
ExamResult *e = new ProjectAndExamResult("231002", "Ana", 60, 80, 20, 10);
cout << e->finalPoints() << endl;
cout << e->passed() << endl;
e->print();
delete e;


69
1
231002 Ana 69 20 10% PASSED
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");
ExamResult *e = readExamResult(in);
e->print();
delete e;
in.close();


E 231001 Stefan 60 80


231001 Stefan 70 PASSED
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");
ExamResult *e = readExamResult(in);
e->print();
delete e;
in.close();


P 231002 Ana 60 80 20 10


231002 Ana 69 20 10% PASSED
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");

try {
    ExamResult *e = readExamResult(in);
    e->print();
    delete e;
} catch (InvalidStudentIDException &e) {
    cout << e.getId() << " is not valid index" << endl;
}

in.close();


E 23A001 Stefan 60 80


23A001 is not valid index
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");

    int total = 0;
    ExamResult **results = readExamResults(in, total);

    for (int i = 0; i < total; i++) {
        results[i]->print();
    }

    for (int i = 0; i < total; i++) {
        delete results[i];
    }

    delete[] results;
    in.close();


3
E 231001 Stefan 60 80
P 231002 Ana 60 80 20 10
E 231003 Marko 30 40


231001 Stefan 70 PASSED
231002 Ana 69 20 10% PASSED
231003 Marko 35 FAILED
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");

    int total = 0;
    ExamResult **results = readExamResults(in, total);

    for (int i = 0; i < total; i++) {
        results[i]->print();
    }

    for (int i = 0; i < total; i++) {
        delete results[i];
    }

    delete[] results;
    in.close();


4
E 231001 Stefan 60 80
P 23A002 Ana 60 80 20 10
E 231003 Marko 30 40
P 231004 Elena 90 90 5 10


23A002 is not valid index
231001 Stefan 70 PASSED
231003 Marko 35 FAILED
231004 Elena 68 5 10% FAILED
----------------------------------
ofstream out("report.txt");
ExamResult e("231001", "Stefan", 60, 80);
e.writeReport(out);
out.close();
readFromFile("report.txt");


231001 Stefan 70 PASSED
----------------------------------
ExamResult **results = new ExamResult*[4];
results[0] = new ExamResult("231001", "Stefan", 60, 80);
results[1] = new ExamResult("231002", "Ana", 30, 40);
results[2] = new ProjectAndExamResult("231003", "Marko", 70, 80, 20, 10);
results[3] = new ProjectAndExamResult("231004", "Elena", 90, 90, 5, 10);

writePassedStudentsReport(results, 4, "passed_students.txt");

for (int i = 0; i < 4; i++) {
    delete results[i];
}

delete[] results;
readFromFile("passed_students.txt");


231001 Stefan 70 PASSED
231003 Marko 72 20 10% PASSED
----------------------------------
writeToFile("input.txt");
ifstream in("input.txt");

    int total = 0;
    ExamResult **results = readExamResults(in, total);

    for (int i = 0; i < total; i++) {
        results[i]->print();
    }

    for (int i = 0; i < total; i++) {
        delete results[i];
    }

    delete[] results;
    in.close();


6
E 231001 Stefan 60 80
E 231002 Ana 30 40
P 231003 Marko 80 80 20 10
P 231004 Elena 80 80 20 40
P 231005 Petar 90 90 5 10
P 231006 Jana 40 40 15 10


231001 Stefan 70 PASSED
231002 Ana 35 FAILED
231003 Marko 76 20 10% PASSED
231004 Elena 76 20 40% FAILED
231005 Petar 68 5 10% FAILED
231006 Jana 43 15 10% FAILED
*/

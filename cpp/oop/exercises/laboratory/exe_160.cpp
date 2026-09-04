// Во рамките на систем за следење на Formula 1 трки се чуваат податоци за возачи и нивните резултати на различни трки.
//
// Дефинирајте класа RaceResult со приватни податочни членки:
//
//     raceName – име на трката (низа од знаци);
//     position – освоена позиција на трката (цел број);
//     totalResults – вкупен број на сите внесени резултати за сите возачи (static int).
//
// Дополнете ја класата со:
//
//     default конструктор,
//     конструктор со аргументи,
//     copy конструктор,
//
// и следните функции:
//
//     print() – функција која ги печати името на трката и позицијата;
//     incrementTotalResults() – функција која ја зголемува вредноста на totalResults за 1.
//
// Понатаму, дефинирајте класа Driver со приватни податочни членки:
//
//     name – име на возачот (низа од знаци);
//     number - број на возачот (int);
//     results – низа од резултати (RaceResult) на возачот (максимална големина е 50);
//     n – број на внесени резултати (иницијално поставен на 0).
//
// Дополнете ја класата со:
//
//     default конструктор,
//     конструктор со аргумент name,
//     copy конструктор
//
// Напишете ги функциите:
//
//     averagePosition(): float - функција која ја враќа просечната позиција на возачот од сите настапи кои ги имал
//     print(bool withResults) - печати:
//         Driver Name: <name>
//         Driver Number: <number>
//         Average Position: <average_position>
//         Total Results: <n>
//         <result_1>
//         <result_2>...
//         Резултатите се прикажуваат само доколку withResults е true!
//     void addResult(const RaceResult& result) - функција која во низата од резултати results го додава настапот entry и ја зголемува вредноста на totalResults
//
// Дополнително, потребно е да се имплементира функцијата:
//
// void showRaceStatistics(Driver drivers[], int n, RaceResult races[], int m, int minPosition) која директно пристапува до приватните членки на класите Driver и RaceResult.
//
// Функцијата треба за секоја трка да ги испечати името на трката, возачите (без сите нивни трки) и процентот на возачи кои завршиле со позиција помала или еднаква на minPosition. Процентот се пресметува како: број на возачи кои го исполнуваат условот / вкупен број на возачи * 100
//
// Не го менувајте дадениот код.
//
// ---
//
// Within a Formula 1 racing tracking system, data about drivers and their results in various races is stored.
//
// Define a RaceResult class with private data members:
//
//     raceName – race name (string);
//     position – race position (integer);
//     totalResults – total number of all entered results for all drivers (static int).
//
// Complete the class with:
//
//     default constructor,
//     constructor with arguments,
//     copy constructor,
//
// and the following functions:
//
//     print() – function that prints the race name and position;
//     incrementTotalResults() – function that increases the value of totalResults by 1.
//
// Furthermore, define a Driver class with private data members:
//
//     name – driver name (string);
//     number - driver number (int);
//     results – driver results (maximum size is 50);
//     n – number of entered results (initial set to 0).
//
// Add the class with:
//
//     default constructor,
//     constructor with argument name,
//     copy constructor
//
// Write the functions:
//
//     averagePosition(): float - function that returns the average position of the driver from all the performances he has had
//     print(bool withResults) - prints:
//         Driver Name: <name>
//         Driver Number: <number>
//         Average Position: <average_position>
//         Total Results: <n>
//         <result_1>
//         <result_2>...
//         The results are displayed only if withResults is true!
//     void addResult(const RaceResult& result) - function that adds the performance entry to the results array and increases the value of totalResults
//
// In addition, implement the function:
//
// void showRaceStatistics(Driver drivers[], int n, RaceResult races[], int m, int minPosition) which directly accesses the private members of the Driver and RaceResult classes.
//
// The function should print for each race the race name, the drivers (excluding all their races) and the percentage of drivers who finished with a position less than or equal to minPosition. The percentage is calculated as: number of drivers who meet the condition / total number of drivers * 100
//
// Do not change the given code.
//
// For example:
// Input 	Result
//
// 1
//
//
//
// === TEST 1: Basic addResult and print ===
// [print with results = true]
// Driver Name: Charles Leclerc
// Driver Number: 0 Average Position: 2
// Total Results: 3
// Monaco GP 1
// Monza GP 3
// Spa GP 2
// [print with results = false]
// Driver Name: Charles Leclerc
// Driver Number: 0 Average Position: 2
// Total Results: 3
//
// 3
//
//
//
// === TEST 3: showRaceStatistics ===
// minPosition = 3
// Race: Monaco GP
// Driver Name: Max Verstappen
// Driver Number: 0 Average Position: 2.5
// Total Results: 2
// Driver Name: Lewis Hamilton
// Driver Number: 0 Average Position: 3.5
// Total Results: 2
// Driver Name: George Russell
// Driver Number: 0 Average Position: 5
// Total Results: 2
// Percentage of drivers with position <= 3: 66.6667%
// Race: Silverstone GP
// Driver Name: Max Verstappen
// Driver Number: 0 Average Position: 2.5
// Total Results: 2
// Driver Name: Lewis Hamilton
// Driver Number: 0 Average Position: 3.5
// Total Results: 2
// Driver Name: George Russell
// Driver Number: 0 Average Position: 5
// Total Results: 2
// Percentage of drivers with position <= 3: 33.3333%
#include <iostream>
#include <cstring>
using namespace std;

// TODO: Implement 'Driver' and 'RaceResult' classes
...

// TODO: Implement showRaceStatistics function
...


void test1() {
    cout << "=== TEST 1: Basic addResult and print ===" << endl;

    Driver d("Charles Leclerc");
    d.addResult(RaceResult("Monaco GP", 1));
    d.addResult(RaceResult("Monza GP", 3));
    d.addResult(RaceResult("Spa GP", 2));

    cout << "[print with results = true]" << endl;
    d.print(true);

    cout << "[print with results = false]" << endl;
    d.print(false);
}

void test2() {
    cout << "=== TEST 2: Average Position ===" << endl;

    Driver d("Carlos Sainz");
    d.addResult(RaceResult("Bahrain GP", 4));
    d.addResult(RaceResult("Saudi GP", 2));
    d.addResult(RaceResult("Australia GP", 6));
    d.addResult(RaceResult("Japan GP", 4));

    // Expected average: (4+2+6+4)/4 = 4.0
    cout << "Expected average: 4.0" << endl;
    cout << "Computed average: " << d.averagePosition() << endl;

    Driver d2("Lando Norris");
    d2.addResult(RaceResult("Bahrain GP", 1));
    d2.addResult(RaceResult("Saudi GP", 1));

    // Expected average: (1+1)/2 = 1.0
    cout << "Expected average: 1.0" << endl;
    cout << "Computed average: " << d2.averagePosition() << endl;
}

void test3() {
    cout << "=== TEST 3: showRaceStatistics ===" << endl;

    Driver d1("Max Verstappen");
    Driver d2("Lewis Hamilton");
    Driver d3("George Russell");

    d1.addResult(RaceResult("Monaco GP", 1));
    d1.addResult(RaceResult("Silverstone GP", 4));

    d2.addResult(RaceResult("Monaco GP", 5));
    d2.addResult(RaceResult("Silverstone GP", 2));

    d3.addResult(RaceResult("Monaco GP", 3));
    d3.addResult(RaceResult("Silverstone GP", 7));

    Driver drivers[] = {d1, d2, d3};
    RaceResult races[] = {
        RaceResult("Monaco GP", 0),
        RaceResult("Silverstone GP", 0)
    };

    // minPosition=3: Monaco   → d1(1)✓ d2(5)✗ d3(3)✓ → 2/3 = 66.67%
    // minPosition=3: Silverstone → d1(4)✗ d2(2)✓ d3(7)✗ → 1/3 = 33.33%
    cout << "minPosition = 3" << endl;
    showRaceStatistics(drivers, 3, races, 2, 3);
}

void test4() {
    cout << "=== TEST 4: Copy Constructor ===" << endl;

    Driver original("Fernando Alonso");
    original.addResult(RaceResult("Bahrain GP", 2));
    original.addResult(RaceResult("Japan GP", 1));

    Driver copy(original);

    cout << "[Original]" << endl;
    original.print(true);

    cout << "[Copy — should be identical]" << endl;
    copy.print(true);

    // Modify copy — original must be unaffected
    copy.addResult(RaceResult("Monaco GP", 5));

    cout << "[Original after modifying copy — must NOT have Monaco GP]" << endl;
    original.print(true);

    cout << "[Copy after adding Monaco GP]" << endl;
    copy.print(true);

    // Same for RaceResult copy constructor
    RaceResult r1("Abu Dhabi GP", 3);
    RaceResult r2(r1);
    cout << "[RaceResult original]: ";
    r1.print();
    cout << endl;
    cout << "[RaceResult copy]:     ";
    r2.print();
    cout << endl;
}


void test5() {
    cout << "=== TEST 5: Edge Cases ===" << endl;

    // Driver with 0 results
    cout << "[Driver with 0 results]" << endl;
    Driver empty("No Race Driver");
    empty.print(true);
    cout << "Average position (expect 0): " << empty.averagePosition() << endl;

    // showRaceStatistics with single driver
    cout << "\n[showRaceStatistics with single driver, minPosition=1]" << endl;
    Driver solo("Solo Driver");
    solo.addResult(RaceResult("Italian GP", 1));
    Driver soloArr[] = {solo};
    RaceResult soloRaces[] = {RaceResult("Italian GP", 0)};
    // solo finished P1 <= 1 → 1/1 = 100%
    showRaceStatistics(soloArr, 1, soloRaces, 1, 1);

    // totalResults counter
    cout << "\n[Total RaceResult entries recorded across all drivers]: "
            << RaceResult::getTotalResults() << endl;
}


int main() {
    int choice;
    cin >> choice;

    switch (choice) {
        case 1: test1();
            break;
        case 2: test2();
            break;
        case 3: test3();
            break;
        case 4: test4();
            break;
        case 5: test5();
            break;
        default: cout << endl;
    }

    return 0;
}

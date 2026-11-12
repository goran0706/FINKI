// Define a class WorkingWeek that will store the number of working hours for each working day in a week (5 days) and number of week. Then define a class Worker that will store name (char array 50) and array of working weeks (max 4).
//
// Implement the following functions:
//
//     int maxWeek(Worker w) that for the passed argument will return the number of the week with max working hours
//     void table(Worker *w, int n) that for the array of workers will print a table in the following format:
//
// Example
//
// Wor     1   2   3   4   Total
// Brianna 192 238 226 225 881
// Ava     236 231 184 212 863
// Matthew 236 235 219 243 933
// Alyssa  240 254 217 228 939
// Emma    247 205 204 242 898
//
// where in each row the name of the worker is printed, and the totals of working hours for each working week, as the sum of all totals for all weeks. A tabulator\t is used as a separator inside the row.
//
// For example:
// Input 	Result
//
// 10
// Andrew
// 44 55 48 34 30
// 37 35 31 55 59
// 36 55 57 37 32
// 57 45 60 42 46
// Mia
// 58 58 56 57 51
// 56 55 44 56 38
// 58 34 36 50 45
// 37 51 45 31 45
// Natalie
// 50 59 42 33 43
// 44 30 48 38 59
// 53 34 53 52 31
// 40 45 44 41 59
// John
// 37 43 39 59 49
// 51 60 49 60 33
// 40 38 58 39 46
// 42 33 31 42 60
// Brianna
// 60 51 52 57 40
// 55 31 55 34 59
// 32 58 32 49 40
// 38 41 50 48 35
// Samantha
// 40 35 45 55 38
// 39 31 56 55 40
// 55 46 38 36 32
// 46 31 56 47 57
// Samantha
// 38 40 54 57 45
// 31 33 39 47 55
// 32 49 46 33 36
// 30 51 44 39 41
// Ashley
// 32 39 49 31 38
// 45 54 41 45 55
// 41 59 47 35 30
// 45 43 40 37 53
// Jacob
// 44 48 51 45 60
// 56 48 31 54 35
// 48 50 38 30 32
// 55 41 60 53 57
// John
// 50 46 59 59 42
// 44 31 35 37 39
// 60 58 45 60 60
// 52 35 55 37 37
//
//
//
// TABLE
// Wor\t1\t2\t3\t4\tTotal
// Andrew\t211\t217\t217\t250\t895
// Mia\t280\t249\t223\t209\t961
// Natalie\t227\t219\t223\t229\t898
// John\t227\t253\t221\t208\t909
// Brianna\t260\t234\t211\t212\t917
// Samantha\t213\t221\t207\t237\t878
// Samantha\t234\t205\t196\t205\t840
// Ashley\t189\t240\t212\t218\t859
// Jacob\t248\t224\t198\t266\t936
// John\t256\t186\t283\t216\t941
// MAX WEEK FOR WORKER: Samantha
// 4

#include<iostream>

using namespace std;


int main() {
    int n;
    cin >> n;

    Worker workers[n];

    for (int i = 0; i < n; i++) {
        //TODO read workers data
    }

    cout << "TABLE" << endl;
    table(workers, n);

    cout << "MAX WEEK FOR WORKER: " << workers[n / 2].name << endl;
    cout << maxWeek(workers[n / 2]) << endl;

    return 0;
}

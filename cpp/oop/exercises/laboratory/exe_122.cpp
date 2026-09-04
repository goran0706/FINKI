// Дизајнирате програма за каталог на музички инструменти.
// За ова ќе треба да креирате базична класа наречена MusicalInstrument што претставува генерички музички инструмент и
// ги има овие три чисти виртуелни функции:
// displayInstrumentInfo()
// displaySoundQuality()
// calculateLearningDifficulty() - функција која враќа оценка за тежината на учење од 1 до 100
//
// Понатаму, треба да креирате 2 подкласи на MusicalInstrument наречени:
// StringInstrument
// WindInstrument
//
// Класата StringInstrument треба да ги има овие информации:
// isElectric - bool променлива
// numberOfStrings - int променлива (број на жици)
//
// и имплементирајте ги трите функции погоре со овие имплементации:
// За displayInstrumentInfo() треба да печати This is a string instrument with [numberOfStrings] strings.
// Ако инструментот е електричен, треба да додадете and electric amplification. на крајот од пораката.
// За displaySoundQuality() треба да печати The sound quality of this string instrument is rated [quality] out of 10.
// каде што квалитетот се пресметува врз основа на тоа дали инструментот е електричен или не.
// Ако е електричен, оценката е 9 од 10, а ако не е, оценката е 7 од 10.
// За calculateLearningDifficulty() треба да врати оценка за тежината на учење од 1 до 100, пресметана како 40 + (numberOfStrings * 5).
// Ако е електричен, тежината се зголемува за дополнителни 15 поени.

// Класата WindInstrument треба да ги има овие информации:
// isBrass - bool променлива
// complexityLevel - int променлива (ниво на сложеност од 1 до 5)

// и имплементирајте ги трите функции погоре со овие имплементации:
// За displayInstrumentInfo() треба да печати This is a wind instrument that requires breath control.
// Доколку инструментот е лимен, додадете and is made of brass на крајот од пораката.
// За displaySoundQuality() треба да печати The sound quality of this wind instrument is rated [quality] out of 10.
// каде што квалитетот се пресметува врз основа на тоа дали инструментот е лимен или не.
// Ако е лимен, оценката е 8 од 10, а ако не е, оценката е 6 од 10.
// За calculateLearningDifficulty() треба да врати оценка за тежината на учење од 1 до 100,
// пресметана како 30 + (complexityLevel * 10).
// Ако е лимен инструмент, тежината се зголемува за дополнителни 20 поени.

#include "iostream"
using namespace std;

int main() {
    MusicalInstrument *instruments[5];
    int testCase;

    cin >> testCase;

    if (testCase == 1) {
        cout << "TEST CASE 1: TESTING STRING INSTRUMENT CLASS" << endl;

        for (int i = 0; i < 5; i++) {
            int strings;
            cin >> strings;
            instruments[i] = new StringInstrument(false, strings);
            instruments[i]->displayInstrumentInfo();
            instruments[i]->displaySoundQuality();
            cout << "Learning difficulty: " << instruments[i]->calculateLearningDifficulty() << " out of 100." << endl;
        }
    } else if (testCase == 2) {
        cout << "TEST CASE 2: TESTING WIND INSTRUMENT CLASS" << endl;

        for (int i = 0; i < 5; i++) {
            int complexity;
            cin >> complexity;
            instruments[i] = new WindInstrument(false, complexity);
            instruments[i]->displayInstrumentInfo();
            instruments[i]->displaySoundQuality();
            cout << "Learning difficulty: " << instruments[i]->calculateLearningDifficulty() << " out of 100." << endl;
        }
    } else {
        cout << "TEST CASE 3: TESTING BOTH CLASSES" << endl;

        for (int i = 0; i < 5; i++) {
            if (i % 2) {
                bool isBrass;
                int complexity;
                cin >> isBrass >> complexity;
                instruments[i] = new WindInstrument(isBrass, complexity);
            } else {
                bool isElectric;
                int strings;
                cin >> isElectric >> strings;
                instruments[i] = new StringInstrument(isElectric, strings);
            }
            instruments[i]->displayInstrumentInfo();
            instruments[i]->displaySoundQuality();
            cout << "Learning difficulty: " << instruments[i]->calculateLearningDifficulty() << " out of 100." << endl;
        }
    }

    return 0;
}

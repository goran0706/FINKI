#include <iostream>

int main() {
    using std::cout;
    using std::cin;
    using std::endl;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. Kilograms → grams → milligrams
    // ─────────────────────────────────────────────────────────────────────────
    constexpr int gramsPerKg = 1000;
    constexpr int mgPerGram = 1000;

    double totalKg;
    cout << "Enter weight in kilograms: ";
    cin >> totalKg;

    long totalGrams = static_cast<long>(totalKg * gramsPerKg);
    long kg = totalGrams / gramsPerKg;      // whole unit
    long grams = totalGrams % gramsPerKg;   // reminder units

    long totalMg = grams * mgPerGram;
    long mg = totalMg; // leftover milligrams

    cout << totalKg << " kg = " << kg << " kg, " << grams << " g, " << mg << " mg" << endl << endl;


    // ─────────────────────────────────────────────────────────────────────────
    // 2. Kilometers → meters → centimeters
    // ─────────────────────────────────────────────────────────────────────────
    constexpr int metersPerKm = 1000;
    constexpr int cmPerMeter = 100;

    double totalKm;
    cout << "Enter distance in kilometers: ";
    cin >> totalKm;

    long totalMeters = static_cast<long>(totalKm * metersPerKm);
    long km = totalMeters / metersPerKm;
    long meters = totalMeters % metersPerKm;

    long totalCm = meters * cmPerMeter;
    long cm = totalCm;

    cout << totalKm << " km = " << km << " km, " << meters << " m, " << cm << " cm" << endl;


    return 0;
}


// Write a C++ program that asks for a distance in furlongs and converts it to yards. (One furlong is 220 yards.)

#include <iostream>

using namespace std;

int main() {
    int distanceInFurlongs;

    cin >> distanceInFurlongs;

    constexpr int FURLONG_TO_YARD = 220;
    int distanceInYards = distanceInFurlongs * FURLONG_TO_YARD;

    cout << "Distance in yards: " << distanceInYards << endl;
}

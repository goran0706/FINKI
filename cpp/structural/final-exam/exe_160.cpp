// Write a program that will read lines from SI and it will print on the SO the lines preceded by the ratio of upper/lower case letters in the rows.
// Also, at the end print the number of the line with the largest ration of upper/lower case letters.
//
// For example:
// Input
// So, so you think you can tell Heaven from Hell,
// blue skies From Pain.
// Can you tell a Green Field From a cold steel rail?
// A smile from a veil?
// Do you think you can tell?
// And did they geT you to Trade Your heroes for ghosts?
// Hot ashes for trees?
//
// Result
// 0.09 So, so you think you can tell Heaven from Hell,
// 0.13 blue skies From Pain.
// 0.11 Can you tell a Green Field From a cold steel rail?
// 0.07 A smile from a veil?
// 0.05 Do you think you can tell?
// 0.11 And did they geT you to Trade Your heroes for ghosts?
// 0.07 Hot ashes for trees?
// 1
#include <iostream>
#include <iomanip>
using namespace std;

int main() {
	char str[100];

	float max_ratio = 0;
	float curr_ratio = 0;

	int max_row = 0;
	int curr_count = 0;

	while (cin.getline(str, 100)) {
		if (str[0] == '\0') {
			break;
		}

		int upper_count = 0;
		int lower_count = 0;

		for (int i = 0; str[i] != '\0'; i++) {
			char c = str[i];
			if (isalpha(c)) {
				if (isupper(c)) {
					upper_count++;
				} else {
					lower_count++;
				}
			}
		}

		curr_ratio = float(upper_count) / float(lower_count);

		if (curr_ratio > max_ratio) {
			max_ratio = curr_ratio;
			max_row = curr_count;
		}

		cout << fixed << setprecision(2) << curr_ratio << " " << str << endl;
		curr_count++;
	}

	cout << max_row << endl;
}

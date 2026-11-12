// In a given file "numbers.txt" are written more rows with integers, and each row starts with one integer (N >= 1)
// that represents how many integers are following afterward in the same row.
// Write a program that on SO will print the number with the largest most significant digit.
// Reading of integers ends when 0 is read.
//
// For example:
// Input
//
// 14 133944 278216 387399 28307 253543 419078 35197 211333 324609 260197 330161 395298 28991 59686
// 7 337422 459187 348310 78139 399034 456374 309499
// 15 471882 16606 52710 20269 202735 32904 132885 145244 98324 224723 311241 486996 2199 394455 171800
// 6 105192 290533 184513 488146 171447 479947
// 14 291296 136991 424759 479132 477586 61427 490850 356371 305920 159396 82301 467786 343436 201413
// 13 378398 301708 146052 422210 143716 400158 146357 41139 243123 471720 156271 452286 195993
// 3 333401 371831 377200
// 0
//
// Result
// 59686
// 78139
// 98324
// 488146
// 82301
// 422210
// 333401
#include <iostream>
#include <fstream>
using namespace std;

int get_msd(int num) {
	if (num < 0) num = -num;
	while (num >= 10) {
		num /= 10;
	}
	return num;
}

int main() {
	ifstream input("exe_166.txt");

	if (!input) {
		cout << "Failed to read the file" << endl;
		return 0;
	}

	int n;

	while (input >> n && n != 0) {
		int max_num = -1;
		int max_msd_val = -1;

		for (int i = 0; i < n; i++) {
			int current_num;
			input >> current_num;

			int current_msd = get_msd(current_num);

			if (current_msd > max_msd_val) {
				max_msd_val = current_msd;
				max_num = current_num;
			}
		}

		cout << max_num << endl;
	}

	input.close();

	return 0;
}

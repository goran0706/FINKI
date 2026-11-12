// Од стандарден влез се читаат знаци се додека не се прочита извичник.
// Во вака внесениот текст се скриени цели броеви (помали од 100).
// Да се напише програма што ќе ги прочита сите знаци и на излез ќе го испечати збирот на сите броеви скриени во текстот.
//
// Напомена: cin во C++ ги игнорира празните места (space).
// За да не ги игнорира потребно е да се додаде noskipws пред читањето на знакот (пр. cin >> noskipws >> znak;)
// Input: ako34D neka12em bashka41mewr20!
// Output: 107
#include <iostream>
#include <cctype>
using namespace std;

int main() {
	char c;
	int sum = 0;
	int current_number = 0;

	while (cin >> noskipws >> c) {
		if (c == '!') {
			break;
		}

		if (isdigit(c)) {
			current_number = current_number * 10 + (c - '0');
		} else {
			sum += current_number;
			current_number = 0;
		}
	}

	sum += current_number;

	cout << sum << endl;
	return 0;
}

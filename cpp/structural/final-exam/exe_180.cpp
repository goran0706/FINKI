// Read from SI lines.
// Find and print the row, where the ratio of digits/letters is largest.
// If there are more than one such rows print the last.
// No row is longer than 100 characters, and if in a row there are no letters, that row is ignored.
//
// Example
//
// Input
// aaa123aa 222aa5a289
// aaaa cde 23aaaa
// 45 ,, 56! 7
// 222aa5a289 aaa123aa
// 123 aaa 89994 ghj 90 xyz
// xyz ,. hgfd
//
// Output
// 222aa5a289 aaa123aa
//
// For example:
// Input
//
// dct4MaGaxilBB
// EjjcbpTxyq1Np33VgX8zzgYU27kPgNXqh8xGKDv7lon7skaedIdTBGCmqObHiJVJa3Li6qOezrflzrE
// lwmxpqkAwVxY7XhKUB4wlQvtrFfwo5X406slhHEryb44K0l9ppaoEvlrh1Vnj0p3yr4oXxCvy
// rwfcwTkpzt90nkm3guA1uncNotkbJl1pquSdzuCgzBxbqP4bowyf9T4n0iEsx39aqhl3vh31bBq7asQ
// 6l1zv000000003333333333TakyQ
// dLcGA4yseDppd6s3CUzurl2Xhh6eeX5SpSW7o0DcilYmtSljk5g19lV722jljr
//
// Result
// 6l1zv000000003333333333TakyQ

#include <iostream>
#include <cctype>
#include <cstring>
using namespace std;

int main() {
	char str[101] = "";
	char max_str[101] = "";
	float max_ratio = -1.0;

	while (cin.getline(str, 101)) {
		if (strlen(str) == 0) {
			break;
		}

		int digits = 0;
		int letters = 0;

		for (int i = 0; str[i] != '\0'; i++) {
			if (isdigit(str[i])) digits++;
			else if (isalpha(str[i])) letters++;
		}

		if (letters == 0) continue;

		float curr_ratio = float(digits) / float(letters);

		if (curr_ratio >= max_ratio) {
			max_ratio = curr_ratio;
			strcpy(max_str, str);
		}
	}

	cout << max_str << endl;
}

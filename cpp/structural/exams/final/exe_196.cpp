// Од тастатура се внесува природен број N, а потоа N цели броеви.
// За секој број треба да се провери неговиот остаток при делење со 3 и според тоа да се изврши соодветната операција:
//
//     ако остатокот е 0, испечати: бројот поделен со 3;
//     ако остатокот е 1, испечати: бројот собран со претходно внесениот број ( освен за првовнесениот - се печати самиот број);
//     ако остатокот е 2, испечати: бројот помножен со 2;
//
// Форматот на излезот е: во посебен ред, за секој внесен број да се отпечати резултатот на соодветната операција, како во примерот.
//
// Објаснување:
// за 7, остатокот при делењето со 3 е 1, според тоа треба да се испечати самиот тој број (бидејќи е првовнесен број), 7
// За 9, остатокот при делењето со 3 е 0, според тоа се печати 9 / 3 = 3
// За 7, остатокот при делењето со 3 е 1, според тоа треба да се испечати бројот собран со претходно внесениот број , 7 + 9 = 16
// За 11, остатокот при делењето со 3 е 2,, според тоа треба да се испечати бројот помножен со 2, 11 * 2 = 22
//
// ----------------------------------------------------------------------------------------------------------------------------------
//
// A natural number N is entered from the standard input, followed by N integers.
// For each number, its remainder when divided by 3 should be checked, and the corresponding operation should be performed:
//
//     If the remainder is 0, print: the number divided by 3;
//     If the remainder is 1, print: the number added to the previously entered number (except for the first entered number - print the number itself);
//     If the remainder is 2, print: the number multiplied by 2;
//
// The output format is: on a separate line, for each entered number, print the result of the corresponding operation, as shown in the example.
//
// Explanation:
// For 7, the remainder when divided by 3 is 1, therefore the number itself should be printed (since it is the first entered number), 7
// For 9, the remainder when divided by 3 is 0, therefore 9 / 3 = 3 is printed
// For 7, the remainder when divided by 3 is 1, therefore the number combined with the previously entered number should be printed, 7 + 9 = 16
// For 11, the remainder when divided by 3 is 2, therefore the number multiplied by 2 is printed, 11 * 2 = 22

// For example:
// Input
// 4
// 7 9 7 11
//
//
// Result
// 7
// 3
// 16
// 22
#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	int a[100];
	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	for (int i = 0; i < n; i++) {
		int reminder = a[i] % 3;
		if (reminder == 0) {
			cout << a[i] / 3 << endl;
		} else if (reminder == 1) {
			cout << (i == 0 ? a[i] : a[i] + a[i - 1]) << endl;
		} else if (reminder == 2) {
			cout << a[i] * 2 << endl;
		}
	}
}

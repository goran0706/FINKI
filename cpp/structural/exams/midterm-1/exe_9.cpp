// За дадена низа од знаци со големина од максимум 100 знаци (се внесува од тастатура)
// да се пронајде и врати првата голема буква со помош на рекурзивна функција.
// Пронајдената буква да се испечати на екран. Доколку нема, функцијата потребно е да го врати знакот ‘\0’.
#include <iostream>
using namespace std;

char first_uppercase(char str[]) {
	if (*str == '\0') return *str;
	if (isupper(*str)) return *str;
	return first_uppercase(str + 1);
}

int main() {
	char str[100];
	cin.getline(str, 100);
	cout << first_uppercase(str) << endl;
}

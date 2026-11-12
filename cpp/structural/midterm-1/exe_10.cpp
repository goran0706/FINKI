// 2.9. Задача 8
// Да се напише функција која во дадена текстуална низа ќе ги отстранува празните места на почетокот и крајот од низата.
#include <cstring>
#include <iostream>
using namespace std;

void trim(char str[]) {
	int length = strlen(str);

	int start = 0;
	while (start <= length && isspace(str[start])) {
		start++;
	}

	int end = length - 1;
	while (end >= 0 && isspace(str[end])) {
		end--;
	}

	int write = 0;
	for (int i = start; i <= end; i++) {
		str[write++] = str[i];
	}
	str[write] = '\0';
}

int main() {
	char str[100];
	cin.getline(str, 100);

	trim(str);
	cout << str << endl;
}

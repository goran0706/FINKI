// За даден природен број N, да се пополни матрица N x N со буквите A, B, C, D, E, F, G, H, I по редови,
// во змијовиден (цик-цак) облик, односно:
// редовите со парен индекс (0, 2, 4, ...) се пополнуваат од лево кон десно
// редовите со непарен индекс (1, 3, 5, ...) се пополнуваат од десно кон лево

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;

	char a[100][100];
	char c[] = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'};
	int count = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			const int index = i % 2 == 0 ? j : n - 1 - j;
			a[i][index] = c[count % 9];
			count++;
		}
	}

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}

	return 0;
}

// Пронаоѓање на минимална и максимална вредност во низа со покажувачи

#include <iostream>
using namespace std;

int main() {
	int n;
	cin >> n;
	if (n <= 0 || n > 100) return 1;

	int a[100];

	for (int i = 0; i < n; i++) {
		cin >> a[i];
	}

	int min = *a;
	int max = *a;
	int *ptr = a;
	int *end = a + n;

	while (ptr < end) {
		if (*ptr < min) min = *ptr;
		if (*ptr > max) max = *ptr;
		ptr++;
	}

	cout << "Минимална вредност: " << min << endl;
	cout << "Максимална вредност: " << max << endl;

	return 0;
}

// 1. ispechati gi site 4 cifreni broevi delivi so 127 i shto se parni vo opagjacki redosled
// 2. od sv se vnesuvaat 17 clenovi na niza, sumiraj gi parnite i neparnite clenovi
// 3. ispecati gi site clenovi od niza vnesena od sv so zapirka izmegju niv

#include <iostream>
using namespace std;

int main() {
    // Task 1:
    bool flag_first = true;

    for (int i = 9999; i >= 1000; i--) {
        if (i % 127 == 0 && i % 2 == 0) {
            if (!flag_first) {
                cout << ", ";
            }
            cout << i;
            flag_first = false;
        }
    }
    cout << endl;

    // Task 2:
    int n;
    cin >> n;

    int a[100];
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }

    int sum_even_pos = 0;
    int sum_odd_pos = 0;

    for (int i = 0; i < n; i++) {
        if (i % 2 == 0) {
            sum_even_pos += a[i];
        } else {
            sum_odd_pos += a[i];
        }
    }

    cout << "Sum even elements: " << sum_even_pos << endl;
    cout << "Sum odd elements: " << sum_odd_pos << endl;

    // Task 3:
    for (int i = 0; i < n; i++) {
        cout << a[i] << (i == n - 1 ? "\n" : ", ");
    }
}

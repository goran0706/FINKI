// 1)
// Matrica po sekoj kolona da proveris kolku pati elementite se menuvaat od strogo opagjacki do strogo rastecki (i obratno).
// Na kraj na napises kolku koloni ima kade sto elementite samo ednas se menuvaat od opagjacki do rastecki (i obratno).
//
// 2)
// Vnesuvas broj X i treba da vidis kolku parovi elementi (elementi a i b, od 10 do X) ima kade sto vazi praviloto a+b=X.
// Isto taka za sekoj elementi a i b treba da vazi deka zbirot na parni cifri vo a e ednakov na zbirot od neparnite cifri vo a (isto ovaa vazi i za b).
// Ako nema vakvi parovi ispecati samo Ne

#include <iostream>
using namespace std;

int order(int a, int b) {
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
}


bool is_valid_number(int n) {
    int sum_odd = 0;
    int sum_even = 0;

    while (n > 0) {
        int digit = n % 10;
        if (digit % 2 == 0) {
            sum_even += digit;
        } else {
            sum_odd += digit;
        }
        n /= 10;
    }

    return sum_odd == sum_even;
}

int main() {
    int n, m;
    cin >> n >> m;

    int A[100][100];

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> A[i][j];
        }
    }

    int total_columns_with_one_change = 0;

    for (int j = 0; j < m; j++) {
        int dir = 0;
        int change_count = 0;

        for (int i = 0; i < n - 1; i++) {
            int current_dir = order(A[i][j], A[i + 1][j]);

            if (current_dir == 0) {
                continue;
            }

            if (dir == 0) {
                dir = current_dir;
            } else if (current_dir != dir) {
                change_count++;
                dir = current_dir;
            }
        }

        total_columns_with_one_change[j] = change_count;

        if (change_count == 1) {
            total_columns_with_one_change++;
        }
    }

    cout << "Koloni so tocno edna promena: " << total_columns_with_one_change << endl;


    int x;
    cin >> x;

    int pairs_count = 0;

    for (int a = 10; a <= (x / 2) - 10; a++) {
        int b = x - a;

        if (is_valid_number(a) && is_valid_number(b)) {
            cout << "Najden par: " << a << " + " << b << " = " << x << endl;
            pairs_count++;
        }
    }

    if (pairs_count == 0) {
        cout << "Ne" << endl;
    } else {
        cout << "Vkupno parovi: " << pairs_count << endl;
    }

    return 0;
}

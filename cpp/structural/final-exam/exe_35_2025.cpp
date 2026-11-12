/*
    === 1. ===
    Matrica po sekoja kolona da proveris kolku pati elementite se menuvaat od strogo opagjacki do strogo rastecki (i obratno).
    Na kraj da napises kolku koloni ima kade sto elementite samo ednas se menuvaat od opagjacki do rastecki (i obratno).
*/
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;

    int matrix[100][100];
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }

    int total_columns_with_one_change = 0;

    for (int j = 0; j < m; j++) {
        int current_direction = 0;
        int order_changes = 0;

        for (int i = 0; i < n - 1; i++) {
            if (matrix[i][j] < matrix[i + 1][j]) {
                if (current_direction == -1) {
                    order_changes++;
                }
                current_direction = 1;
            } else if (matrix[i][j] > matrix[i + 1][j]) {
                if (current_direction == 1) {
                    order_changes++;
                }
                current_direction = -1;
            }
        }

        cout << "Col " << j << " has " << order_changes << " order changes." << endl;

        if (order_changes == 1) {
            total_columns_with_one_change++;
        }
    }

    cout << "only one change " << total_columns_with_one_change << endl;

    return 0;
}

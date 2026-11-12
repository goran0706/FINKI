#include <iostream>
#include <cstring>
using namespace std;

// ===============
// БРОЕВИ
// ===============
void findDayMonthYear(int n) {
    int d = n / 1000000;
    int m = n / 10000 % 100;
    int y = n % 10000;

    cout << d << "-" << m << "-" << y << endl;
}

int sumDigits(int n) {
    int sum = 0;
    while (n > 0) {
        sum += n % 10;
        n /= 10;
    }
    return sum;
}

int sumDigitsRecursive(int n) {
    if (n <= 0) return 0;
    return n % 10 + sumDigitsRecursive(n / 10);
}

int countDigits(int n) {
    if (n == 0) return 1;

    int count = 0;
    n = abs(n); // handle negative numbers

    while (n > 0) {
        count++;
        n /= 10;
    }

    return count;
}

int countDigitsRecursive(int n) {
    if (n < 0) return countDigitsRecursive(-n); // handle negative numbers
    if (n < 10) return 1; // 0-9
    return 1 + countDigitsRecursive(n / 10);
}

int countOddDigits(int n) {
    int count = 0;

    while (n > 0) {
        if ((n % 10) % 2 != 0) {
            count++;
        }
        n /= 10;
    }

    return count;
}

int countEvenDigits(int n) {
    int count = 0;

    while (n > 0) {
        if ((n % 10) % 2 == 0) {
            count++;
        }
        n /= 10;
    }

    return count;
}

void countUp(int n) {
    for (int i = 0; i <= n; i++) {
        cout << i << endl;
    }
}

void countUpRecursive(int n) {
    if (n < 0) return;
    countUpRecursive(n - 1);
    cout << n << endl;
}

void countDown(int n) {
    for (int i = n; i >= 0; i--) {
        cout << i << endl;
    }
}

void countDownRecursive(int n) {
    if (n < 0) return;
    cout << n << endl;
    countDownRecursive(n - 1);
}

int reverseDigits(int n) {
    int reversed = 0;

    while (n > 0) {
        reversed = reversed * 10 + n % 10;
        n /= 10;
    }

    return reversed;
}

int reverseDigitsRecursive(int n, int reversed) {
    if (n == 0) return reversed;
    return reverseDigitsRecursive(n / 10, reversed * 10 + n % 10);
}

bool isPalindrome(int n) {
    int reversed = reverseDigits(n);
    return reversed == n;
}

bool isPalindromeRecursive(int n) {
    int reversed = reverseDigitsRecursive(n, 0);
    return reversed == n;
}

// благ број - само парни цифри
bool isSweetNumber(int n) {
    while (n > 0) {
        int digit = n % 10;
        if (digit % 2 != 0) {
            return false;
        }
        n /= 10;
    }
    return true;
}

// среден број - следната цифра е помала од претходната, најзначајна до најмалку значајна
bool isMidNumber(int n) {
    if (n < 10) return false;

    while (n >= 10) {
        int last = n % 10;
        int prev = (n / 10) % 10;
        if (prev <= last) {
            return false;
        }
        n /= 10;
    }

    return true;
}

// подреден број - следната цифра е помала или еднаква на претходната
bool isOrderedNumber(int n) {
    if (n < 10) return false;

    while (n > 0) {
        int last = n % 10;
        int prev = n / 10 % 10;
        if (prev > last) {
            return false;
        }
        n /= 10;
    }

    return true;
}

// парен еквивалент - чии цифри се наоѓаат на парни позиции на другиот број
bool evenEquivalent(int n, int m) {
    while (n > 0) {
        int digit_n = n % 10;

        int temp = m;
        int position = 0;
        bool found = false;

        while (temp > 0) {
            int digit_m = temp % 10;
            if (digit_n == digit_m) {
                if (position % 2 == 0) {
                    found = true;
                }
            }
            temp /= 10;
            position++;
        }

        if (!found) return false;
        n /= 10;
    }

    return true;
}

// сума рабен број - последните 2 цифри се собираат и се заменуваат со нивната сума
void sumEdgeNumber(int n) {
    while (n >= 10) {
        int last = n % 10;
        int prev = n / 10 % 10;
        int sum = prev + last;
        n /= 100;
        n = n * 10 + sum;
        cout << n << endl;
    }
}

int sumFirstK(int n) {
    int sum = 0;
    for (int i = 0; i <= n; i++) {
        sum += i;
    }
    return sum;
}

int sumFirstKRecursive(int n) {
    if (n <= 0) return 0;
    return n + sumFirstKRecursive(n - 1);
}

bool isPrime(int n) {
    if (n <= 1) return false;

    for (int i = 2; i * i < n; i++) {
        if (n % i == 0) {
            return false;
        }
    }

    return true;
}


bool isPrimeRecursive(int n, int d) {
    if (n <= 1) return false;
    if (d * d > n) return true;
    if (n % d == 0) return false;
    return isPrimeRecursive(n, d + 1);
}

int findNextPrime(int n) {
    int next = n + 1;
    while (true) {
        if (isPrime(next)) return next;
        next++;
    }
}

int findNextPrimeRecursive(int n) {
    int next = n + 1;
    if (isPrime(next)) return next;
    return findNextPrime(next);
}

int findNextPrimeDiff(int n, int diff) {
    for (int i = n; ; i++) {
        if (i % 2 != 0 && isPrime(i) && isPrime(i + diff)) {
            return i;
        }
    }
}


int factorial(int n) {
    int result = 1;

    for (int i = 1; i <= n; i++) {
        result *= i;
    }

    return result;
}

int factorialRecursive(int n) {
    if (n < 0) return -1;
    if (n == 0) return 1;
    return n * factorialRecursive(n - 1);
}

int fibonacci(int n) {
    if (n <= 1) return n;

    int prev = 0;
    int curr = 1;

    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }

    return curr;
}

int fibonacciRecursive(int n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// ===============
// НИЗИ
// ===============

int scalar(int a[], int n) {
    int scalar = 1;
    for (int i = 0; i < n; i++) {
        scalar *= a[i];
    }
    return scalar;
}

bool isSorted(int a[], int n, int order) {
    if (order != 0 && order != 1) return false;

    for (int i = 0; i < n - 1; i++) {
        if (order == 0 && a[i] > a[i + 1]) return false;
        if (order == 1 && a[i] < a[i + 1]) return false;
    }

    return true;
}

void arrayOrder(int a[], int n) {
    bool ascending = true;
    bool descending = true;

    for (int i = 0; i < n - 1; i++) {
        if (a[i] < a[i + 1]) {
            descending = false;
        }
        if (a[i] > a[i + 1]) {
            ascending = false;
        }
    }

    if (!ascending && !descending) {
        cout << "Neither ASCENDING nor DESCENDING" << endl;
    } else if (ascending) {
        cout << "ASCENDING" << endl;
    } else if (descending) {
        cout << "DESCENDING" << endl;
    }
}

bool hasPeak(int a[], int n) {
    for (int i = 1; i < n - 1; i++) {
        if (a[i - 1] < a[i] && a[i] > a[i + 1])
            return true;
    }
    return false;
}

bool hasDip(int a[], int n) {
    for (int i = 1; i < n - 1; i++) {
        if (a[i - 1] > a[i] && a[i] < a[i + 1])
            return true;
    }
    return false;
}

bool hasPeakOrDip(int a[], int n) {
    for (int i = 1; i < n - 1; i++) {
        if ((a[i - 1] < a[i] && a[i] > a[i + 1]) ||
            (a[i - 1] > a[i] && a[i] < a[i + 1]))
            return true;
    }
    return false;
}

void printElements(int a[], int n) {
    for (int i = 0; i < n; i++) {
        cout << a[i] << " ";
    }
    cout << endl;
}

void fillElements(int a[], int n) {
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
}

void rotateRight(int a[], int n) {
    int last = a[n - 1];

    for (int i = n - 1; i > 0; i--) {
        a[i] = a[i - 1];
    }

    a[0] = last;
}

void rotateRightByN(int a[], int n, int k) {
    for (int i = 1; i < k; i++) {
        int last = a[n - 1];

        for (int j = n - 1; j > 0; j--) {
            a[j] = a[j - 1];
        }

        a[0] = last;
    }
}

void rotateLeft(int a[], int n) {
    int first = a[0];

    for (int i = 0; i < n - 1; i++) {
        a[i] = a[i + 1];
    }

    a[n - 1] = first;
}

void rotateLeftByN(int a[], int n, int k) {
    for (int i = 1; i < k; i++) {
        int first = a[0];

        for (int j = 0; j < n - 1; j++) {
            a[j] = a[j + 1];
        }

        a[n - 1] = first;
    }
}

int remove(int a[], int *n, int index) {
    if (index < 0 || index >= *n) {
        return -1;
    }

    for (int i = index; i < *n - 1; i++) {
        a[i] = a[i + 1];
    }

    (*n)--;

    return 1;
}

int removeDuplicatesSorted(int a[], int n) {
    // Option 1
    // int write = 0;
    // for (int i = 1; i < n; i++) {
    //     if (a[i] != a[write]) {
    //         write++;
    //         a[write] = a[i];
    //     }
    // }

    // Option 2 (clearer - write means “next position to write to”)
    int write = 1;
    for (int i = 1; i < n; i++) {
        if (a[i] != a[write - 1]) {
            a[write] = a[i];
            write++;
        }
    }

    return write;
}

int sumElements(int a[], int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += a[i];
    }
    return sum;
}

int sumElementsRecursive(int a[], int n) {
    if (n < 0) return 0;
    return a[n] + sumElementsRecursive(a, n - 1);
}

int findMin(int a[], int n) {
    int min = a[0];
    for (int i = 0; i < n; i++) {
        if (a[i] < min) {
            min = a[i];
        }
    }
    return min;
}

int findMax(int a[], int n) {
    int max = a[0];
    for (int i = 0; i < n; i++) {
        if (a[i] > max) {
            max = a[i];
        }
    }
    return max;
}

int findMinUsingPointers(int a[], int n) {
    int min = *a;
    while (n > 0) {
        if (*a < min) {
            min = *a;
        }
        a++;
        n--;
    }
    return min;
}

int findMaxUsingPointers(int a[], int n) {
    int max = *a;
    while (n > 0) {
        if (*a > max) {
            max = *a;
        }
        a++;
        n--;
    }
    return max;
}

void transformElements(int a[], int n) {
    for (int i = 0; i < n; i++) {
        a[i] = a[i] * 2;
    }
}

void swap(int a, int b) {
    int temp = a;
    b = a;
    a = temp;
}

void swapPtr(int *a, int *b) {
    int temp = *a;
    *b = *a;
    *a = temp;
}

void swapRfr(int &a, int &b) {
    int temp = a;
    b = a;
    a = temp;
}

void bubble_sort(int a[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (a[i] > a[j]) {
                int temp = a[i];
                a[i] = a[j];
                a[j] = temp;
            }
        }
    }
}

int linearSearch(int a[], int n, int el) {
    for (int i = 0; i < n; i++) {
        if (a[i] == el) {
            return i;
        }
    }
    return -1;
}

int binarySearch(int a[], int n, int el) {
    int left = 0;
    int right = n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (a[mid] == el) {
            return mid;
        }
        if (a[mid] < el) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// ===============
// МАТРИЦИ
// ===============
const int N = 3;
const int M = 3;

void fillMatrix(int matrix[N][M], int n, int m) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> matrix[i][j];
        }
    }
}

void printMatrix(int matrix[N][M], int n, int m) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
}

void printRows(int matrix[N][M], int n, int m) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }
}

void printCols(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            cout << matrix[j][i] << " ";
        }
        cout << endl;
    }
}

void printMainDiagonal(int matrix[N][M], int n, int m) {
    // Optimization: run one loop since i == j, matrix[i][i]
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void printAboveMainDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i < j) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void printBellowMainDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i > j) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void printSecondaryDiagonal(int matrix[N][M], int n, int m) {
    // Optimization: run one loop matrix[i][n - 1 - i]
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j == n - 1) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void printAboveSecondaryDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j < n - 1) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

void printBellowSecondaryDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i + j > n - 1) {
                cout << matrix[j][i] << " ";
            } else {
                cout << "  ";
            }
        }
        cout << endl;
    }
}

int findMin(int matrix[N][M], int n, int m) {
    int min = matrix[0][0];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] < min) {
                min = matrix[i][j];
            }
        }
    }
    return min;
}

int findMax(int matrix[N][M], int n, int m) {
    int max = matrix[0][0];
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] > max) {
                max = matrix[i][j];
            }
        }
    }
    return max;
}

bool isSymmetricalMainDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[j][i]) {
                return false;
            }
        }
    }
    return true;
}

bool isSymmetricalSecondaryDiagonal(int matrix[N][M], int n, int m) {
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (matrix[i][j] != matrix[n - 1 - j][n - 1 - i]) {
                return false;
            }
        }
    }
    return true;
}

// nPattern
// zPattern

// ===============
// НИЗА ОД КАРАКТЕРИ
// ===============
int strlen(char s[]) {
    int count = 0;
    for (int i = 0; s[i] != '\0'; i++) {
        count++;
    }
    return count;
}

int strlenRecursive(char s[]) {
    if (*s == '\0') return 0;
    return 1 + strlenRecursive(s + 1);
}

void transform(char s[]) {
    int write = 0;

    for (int i = 0; s[i] != '\0'; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            s[write++] = char(s[i] + ('a' - 'A'));
        } else if (s[i] >= 'a' && s[i] <= 'z') {
            s[write++] = char(s[i] - ('a' - 'A'));
        }
    }

    s[write] = '\0';
}

char toLowercase(char s) {
    if (s >= 'a' && s <= 'z') return s;
    return char(s + ('a' - 'A'));
}

char toUppercase(char s) {
    if (s >= 'A' && s <= 'Z') return s;
    return char(s - ('a' - 'A'));
}

bool isLowercase(char s) {
    return s >= 'a' && s <= 'z';
}

bool isUppercase(char s) {
    return s >= 'A' && s <= 'Z';
}

int find(char s[], char c) {
    for (int i = 0; s[i] != '\0'; i++) {
        if (s[i] == c) {
            return i;
        }
    }
    return -1;
}

int findRecursive(char s[], char c, int index) {
    if (*s == '\0') return -1;
    if (*s == c) return index;
    return findRecursive(s + 1, c, index + 1);
}

int occurs(char str[], char s) {
    int count = 0;
    for (int i = 0; str[i] != '\0'; i++) {
        if (str[i] == s) {
            count++;
        }
    }
    return count;
}

// Every recursive function needs two things:
// 1. Base case → When do we stop?
// 2. Recursive step → How do we reduce the problem?
int occursRecursive(char str[], char s) {
    if (*str == '\0') return 0;
    return (*str == s) ? 1 : 0 + occursRecursive(str + 1, s);
    // if (*str == s)
    //     return 1 + occursRecursive(str + 1, s);
    // return occursRecursive(str + 1, s);
}

bool isSubstring(char s1[], char s2[]) {
    int len1 = strlen(s1);
    int len2 = strlen(s2);

    if (len2 > len1) {
        return false;
    }

    for (int i = 0; i <= len1 - len2; i++) {
        bool match = true;

        for (int j = 0; j < len2; j++) {
            if (s1[i + j] != s2[j]) {
                match = false;
                break;
            }
        }

        if (match) {
            return true;
        }
    }

    return false;
}

bool isPalindrome(char s[]) {
    int len = strlen(s);
    for (int i = 0; i < len; i++) {
        if (s[i] != s[len - 1 - i]) {
            return false;
        }
    }
    return true;
}

bool isPalindromeRecursive(char s[], int start, int end) {
    if (start >= end) return true;
    if (s[start] != s[end]) return false;
    return isPalindromeRecursive(s, start + 1, end - 1);
}


bool isValidPassword(char s[]) {
    int min_length = 8;
    int length = strlen(s);

    if (length < min_length) {
        return false;
    }

    bool hasUppercase = false;
    bool hasLowercase = false;
    bool hasDigit = false;
    bool hasSpecial = false;

    for (int i = 0; i < length; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            hasUppercase = true;
        } else if (s[i] >= 'a' && s[i] <= 'z') {
            hasLowercase = true;
        } else if (s[i] >= '0' && s[i] <= '9') {
            hasDigit = true;
        } else if (s[i] == '!' || s[i] == '@' || s[i] == '#' ||
                   s[i] == '$' || s[i] == '%' || s[i] == '^' ||
                   s[i] == '&') {
            hasSpecial = true;
        }
    }

    return hasUppercase && hasLowercase && hasDigit && hasSpecial;
}


int main() {
    // ===============
    // БРОЕВИ
    // ===============
    // findDayMonthYear(13121990);
    // cout << sumDigits(12345) << endl;
    // cout << sumDigitsRecursive(12345) << endl;
    // cout << countDigits(12345) << endl;
    // cout << countDigitsRecursive(12345) << endl;
    // cout << countOddDigits(12345) << endl;
    // cout << countEvenDigits(12345) << endl;
    // countUp(10);
    // countUpRecursive(10);
    // countDown(10);
    // countDownRecursive(10);
    // cout << reverseDigits(12345) << endl;
    // cout << reverseDigitsRecursive(12345, 0) << endl;
    // cout << isPalindrome(12321) << endl;
    // cout << isPalindromeRecursive(12321) << endl;
    // cout << isSweetNumber(1234) << endl;
    // cout << isSweetNumber(2468) << endl;
    // cout << isMidNumber(12345) << endl;
    // cout << isMidNumber(54321) << endl;
    // cout << isOrderedNumber(12345) << endl;
    // cout << isOrderedNumber(54321) << endl;
    // cout << evenEquivalent(123, 212223) << endl;
    // sumEdgeNumber(654654);
    // cout << sumFirstK(20) << endl;
    // cout << sumFirstKRecursive(20) << endl;
    // cout << isPrime(20) << endl;
    // cout << isPrimeRecursive(20, 2) << endl;
    // cout << findNextPrime(5) << endl;
    // cout << findNextPrimeRecursive(5) << endl;
    // cout << findNextPrimeDiff(20, 2) << endl;
    // cout << factorial(10) << endl;
    // cout << factorialRecursive(10) << endl;
    // cout << fibonacci(10) << endl;
    // cout << fibonacciRecursive(10) << endl;

    // ===============
    // НИЗИ
    // ===============
    const int n = 5;
    int arr[n] = {1, 2, 3, 4, 5};
    int arr_asc[n] = {1, 2, 3, 4, 5};
    int arr_desc[n] = {5, 4, 3, 2, 1};
    int arr_dynamic[n] = {1, 4, 3, 2, 5};
    int arr_duplicates[n] = {1, 2, 3, 3, 3};

    // cout << scalar(arr, n) << endl;
    // cout << isSorted(arr, n, 0) << endl;
    // cout << isSorted(arr, n, 1) << endl;
    // arrayOrder(arr_asc, n);
    // arrayOrder(arr_desc, n);
    // arrayOrder(arr_dynamic, n);
    // cout << hasPeak(arr_dynamic, n) << endl;
    // cout << hasDip(arr_dynamic, n) << endl;
    // cout << hasPeakOrDip(arr_dynamic, n) << endl;
    // rotateRight(arr, n);
    // printElements(arr, n);
    // rotateRightByN(arr, n, 2);
    // printElements(arr, n);
    // rotateLeft(arr, n);
    // printElements(arr, n);
    // rotateLeftByN(arr, n, 2);
    // printElements(arr, n);
    // cout << remove(arr, &n, 2) << endl;
    // printElements(arr, n);
    // int removed = removeDuplicatesSorted(arr_duplicates, n);
    // printElements(arr_duplicates, removed);
    // cout << sumElements(arr, n) << endl;
    // cout << sumElementsRecursive(arr, n) << endl;
    // cout << findMin(arr, n) << endl;
    // cout << findMax(arr, n) << endl;
    // cout << findMinUsingPointers(arr, n) << endl;
    // cout << findMaxUsingPointers(arr, n) << endl;
    // transformElements(arr, n);
    // printElements(arr, n);
    // int a = 10;
    // int b = 20;
    // swap(a, b);
    // swapPtr(&a, &b);
    // swapRfr(a, b);
    // bubbleSort(arr_dynamic, n);
    // printElements(arr_dynamic, n);
    // cout << linearSearch(arr, n, 3) << endl;
    // cout << linearSearch(arr, n, 20) << endl;
    // cout << binarySearch(arr, n, 3) << endl;
    // cout << binarySearch(arr, n, 20) << endl;

    // ===============
    // МАТРИЦИ
    // ===============
    int matrix[N][M];
    // fillMatrix(matrix, N, M);
    // printMatrix(matrix, N, M);
    // printRows(matrix, N, M);
    // printCols(matrix, N, M);
    // printMainDiagonal(matrix, N, M);
    // printAboveMainDiagonal(matrix, N, M);
    // printBellowMainDiagonal(matrix, N, M);
    // printSecondaryDiagonal(matrix, N, M);
    // printAboveSecondaryDiagonal(matrix, N, M);
    // printBellowSecondaryDiagonal(matrix, N, M);
    // cout << findMin(matrix, N, M) << endl;
    // cout << findMax(matrix, N, M) << endl;
    // cout << isSymmetricalMainDiagonal(matrix, N, M) << endl;
    // cout << isSymmetricalSecondaryDiagonal(matrix, N, M) << endl;

    // ===============
    // НИЗА ОД КАРАКТЕРИ
    // ===============
    char c_uppercase = 'A';
    char c_lowercase = 'a';
    char str[20];

    cin.getline(str, 20);

    // cout << strlen(str) << endl;
    // cout << strlenRecursive(str) << endl;
    // transform(str);
    // cout << str << endl;
    // cout << toLowercase(c_uppercase) << endl;
    // cout << toUppercase(c_lowercase) << endl;
    // cout << isLowercase(c_lowercase) << endl;
    // cout << isUppercase(c_uppercase) << endl;
    // cout << find(str, 'o') << endl;
    // cout << findRecursive(str, 'o', 0) << endl;
    // cout << occurs(str, 'o') << endl;
    // cout << occurs(str, 'z') << endl;
    // cout << occursRecursive(str, 'o') << endl;
    // cout << occursRecursive(str, 'z') << endl;
    // char s1[20];
    // char s2[20];
    // cin.getline(s1, 20);
    // cin.getline(s2, 20);
    // cout << isSubstring(s1, s2) << endl;
    // cout << isPalindrome(str) << endl;
    // cout << isPalindromeRecursive(str, 0, strlen(str) - 1) << endl;
    // cout << isValidPassword(str) << endl;
}

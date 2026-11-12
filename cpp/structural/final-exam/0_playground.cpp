#include <iostream>
#include <cmath>
#include <algorithm>
#include <cstring>
#include <fstream>
using namespace std;

// --------------------
// NUMBERS
// --------------------

int most_significant(int n) {
	while (n >= 10) {
		n /= 10;
	}

	return n;
}

int min_most_significant(int a[], int n) {
	int min = most_significant(a[0]);

	for (int i = 0; i < n; i++) {
		int current = most_significant(a[i]);
		if (current < min) {
			min = current;
		}
	}

	return min;
}

int max_most_significant(int a[], int n) {
	int max = most_significant(a[0]);

	for (int i = 0; i < n; i++) {
		int current = most_significant(a[i]);
		if (current > max) {
			max = current;
		}
	}

	return max;
}

int least_significant(int n) {
	return n % 10;
}

int min_least_significant(int a[], int n) {
	int min = least_significant(n);

	for (int i = 0; i < n; i++) {
		int current = least_significant(a[i]);
		if (current < min) {
			min = current;
		}
	}

	return min;
}

int max_least_significant(int a[], int n) {
	int max = least_significant(n);

	for (int i = 0; i < n; i++) {
		int current = least_significant(a[i]);
		if (current > max) {
			max = current;
		}
	}

	return max;
}

int count_digits(int n) {
	int count = 0;

	while (n > 0) {
		count++;
		n /= 10;
	}

	return count;
}

int count_occurrences(int n, int x) {
	int count = 0;

	while (n > 0) {
		int digit = n % 10;
		if (digit == x) count++;
		n /= 10;
	}

	return count;
}

int sum_digits(int n) {
	int sum = 0;

	while (n > 0) {
		sum += n % 10;
		n /= 10;
	}

	return sum;
}

int sum_digits_pointers(int a[], int n) {
	int sum = 0;
	int *end = a + n;

	while (a < end) {
		sum += *a++;
	}

	return sum;
}

int sum_odd_digits(int n) {
	int sum = 0;

	while (n > 0) {
		int digit = n % 10;
		if (digit % 2 != 0) sum += digit;
		n /= 10;
	}

	return sum;
}

int sum_even_digits(int n) {
	int sum = 0;

	while (n > 0) {
		int digit = n % 10;
		if (digit % 2 == 0) sum += digit;
		n /= 10;
	}

	return sum;
}

int factorial(int n) {
	int result = 0;

	for (int i = 1; i < n; i++) {
		result *= i;
	}

	return result;
}

int factorial_digits(int n) {
	int result = 0;

	while (n > 0) {
		result *= n % 10;
		n /= 10;
	}

	return result;
}

int replace_digits(int n, int a, int b) {
	int result = 0;
	int multiplier = 1;

	while (n > 0) {
		int digit = n % 10;
		if (digit == a) digit = b;
		result += digit * multiplier;
		multiplier *= 10;
		n /= 10;
	}

	return result;
}

int reverse_digits(int n) {
	int reversed = 0;

	while (n > 0) {
		reversed = (reversed * 10) + (n % 10);
		n /= 10;
	}

	return reversed;
}

int transform_digit(int n) {
	int result = 0;
	int digit = most_significant(n);

	while (n > 0) {
		result = result * 10 + digit;
		n /= 10;
	}

	return result;
}

bool is_palindrome(int n) {
	return n == reverse_digits(n);
}

bool is_prime(int n) {
	if (n <= 1) return false;
	if (n == 2) return true;
	if (n % 2 == 0) return false;

	for (int i = 3; i * i <= n; i += 2) {
		if (n % i == 0) return false;
	}

	return true;
}

bool is_armstrong_number(int n) {
	int sum = sum_digits(n);
	return n == sum * sum;
}

bool is_harshad_number(int n) {
	int sum = sum_digits(n);
	return n % sum == 0;
}

bool is_strong_number(int n) {
	int sum_factorial = factorial(n);
	return n == sum_factorial;
}

// --------------------
// ARRAYS
// --------------------

template<typename Func>
void add_elements_original_order(int dest[], int src[], int n, int &index, Func func = nullptr) {
	for (int i = 0; i < n; i++) {
		if (!func || func(src[i])) {
			dest[index++] = src[i];
		}
	}
}

template<typename Func>
void add_elements_reverse_order(int dest[], int src[], int n, int &index, Func func = nullptr) {
	for (int i = n - 1; i >= 0; i--) {
		if (!func || func(src[i])) {
			dest[index++] = src[i];
		}
	}
}

void copy_elements(int a[], const int b[], const int n) {
	for (int i = 0; i < n; i++) {
		a[i] = b[i];
	}
}

void transform_elements_even_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x % 2 == 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x % 2 != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_even_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x % 2 == 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x % 2 != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_odd_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x % 2 != 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x % 2 == 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_odd_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x % 2 != 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x % 2 == 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_positive_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x > 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x < 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_positive_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x > 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x < 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_negative_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x < 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x > 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_negative_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x < 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x > 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_zeros_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x == 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_zeros_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x == 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_non_zeros_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x != 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x == 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_non_zeros_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x != 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x == 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_multiplies_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 == 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_multiplies_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 == 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 != 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_others_first_reverse_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 != 0; });
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 == 0; });
	copy_elements(a, tmp, n);
}

void transform_elements_others_first_original_order(int a[], int n) {
	int tmp[n];
	int write = 0;
	add_elements_original_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 != 0; });
	add_elements_reverse_order(tmp, a, n, write, [](const int x) { return x * 3 % 2 == 0; });
	copy_elements(a, tmp, n);
}

void transform_array_by_replacing(int a[], int n, int find, int replace) {
	for (int i = 0; i < n; i++) {
		int number = a[i];
		int result = 0;
		int multiplier = 1;

		while (number > 0) {
			int digit = n % 10;
			if (digit == find)
				digit = replace;

			result += digit * multiplier;
			multiplier *= 10;
			number /= 10;
		}

		a[i] = result;
	}
}

int sum_elements(int a[], int n) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		sum += a[i];
	}

	return sum;
}

int sum_elements_pointer(int a[], int n) {
	int sum = 0;
	int *end = a + n;

	while (a < end) {
		sum += *a;
	}

	return sum;
}

int sum_elements_pointers(int a[], int n, int start, int end) {
	int sum = 0;

	while (a + start < a + end) {
		sum += *a++;
	}

	return sum;
}

int sum_elements_recursive(int a[], int n) {
	if (n == 0) return 0;
	return a[n - 1] + sum_elements(a, n - 1);
}

int sum_elements_recursive_start_from(int a[], int n, int start) {
	if (start == n) return 0;
	return a[start] + sum_elements_recursive_start_from(a, n, start + 1);
}


int product_elements(int a[], int n) {
	int result = 1;
	for (int i = 0; i < n; i++) {
		result *= a[i];
	}
	return result;
}

int product_elements_pointer(int a[], int n) {
	int result = 0;
	int *end = a + n;

	while (a < end) {
		result *= *a++;
	}

	return result;
}

int product_elements_pointers(int a[], int n, int start, int end) {
	int result = 0;

	while (a + start < a + end) {
		result *= *a++;
	}

	return result;
}

int product_elements_recursive(int a[], int n) {
	if (n == 0) return 0;
	return a[n - 1] * sum_elements(a, n - 1);
}

int product_elements_recursive_start_from(int a[], int n, int start) {
	if (start == n) return 0;
	return a[start] * sum_elements_recursive_start_from(a, n, start + 1);
}

bool is_ascending_array(int a[], int n) {
	for (int i = 0; i < n - 1; i++) {
		if (a[i] > a[i + 1]) {
			return false;
		}
	}

	return true;
}

bool is_descending_array(int a[], int n) {
	for (int i = 0; i < n - 1; i++) {
		if (a[i] < a[i + 1]) {
			return false;
		}
	}

	return true;
}

bool is_zigzag_array(int a[], int n) {
	for (int i = 1; i < n - 1; i++) {
		if (
			!(a[i - 1] < a[i] && a[i] > a[i + 1]) ||
			!(a[i - 1] > a[i] && a[i] < a[i + 1])
		) {
			return false;
		}
	}

	return true;
}

int count_order_changes(int a[], int n) {
	if (n < 3) return 0;

	int count = 0, dir = 0;

	for (int i = 0; i < n - 1; i++) {
		int cur = 0;

		if (a[i] < a[i + 1]) {
			cur = 1;
		} else if (a[i] > a[i + 1]) {
			cur = -1;
		}

		if (cur == 0) continue;
		if (dir != 0 && cur != dir) count++;
		dir = cur;
	}

	return count;
}

int find_min(int a[], int n) {
	int min = a[0];

	for (int i = 0; i < n; i++) {
		if (a[i] < min) min = a[i];
	}

	return min;
}

int find_max(int a[], int n) {
	int max = a[0];

	for (int i = 0; i < n; i++) {
		if (a[i] > max) max = a[i];
	}

	return max;
}

int find_second_min(int a[], int n) {
	int first = a[0];
	int second = a[1];

	for (int i = 0; i < n; i++) {
		int current = a[i];
		if (current < first) {
			second = first;
			first = current;
		} else if (current < second) {
			second = current;
		}
	}

	return second;
}

int find_second_max(int a[], int n) {
	int first = a[0];
	int second = a[1];

	for (int i = 0; i < n; i++) {
		int current = a[i];
		if (current > first) {
			second = first;
			first = current;
		} else if (current > second) {
			second = current;
		}
	}

	return second;
}

int longest_palindrome(int a[], int n) {
	int max_palindrome = a[0];
	int max_palindrome_length = count_digits(max_palindrome);

	for (int i = 0; i < n; i++) {
		int current_number = a[i];
		if (is_palindrome(current_number)) {
			int current_length = count_digits(current_number);
			if (current_length > max_palindrome_length) {
				max_palindrome = current_number;
				max_palindrome_length = current_length;
			}
		}
	}

	return max_palindrome;
}

int shortest_palindrome(int a[], int n) {
	int min_palindrome = a[0];
	int min_palindrome_length = count_digits(min_palindrome);

	for (int i = 0; i < n; i++) {
		int current_number = a[i];
		if (is_palindrome(current_number)) {
			int current_length = count_digits(current_number);
			if (current_length < min_palindrome_length) {
				min_palindrome = current_number;
				min_palindrome_length = current_length;
			}
		}
	}

	return min_palindrome;
}

int longest_subarray(int a[], int n, int k) {
	int max_len = 0;
	int start_index = -1;
	int end_index = -1;

	for (int i = 0; i < n; i++) {
		int current_sum = 0;
		int current_len = 0;

		for (int j = i; j < n; j++) {
			current_sum += a[j];
			current_len++;

			if (current_sum == k) {
				if (current_len > max_len) {
					max_len = current_len;
					start_index = i;
					end_index = j;
				}
			}
		}
	}

	if (max_len > 0) {
		for (int i = start_index; i <= end_index; i++) {
			cout << a[i] << " ";
		}
		cout << endl;
	} else {
		cout << "No 0-sum subarray found" << endl;
	}

	return max_len;
}

int shortest_subarray(int a[], int n, int k) {
	int min_len = n + 1; // Initialized to n + 1 so we can easily tell if it was never updated
	int start_index = -1;
	int end_index = -1;

	for (int i = 0; i < n; i++) {
		int current_sum = 0;
		int current_len = 0;

		for (int j = i; j < n; j++) {
			current_sum += a[j];
			current_len++;

			if (current_sum > k) {
				if (current_len < min_len) {
					min_len = current_len;
					start_index = i;
					end_index = j;
				}
			}
		}
	}

	if (min_len <= n) {
		for (int i = start_index; i <= end_index; i++) {
			cout << a[i] << " ";
		}
		cout << endl;
		return min_len;
	} else {
		cout << "No subarray found with sum > " << k << endl;
		return 0;
	}
}

int smallest_element_odd_times(int a[], int n) {
	int counters[100] = {};

	for (int i = 0; i < n; i++) {
		counters[a[i]]++;
	}

	int min = a[0];

	for (int i = 0; i < n; i++) {
		if (counters[a[i]] % 2 != 0) {
			if (a[i] < min) {
				min = a[i];
			}
		}
	}

	return min;
}

int smallest_element_even_times(int a[], int n) {
	int counters[100] = {};

	for (int i = 0; i < n; i++) {
		counters[a[i]]++;
	}

	int min = a[0];

	for (int i = 0; i < n; i++) {
		if (counters[a[i]] % 2 == 0) {
			if (a[i] < min) {
				min = a[i];
			}
		}
	}

	return min;
}

int count_pairs_equal_sum(int a[], int n, int sum) {
	int count = 0;

	for (int i = 0; i < n - 1; i++) {
		int current_sum = a[i] + a[i + 1];
		if (current_sum == sum) {
			count++;
		}
	}

	return count;
}

void rotate_right_by_k(int a[], int n, int k) {
	for (int i = 0; i < k; i++) {
		int temp = a[n - 1];

		for (int j = n - 1; j > 0; j--) {
			a[j] = a[j - 1];
		}

		a[0] = temp;
	}
}

void rotate_left_by_k(int a[], int n, int k) {
	for (int i = 0; i < k; i++) {
		int temp = a[0];

		for (int j = 0; j < n - 1; j++) {
			a[j] = a[j + 1];
		}

		a[n - 1] = temp;
	}
}

void rotate_zero_values_last(int a[], int n) {
	int write = 0;

	for (int i = 0; i < n; i++) {
		if (a[i] != 0) {
			a[write++] = a[i];
		}
	}

	for (int i = write; i < n; i++) {
		a[i] = 0;
	}
}

int remove_duplicates(int a[], int n) {
	if (n == 0) return 0;

	int write = 0;
	int tmp[n];
	tmp[write++] = a[0];

	for (int i = 1; i < n; i++) {
		bool duplicate = false;

		for (int j = 0; j < write; j++) {
			if (a[i] == tmp[j]) {
				duplicate = true;
				break;
			}
		}

		if (!duplicate) {
			tmp[write++] = a[i];
		}
	}

	for (int i = 0; i < write; i++) {
		a[i] = tmp[i];
	}

	return write;
}

void selection_sort(int a[], int n) {
	for (int i = 0; i < n - 1; i++) {
		for (int j = i + 1; j < n; j++) {
			if (a[j] < a[i]) {
				int tmp = a[i];
				a[i] = a[j];
				a[j] = tmp;
			}
		}
	}
}

void bubble_sort(int a[], int n) {
	for (int i = 0; i < n - 1; i++) {
		bool swapped = false;

		for (int j = 0; j < n - 1 - i; j++) {
			if (a[j] > a[j + 1]) {
				int tmp = a[j];
				a[j] = a[j + 1];
				a[j + 1] = tmp;
				swapped = true;
			}
		}

		if (!swapped) break;
	}
}

// --------------------
// MATRIX
// --------------------

void read_matrix(int a[100][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			cin >> a[i][j];
		}
	}
}

void fill_matrix(int a[100][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			a[i][j] = 0;
		}
	}
}

void replace_matrix(int a[][100], int n, int m, int find, int replace) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (a[i][j] == find) {
				a[i][j] = replace;
			}
		}
	}
}

void print_elements_main_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i == j) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

void print_elements_above_main_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i < j) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

void print_elements_bellow_main_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i > j) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

void print_elements_anti_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j == n - 1) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

void print_elements_above_anti_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j < n - 1) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

void print_elements_bellow_anti_diagonal(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j > n - 1) {
				cout << a[i][i] << " ";
			}
		}
		cout << endl;
	}
}

int sum_elements_main_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i == j) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

int sum_elements_above_main_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i < j) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

int sum_elements_bellow_main_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i > j) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

int sum_elements_anti_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j == n - 1) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

int sum_elements_above_anti_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j < n - 1) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

int sum_elements_bellow_anti_diagonal(int a[][100], int n, int m) {
	int sum = 0;

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i + j > n - 1) {
				sum += a[i][j];
			}
		}
	}

	return sum;
}

void print_even_rows_left_to_right(int a[][100], int n, int m) {
	// ----- Solution 1 -----
	for (int i = 0; i < n; i += 2) {
		for (int j = 0; j < m; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;

		// ----- Solution 2 -----
		// if (i % 2 != 0) continue;

		// ----- Solution 3 -----
		// if (i % 2 == 0) {
		// 	for (int j = 0; j < m; j++) {
		// 		cout << a[i][j] << " ";
		// 	}
		// 	cout << endl;
		// }
	}
}

void print_odd_rows_left_to_right(int a[][100], int n, int m) {
	for (int i = 1; i < n; i += 2) {
		for (int j = 0; j < m; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}
}

int count_rows_consecutive_n_occurrences(int a[][100], int n, int m, int x, int y) {
	int row_count = 0;

	for (int i = 0; i < n; i++) {
		int current_count = 0;

		for (int j = 0; j < m; j++) {
			if (a[i][j] == x) {
				current_count++;
			} else {
				if (current_count >= y)
					row_count++;
				current_count = 0;
			}
		}
	}

	return row_count;
}

int count_rows_ones_occurrences(int a[][100], int n, int m, int x, int y) {
	int row_count = 0;

	for (int i = 0; i < n; i++) {
		int current_count = 0;

		for (int j = 0; j < m; j++) {
			if (a[i][j] == 1) {
				current_count++;
				if (current_count >= 3) {
					row_count++;
					break;
				}
			}
		}
	}

	return row_count;
}

void row_average_array(int a[][100], int n, int m) {
	double average_values[n];

	for (int i = 0; i < n; i++) {
		int current_sum = 0;

		for (int j = 0; j < m; j++) {
			current_sum += a[i][j];
		}

		double average = float(current_sum) / m;
		double max_diff = 0.0;

		for (int j = 0; j < m; j++) {
			double current_diff = abs(average - a[i][j]);
			if (current_diff > max_diff) {
				max_diff = current_diff;
			}
		}

		average_values[i] = max_diff;
	}

	for (int i = 0; i < n; i++) {
		cout << average_values[i] << " ";
	}
	cout << endl;
}

void transform_matrix_elements(int a[][100], int n, int m, int x) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			int element = a[i][j];
			if (element < x) {
				a[i][j] = -1;
			} else if (element > x) {
				a[i][j] = 1;
			} else {
				a[i][j] = 0;
			}
		}
	}
}

void print_pattern_Z(int a[][100], int n, int m) {
	int size = min(n, m);

	for (int j = 0; j < size; j++) {
		cout << a[0][j];
	}
	for (int j = 0; j < size; j++) {
		cout << a[size - 1][j];
	}
	for (int i = 1; i < size - 1; i++) {
		cout << a[i][size - 1 - i];
	}
}

void print_pattern_N(int a[][100], int n, int m) {
	int size = min(n, m);

	for (int i = 0; i < size; i++) {
		cout << a[i][0];
	}
	for (int i = 0; i < size; i++) {
		cout << a[i][size - 1];
	}
	for (int i = 1; i < size - 1; i++) {
		cout << a[i][i];
	}
}

void print_pattern_X(int a[][100], int n, int m) {
	int size = min(n, m);
	int skipped = 0;
	bool center_found = false;

	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
			if (i == j && i + j == size - 1) {
				skipped = a[i][j];
				center_found = true;
				continue;
			}

			if (i == j || i + j == size - 1) {
				cout << a[i][j] << " ";
			}
		}
	}

	if (center_found) {
		cout << skipped;
	}
}

void print_pattern_plus(int a[][100], int n, int m) {
	int size = min(n, m);
	int center_y = size % 2 == 0 ? size / 2 - 1 : size / 2;
	int center_x = size % 2 == 0 ? size / 2 - 1 : size / 2;

	for (int i = 0; i < size; i++) {
		cout << a[i][center_x];
	}

	for (int j = 0; j < size; j++) {
		cout << a[center_y][j];
	}
}

int sum_pattern_Z(int a[][100], int n, int m) {
	int sum = 0;
	int size = min(n, m);

	for (int j = 0; j < size; j++) {
		sum += a[0][j];
	}
	for (int j = 0; j < size; j++) {
		sum += a[size - 1][j];
	}
	for (int i = 1; i < size - 1; i++) {
		sum += a[i][size - 1 - i];
	}

	return sum;
}

int sum_pattern_N(int a[][100], int n, int m) {
	int sum = 0;
	int size = min(n, m);

	for (int i = 0; i < size; i++) {
		sum += a[i][0];
	}
	for (int i = 0; i < size; i++) {
		sum += a[i][size - 1];
	}
	for (int i = 1; i < size - 1; i++) {
		sum += a[i][i];
	}

	return sum;
}

int sum_pattern_X(int a[][100], int n, int m) {
	int sum = 0;
	int size = min(n, m);
	int skipped = 0;
	bool center_found = false;

	for (int i = 0; i < size; i++) {
		for (int j = 0; j < size; j++) {
			if (i == j && i + j == size - 1) {
				skipped = a[i][j];
				center_found = true;
				continue;
			}

			if (i == j || i + j == size - 1) {
				sum += a[i][j];
			}
		}
	}

	if (center_found) {
		sum += skipped;
	}

	return sum;
}

int sum_pattern_plus(int a[][100], int n, int m) {
	int sum = 0;
	int size = min(n, m);
	int center_y = size % 2 == 0 ? size / 2 - 1 : size / 2;
	int center_x = size % 2 == 0 ? size / 2 - 1 : size / 2;

	for (int i = 0; i < size; i++) {
		sum += a[i][center_x];
	}

	for (int j = 0; j < size; j++) {
		sum += a[center_y][j];
	}

	return sum;
}

void print_submatrix_2x2_sliding_window(int a[][100], int n, int m) {
	// OUTER SLIDING WINDOW
	for (int i_k = 0; i_k < n - 1; i_k++) {
		for (int j_k = 0; j_k < m - 1; j_k++) {
			// INNER PRINTING 2x2
			for (int i = 0; i < 2; i++) {
				for (int j = 0; j < 2; j++) {
					cout << a[i_k + i][j_k + j] << " ";
				}
				cout << endl;
			}
		}
	}
}

void print_submatrix_pattern_z(int a[][100], int n, int m) {
	int max_size = min(n, m);
	for (int k = 2; k <= max_size; k++) {
		for (int j = 0; j < k; j++) {
			cout << a[0][j] << " ";
		}
		for (int i = 1; i < k - 1; i++) {
			cout << a[i][k - 1 - i] << " ";
		}
		for (int j = 0; j < k; j++) {
			cout << a[k - 1][j] << " ";
		}
		cout << endl;
	}
}

void print_submatrix_pattern_N(int a[][100], int n, int m) {
	int max_size = min(n, m);

	for (int k = 2; k <= max_size; k++) {
		// 1. Left column of size k
		for (int i = 0; i < k; i++) {
			cout << a[i][0] << " ";
		}
		// 2. Main diagonal of size k
		for (int i = 1; i < k - 1; i++) {
			cout << a[i][i] << " ";
		}
		// 3. Right column of size k
		for (int i = 0; i < k; i++) {
			cout << a[i][k - 1] << " ";
		}
		cout << endl;
	}
}

void print_submatrix_pattern_X(int a[][100], int n, int m) {
	int max_size = min(n, m);

	for (int k = 2; k <= max_size; k++) {
		int skipped = 0;
		bool center_found = false;

		for (int i = 0; i < k; i++) {
			for (int j = 0; j < k; j++) {
				if (i == j && i + j == k - 1) {
					skipped = a[i][j];
					center_found = true;
					continue;
				}
				if (i == j || i + j == k - 1) {
					cout << a[i][j] << " ";
				}
			}
		}

		if (center_found) {
			cout << skipped << " ";
		}
		cout << endl;
	}
}

void print_submatrix_pattern_plus(int a[][100], int n, int m) {
	int max_size = min(n, m);

	for (int k = 2; k <= max_size; k++) {
		int center_y = k % 2 == 0 ? k / 2 - 1 : k / 2;
		int center_x = k % 2 == 0 ? k / 2 - 1 : k / 2;

		// 1. Vertical line of size k
		for (int i = 0; i < k; i++) {
			cout << a[i][center_x] << " ";
		}
		// 2. Horizontal line of size k
		for (int j = 0; j < k; j++) {
			cout << a[center_y][j] << " ";
		}
		cout << endl;
	}
}

void print_rows_odd_left_to_right(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i % 2 != 0) {
				cout << a[i][j] << " ";
			} else {
				cout << a[i][m - 1 - j] << " ";
			}
		}
	}
}

void print_rows_even_left_to_right(int a[][100], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			if (i % 2 == 0) {
				cout << a[i][j] << " ";
			} else {
				cout << a[i][m - 1 - j] << " ";
			}
		}
	}
}

void print_cols_odd_top_to_bottom(int a[][100], int n, int m) {
	for (int j = 0; j < m; j++) {
		for (int i = 0; i < n; i++) {
			if (j % 2 != 0) {
				cout << a[i][j] << " ";
			} else {
				cout << a[n - 1 - i][j] << " ";
			}
		}
	}
}

void print_cols_even_top_to_bottom(int a[][100], int n, int m) {
	for (int j = 0; j < m; j++) {
		for (int i = 0; i < n; i++) {
			if (j % 2 == 0) {
				cout << a[i][j] << " ";
			} else {
				cout << a[n - 1 - i][j] << " ";
			}
		}
	}
}

void print_sum_submatrix_2x2_sliding_window(int a[][100], int n, int m) {
	int max_sum = 0;

	for (int i_k = 0; i_k < n - 1; i_k++) {
		for (int j_k = 0; j_k < m - 1; j_k++) {
			int current_sum = 0;

			for (int i = 0; i < 2; i++) {
				for (int j = 0; j < 2; j++) {
					current_sum += a[i_k + i][j_k + j];
				}
			}

			cout << current_sum << endl;

			if (current_sum > max_sum) {
				max_sum = current_sum;
			}
		}
	}

	cout << max_sum << endl;
}

void find_min_transform_matrix(int a[][100], int n, int m) {
	int min = a[0][0];

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			int current = a[i][j];
			if (current < min) {
				min = current;
			}
		}
	}

	for (int i = 0; i < n; i++) {
		for (int j = 0; j < m; j++) {
			a[i][j] = min;
		}
	}
}

void find_largest_diamond(int a[][100], int n, int m, int pos_x, int pos_y) {
	int dist_top = pos_x;
	int dist_bottom = (n - 1) - pos_x;
	int dist_left = pos_y;
	int dist_right = (m - 1) - pos_y;
	int max_r = min({dist_top, dist_bottom, dist_left, dist_right});
	int total_sum = 0;

	for (int i = pos_x - max_r; i <= pos_x + max_r; i++) {
		for (int j = pos_y - max_r; j <= pos_y + max_r; j++) {
			if (abs(i - pos_x) + abs(j - pos_y) == max_r) {
				total_sum += a[i][j];
			}
		}
	}
}

// --------------------
// STRINGS
// --------------------

void trim_whitespace(char *str) {
	int len = strlen(str);

	int start_index = -1;
	int end_index = -1;

	// Find first non-space
	for (int i = 0; i < len; i++) {
		if (!isspace((unsigned char) str[i])) {
			start_index = i;
			break;
		}
	}

	// String contains only whitespace
	if (start_index == -1) {
		str[0] = '\0';
		return;
	}

	// Find last non-space
	for (int i = len - 1; i >= 0; i--) {
		if (!isspace((unsigned char) str[i])) {
			end_index = i;
			break;
		}
	}

	int write = 0;
	for (int i = start_index; i <= end_index; i++) {
		str[write++] = str[i];
	}

	str[write] = '\0';
}

bool is_substring(char haystack[], char needle[]) {
	return strstr(haystack, needle);
}

bool is_substring_custom(char haystack[], char needle[]) {
	int haystack_len = strlen(haystack);
	int needle_len = strlen(needle);

	if (haystack_len < needle_len)
		return false;

	for (int i = 0; i <= haystack_len - needle_len; i++) {
		bool found = true;

		for (int j = 0; j < needle_len; j++) {
			if (haystack[i + j] != needle[j]) {
				found = false;
				break;
			}
		}

		if (found) {
			return true;
		}
	}

	return false;
}

int substring_count(char haystack[], char needle[]) {
	int haystack_len = strlen(haystack);
	int needle_len = strlen(needle);

	if (haystack_len < needle_len)
		return false;

	int count = 0;

	for (int i = 0; i <= haystack_len - needle_len; i++) {
		bool found = true;

		for (int j = 0; j < needle_len; j++) {
			if (haystack[i + j] != needle[j]) {
				found = false;
				break;
			}
		}

		if (found) {
			count++;
		}
	}

	return count;
}

void print_substring_between_first_last_digit(const char *str) {
	int start = -1;
	int end = -1;

	int len = strlen(str);

	for (int i = 0; i < len; i++) {
		if (start == -1 && isdigit(str[i])) {
			start = i;
			break;
		}
	}

	for (int i = len - 1; i >= 0; i--) {
		if (end == -1 && isdigit(str[i])) {
			end = i;
			break;
		}
	}

	for (int i = start; i <= end; i++) {
		cout << str[i];
	}
	cout << endl;
}

void print_substring_between_x_and_y(const char *str, char x, char y) {
	int start = -1;
	int end = -1;

	int len = strlen(str);

	for (int i = 0; i < len; i++) {
		if (start == -1 && str[i] == x) {
			start = i;
			break;
		}
	}

	for (int i = len - 1; i >= 0; i--) {
		if (end == -1 && str[i] == y) {
			end = i;
			break;
		}
	}

	for (int i = start; i <= end; i++) {
		cout << str[i];
	}
	cout << endl;
}

void print_substring_between_start_end(const char *str, int start, int end) {
	if (start < end) return;
	int len = strlen(str);
	if (len < end) return;

	for (int i = start; i <= end; i++) {
		cout << str[i];
	}
	cout << endl;
}

bool is_palindrome(const char *str) {
	int len = strlen(str);

	for (int i = 0; i < len / 2; i++) {
		if (str[i] != str[len - 1 - i]) {
			return false;
		}
	}

	return true;
}

void find_longest_palindrome() {
	char str[100];
	char longest_palindrome[100];
	int max = 0;

	while (cin.getline(str, 100)) {
		if (is_palindrome(str)) {
			int current_length = strlen(str);
			if (current_length > max) {
				max = current_length;
				strcpy(longest_palindrome, str);
			}
		}
	}

	cout << longest_palindrome << endl;
}

bool has_special(const char *str) {
	for (int i = 0; str[i] != '\0'; i++) {
		if (!isalnum(str[i])) {
			return true;
		}
	}
	return false;
}

void find_palindrome_special() {
	char str[100];

	while (cin.getline(str, 100)) {
		if (is_palindrome(str) && has_special(str)) {
			cout << str << endl;
		}
	}
}

void caesar_cipher(char *str, int k) {
	k = k % 26;

	for (int i = 0; str[i] != '\0'; i++) {
		if (isupper(str[i])) {
			str[i] = (str[i] - 'A' + k) % 26 + 'A';
		} else {
			str[i] = (str[i] - 'a' + k) % 26 + 'a';
		}
	}
}

void find_replace(char *str, char find, char replace) {
	for (int i = 0; str[i] != '\0'; i++) {
		if (str[i] == find) {
			str[i] = replace;
		}
	}
}

void compress_string(char *str) {
	int len = strlen(str);
	int write = 0;
	int count = 1;

	for (int i = 1; i < len; i++) {
		if (str[i] == str[i - 1]) {
			count++;
		} else {
			str[write++] = str[i - 1];
			str[write++] = count + '0';
			count = 1;
		}
	}

	// Write the last group
	str[write++] = str[len - 1];
	str[write++] = count + '0';

	str[write] = '\0';
}

int substringCount(const char *haystack, const char *needle) {
	int strLen = strlen(haystack);
	int subLen = strlen(needle);

	if (subLen == 0) {
		return 0;
	}

	int count = 0;

	for (int i = 0; i <= strLen - subLen; i++) {
		bool match = true;

		for (int j = 0; j < subLen; j++) {
			if (haystack[i + j] != needle[j]) {
				match = false;
				break;
			}
		}

		if (match) {
			count++;
		}
	}

	return count;
}

int consecutiveSubstringCount(const char *str, const char *sub) {
	int strLen = strlen(str);
	int subLen = strlen(sub);

	if (subLen == 0) {
		return 0;
	}

	int maxCount = 0;

	for (int i = 0; i <= strLen - subLen; i++) {
		int count = 0;
		int pos = i;

		while (pos <= strLen - subLen) {
			bool match = true;

			for (int j = 0; j < subLen; j++) {
				if (str[pos + j] != sub[j]) {
					match = false;
					break;
				}
			}

			if (match == false) {
				break;
			}

			count++;
			pos += subLen;
		}

		if (count > maxCount) {
			maxCount = count;
		}
	}

	return maxCount;
}


// --------------------
// RECURSIVE FUNCTIONS
// --------------------

void recursive_sequence(int n, int k = 5) {
	if (n == 0) return;
	cout << n << " ";
	recursive_sequence(n - k, k);
	cout << n << " ";
}

void recursive_sequence_alt(int n, int k = 3) {
	cout << n << " ";
	if (n <= 0) return;
	recursive_sequence(n - k, k);
	cout << n << " ";
}

char recursive_punctuation_search(const char str[]) {
	if (*str == '\0') return *str;
	if (ispunct(*str)) return *str;
	return recursive_punctuation_search(str + 1);
}

char recursive_uppercase_search(const char str[]) {
	if (*str == '\0') return *str;
	if (isupper(*str)) return *str;
	return recursive_uppercase_search(str + 1);
}

int recursive_negative_digits_count(int a[], int n) {
	if (n == 0) return 0;
	if (a[n - 1] < 0) return recursive_negative_digits_count(a, n - 1) + 1;
	return recursive_negative_digits_count(a, n - 1);
}

int recursive_max_digit(int n) {
	if (n == 0) return 0;
	int max = n % 10;
	int current_max = recursive_max_digit(n / 10);
	return current_max > max ? current_max : max;
}

void recursive_caesar_cipher(char str[], int k) {
	if (*str == '\0') return;

	k = k % 26;

	if (isupper(*str)) {
		*str = (*str - 'A' + k) % 26 + 'A';
	} else {
		*str = (*str - 'a' + k) % 26 + 'a';
	}

	recursive_caesar_cipher(str + 1, k);
}

bool recursive_is_palindrome(const char str[], int left, int right) {
	if (left > right) return true;
	if (str[left] != str[right]) return false;
	return recursive_is_palindrome(str, left + 1, right - 1);
}

void print_starts(int n) {
	if (n == 0) return;
	cout << "*";
	print_starts(n - 1);
}

void print_triangle(int n) {
	if (n == 0) return;
	print_starts(n);
	cout << endl;
	print_triangle(n - 1);
}

int print_digits(int n) {
	if (n == 0)
		return 0;

	int digit = n % 10;

	if (digit % 2 != 0) {
		cout << digit << " ";
		return digit + print_digits(n / 10);
	} else {
		int sum = print_digits(n / 10);
		cout << digit << " ";
		return sum;
	}
}


// --------------------
// POINTERS
// --------------------

void iterate_array_using_pointers(int a[], int n) {
	int *end = a + n;

	while (a != end) {
		cout << *a++ << " ";
	}
	cout << endl;
}

int sum_array_using_pointers(int a[], int n) {
	int sum = 0;
	int *end = a + n;

	while (a != end) {
		sum += *a++;
	}

	return sum;
}


// ----------------------
// FILE READ & FILE WRITE
// ----------------------
void read_file() {
	// 1. Open stream
	ifstream file("0_read_file.txt");


	// 2. Check if stream is open
	if (!file.is_open()) {
		cout << "Failed to open the file" << endl;
		return;
	}

	// 3. Read and process stream data
	char c;
	char word[100];
	char entire_line[100];

	// 3.1. Read character by character
	while (file.get(c)) {
		cout << c;
	}
	cout << endl;
	// Reset for reading again
	file.clear(); // 1. Clear EOF and fail bits
	file.seekg(0, std::ios::beg); // 2. Move read pointer to the beginning


	// 3.2. Read until white space
	while (file >> word) {
		cout << word << " ";
	}
	cout << endl;
	file.clear();
	file.seekg(0, std::ios::beg);


	// 3.3. Read entire line until \n
	while (file.getline(entire_line, 100)) {
		cout << entire_line;
	}
	cout << endl;
	file.clear();
	file.seekg(0, std::ios::beg);

	// 4. Close the stream
	file.close();
}

void write_file() {
	// 1. Open file stream
	ofstream file("0_write_file.txt");

	// 2. Check if stream is opened
	if (!file.is_open()) {
		cout << "Failed to open file" << endl;
		return;
	}

	// 3. Process the file stream
	string str;
	str.append("lets write to this file.");
	str.append(" Lets append some more text");
	file.write(str.data(), 100);

	// 4. Close file stream
	file.close();
}

// --------------------
// HELPER FUNCTIONS
// --------------------

void print_array(int a[], int n) {
	for (int i = 0; i < n; i++) {
		cout << a[i] << " ";
	}
	cout << endl;
}

void print_matrix(int *a[], int n, int m) {
	for (int i = 0; i < n; i++) {
		for (int j = 0; j < n; j++) {
			cout << a[i][j] << " ";
		}
		cout << endl;
	}
}


int main() {
	int n, a[100];
	if (!(cin >> n)) return 0;
	for (int i = 0; i < n; i++) cin >> a[i];

	int num = a[0];

	// NUMBERS
	cout << most_significant(num) << endl;
	cout << min_most_significant(a, n) << endl;
	cout << max_most_significant(a, n) << endl;
	cout << least_significant(num) << endl;
	cout << min_least_significant(a, n) << endl;
	cout << max_least_significant(a, n) << endl;
	cout << count_digits(num) << endl;
	cout << count_occurrences(num, 5) << endl;
	cout << sum_digits(num) << endl;
	cout << sum_digits_pointers(a, n) << endl;
	cout << sum_odd_digits(num) << endl;
	cout << sum_even_digits(num) << endl;
	cout << factorial(num) << endl;
	cout << factorial_digits(num) << endl;
	cout << replace_digits(num, 1, 9) << endl;
	cout << reverse_digits(num) << endl;
	cout << transform_digit(num) << endl;
	cout << is_palindrome(num) << endl;
	cout << is_prime(num) << endl;
	cout << is_armstrong_number(num) << endl;
	cout << is_harshad_number(num) << endl;
	cout << is_strong_number(num) << endl;

	// ARRAYS
	transform_elements_even_first_reverse_order(a, n);
	transform_elements_even_first_original_order(a, n);
	transform_elements_odd_first_reverse_order(a, n);
	transform_elements_odd_first_original_order(a, n);
	transform_elements_positive_first_reverse_order(a, n);
	transform_elements_positive_first_original_order(a, n);
	transform_elements_negative_first_reverse_order(a, n);
	transform_elements_negative_first_original_order(a, n);
	transform_elements_zeros_first_reverse_order(a, n);
	transform_elements_zeros_first_original_order(a, n);
	transform_elements_non_zeros_first_reverse_order(a, n);
	transform_elements_non_zeros_first_original_order(a, n);
	transform_elements_multiplies_first_reverse_order(a, n);
	transform_elements_multiplies_first_original_order(a, n);
	transform_elements_others_first_reverse_order(a, n);
	transform_elements_others_first_original_order(a, n);
	transform_array_by_replacing(a, n, 9, 7);

	cout << sum_elements(a, n) << endl;
	cout << sum_elements_pointer(a, n) << endl;
	cout << sum_elements_pointers(a, n, 0, n) << endl;
	cout << sum_elements_recursive(a, n) << endl;
	cout << sum_elements_recursive_start_from(a, n, 0) << endl;
	cout << product_elements(a, n) << endl;
	cout << product_elements_pointer(a, n) << endl;
	cout << product_elements_pointers(a, n, 0, n) << endl;
	cout << product_elements_recursive(a, n) << endl;
	cout << product_elements_recursive_start_from(a, n, 0) << endl;
	cout << is_ascending_array(a, n) << endl;
	cout << is_descending_array(a, n) << endl;
	cout << is_zigzag_array(a, n) << endl;
	cout << count_order_changes(a, n) << endl;
	cout << find_min(a, n) << endl;
	cout << find_max(a, n) << endl;
	cout << find_second_min(a, n) << endl;
	cout << find_second_max(a, n) << endl;
	cout << longest_palindrome(a, n) << endl;
	cout << shortest_palindrome(a, n) << endl;
	longest_subarray(a, n, 10);
	shortest_subarray(a, n, 10);
	cout << smallest_element_odd_times(a, n) << endl;
	cout << smallest_element_even_times(a, n) << endl;
	cout << count_pairs_equal_sum(a, n, 10) << endl;
	rotate_right_by_k(a, n, 2);
	rotate_left_by_k(a, n, 2);
	rotate_zero_values_last(a, n);
	remove_duplicates(a, n);
	selection_sort(a, n);
	bubble_sort(a, n);

	// HELPER FUNCTIONS
	print_array(a, n);

	// READ & WRITE FILE
	read_file();
	write_file();

	return 0;
}

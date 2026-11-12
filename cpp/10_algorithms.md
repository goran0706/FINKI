# Cheat Sheet

## Аритметички оператори

- `+` Собирање (Addition)
- `-` Одземање (Subtraction)
- `*` Множење (Multiplication)
- `/` Делење (Division)
- `%` Остаток при делење (Modulo/remainder)

## Термини

- **Цел број** е број што нема децимален дел (нема запирка или точка).
- **Реален број** е секој број на бројната права - вклучува цели, децимални и ирационални броеви.
- **Природен број** е позитивен цел број (1, 2, 3, …). Во некои случаи и 0 се смета за природен број.
- **Прост број** е природен број поголем од 1 што има точно два делители: 1 и самиот број.
- **Сума** - збир од два или повеќе броеви `sum = a + b`
- **Разлика** - одземање на два или повеќе броеви `difference = a - b`
- **Производ** - множење на два или повеќе броеви `product = a * b`
- **Целобројно делење** - резултат од делење на два броја `integer division = a / b`
- **Остаток од делење** - остаток при делење на два или повеќе броеви `remainder = a % b`
- **Стандарден Влез** - влез од тастатура преку CLI `cin >> n`
- **Стандарден Излез** - излез преку печатење на екран во CLI `cout << n`
- **Палиндром** (Palindrome) - кои се читаат исто и одлево надесно и оддесно налево
- **Аритметичка средина** - резултат од делење на сума броеви со бројот на броевите
- **Инклузивност**:
    - Инклузивно: `[ ]`
    - Ексклузивно: `( )`
    - Варијации: `( ] или [ )`

## Манипулација со броеви

- Земање цифра на крај од број:
  ```cpp
  int n = 123;
  int last_digit = n % 10;
  ```
- Земање цифра на почеток од број:
  ```cpp
  int n = 123;

  while (n >= 10) {
      n /= 10;
  }

  int first_digit = n;
  ```
- Додавање цифра на крај од број:
  ```cpp
  int n = 123;
  int m = 4;
  n = n * 10 + m;
  ```
- Додавање цифра на почеток од број:
  ```cpp
  int n = 123;
  int m = 4;
  n = m * (int) pow(10, countDigits(n)) + n;
  ```
- Бришење цифра на крај од број:
  ```cpp
  int n = 123;
  n /= 10;
  ```
- Бришење цифра на почеток од број:
  ```cpp
  int n = 123;
  n = n % (int) pow(10, countDigits(n) - 1);
  ```
- Најзначајната цифра од бројот - првата цифра од бројот:
  ```cpp
  int n = 123;

  while (n >= 10) {
      n /= 10;
  }

  int most_significant = n;
  ```
- Најмалку значајната цифра од бројот - последната цифра од бројот:
  ```cpp
  int n = 123;
  int least_significant = n % 10;
  ```
- Превртен број:
  ```cpp
  int n = 123;
  int reversed = 0;

  while (n > 0) {
      int digit = n % 10;
      reversed = reversed * 10 + digit;
      n /= 10;
  }
  ```
- Парни броеви:
  ```cpp
  int n = 123;
  bool even = n % 2 == 0;
  ```
- Непарни броеви:
  ```cpp
  int n = 123;
  bool odd = n % 2 != 0;
  ```
- Извлекувањето на цифрата од соодветната позиција наизменично, слично на парни/непарни позиции.
  ```cpp
  int n = 123;
  int a[3];
  int b[3];

  bool flag = false;
  int index_a = 0;
  int index_b = 0;

  for (int i = 0; i < 3; i++) {
      if (flag) {
          flag = false;
          a[index_a++] = n % 10;
      } else {
          flag = true;
          b[index_b++] = n % 10;
      }
      n /= 10;
  }
  ```
- Процент на нешто:
  ```cpp
  double price = 100;
  double TAX_RATE = 18;
  double tax = price * TAX_RATE / 100;
  ```
- Процент од вкупно:
  ```cpp
  double total = 100;
  double number = 18;
  double percent = number / 100 * 100;
  ```
- Замена на вредности зачувани во варијабли:
  ```cpp
  int a = 10;
  int b = 20;
  
  int temp = a;
  a = b;
  b = temp;
  ```
- Замена со користење на поинтери:
  ```cpp
  void swap(int *a, int *b) {
      int temp = *a;
      *a = *b;
      *b = temp;
  }
  ```
- Замена со користење на референци:
  ```cpp
  void swap(int &a, int &b) {
      int temp = a;
      a = b;
      b = temp;
  }
  ```

## Манипулација со букви

- Конверзија на голема во мала буква:
  ```cpp
  char c = 'A';
  char lowercase = c + ('a' - 'A');
  ```
- Конверзија на мала во голема буква:
  ```cpp
  char c = 'a';
  char uppercase = c - ('a' - 'A');
  ```
- Да се напише функција што ќе одредува колку пати даден знак се наоѓа во даден стринг, со користење на индекс.
  ```cpp
  int occurs(char str[], char c) {
      int count = 0;
  
      for (int i = 0; str[i] != '\0'; i++) {
          if (str[i] == c) {
              count++;
          }
      }
  
      return count;
  }
  ```
- Да се напише функција што ќе одредува колку пати даден знак се наоѓа во даден стринг, без користење на индекс.
  ```cpp
  int occurs(char str[], char c) {
      int count = 0;
  
      while (*str != '\0') {
          if (*str == c) {
              count++;
          }
          str++;
      }
  
      return count;
  }
  ```
- Да се напише итеративна функција што ќе ја одредува должината на една текстуална низа.
  ```cpp
  int length(char str[]) {
      int count = 0;
  
      while (*str != '\0') {
          count++;
          str++;
      }
  
      return count;
  }
  ```
- Да се напише рекурзивна функција што ќе ја одредува должината на една текстуална низа.
  ```cpp
  int length(char str[]) {
      if (*str == '\0') return 0;
      return 1 + length(str + 1);
  }
  ```
- Да се напише функција која ќе одредува дали една текстуална низа е подниза на друга текстуална низа.
  ```cpp
  bool isSubstring(char s1[], char s2[]) {
      int i, j;
  
      int n = strlen(s1);
      int m = strlen(s2);
  
      if (n < m) return false;
  
      // За да не излеземе надвор од низата: i < n - m
      // Ја споредуваме поднизата од позиција: s1[i + j] != s2[j]
  
      for (i = 0; i < n - m; i++) {
          for (j = 0; j < m; j++) {
              if (s1[i + j] != s2[j]) {
                  break;
              }
          }
          if (j == m) return true;
      }
  } 
  ```
- Да се напише итеративна функција која ќе проверува дали дадена текстуална низа е палиндром.
  ```cpp
  bool isPalindrome(char str[]) {
      int n = strlen(str);
  
      // Итерираме до пола
      // Споредуваме карактери од почеток со крај
  
      for (int i = 0; i < n / 2; i++) {
          if (str[i] != str[n - 1 - i]) {
              return false;
          }
      }
  
      return true;
  } 
  ```
- Да се напише рекурзивна функција која ќе проверува дали дадена текстуална низа е палиндром.
  ```cpp
  bool isPalindromeRec(char str[], int left, int right) {
      if (left >= right) return true;
      if (str[left] != str[right]) return false;
      return isPalindromeRec(str, left + 1, right - 1);
  }
  
  bool isPalindromeRec(char str[]) {
      int n = strlen(str);
      return isPalindromeRec(str, 0, n - 1);
  } 
  ```
- Да се напише функција која за дадена текстуална низа ќе одредува дали таа е доволно сложена за да биде лозинка.
  Секоја лозинка мора да содржи барем една буква, барем една цифра и барем еден специјален знак
  ```cpp
  bool isValidPassword(char str[]) {
      int n = strlen(str);
      if (n < 8) return false;
  
      bool hasAlpha = false;
      bool hasDigit = false;
      bool hasSpecial = false;
  
      for (int i = 0; str[i] != '\0'; i++) {
          if (isalpha(str[i]))
              hasAlpha = true;
          else if (isdigit(str[i]))
              hasDigit = true;
          else
              hasSpecial = true;
      }
  
      return hasAlpha && hasDigit && hasSpecial;
  }
  ```
- Да се напише функција која ќе ги промени малите букви во големи и обратно, и ќе ги отстрани сите цифри и специјални
  знаци.
  ```cpp
  void str_convert(char str[]) {
      int read = 0;
      int write = 0;
  
      while (str[read] != '\0') {
          if (isalpha(str[read])) {
              if (isupper(str[read])) {
                  str[write] = tolower(str[read]);
              } else {
                  str[write] = toupper(str[read]);
              }
              write++;
          }
          read++;
      }
  
      str[write] = '\0';
  }
  ```
- Проверка дали број е репрезентација на збор
  ```cpp
  bool isWord(int n) {
      int count = 0;
  
      while (n > 0) {
          int ascii = n % 100; // земаме 2 цифри
          n /= 100; // ги тргаме тие 2 цифри
  
          if ((ascii >= 65 && ascii <= 90) ||
              (ascii >= 97 && ascii <= 122)) {
              count++;
          } else {
              return false;
          }
      }
  
      return count >= 3;
  }
  ```

## Низи

- Пополнување елементи во низа
  ```cpp
  for (int i = 0; i < n; i++) {
      cin >> arr[i];
  }
  ```
- Печатење на елементи во низа
  ```cpp
  for (int i = 0; i < n; i++) {
      cout << arr[i];
  }
  ```
- Наоѓање на минимум и максимум во низа
  ```cpp
  const int n = 5;
  int arr[n] = {1, 2, 3, 4, 5};
  
  int min = arr[0];
  int max = arr[0];
  
  for (int i = 0; i < n; i++) {
      if (arr[i] < min) {
          min = arr[i];
      } else if (arr[i] > max) {
          max = arr[i];
      }
  }
  ```
- Наоѓање на втор минимум и максимум во низа
  ```cpp
  const int n = 5;
  int arr[n] = {1, 2, 3, 4, 5};
  
  int min1 = INT_MAX, min2 = INT_MAX;
  int max1 = INT_MIN, max2 = INT_MIN;
  
  for (int i = 0; i < n; i++) {
      if (arr[i] < min1) {
          min2 = min1;
          min1 = arr[i];
      } else if (arr[i] < min2 && arr[i] != min1) {
          min2 = arr[i];
      }
  
      if (arr[i] > max1) {
          max2 = max1;
          max1 = arr[i];
      } else if (arr[i] > max2 && arr[i] != max1) {
          max2 = arr[i];
      }
  }
  
  cout << "Min: " << min1 << endl;
  cout << "Second Min: " << min2 << endl;
  
  cout << "Max: " << max1 << endl;
  cout << "Second Max: " << max2 << endl;
  ```
- Бришење на елемент од даден индекс во низа
  ```cpp
  int removeAt(int arr[], int n, int index) {
      if (index < 0 || index >= n)
          return n;
  
      for (int i = index; i < n - 1; i++) {
          arr[i] = arr[i + 1];
      }
  
      return n - 1;
  } 
  ```
- Бришење на дупликат елементи во низа
  ```cpp
  int removeDuplicates(int arr[], int n) {
      int write = 0;
  
      for (int i = 0; i < n; i++) {
          bool duplicate = false;
  
          // write е граница меѓу:
          // ✔ веќе проверени уникатни елементи
          // ✖ непроверен/небитен дел од низата
          // И затоа проверуваме само до write.
          
          // arr[0 .. write-1]   → содржи САМО уникатни елементи
          // arr[write .. n-1]   → остаток (небитен дел)
          // проверуваме дали arr[i] е дупликат, треба да го споредиме само со веќе запишаните уникатни елементи.
          
          for (int j = 0; j < write; j++) {
              if (arr[i] == arr[j]) {
                  duplicate = true;
                  break;
              }
          }
  
          if (!duplicate) {
              arr[write] = arr[i];
              write++;
          }
      }
  
      return write;
  }
  ```
- Проверка дали две низи се еднакви
  ```cpp
  bool equalArrays(int a[], int b[], int n) {
      for (int i = 0; i < n; i++) {
          if (a[i] != b[i]) {
              return false;
          }
      }
      return true;
  }
  ```
- Проверка дали една низа е строго растечка
  ```cpp
  bool ascending(int a[], int n) {
      for (int i = 0; i < n - 1; i++) {
          if (a[i] > a[i + 1]) {
              return false;
          }
      }
      return true;
  } 
  ```
- Проверка дали една низа е строго опаѓачка
  ```cpp
  bool descending(int a[], int n) {
      for (int i = 0; i < n - 1; i++) {
          if (a[i] < a[i + 1]) {
              return false;
          }
      }
      return true;
  } 
  ```
- Проверка дали една низа е ниту строго растечка ниту строго опаѓачка
  ```cpp
  int arrayOrder(int a[], int n) {
      if (n <= 1)
          return 2; // тривијално еднаква
  
      bool asc = true;
      bool desc = true;
  
      for (int i = 0; i < n - 1; i++) {
  
          if (a[i] < a[i + 1]) {
              desc = false;
          }
  
          if (a[i] > a[i + 1]) {
              asc = false;
          }
  
          if (!asc && !desc)
              return 0;
      }
  
      if (asc && desc) return 2; // сите еднакви
      if (asc) return 1;
      if (desc) return -1;
  } 
  ```
- Ротирање на елементите на една низа за едно место во десно.
  ```cpp
  void rotateRight(int a[], int n) {
      int last = a[n - 1];
      for (int i = n - 1; i > 0; i--) {
          a[i] = a[i - 1];
      }
      a[0] = last;
  }
  ```
- Ротирање на елементите на една низа за едно место во лево.
  ```cpp
  void rotateLeft(int a[], int n) {
      int first = a[0];
      for (int i = 0; i < n - 1; i++) {
          a[i] = a[i + 1];
      }
      a[n - 1] = first;
  } 
  ```
- Ротирање на елементите на една низа за n место во десно.
  ```cpp
  void rotateRight(int a[], int n, int k) {
      for (int i = 0; i < k; i++) {
          int last = a[n - 1];
          for (int j = n - 1; j > 0; j--) {
              a[j] = a[j - 1];
          }
          a[0] = last;
      }
  }
  ```
- Ротирање на елементите на една низа за n место во лево.
  ```cpp
  void rotateLeft(int a[], int n, int k) {
      for (int i = 0; i < k; i++) {
          int first = a[0];
          for (int i = 0; i < n - 1; i++) {
              a[i] = a[i + 1];
          }
          a[n - 1] = first;
      }
  }
  ```
- Скаларниот производ на два вектори со по n координати.
  ```cpp
  int scalar(int a[], int b[], int n) {
      int result = 0;
      for (int i = 0; i < n; i++) {
          result += a[i] * b[i];
      }
      return result;
  }
  ```
- Печатење на статистика колку пати се јавува секоја цифра меѓу прочитаните броеви.
  ```cpp
  void stats() {
      int n;
      int a[10] = {0};
  
      while (cin >> n) {
          a[n]++;
      }
  
      for (int i = 0; i < 10; i++) {
          cout << "(" << i << ":" << a[i] << ")" << endl;
      }
  }
  ```
- Сортирање на елементи во низа - Bubble sort
  ```cpp
  void bubbleSort(int a[], int n) {
      for (int i = 0; i < n; i++) {
          for (int j = i + 1; j < n; j++) {
              // a[i] > a[j] ASCENDING
              // a[i] < a[j] DESCENDING
              if (a[i] > a[j]) {
                  int temp = a[i];
                  a[i] = a[j];
                  a[j] = temp;
              }
          }
      }
  }
  ```
- Сортирање на елементи во низа - Insertion sort
- Наоѓање на елемент во низа - Linear Search
  ```cpp
  int linearSearch(int a[], int n, int key) {
      for (int i = 0; i < n; i++) {
          if (a[i] == key) {
              return i;
          }
      }
      return -1;
  }
  ```
- Наоѓање на елемент во низа - Binary Search
  ```cpp
  int binarySearch(int a[], int n, int key) {
      int left = 0;
      int right = n - 1;
  
      while (left <= right) {
          int mid = left + (right - left) / 2;
  
          if (a[mid] == key) {
              return mid;
          }
  
          if (a[mid] < key) {
              left = mid + 1;
          } else {
              right = mid - 1;
          }
      }
  
      return -1;
  }
  ```

## Матрици

- Пример за вчитување и печатење на матрица
  ```cpp
  int n, m;
  cin >> n >> m;

  int matrix[n][m];

  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          cin >> matrix[i][j];
      }
  }

  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          cout << matrix[i][j] << " ";
      }
      cout << endl;
  }
  ```
- Печати по редици
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          cout << matrix[i][j] << " ";
      }
      cout << endl;
  }
  ```
- Печати по колони
  ```cpp
  for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
          cout << matrix[j][i] << " ";
      }
      cout << endl;
  }
  ```
- елементите на непарните редици на матрица
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          if ((i + 1) % 2 != 0) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- елементите на непарните колони на матрица
  ```cpp
  for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
          if ((i + 1) % 2 != 0) {
              cout << matrix[j][i] << " ";
          }
      }
      cout << endl;
  }
  ```
- елементите на парните редици на матрица
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          if ((i + 1) % 2 == 0) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  } 
  ```
- елементите на парните колони на матрица
  ```cpp
  for (int i = 0; i < m; i++) {
      for (int j = 0; j < n; j++) {
          if ((i + 1) % 2 == 0) {
              cout << matrix[j][i] << " ";
          }
      }
      cout << endl;
  }
  ```
- Неквадратна матрица
  ```cpp
  int matrix[n][m];
  
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          cin >> matrix[i][j];
      }
  }
  
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < m; j++) {
          cout << matrix[i][j] << " ";
      }
      cout << endl;
  } 
  ```
- Квадратна матрица
  ```cpp
  int matrix[n][n];
  
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          cin >> matrix[i][j];
      }
  }
  
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          cout << matrix[i][j] << " ";
      }
      cout << endl;
  } 
  ```
- Елементите од главната дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i == j) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  } 
  ```
- Елементите над главната дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i < j) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- Елементите под главната дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i > j) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- Елементите од споредна дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i + j == n - 1) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- Елементите над споредна дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i + j < n - 1) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- Елементите под споредна дијагонала
  ```cpp
  for (int i = 0; i < n; i++) {
      for (int j = 0; j < n; j++) {
          if (i + j > n - 1) {
              cout << matrix[i][j] << " ";
          }
      }
      cout << endl;
  }
  ```
- Симетрична во однос на главната дијагонала.
  ```cpp
  bool symmetrical = true;
  
  for (int i = 0; i < n && symmetrical; i++) {
      for (int j = i + 1; j < n; j++) {
          if (matrix[i][j] != matrix[j][i]) {
              symmetrical = false;
              break;
          }
      }
  }
  
  cout << symmetrical << endl; 
  ```
- Симетрична во однос на споредна дијагонала.
  ```cpp
  bool symmetrical = true;
  
  for (int i = 0; i < n && symmetrical; i++) {
      for (int j = i + 1; j < n; j++) {
          if (matrix[i][j] != matrix[n - 1 - j][n - 1 - i]) {
              symmetrical = false;
              break;
          }
      }
  }
  
  cout << symmetrical << endl;
  ```
- Шема N во матрица:
  ```cpp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (j == 0 || j == k - 1 || i == j)
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  } 
  ```
- Шема Z во матрица:
  ```cpp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (i == 0 || i == k - 1 || i + j == k - 1)
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  }
  ```
- Шема X во матрица:
  ```cppp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (i == j || i + j == k - 1)
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  }
  ```
- Шема M во матрица:
  ```cpp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (j == 0 || j == k - 1 ||
              (i <= k/2 && i == j) ||
              (i <= k/2 && i + j == k - 1))
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  } 
  ```
- Шема W во матрица:
  ```cpp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (j == 0 || j == k - 1 ||
              (i >= k/2 && i == j) ||
              (i >= k/2 && i + j == k - 1))
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  } 
  ```
- Шема A во матрица:
  ```cppp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (i == j || i + j == k - 1 || i == k/2)
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  } 
  ```
- Шема H во матрица:
  ```cpp
  for (int i = 0; i < k; i++) {
      for (int j = 0; j < k; j++) {
          if (j == 0 || j == k - 1 || i == k/2)
              cout << "*";
          else
              cout << " ";
      }
      cout << endl;
  } 
  ```

## Поинтери:

- декларирај и иницијализирај поинтер
  ```cpp
  int a = 10;
  int *pointer = &a;
  
  cout << pointer << endl;  // address
  cout << *pointer << endl; // value
  ```
- декларирај и иницијализирај референци
  ```cpp
  int a = 10;
  int &reference = a;
  
  cout << reference << endl;  // value
  cout << &reference << endl; // address
  ```
- печати адреса во меморија
  ```cpp
  cout << pointer << endl;  // address
  cout << &pointer << endl;  // address
  cout << &reference << endl; // address
  ```
- печати вредност на поинтер
  ```cpp
  cout << *pointer << endl; // value
  cout << reference << endl;  // value
  ```
- итерирај низа со користење на поинтер
  ```cpp
  int n = 5;
  int a[n] = {1, 2, 3, 4, 5};
  
  int *pointer = a;
  
  while (n > 0) {
      cout << *pointer << " ";
      pointer++;
      n--;
  } 
  ```
- итерирај низа со користење на референци
  ```cpp
  int n = 5;
  int a[n] = {1, 2, 3, 4, 5};
  
  int &ref = *a;
  
  while (n > 0) {
      cout << ref << " ";
      ref++;
      n--;
  } 
  ```
- Swap using POINTERS
  ```cpp
  void swap(int *a, int *b) {
      int temp = *a;
      *a = *b;
      *b = temp;
  } 
  ```
- Swap using REFERENCES
  ```cpp
  void swap(int &a, int &b) {
      int temp = a;
      a = b;
      b = temp;
  }
  ```
- Да се најде мин и макс со користење на покажувачи
- Да се најде минимална и максимална вредност во низа со покажувачи
- Да се трансформира низа
- Да се трансформира низа со користење на поинтери

## Рекурзивни функции:

- factorial
  ```cpp
  int factorial(int n) {
      int result = 1;
  
      for (int i = 1; i <= n; i++) {
          result *= i;
      }
  
      return result;
  }
  
  int factorialRecursive(int n) {
      if (n <= 1) return 1;
      return n * factorialRecursive(n - 1);
  } 
  ```
- fibonacci
  ```cpp
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
  ```
- count_up
  ```cpp
  void count_up(int n) {
      if (n < 0) return;
      cout << n << endl;
      count_up(n - 1);
  } 
  ```
- count_down
  ```cpp
  void count_down(int n) {
      if (n < 0) return;
      count_down(n - 1);
      cout << n << endl;
  }
  ```
- count_digits
  ```cpp
  int countDigits(int n) {
      int temp = abs(n);
      if (temp <= 0) return 0;
      return 1 + countDigits(temp / 10);
  } 
  ```
- sum_digits
  ```cpp
  int sumDigits(int n) {
      if (n <= 0) return 0;
      return n % 10 + sumDigits(n / 10);
  } 
  ```
- length
  ```cpp
  int length(char str[]) {
      if (*str == '\0') return 0;
      return 1 + length(str + 1);
  } 
  ```
- рекурзивна функција за пресметување на збирот на првите k природни броеви.
  ```cpp
  int sumFirstK(int n) {
      if (n <= 0) return 0;
      return n + sumFirstK(n - 1);
  } 
  ```
- рекурзивна функција за пресметување на факториел на еден природен број.
  ```cpp
  int factorialRecursive(int n) {
      if (n <= 1) return 1;
      return n * factorialRecursive(n - 1);
  } 
  ```
- рекурзивна функција за наоѓање на соодветниот прост број.
- рекурзивна функција за наоѓање на следниот прост број.
- рекурзивна функција за проверка дали даден број е прост број.
- рекурзивна функција која ќе го пресметува збирот на цифрите на еден број.
- рекурзивна функција која ќе ги изброи појавувањата на дадена цифра.
  -- доколку до некоја цифра 8 има уште една цифра 8 веднаш лево од неа, нејзиното појавување се брои двојно.
- рекурзивна функција за наоѓање на збирот на елементите во дадена низа.

## Recursion

```cpp
/*
==================== RECURSION CHEAT SHEET ====================

Before writing ANY recursive function, answer these questions:

1) WHAT IS THE SMALLEST INPUT?
   - When should the function stop?
   - What is the simplest possible case?
   - What should it return in that case?
   --> This becomes the BASE CASE.

2) HOW DO I MAKE THE PROBLEM SMALLER?
   - How can I reduce the input size?
   - Am I moving toward the base case?
   --> This becomes the RECURSIVE CALL.

3) IF THE FUNCTION WORKS FOR SMALLER INPUT...
   HOW DO I USE THAT RESULT TO SOLVE THE BIGGER INPUT?
   - Do I add something?
   - Do I multiply?
   - Do I check something?
   - Do I just return it directly?
   --> This defines how you COMBINE results.

---------------------------------------------------------------

General Recursive Structure:

function(input) {
    // 1) BASE CASE
    // if (smallest possible input)
    //     return simplest answer;

    // 2) REDUCE THE PROBLEM
    // smaller_input = make input smaller

    // 3) RECURSIVE CALL
    // result_from_smaller = function(smaller_input)

    // 4) COMBINE (very important step!)
    // return (my contribution) + result_from_smaller;
    // OR
    // return (condition ? something : result_from_smaller);
    // OR
    // return result_from_smaller;
}

---------------------------------------------------------------

Common Recursion Patterns:

✔ Counting:
    return (condition ? 1 : 0) + recursive_call;

✔ Summing:
    return current_value + recursive_call;

✔ Multiplying:
    return current_value * recursive_call;

✔ Searching (boolean):
    if (condition) return true;
    return recursive_call;

✔ Just shrinking without extra work:
    return recursive_call;

---------------------------------------------------------------

Golden Rules:

• Every recursive call MUST get closer to the base case.
• Base case must stop the recursion.
• Never forget to return the recursive result.
• Think in English before coding:
  "What does this function return?"

If you can explain the recursion in words,
you can write the code.
===============================================================
*/
```

## Формули

**Формули Триаголник:**

- Периметарот - `float P = a + b + c;`
- Плоштина - `float s = (a + b + c) / 2;`
- Квадрат на плоштина - `float S2 = s * (s - a) * (s - b) * (s - c);`
- Проверка дали може да се конструира триаголник: `(a + b <= c) || (a + c <= b) || (b + c <= a)`

**Формули Круг:**

- Плоштина (P) на круг се пресметува со формулата: P = π × r², каде r е радиусот на кругот, а π ≈ 3.14.
- Периметар (L) (или обиколка) на круг се пресметува со формулата: L = 2 × π × r

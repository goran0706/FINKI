package playground._01_arrays_and_lists;

public class Arrays {
    static void main(String[] args) {
        // Последователно множество на мемориски локации
        // Множество на подредени парови
        // Постои соодветна вредност асоцирана за тој индекс
        // Индексите се единствени и фиксирани за секоја вредност
        // Индексите се во ранг од долна граница до горна граница [0 - n-1]
        // Должина на низата (бројот на елементи што содржат вредности) е вредност која се задава на почеток кога се формира низата
        // Секоја вредност на низата може да се пристапи, со користење на нејзиниот индекс, во O(1) време.
        // Секогаш се специфицира максималниот индекс дозволен во низата

        // Статичка:
        // Фиксна должина што не може да се промени по создавањето.
        // Елементите може да ги менуваме.
        // Индекси: 0 до length - 1.
        // Пристап до елемент преку индекс: O(1).

        int[] staticArrayA = new int[5];
        staticArrayA[0] = 1;
        staticArrayA[1] = 2;
        staticArrayA[2] = 3;
        staticArrayA[3] = 4;
        staticArrayA[4] = 5;

        int[] staticArrayB = {1, 2, 3, 4, 5};

        // Динамичка низа (ArrayList):
        // - Автоматски ја зголемува внатрешната низа кога е потребно.
        // - Може да додава и брише елементи.
        // - Пристап преку индекс: O(1) во просек.
        // - Додавање на крај: O(1) амортизирано.
        // - Вметнување или бришење на почеток/средина: O(n).

        // n-димензионални низи
        int[][][] nDimensional = {{{1, 2, 3, 4, 5},}, {{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}}, {{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}, {100, 200, 300, 400, 500}, {600, 700, 800, 900, 1000}}};

        // матрици
        int[][] matrix = {{1, 2, 3, 4, 5}, {6, 7, 8, 9, 10}, {100, 200, 300, 400, 500}, {600, 700, 800, 900, 1000}};

        // квадратна матрица
        int[][] quadraticMatrix = {{1, 2, 3, 4}, {6, 7, 8, 9}, {1, 2, 3, 4}, {6, 7, 8, 9}};

        // Операции:
        // - Изминување
        // - Додавање
        // - Бришење
        // - Пребарување
        // - Сортирање

        int[] numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        int size = numbers.length;

        for (int i = 0; i < size; i++) {
            System.out.println("Current element: " + numbers[i]);
        }

        for (int num : numbers) {
            System.out.println("Current element: " + num);
        }

        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.printf("Total sum is: %d", sum);


        int firstIndex = 0;
        int lastIndex = numbers.length - 1;
        int atIndex = 2;
        int value = 100;

        // INSERT FIRST

        // 1. create new array with larger size
        // 2. insert new element at index 0
        // 3. insert the original elements at index i + 1
//        int[] newArray = new int[numbers.length + 1];
//
//        newArray[0] = value;
//
//        for (int i = 0; i < numbers.length; i++) {
//            newArray[i + 1] = numbers[i];
//        }


        // INSERT LAST

        // 1. create new array with larger size
        // 2. insert the original elements at index i
        // 3. insert new element at index n (not n - 1)
//        int[] newArray = new int[numbers.length + 1];
//
//        for (int i = 0; i < numbers.length; i++) {
//            newArray[i] = numbers[i];
//        }
//
//        newArray[numbers.length] = value;


        // INSERT AT GIVEN INDEX

        // 1. create new array with larger size
        // 2. copy and move all elements to right
        // 3. insert new element at given index
//        int[] newArray = new int[numbers.length + 1];
//
//        for (int i = 0; i < atIndex; i++) {
//            newArray[i] = numbers[i];
//        }
//
//        newArray[atIndex] = value;
//
//        for (int i = atIndex; i < numbers.length; i++) {
//            newArray[i + 1] = numbers[i];
//        }

        // LINEAR SEARCH
        int target = 2;

        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) {
                System.out.printf("Found at index: %d%n", i);
                break;
            }
        }


        // BINARY SEARCH
        int left = 0;
        int right = numbers.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (numbers[mid] == target) {
                System.out.printf("Found at index: %d%n", mid);
                break;
            }

            if (numbers[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }


        // SORT
        for (int i = 0; i < numbers.length - 1; i++) {
            for (int j = 0; j < numbers.length - 1 - i; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    int tmp = numbers[j];
                    numbers[j] = numbers[j + 1];
                    numbers[j + 1] = tmp;
                }
            }
        }
    }
}


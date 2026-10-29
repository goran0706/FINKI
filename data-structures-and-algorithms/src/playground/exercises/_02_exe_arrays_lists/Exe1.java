package playground.exercises._02_exe_arrays_lists;

/*
    За дадена низа од N цели броеви, да се избришат елементите со вредност помала од просекот на сите елементи во низата.
    На пример за низата 1, 2, 3, 4, 5 просекот е (1 + 2 + 3 + 4 + 5) / 5 = 15 / 5 = 3,
    што значи треба да се избришат елементите 1 и 2,
    што значи низата после оваа трансформација ќе биде 3, 4, 5.

    Влез: Првиот број од влезот е бројот на елементи во низата N, а потоа во следниот ред се дадени самите елементи одделени со празно место.
    Излез: Низата пред и после направената трансформација.

    For example:
    Input
    5
    1 2 3 4 5

    Result
    {1,2,3,4,5}
    {3,4,5}
*/

import java.util.Arrays;
import java.util.Scanner;

public class Exe1 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        int n = input.nextInt();
        int[] numbers = new int[n];

        for (int i = 0; i < n; i++) {
            numbers[i] = input.nextInt();
        }

        System.out.println(Arrays.toString(numbers));

        double average = calculateAverage(numbers);
        numbers = removeElementsBelowAverage(numbers, average);

        System.out.println(Arrays.toString(numbers));

        input.close();
    }

    public static double calculateAverage(int[] numbers) {
        int sum = 0;

        for (int number : numbers) {
            sum += number;
        }

        return (double) sum / numbers.length;
    }

    public static int[] removeElementsBelowAverage(int[] numbers, double average) {
        int index = 0;

        for (int number : numbers) {
            if (number >= average) {
                numbers[index++] = number;
            }
        }

        return Arrays.copyOf(numbers, index);
    }
}

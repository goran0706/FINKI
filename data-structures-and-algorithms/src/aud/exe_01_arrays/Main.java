package aud.exe_01_arrays;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Main {
    static void main() {
        // ================== Static array ==================
        int[] numbers = new int[3];
        numbers[0] = 1;
        numbers[1] = 2;
        numbers[2] = 3;

        // Array index is out of bounds.
        // numbers[3] = 4; // Exception: Index 3 out of bounds for length 3

        System.out.println(Arrays.toString(numbers));

        // ================== Dynamic array ==================
        List<Integer> list = new ArrayList<>(3);
        list.add(1);
        list.add(2);
        list.add(3);

        // Grows dynamically
        list.add(4);
        list.add(5);

        System.out.println(list);


        // Задача 1)
        // Нека се дадени две низи, кои треба да бидат со иста големина.
        // Да се напише функција која ќе прави промени во двете низи така што
        // доколку на дадена позиција тие имаат еднакви елементи, истите треба да се избришат и во двете низи.

        Array<Integer> arrA = new Array<>(3);
        arrA.insertLast(1);
        arrA.insertLast(2);
        arrA.insertLast(3);
        System.out.println(arrA);

        Array<Integer> arrB = new Array<>(3);
        arrB.insertLast(1);
        arrB.insertLast(2);
        arrB.insertLast(3);
        System.out.println(arrA);

        ArrayUtils.changeArrays(arrA, arrB);
        System.out.println("Printing array A after change: " + arrA);
        System.out.println("Printing array B after change: " + arrB);
    }
}

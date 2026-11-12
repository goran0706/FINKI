package aud.aud_01_arrays_and_lists.arrays;

import impl.Array.Array;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class Duplicates {
    // Задача 1)
    // Нека се дадени две низи, кои треба да бидат со иста големина.
    // Да се напише функција која ќе прави промени во двете низи така што
    // доколку на дадена позиција тие имаат еднакви елементи, истите треба да се избришат и во двете низи.

    public static void changeArrays(Array<?> a, Array<?> b) {
        if (a.getSize() != b.getSize()) {
            throw new IllegalArgumentException("Array sizes do not match");
        }

        int size = a.getSize();

        for (int i = 0; i < size; ) {
            if (Objects.equals(a.get(i), b.get(i))) {
                a.delete(i);
                b.delete(i);
                size--;
            } else {
                i++;
            }
        }

//        or backwards
//
//        for (int i = a.getSize() - 1; i >= 0; i--) {
//            if (Objects.equals(a.get(i), b.get(i))) {
//                a.delete(i);
//                b.delete(i);
//            }
//        }
    }

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

        // ================== Dynamic array ==================
        Array<Integer> array = new Array<>(5);
        array.insertLast(1);
        array.insertLast(2);
        array.insertLast(3);
        array.insertLast(4);
        array.insertLast(5);
        array.insertLast(6);
        System.out.println(array);
        System.out.println("Size of array: " + array.getSize());
        System.out.println("Index of element 3: " + array.find(3));

        array.delete(2);
        System.out.println(array);

        array.insert(3, 10);
        System.out.println(array);


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

        changeArrays(arrA, arrB);
        System.out.println("Printing array A after change: " + arrA);
        System.out.println("Printing array B after change: " + arrB);
    }
}

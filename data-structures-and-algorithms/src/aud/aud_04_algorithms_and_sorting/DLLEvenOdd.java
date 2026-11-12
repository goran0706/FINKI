package aud.aud_04_algorithms_and_sorting;

import impl.DLL.DLL;
import impl.DLL.DLLNode;

import java.util.Scanner;

public class DLLEvenOdd {
    static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int n = scanner.nextInt();
        DLL<String> list = new DLL<>();

        for (int i = 0; i < n; i++) {
            list.insertLast(scanner.next());
        }

        DLLNode<String> firstOdd = getFirstOdd(list);
        DLLNode<String> lastEven = getLastEven(list);

        if (firstOdd == null || lastEven == null) {
            System.out.println(list);
            return;
        }

        int firstOddPosition = 0;
        DLLNode<String> current = list.getFirst();

        while (current != firstOdd) {
            firstOddPosition++;
            current = current.getSucc();
        }

        int lastEvenPosition = 0;
        current = list.getLast();

        while (current != lastEven) {
            lastEvenPosition++;
            current = current.getPred();
        }

        System.out.println(firstOdd.getElement() + " " + firstOddPosition);
        System.out.println(lastEven.getElement() + " " + (n - 1 - lastEvenPosition));

        // Swap the elements of the two nodes.
        String temp = firstOdd.getElement();
        firstOdd.setElement(lastEven.getElement());
        lastEven.setElement(temp);

        System.out.println(list);
    }

    // Find the first node containing a string with an odd length.
    public static DLLNode<String> getFirstOdd(DLL<String> list) {
        DLLNode<String> current = list.getFirst();

        while (current != null) {
            if (current.getElement().length() % 2 != 0) {
                return current;
            }

            current = current.getSucc();
        }

        return null;
    }

    // Find the last node containing a string with an even length.
    public static DLLNode<String> getLastEven(DLL<String> list) {
        DLLNode<String> current = list.getLast();

        while (current != null) {
            if (current.getElement().length() % 2 == 0) {
                return current;
            }

            current = current.getPred();
        }

        return null;
    }
}
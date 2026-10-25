package aud.exe_02_lists;

public class ListUtils {
    public static int countEvenNumbers(SinglyLinkedList<Integer> list) {
        int count = 0;
        Node<Integer> current = list.getHead();

        while (current != null) {
            if (current.data % 2 == 0) {
                count++;
            }

            current = current.next;
        }

        return count;
    }
}

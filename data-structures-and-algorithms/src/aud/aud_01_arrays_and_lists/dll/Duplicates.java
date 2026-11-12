package aud.aud_01_arrays_and_lists.dll;

import impl.DLL.DLL;
import impl.DLL.DLLNode;

public class Duplicates {
    // Да се напише програма за произволна двојно поврзана листа во која ќе се исфрлат сите јазли што се повторуваат.
    // Дополнително секој јазол на оваа листа покрај објектот, содржи и дополнителна информација:
    // бројот на повторувања на дадениот јазел.

    // 1. compare current with successor element
    // 2. if equals remove successor
    // 3. repeat for all nodes
    // Complexity O(n2)
    private static <T> void removeDuplicates(DLL<T> list) {
        DLLNode<T> current = list.getFirst();
        int counter = 0;

        while (current != null) {
            DLLNode<T> successor = current.getSucc();

            while (successor != null) {
                if (current.getElement().equals(successor.getElement())) {
                    list.delete(successor);
                    counter++;
                }

                successor = successor.getSucc();
            }

            System.out.println(current.getElement() + " - repetitions: " + counter);
            current = current.getSucc();
            counter = 0;
        }
    }

    static void main() {
        DLL<String> list = new DLL<>();
        list.insertLast("A");
        list.insertLast("B");
        list.insertLast("C");
        list.insertLast("B");
        list.insertLast("D");
        System.out.println("Original list: " + list);

        removeDuplicates(list);
        System.out.println("List after removing duplicates: " + list);
    }
}

package aud.aud_01_arrays_and_lists.sll;

import impl.SLL.SLL;
import impl.SLL.SLLNode;

public class JoinSortedLists {
    // Нека се дадени две еднострано поврзани листи чии јазли се сортирани во растечки редослед.
    // Да се напише функција која ќе ги спои двете листи во една така што резултантната листа да е сортирана.
    // Сортирањето е подредување со слевање.

    public static <E extends Comparable<E>> SLL<E> joinMergeSort(SLL<E> listA, SLL<E> listB) {
        SLL<E> result = new SLL<>();
        SLLNode<E> nodeA = listA.getFirst();
        SLLNode<E> nodeB = listB.getFirst();

        while (nodeA != null && nodeB != null) {
            if (nodeA.getElement().compareTo(nodeB.getElement()) < 0) {
                result.insertLast(nodeA.getElement());
                nodeA = nodeA.getSucc();
            } else {
                result.insertLast(nodeB.getElement());
                nodeB = nodeB.getSucc();
            }
        }

        if (nodeA != null) {
            while (nodeA != null) {
                result.insertLast(nodeA.getElement());
                nodeA = nodeA.getSucc();
            }
        }

        if (nodeB != null) {
            while (nodeB != null) {
                result.insertLast(nodeB.getElement());
                nodeB = nodeB.getSucc();
            }
        }

        return result;
    }

    // Bubble Sort example
    public static <E extends Comparable<? super E>> SLL<E> joinBubbleSort(SLL<E> listA, SLL<E> listB) {
        SLL<E> result = new SLL<>();

        // Concatenate both lists.
        SLLNode<E> nodeA = listA.getFirst();
        SLLNode<E> nodeB = listB.getFirst();

        while (nodeA != null) {
            result.insertLast(nodeA.getElement());
            nodeA = nodeA.getSucc();
        }

        while (nodeB != null) {
            result.insertLast(nodeB.getElement());
            nodeB = nodeB.getSucc();
        }

        // Bubble Sort.
        boolean swapped;

        do {
            swapped = false;
            SLLNode<E> current = result.getFirst();

            while (current != null && current.getSucc() != null) {
                SLLNode<E> next = current.getSucc();

                if (current.getElement().compareTo(next.getElement()) > 0) {
                    E temp = current.getElement();
                    current.setElement(next.getElement());
                    next.setElement(temp);
                    swapped = true;
                }

                current = next;
            }

        } while (swapped);

        return result;
    }

    static void main() {
        SLL<Integer> listA = new SLL<>();
        listA.insertLast(1);
        listA.insertLast(3);
        listA.insertLast(5);
        listA.insertLast(7);
        listA.insertLast(9);

        SLL<Integer> listB = new SLL<>();
        listB.insertLast(2);
        listB.insertLast(4);
        listB.insertLast(6);
        listB.insertLast(8);
        listB.insertLast(10);

        SLL<Integer> joined = joinMergeSort(listA, listB);
        System.out.println(joined);

        // SLL<Integer> joined = joinBubbleSort(listA, listB);
        // System.out.println(joined);
    }
}

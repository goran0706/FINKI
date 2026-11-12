package aud.aud_01_arrays_and_lists.sll;


import impl.SLL.SLL;
import impl.SLL.SLLNode;

public class CountEvenNumbers {
    // Да се напише функција којашто за дадена еднострано поврзана листа од цели броеви
    // ќе го врати бројот на парни елементи во истата.

    public static int evenNumbers(SLL<Integer> list) {
        SLLNode<Integer> node = list.getFirst();
        int count = 0;

        while (node != null) {
            if (node.getElement() % 2 == 0) {
                count++;
            }
            node = node.getSucc();
        }

        return count;
    }

    static void main() {
        SLL<Integer> list = new SLL<>();
        list.insertFirst(1);
        list.insertFirst(2);
        list.insertFirst(3);
        list.insertFirst(4);
        list.insertFirst(5);
        list.insertFirst(6);

        int evenCount = CountEvenNumbers.evenNumbers(list);
        System.out.println("Number of even elements: " + evenCount);
    }
}

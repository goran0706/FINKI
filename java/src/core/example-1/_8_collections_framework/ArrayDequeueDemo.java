package lessons._8_collections_framework;

import java.util.ArrayDeque;

public class ArrayDequeueDemo {
    public static void main(String[] args) {
        var arrayDeque = new ArrayDeque<Integer>();

        arrayDeque.add(23);
        arrayDeque.add(53);
        arrayDeque.add(76);
        arrayDeque.add(82);
        arrayDeque.add(19);

        arrayDeque.addFirst(1);
        arrayDeque.addFirst(11);

        var iterator = arrayDeque.descendingIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}

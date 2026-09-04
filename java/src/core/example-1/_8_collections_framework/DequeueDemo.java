package lessons._8_collections_framework;

import java.util.Deque;
import java.util.LinkedList;

public class DequeueDemo {
    public static void main(String[] args) {
        Deque<Integer> linkedList = new LinkedList<>();

        linkedList.add(33);
        linkedList.add(12);
        linkedList.add(75);

        linkedList.addFirst(10);
        linkedList.addLast(100);

        System.out.println(linkedList.removeLast());
        System.out.println(linkedList);
    }
}

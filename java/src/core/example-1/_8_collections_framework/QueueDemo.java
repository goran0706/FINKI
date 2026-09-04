package lessons._8_collections_framework;

import java.util.LinkedList;
import java.util.Queue;

public class QueueDemo {
    public static void main(String[] args) {
        Queue<Integer> linkedList = new LinkedList<>();

        linkedList.add(32);
        linkedList.add(11);
        linkedList.add(23);

        System.out.println(linkedList.poll()); // removes the head
        System.out.println(linkedList.peek());
    }
}

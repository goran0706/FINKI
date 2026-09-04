package lessons._8_collections_framework;

import java.util.PriorityQueue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        var priorityQ = new PriorityQueue<Integer>();

        priorityQ.add(12);
        priorityQ.add(32);
        priorityQ.add(55);

        // The first element is the smallest element
        var firstElement = priorityQ.peek();
        System.out.println(firstElement);
    }
}

package _09_collections;

import java.util.LinkedList;
import java.util.Queue;

public class _11_QueueInterface {

    static void main(String[] args) {

        // Queue represents elements waiting to be processed.
        // A typical queue follows FIFO: First In, First Out.
        // The Queue interface defines insertion, inspection, and removal operations.

        Queue<String> tasks = new LinkedList<>();

        // offer() inserts an element and returns false if insertion fails.
        tasks.offer("Process invoice");
        tasks.offer("Send notification");
        tasks.offer("Generate report");

        System.out.println("Queue: " + tasks);
        System.out.println("Size: " + tasks.size());

        // peek() inspects the head without removing it.
        System.out.println("Next task: " + tasks.peek());
        System.out.println("Queue after peek: " + tasks);

        // poll() removes and returns the head, or null if the queue is empty.
        String processedTask = tasks.poll();

        System.out.println("Processed: " + processedTask);
        System.out.println("Remaining: " + tasks);

        // Queue also provides element() and remove().
        // Unlike peek() and poll(), these throw NoSuchElementException
        // when the queue is empty.
        System.out.println("Head using element(): " + tasks.element());
        System.out.println("Removed using remove(): " + tasks.remove());

        System.out.println("Queue after removal: " + tasks);

        // Check whether the queue is empty before processing.
        while (!tasks.isEmpty()) {
            String task = tasks.poll();
            System.out.println("Processing: " + task);
        }

        System.out.println("Queue empty: " + tasks.isEmpty());

        // poll() safely handles an empty queue by returning null.
        System.out.println("Poll empty queue: " + tasks.poll());

        // add() is another insertion method.
        // It may throw IllegalStateException if a capacity-restricted
        // queue cannot accept another element.
        tasks.add("New task");

        System.out.println("\nAfter add(): " + tasks);

        // offer() is generally preferred when insertion might fail.
        boolean accepted = tasks.offer("Another task");

        System.out.println("Another task accepted: " + accepted);
        System.out.println("Final queue: " + tasks);

        // Queue is an interface; behavior and ordering depend on implementation.
        // LinkedList provides FIFO-style operations but is not thread-safe.
        // ArrayDeque is often a better choice for a single-threaded FIFO queue.
        // PriorityQueue processes elements according to priority, not insertion order.
    }
}
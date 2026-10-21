package _09_collections;

import java.util.ArrayDeque;
import java.util.Deque;

public class _14_ArrayDeque {

    static void main(String[] args) {

        // ArrayDeque is a resizable-array implementation of Deque.
        // It supports efficient insertion and removal at both ends.
        // It can be used as a queue or a stack.

        ArrayDeque<String> deque = new ArrayDeque<>();

        // Add elements at either end.
        deque.addFirst("Bob");
        deque.addLast("Charlie");
        deque.offerFirst("Alice");
        deque.offerLast("Diana");

        System.out.println("Deque: " + deque);

        // Inspect elements without removing them.
        System.out.println("First: " + deque.getFirst());
        System.out.println("Last: " + deque.getLast());

        System.out.println("Peek first: " + deque.peekFirst());
        System.out.println("Peek last: " + deque.peekLast());

        // Remove elements from either end.
        System.out.println("Removed first: " + deque.removeFirst());
        System.out.println("Removed last: " + deque.removeLast());

        System.out.println("After removals: " + deque);

        // ArrayDeque does not allow null elements.
        // The following operation throws NullPointerException:
        // deque.add(null);

        // Use ArrayDeque as a FIFO queue.
        Deque<String> tasks = new ArrayDeque<>();

        tasks.offer("Process invoice");
        tasks.offer("Send notification");
        tasks.offer("Generate report");

        System.out.println("\nFIFO processing:");

        while (!tasks.isEmpty()) {
            System.out.println(tasks.poll());
        }

        // Use ArrayDeque as a LIFO stack.
        Deque<String> stack = new ArrayDeque<>();

        stack.push("First");
        stack.push("Second");
        stack.push("Third");

        System.out.println("\nLIFO processing:");

        while (!stack.isEmpty()) {
            System.out.println(stack.pop());
        }

        // ArrayDeque grows automatically as needed.
        // An initial capacity can be supplied when the expected size is known.
        ArrayDeque<Integer> numbers = new ArrayDeque<>(20);

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);

        System.out.println("\nNumbers: " + numbers);

        // Remove a specific element.
        numbers.remove(Integer.valueOf(20));

        System.out.println("After removing 20: " + numbers);

        // ArrayDeque does not support indexed access.
        // This does not compile:
        // numbers.get(0);

        // ArrayDeque is generally preferred over Stack for stack operations.
        // It is also often a good choice for ordinary queue operations.
        //
        // Most operations at either end are amortized O(1).
        // ArrayDeque is not thread-safe.
    }
}
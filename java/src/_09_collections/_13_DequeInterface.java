package _09_collections;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

public class _13_DequeInterface {

    static void main(String[] args) {

        // Deque means double-ended queue.
        // It supports insertion, inspection, and removal at both ends.
        // ArrayDeque and LinkedList are common Deque implementations.

        Deque<String> deque = new ArrayDeque<>();

        // Insert at the beginning.
        deque.addFirst("Bob");
        deque.offerFirst("Alice");

        // Insert at the end.
        deque.addLast("Charlie");
        deque.offerLast("Diana");

        System.out.println("Deque: " + deque);

        // Inspect either end without removing elements.
        System.out.println("First: " + deque.getFirst());
        System.out.println("Last: " + deque.getLast());

        System.out.println("Peek first: " + deque.peekFirst());
        System.out.println("Peek last: " + deque.peekLast());

        // Remove from either end.
        System.out.println("Remove first: " + deque.removeFirst());
        System.out.println("Remove last: " + deque.removeLast());

        System.out.println("After removals: " + deque);

        // pollFirst() and pollLast() return null when the deque is empty.
        // removeFirst() and removeLast() throw NoSuchElementException
        // when the deque is empty.
        System.out.println("Poll first: " + deque.pollFirst());
        System.out.println("Poll last: " + deque.pollLast());

        System.out.println("Empty deque: " + deque);
        System.out.println("Poll empty deque: " + deque.pollFirst());

        // Deque can be used as a FIFO queue.
        // Insert at the tail and remove from the head.
        Deque<String> queue = new ArrayDeque<>();

        queue.offerLast("Task A");
        queue.offerLast("Task B");
        queue.offerLast("Task C");

        System.out.println("\nFIFO queue:");

        while (!queue.isEmpty()) {
            System.out.println(queue.pollFirst());
        }

        // Deque can also be used as a LIFO stack.
        // Push onto the head and pop from the head.
        Deque<String> stack = new ArrayDeque<>();

        stack.push("First");
        stack.push("Second");
        stack.push("Third");

        System.out.println("\nLIFO stack:");

        while (!stack.isEmpty()) {
            System.out.println(stack.pop());
        }

        // Descending iteration traverses from the tail toward the head.
        Deque<Integer> numbers = new ArrayDeque<>();

        numbers.addLast(10);
        numbers.addLast(20);
        numbers.addLast(30);

        System.out.println("\nForward iteration:");

        for (Integer number : numbers) {
            System.out.println(number);
        }

        System.out.println("Reverse iteration:");

        Iterator<Integer> descendingIterator = numbers.descendingIterator();

        while (descendingIterator.hasNext()) {
            System.out.println(descendingIterator.next());
        }

        // ArrayDeque does not permit null elements.
        // It is generally more efficient than Stack for stack operations
        // and often a better choice than LinkedList for queue/deque use.
        //
        // ArrayDeque is not thread-safe.
    }
}
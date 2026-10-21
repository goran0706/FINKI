package _09_collections;

import java.util.Deque;
import java.util.LinkedList;
import java.util.Queue;

public class _04_LinkedList {

    static void main(String[] args) {

        // LinkedList is a doubly linked list implementation.
        // Each node stores an element and references to adjacent nodes.
        // It implements both List and Deque.

        LinkedList<String> names = new LinkedList<>();

        // Add elements at the end.
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        System.out.println("Names: " + names);

        // Add elements at the beginning and end.
        names.addFirst("David");
        names.addLast("Emma");

        System.out.println("After adding first and last: " + names);

        // Access the first and last elements.
        System.out.println("First: " + names.getFirst());
        System.out.println("Last: " + names.getLast());

        // Peek operations inspect elements without removing them.
        System.out.println("Peek first: " + names.peekFirst());
        System.out.println("Peek last: " + names.peekLast());

        // Remove the first and last elements.
        String firstRemoved = names.removeFirst();
        String lastRemoved = names.removeLast();

        System.out.println("Removed first: " + firstRemoved);
        System.out.println("Removed last: " + lastRemoved);
        System.out.println("After removals: " + names);

        // LinkedList supports indexed operations through List.
        // However, accessing an arbitrary index requires traversal: O(n).
        System.out.println("Element at index 1: " + names.get(1));

        names.add(1, "Frank");

        System.out.println("After indexed insertion: " + names);

        // LinkedList allows null elements.
        names.add(null);

        System.out.println("After adding null: " + names);

        // LinkedList can be used as a Queue (FIFO).
        Queue<String> tasks = new LinkedList<>();

        tasks.offer("Task A");
        tasks.offer("Task B");
        tasks.offer("Task C");

        System.out.println("\nQueue: " + tasks);
        System.out.println("Next task: " + tasks.peek());
        System.out.println("Processed task: " + tasks.poll());
        System.out.println("Remaining tasks: " + tasks);

        // LinkedList can be used as a Deque.
        // A deque supports insertion and removal at both ends.
        Deque<Integer> numbers = new LinkedList<>();

        numbers.offerFirst(20);
        numbers.offerFirst(10);
        numbers.offerLast(30);
        numbers.offerLast(40);

        System.out.println("\nDeque: " + numbers);

        System.out.println("Removed first: " + numbers.pollFirst());
        System.out.println("Removed last: " + numbers.pollLast());

        System.out.println("Remaining deque: " + numbers);

        // LinkedList is generally useful when frequent operations at
        // the beginning or end are required.
        //
        // It is usually less efficient than ArrayList for indexed access
        // and iteration-heavy workloads because of node allocation,
        // reference overhead, and poorer cache locality.
        //
        // For most ordinary List use cases, ArrayList is the default choice.
    }
}
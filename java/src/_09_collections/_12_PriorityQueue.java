package _09_collections;

import java.util.PriorityQueue;
import java.util.Queue;

public class _12_PriorityQueue {

    static void main(String[] args) {

        // PriorityQueue processes elements according to priority,
        // not insertion order.
        // By default, the smallest element has the highest priority.
        Queue<Integer> numbers = new PriorityQueue<>();

        numbers.offer(40);
        numbers.offer(10);
        numbers.offer(30);
        numbers.offer(20);

        // Iteration does not guarantee sorted order.
        System.out.println("Priority queue: " + numbers);

        // peek() returns the highest-priority element without removing it.
        System.out.println("Highest priority: " + numbers.peek());

        // poll() repeatedly retrieves elements in priority order.
        System.out.println("\nProcessing in priority order:");

        while (!numbers.isEmpty()) {
            System.out.println(numbers.poll());
        }

        // A reverse-order comparator makes the largest number highest priority.
        Queue<Integer> largestFirst = new PriorityQueue<>(
                (first, second) -> Integer.compare(second, first)
        );

        largestFirst.offer(40);
        largestFirst.offer(10);
        largestFirst.offer(30);
        largestFirst.offer(20);

        System.out.println("\nLargest first:");

        while (!largestFirst.isEmpty()) {
            System.out.println(largestFirst.poll());
        }

        // PriorityQueue can store custom objects when they are comparable
        // or when a Comparator is provided.
        Queue<Task> tasks = new PriorityQueue<>(
                (first, second) -> Integer.compare(first.priority, second.priority)
        );

        tasks.offer(new Task("Generate report", 3));
        tasks.offer(new Task("Process payment", 1));
        tasks.offer(new Task("Send notification", 2));

        System.out.println("\nTasks by priority (lower number = higher priority):");

        while (!tasks.isEmpty()) {
            System.out.println(tasks.poll());
        }

        // PriorityQueue does not permit null elements.
        // Adding null throws NullPointerException.
        //
        // offer() and poll() typically take O(log n) time.
        // peek() takes O(1) time.
        //
        // PriorityQueue is not thread-safe.
        // Use a concurrent priority queue when multiple threads must access it.
    }

    static class Task {

        private final String name;
        private final int priority;

        Task(String name, int priority) {
            this.name = name;
            this.priority = priority;
        }

        @Override
        public String toString() {
            return "Task{name='" + name + "', priority=" + priority + "}";
        }
    }
}
package _09_collections;

import java.util.Stack;
import java.util.Vector;

public class _20_StackAndVector {

    static void main(String[] args) {

        // Vector is a legacy, resizable array implementation of List.
        // Its individual methods are synchronized.
        Vector<String> languages = new Vector<>();

        languages.add("Java");
        languages.add("Python");
        languages.add("JavaScript");

        System.out.println("Languages: " + languages);

        // Access elements by index.
        System.out.println("First language: " + languages.get(0));

        // Replace an element.
        languages.set(1, "Kotlin");

        System.out.println("After replacement: " + languages);

        // Remove an element.
        languages.remove("JavaScript");

        System.out.println("After removal: " + languages);

        // Vector exposes legacy capacity-related methods.
        System.out.println("Size: " + languages.size());
        System.out.println("Capacity: " + languages.capacity());

        // Ensure that the backing array can hold at least 10 elements.
        languages.ensureCapacity(10);

        System.out.println("Capacity after ensureCapacity: " + languages.capacity());

        // Stack extends Vector and represents a last-in, first-out (LIFO) structure.
        Stack<String> books = new Stack<>();

        // push() adds an element to the top of the stack.
        books.push("Clean Code");
        books.push("Effective Java");
        books.push("Design Patterns");

        System.out.println("\nStack: " + books);

        // peek() returns the top element without removing it.
        System.out.println("Top book: " + books.peek());
        System.out.println("Stack after peek: " + books);

        // pop() removes and returns the top element.
        System.out.println("Removed book: " + books.pop());
        System.out.println("Stack after pop: " + books);

        // search() returns a 1-based position from the top.
        System.out.println("Position of Clean Code: " + books.search("Clean Code"));
        System.out.println("Position of Missing Book: " + books.search("Missing Book"));

        // empty() checks whether the stack has no elements.
        System.out.println("Is stack empty? " + books.empty());

        // Popping or peeking at an empty Stack throws EmptyStackException.
        // Check empty() first if the stack may be empty.
        while (!books.empty()) {
            System.out.println("Removing: " + books.pop());
        }

        System.out.println("Is stack empty now? " + books.empty());

        // Prefer ArrayList over Vector for ordinary resizable-list usage.
        // Prefer ArrayDeque over Stack for most stack operations:
        //
        // ArrayDeque<String> stack = new ArrayDeque<>();
        // stack.push("First");
        // stack.push("Second");
        // String top = stack.pop();
        //
        // Synchronization of individual legacy methods does not automatically
        // make compound operations atomic.
    }
}
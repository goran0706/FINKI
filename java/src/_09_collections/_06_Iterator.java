package _09_collections;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

public class _06_Iterator {

    static void main(String[] args) {

        List<String> employees = new ArrayList<>(
                List.of("Alice", "Bob", "Charlie", "Diana")
        );

        System.out.println("Employees: " + employees);

        // Iterator provides a standard way to traverse a collection.
        // hasNext() checks whether another element exists.
        // next() returns the next element.
        Iterator<String> iterator = employees.iterator();

        System.out.println("\nUsing Iterator:");

        while (iterator.hasNext()) {
            String employee = iterator.next();
            System.out.println(employee);
        }

        // Use Iterator.remove() to safely remove the current element
        // during iteration.
        // Calling remove() before next(), or twice after one next(),
        // throws IllegalStateException.
        iterator = employees.iterator();

        while (iterator.hasNext()) {
            String employee = iterator.next();

            if (employee.equals("Bob")) {
                iterator.remove();
            }
        }

        System.out.println("\nAfter Iterator removal: " + employees);

        // ListIterator is available for lists.
        // It supports forward and backward traversal, element replacement,
        // and insertion during iteration.
        ListIterator<String> listIterator = employees.listIterator();

        System.out.println("\nForward traversal:");

        while (listIterator.hasNext()) {
            System.out.println(
                    "Index " + listIterator.nextIndex()
                            + ": " + listIterator.next()
            );
        }

        System.out.println("\nBackward traversal:");

        while (listIterator.hasPrevious()) {
            System.out.println(
                    "Index " + listIterator.previousIndex()
                            + ": " + listIterator.previous()
            );
        }

        // ListIterator.set() replaces the last element returned by
        // next() or previous().
        listIterator = employees.listIterator();

        while (listIterator.hasNext()) {
            String employee = listIterator.next();

            if (employee.equals("Charlie")) {
                listIterator.set("Charles");
            }
        }

        System.out.println("\nAfter ListIterator.set(): " + employees);

        // ListIterator.add() inserts an element at the iterator's current
        // position. The new element is inserted before the element that
        // would be returned by next().
        listIterator = employees.listIterator();

        while (listIterator.hasNext()) {
            String employee = listIterator.next();

            if (employee.equals("Diana")) {
                listIterator.add("Eva");
                break;
            }
        }

        System.out.println("After ListIterator.add(): " + employees);

        // Enhanced for loops also use iteration internally.
        // Do not structurally modify an ArrayList directly inside this loop.
        // Doing so may cause ConcurrentModificationException.
        System.out.println("\nUsing enhanced for:");

        for (String employee : employees) {
            System.out.println(employee);
        }

        // For simple conditional removal, removeIf() is often clearer.
        employees.removeIf(employee -> employee.startsWith("E"));

        System.out.println("\nAfter removeIf(): " + employees);
    }
}
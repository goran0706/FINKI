package _09_collections;

import java.util.HashSet;
import java.util.Set;

public class _08_HashSet {

    static void main(String[] args) {

        // HashSet implements Set using a hash table.
        // It prevents duplicates and does not guarantee iteration order.
        Set<String> names = new HashSet<>();

        // add() returns true when an element is added.
        System.out.println(names.add("Alice")); // true
        System.out.println(names.add("Bob"));   // true
        System.out.println(names.add("Charlie")); // true

        // Adding a duplicate returns false.
        System.out.println(names.add("Alice")); // false

        System.out.println("Names: " + names);
        System.out.println("Size: " + names.size());

        // Membership checks are O(1) on average.
        System.out.println("Contains Bob: " + names.contains("Bob"));
        System.out.println("Contains Diana: " + names.contains("Diana"));

        // Removing an element is O(1) on average.
        names.remove("Bob");

        System.out.println("After removal: " + names);

        // HashSet supports one null element.
        names.add(null);
        names.add(null);

        System.out.println("After adding null twice: " + names);

        // Iteration order is unspecified.
        System.out.println("\nIterating:");

        for (String name : names) {
            System.out.println(name);
        }

        // HashSet identifies duplicates using hashCode() and equals().
        // This custom class overrides both methods, so two Employee objects
        // with the same ID are treated as equal.
        Set<Employee> employees = new HashSet<>();

        employees.add(new Employee(1, "Alice"));
        employees.add(new Employee(2, "Bob"));
        employees.add(new Employee(1, "Alex"));

        System.out.println("\nEmployees: " + employees);
        System.out.println("Employee count: " + employees.size());

        // Do not modify fields involved in hashCode() or equals()
        // while an object is stored in a HashSet. Doing so can make
        // lookup and removal behave unexpectedly.

        // Initial capacity can reduce resizing when the expected size is known.
        Set<Integer> numbers = new HashSet<>(100);

        numbers.add(10);
        numbers.add(20);
        numbers.add(10);

        System.out.println("\nNumbers: " + numbers);

        // HashSet is not thread-safe by default.
        // Use an appropriate concurrent collection or synchronization
        // when multiple threads modify a set.
    }

    static class Employee {

        private final int id;
        private final String name;

        Employee(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public boolean equals(Object object) {
            if (this == object) {
                return true;
            }

            if (!(object instanceof Employee employee)) {
                return false;
            }

            return id == employee.id;
        }

        @Override
        public int hashCode() {
            return Integer.hashCode(id);
        }

        @Override
        public String toString() {
            return "Employee{id=" + id + ", name='" + name + "'}";
        }
    }
}
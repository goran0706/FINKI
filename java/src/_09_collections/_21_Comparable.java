package _09_collections;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class _21_Comparable {

    static void main(String[] args) {

        // Comparable defines the natural ordering of objects.
        // A class implements Comparable<T> and defines compareTo(T other).
        //
        // compareTo() returns:
        //   negative value: this object comes before the other object
        //   zero:           both objects are equivalent in ordering
        //   positive value: this object comes after the other object

        List<Employee> employees = new ArrayList<>();

        employees.add(new Employee(103, "Charlie", 75000));
        employees.add(new Employee(101, "Alice", 90000));
        employees.add(new Employee(102, "Bob", 80000));

        System.out.println("Before sorting:");
        employees.forEach(System.out::println);

        // Collections.sort() uses the natural ordering defined by compareTo().
        Collections.sort(employees);

        System.out.println("\nSorted by employee ID:");
        employees.forEach(System.out::println);

        // List.sort(null) also uses natural ordering.
        employees.sort(null);

        System.out.println("\nSorted using List.sort(null):");
        employees.forEach(System.out::println);

        // compareTo() can be used directly to compare two objects.
        Employee alice = employees.get(0);
        Employee bob = employees.get(1);

        System.out.println("\nComparing Alice and Bob:");
        System.out.println(alice.compareTo(bob));

        // Integer.compare() avoids subtraction-based comparison,
        // which can overflow for extreme integer values.
        //
        // Natural ordering should be consistent and transitive.
        // If compareTo() returns zero, it is recommended that equals()
        // also returns true, although Comparable does not strictly require it.
    }

    record Employee(int id, String name, double salary) implements Comparable<Employee> {

        @Override
            public int compareTo(Employee other) {
                // Define employee ID as the natural ordering.
                return Integer.compare(this.id, other.id);
            }

            @Override
            public String toString() {
                return "Employee{id=" + id
                        + ", name='" + name + '\''
                        + ", salary=" + salary
                        + '}';
            }
        }
}
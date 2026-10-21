package _09_collections;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class _22_Comparator {

    static void main(String[] args) {

        // Comparator defines an ordering independently of the class itself.
        // Unlike Comparable, a class does not need to implement Comparator.
        //
        // compare() returns:
        //   negative value: first object comes before the second
        //   zero:           objects are equivalent in this ordering
        //   positive value: first object comes after the second

        List<Employee> employees = new ArrayList<>();

        employees.add(new Employee(103, "Charlie", 75000));
        employees.add(new Employee(101, "Alice", 90000));
        employees.add(new Employee(102, "Bob", 80000));
        employees.add(new Employee(104, "Alice", 95000));

        System.out.println("Original order:");
        employees.forEach(System.out::println);

        // Sort by name using a lambda expression.
        Comparator<Employee> byName =
                (first, second) -> first.name().compareTo(second.name());

        employees.sort(byName);

        System.out.println("\nSorted by name:");
        employees.forEach(System.out::println);

        // Sort by salary in ascending order.
        employees.sort(
                Comparator.comparingDouble(Employee::salary)
        );

        System.out.println("\nSorted by salary ascending:");
        employees.forEach(System.out::println);

        // Reverse the salary ordering.
        employees.sort(
                Comparator.comparingDouble(Employee::salary).reversed()
        );

        System.out.println("\nSorted by salary descending:");
        employees.forEach(System.out::println);

        // Chain comparators to define multiple sorting criteria.
        // Employees are sorted by name, then by salary descending.
        employees.sort(
                Comparator.comparing(Employee::name)
                        .thenComparing(
                                Comparator.comparingDouble(Employee::salary)
                                        .reversed()
                        )
        );

        System.out.println("\nSorted by name, then salary descending:");
        employees.forEach(System.out::println);

        // nullsFirst() and nullsLast() define how null values are ordered.
        List<String> names = new ArrayList<>();

        names.add("Charlie");
        names.add(null);
        names.add("Alice");
        names.add("Bob");

        names.sort(Comparator.nullsFirst(Comparator.naturalOrder()));

        System.out.println("\nNames with null first: " + names);

        names.sort(Comparator.nullsLast(Comparator.naturalOrder()));

        System.out.println("Names with null last: " + names);

        // A Comparator can also be supplied to a sorted collection,
        // such as TreeSet or TreeMap, to define its ordering.
    }

    record Employee(int id, String name, double salary) {

        @Override
            public String toString() {
                return "Employee{id=" + id
                        + ", name='" + name + '\''
                        + ", salary=" + salary
                        + '}';
            }
        }
}
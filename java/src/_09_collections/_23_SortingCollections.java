package _09_collections;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class _23_SortingCollections {

    static void main(String[] args) {

        // Sorting collections is commonly performed using:
        // - Comparable: defines a class's natural ordering.
        // - Comparator: defines an external or alternative ordering.
        // - Collections.sort() or List.sort(): sorts a List in place.

        List<Integer> numbers = new ArrayList<>(
                List.of(42, 7, 19, 3, 28, 7)
        );

        System.out.println("Original numbers: " + numbers);

        // Sort in ascending natural order.
        Collections.sort(numbers);

        System.out.println("Ascending: " + numbers);

        // Sort in descending order using a Comparator.
        numbers.sort(Comparator.reverseOrder());

        System.out.println("Descending: " + numbers);

        // Collections.reverse() reverses the current order.
        // It does not sort the elements.
        Collections.reverse(numbers);

        System.out.println("After reverse: " + numbers);

        // Shuffle randomly rearranges the elements.
        Collections.shuffle(numbers);

        System.out.println("After shuffle: " + numbers);

        // Sort custom objects using a Comparator.
        List<Employee> employees = new ArrayList<>();

        employees.add(new Employee(103, "Charlie", 75000));
        employees.add(new Employee(101, "Alice", 90000));
        employees.add(new Employee(102, "Bob", 80000));
        employees.add(new Employee(104, "Diana", 80000));

        System.out.println("\nOriginal employees:");
        employees.forEach(System.out::println);

        // Sort by salary, ascending.
        employees.sort(Comparator.comparingDouble(Employee::salary));

        System.out.println("\nSorted by salary ascending:");
        employees.forEach(System.out::println);

        // Sort by salary descending.
        employees.sort(
                Comparator.comparingDouble(Employee::salary).reversed()
        );

        System.out.println("\nSorted by salary descending:");
        employees.forEach(System.out::println);

        // Chain sorting criteria to break ties by employee name.
        employees.sort(
                Comparator.comparingDouble(Employee::salary)
                        .reversed()
                        .thenComparing(Employee::name)
        );

        System.out.println("\nSalary descending, then name ascending:");
        employees.forEach(System.out::println);

        // Binary search requires the List to be sorted according to
        // the same ordering used by the search.
        List<Integer> sortedNumbers = new ArrayList<>(
                List.of(3, 7, 7, 19, 28, 42)
        );

        int index = Collections.binarySearch(sortedNumbers, 19);

        System.out.println("\nIndex of 19: " + index);

        // If an element is absent, binarySearch() returns a negative value.
        // The insertion point can be calculated as -result - 1.
        int missingResult = Collections.binarySearch(sortedNumbers, 20);

        System.out.println("Search result for 20: " + missingResult);

        if (missingResult < 0) {
            int insertionPoint = -missingResult - 1;
            System.out.println("Insertion point for 20: " + insertionPoint);
        }

        // Collections.min() and max() use natural ordering by default.
        System.out.println("Minimum: " + Collections.min(sortedNumbers));
        System.out.println("Maximum: " + Collections.max(sortedNumbers));

        // For custom objects, min() and max() can receive a Comparator.
        Employee highestPaid = Collections.max(
                employees,
                Comparator.comparingDouble(Employee::salary)
        );

        System.out.println("Highest-paid employee: " + highestPaid);

        // List.sort() and Collections.sort() modify the existing List.
        // Sorting an immutable List throws UnsupportedOperationException.
        //
        // Sorting algorithms may use additional memory, and their
        // performance depends on the collection and comparison logic.
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
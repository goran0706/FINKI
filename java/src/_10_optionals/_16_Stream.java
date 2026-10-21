package _10_optionals;

import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/*
 * STREAM()
 *
 * Optional.stream() converts an Optional into a Stream containing
 * zero or one elements.
 *
 * Introduced in Java 9.
 *
 * Behavior:
 * 1. If the Optional is present, the Stream contains its value.
 * 2. If the Optional is empty, the Stream is empty.
 *
 * A Stream is a sequence of elements that supports operations such as
 * filter(), map(), and forEach().
 *
 * Optional.stream() is particularly useful when working with collections
 * of Optional values or combining optional results with other Streams.
 *
 * It allows absent values to be skipped naturally instead of requiring
 * explicit isPresent() checks.
 */
public class _16_Stream {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee("EMP-001", "Alex", "Engineering")
            );
        }

        if ("EMP-002".equals(id)) {
            return Optional.of(
                    new Employee("EMP-002", "Sam", "Finance")
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        /*
         * Example 1: Convert a present Optional into a Stream.
         *
         * The resulting Stream contains one Employee.
         */
        Optional<Employee> employee = findEmployee("EMP-001");

        Stream<Employee> employeeStream = employee.stream();

        employeeStream.forEach(System.out::println);

        /*
         * Example 2: Convert an empty Optional into a Stream.
         *
         * The resulting Stream contains zero elements.
         * Therefore, forEach() does not execute its action.
         */
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        missingEmployee.stream()
                .forEach(System.out::println);

        /*
         * Example 3: Combine Optional results into a single Stream.
         *
         * Stream.of() creates a Stream containing three Optional values.
         *
         * flatMap(Optional::stream) converts each Optional into a Stream
         * and combines the resulting Streams.
         *
         * Empty Optionals contribute no elements.
         * Present Optionals contribute their Employee.
         */
        Stream.of(
                        findEmployee("EMP-001"),
                        findEmployee("EMP-999"),
                        findEmployee("EMP-002")
                )
                .flatMap(Optional::stream)
                .forEach(System.out::println);

        /*
         * Example 4: Collect available Employees into a List.
         *
         * The missing Employee is excluded automatically.
         *
         * toList() returns an unmodifiable List in modern Java versions.
         */
        List<Employee> employees = Stream.of(
                        findEmployee("EMP-001"),
                        findEmployee("EMP-999"),
                        findEmployee("EMP-002")
                )
                .flatMap(Optional::stream)
                .toList();

        System.out.println("Found employees: " + employees);

        /*
         * Example 5: Apply Stream operations after flattening.
         *
         * First, remove empty Optional values.
         * Then, extract each Employee's name.
         * Finally, print the names of Employees in Engineering.
         */
        Stream.of(
                        findEmployee("EMP-001"),
                        findEmployee("EMP-999"),
                        findEmployee("EMP-002")
                )
                .flatMap(Optional::stream)
                .filter(person -> person.department().equals("Engineering"))
                .map(Employee::name)
                .forEach(System.out::println);
    }

    record Employee(String id, String name, String department) {

        @Override
        public String toString() {
            return name + " (" + department + ")";
        }
    }
}
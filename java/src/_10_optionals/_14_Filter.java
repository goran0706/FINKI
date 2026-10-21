package _10_optionals;

import java.util.Optional;

/*
 * FILTER()
 *
 * Optional.filter() keeps the contained value only if it satisfies
 * a specified condition.
 *
 * Syntax:
 *     optional.filter(value -> condition)
 *
 * Behavior:
 * 1. If the Optional is empty, filter() returns an empty Optional.
 * 2. If the Optional is present and the condition is true,
 *    filter() returns an Optional containing the original value.
 * 3. If the Optional is present and the condition is false,
 *    filter() returns an empty Optional.
 *
 * filter() accepts a Predicate, a functional interface that evaluates
 * a value and returns true or false.
 *
 * It is useful for validating or selecting values within an Optional
 * without manually checking whether the value exists.
 */
public class _14_Filter {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-001",
                            "Alex",
                            "Engineering",
                            60000,
                            true
                    )
            );
        }

        if ("EMP-002".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-002",
                            "Sam",
                            "Finance",
                            45000,
                            false
                    )
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> employee = findEmployee("EMP-001");

        /*
         * Keep the Employee only if their salary is at least 50000.
         *
         * The result is still Optional<Employee>.
         */
        Optional<Employee> highSalaryEmployee = employee.filter(
                person -> person.salary() >= 50000
        );

        System.out.println(
                "High salary employee: "
                        + highSalaryEmployee.orElse(null)
        );

        /*
         * The condition is false for Sam because Sam's salary is 45000.
         * filter() therefore returns Optional.empty().
         */
        Optional<Employee> anotherEmployee = findEmployee("EMP-002");

        Optional<Employee> anotherHighSalaryEmployee = anotherEmployee.filter(
                person -> person.salary() >= 50000
        );

        System.out.println(
                "Another high salary employee: "
                        + anotherHighSalaryEmployee.orElse(null)
        );

        /*
         * Filter by department.
         */
        Optional<Employee> engineeringEmployee = employee.filter(
                person -> person.department().equals("Engineering")
        );

        System.out.println(
                "Engineering employee: "
                        + engineeringEmployee.orElse(null)
        );

        /*
         * Filter by multiple conditions.
         *
         * Both conditions must be true for the Employee to be retained.
         */
        Optional<Employee> eligibleEmployee = employee.filter(
                person -> person.active()
                        && person.salary() >= 50000
        );

        System.out.println(
                "Eligible employee: "
                        + eligibleEmployee.orElse(null)
        );

        /*
         * filter() can be chained with map().
         *
         * First, retain only active employees.
         * Then, extract the name.
         *
         * If the Employee is missing or inactive, the result is empty.
         */
        Optional<String> activeEmployeeName = findEmployee("EMP-002")
                .filter(Employee::active)
                .map(Employee::name);

        System.out.println(
                "Active employee name: "
                        + activeEmployeeName.orElse("No active employee found")
        );

        /*
         * Filtering an empty Optional does not execute the predicate.
         */
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        Optional<Employee> filteredMissingEmployee = missingEmployee.filter(
                Employee::active
        );

        System.out.println(
                "Filtered missing employee: " + filteredMissingEmployee
        );
    }

    record Employee(String id, String name, String department, double salary, boolean active) {

        @Override
        public String toString() {
            return name + " (" + department + ")";
        }
    }
}
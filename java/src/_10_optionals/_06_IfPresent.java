package _10_optionals;

import java.util.Optional;

/*
 * IFPRESENT()
 *
 * Optional.ifPresent(Consumer) executes an action only when the Optional
 * contains a value.
 *
 * A Consumer is a functional interface that accepts a value and performs
 * an operation without returning a result.
 *
 * Syntax:
 *     optional.ifPresent(value -> performAction(value));
 *
 * If the Optional is empty, the action is skipped.
 *
 * This is useful when you want to process a value only if it exists,
 * without explicitly checking isPresent() and calling get().
 */
public class _06_IfPresent {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(new Employee("EMP-001", "Alex"));
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> existingEmployee = findEmployee("EMP-001");
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        /*
         * The lambda receives the Employee when a value is present.
         * The action prints the employee's name.
         */
        existingEmployee.ifPresent(employee ->
                System.out.println("Employee: " + employee.name())
        );

        /*
         * The Optional is empty, so the lambda is not executed.
         */
        missingEmployee.ifPresent(employee ->
                System.out.println("Employee: " + employee.name())
        );

        /*
         * ifPresent() is useful for conditional actions.
         *
         * It is not intended to retrieve a value for later assignment.
         * If you need a value or a fallback, consider orElse() or
         * orElseGet() instead.
         */
    }

    record Employee(String id, String name) {

    }
}
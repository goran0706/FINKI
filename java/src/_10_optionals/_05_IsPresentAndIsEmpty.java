package _10_optionals;

import java.util.Optional;

/*
 * ISPRESENT() AND ISEMPTY()
 *
 * isPresent() returns true when an Optional contains a value.
 *
 * isEmpty() returns true when an Optional contains no value.
 * It was introduced in Java 11.
 *
 * Both methods return boolean and can be used to make decisions
 * based on whether a value exists.
 *
 * Note:
 * - isPresent() and isEmpty() are opposites.
 * - Calling get() is only safe when the Optional contains a value.
 */
public class _05_IsPresentAndIsEmpty {

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
         * isPresent() checks whether a value exists.
         */
        if (existingEmployee.isPresent()) {
            Employee employee = existingEmployee.get();
            System.out.println("Found: " + employee.name());
        }

        /*
         * isEmpty() checks whether a value does not exist.
         */
        if (missingEmployee.isEmpty()) {
            System.out.println("Employee not found.");
        }

        /*
         * These methods return opposite results for the same Optional.
         */
        System.out.println(existingEmployee.isPresent()); // true
        System.out.println(existingEmployee.isEmpty());   // false

        System.out.println(missingEmployee.isPresent());  // false
        System.out.println(missingEmployee.isEmpty());    // true

        /*
         * Although checking isPresent() before get() is valid, modern
         * Optional code often uses methods such as ifPresent(),
         * orElse(), orElseGet(), and orElseThrow() to express the
         * intended behavior more directly.
         */
    }

    record Employee(String id, String name) {

    }
}
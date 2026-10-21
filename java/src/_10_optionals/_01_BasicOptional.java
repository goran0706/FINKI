package _10_optionals;

import java.util.Optional;

/*
 * BASIC OPTIONAL
 *
 * Optional<T> is a container that represents either:
 * 1. A value of type T.
 * 2. No value.
 *
 * Optional helps make the possibility of a missing result explicit.
 * Instead of returning null directly, a method can return Optional<T>
 * to indicate that a value might not exist.
 *
 * This is useful when a lookup can legitimately produce no result,
 * such as searching for an employee or bank account.
 *
 * Optional does not eliminate NullPointerException in every situation.
 * It is a tool for representing and handling potentially missing values.
 */
public class _01_BasicOptional {

    /*
     * The method returns Optional<Employee> because an employee with
     * the requested ID might not exist.
     *
     * Optional.of(employee) creates an Optional containing a non-null value.
     */
    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            Employee employee = new Employee("EMP-001", "Alex");
            return Optional.of(employee);
        }

        // Optional.empty() represents the absence of a value.
        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> result = findEmployee("EMP-001");

        /*
         * isPresent() checks whether the Optional contains a value.
         */
        if (result.isPresent()) {
            Employee employee = result.get();

            System.out.println("Employee ID: " + employee.id());
            System.out.println("Employee name: " + employee.name());
        }

        Optional<Employee> missingResult = findEmployee("EMP-999");

        if (missingResult.isEmpty()) {
            System.out.println("Employee not found.");
        }

        /*
         * Calling get() on an empty Optional throws
         * NoSuchElementException.
         *
         * Prefer safer operations such as ifPresent(), orElse(),
         * orElseGet(), and orElseThrow() when handling Optional values.
         */
    }

    record Employee(String id, String name) {

    }
}
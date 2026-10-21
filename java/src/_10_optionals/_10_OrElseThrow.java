package _10_optionals;

import java.util.NoSuchElementException;
import java.util.Optional;

/*
 * ORELSETHROW()
 *
 * Optional.orElseThrow() returns the contained value when present.
 *
 * If the Optional is empty, it throws NoSuchElementException.
 *
 * There are two commonly used forms:
 *
 * 1. orElseThrow()
 *    Throws NoSuchElementException when empty.
 *
 * 2. orElseThrow(Supplier)
 *    Throws an exception created by the supplied factory when empty.
 *
 * Use orElseThrow() when a missing value should prevent the operation
 * from continuing.
 */
public class _10_OrElseThrow {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(new Employee("EMP-001", "Alex"));
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> existingEmployee = findEmployee("EMP-001");

        /*
         * The Optional contains an Employee, so orElseThrow() returns it.
         */
        Employee employee = existingEmployee.orElseThrow();

        System.out.println(employee.getName());

        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        /*
         * The Optional is empty, so this throws NoSuchElementException.
         *
         * The exception is caught here so the example can continue.
         */
        try {
            Employee missing = missingEmployee.orElseThrow();
            System.out.println(missing.getName());
        } catch (NoSuchElementException exception) {
            System.out.println("Employee not found.");
        }

        /*
         * You can supply a factory for a more meaningful exception.
         *
         * The Supplier is evaluated only when the Optional is empty.
         */
        try {
            Employee missing = missingEmployee.orElseThrow(
                    () -> new IllegalArgumentException(
                            "No employee exists with ID EMP-999"
                    )
            );

            System.out.println(missing.getName());
        } catch (IllegalArgumentException exception) {
            System.out.println(exception.getMessage());
        }

        /*
         * The exception type should reflect the meaning of the failure.
         * For example, a domain or application service might use a
         * dedicated EmployeeNotFoundException rather than a generic
         * IllegalArgumentException.
         */
    }

    static class Employee {

        private final String id;
        private final String name;

        public Employee(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
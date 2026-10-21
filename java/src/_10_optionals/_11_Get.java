package _10_optionals;

import java.util.NoSuchElementException;
import java.util.Optional;

/*
 * GET()
 *
 * Optional.get() returns the contained value when the Optional is present.
 *
 * If the Optional is empty, get() throws NoSuchElementException.
 *
 * Example:
 *     Optional<String> name = Optional.of("Alex");
 *     String value = name.get();
 *
 * Important:
 * get() does not provide a fallback or a custom exception.
 *
 * In most cases, prefer orElse(), orElseGet(), orElseThrow(), or
 * another Optional operation that expresses your intention more clearly.
 *
 * get() is demonstrated here because you may encounter it in existing code.
 */
public class _11_Get {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(new Employee("EMP-001", "Alex"));
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> existingEmployee = findEmployee("EMP-001");

        /*
         * The Optional is present, so get() returns the Employee.
         */
        Employee employee = existingEmployee.get();

        System.out.println(employee.getName());

        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        /*
         * Calling get() on an empty Optional throws NoSuchElementException.
         *
         * The try-catch block handles the exception so the program
         * can continue executing.
         */
        try {
            Employee missing = missingEmployee.get();
            System.out.println(missing.getName());
        } catch (NoSuchElementException exception) {
            System.out.println("Cannot retrieve an employee from an empty Optional.");
        }

        /*
         * A clearer alternative when the employee must exist:
         *
         * Employee requiredEmployee = missingEmployee.orElseThrow(
         *         () -> new IllegalStateException("Employee is required.")
         * );
         *
         * orElseThrow() makes the failure behavior explicit and allows
         * you to choose an appropriate exception.
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
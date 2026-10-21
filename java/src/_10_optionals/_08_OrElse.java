package _10_optionals;

import java.util.Optional;

/*
 * ORELSE()
 *
 * Optional.orElse(defaultValue) returns:
 *
 * 1. The contained value if the Optional is present.
 * 2. The supplied default value if the Optional is empty.
 *
 * Syntax:
 *     optional.orElse(defaultValue)
 *
 * Important:
 * The default value expression is evaluated before orElse() is called,
 * even when the Optional already contains a value.
 *
 * This matters when the fallback requires an expensive operation or
 * produces side effects.
 */
public class _08_OrElse {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(new Employee("EMP-001", "Alex"));
        }

        return Optional.empty();
    }

    public static Employee createDefaultEmployee() {
        System.out.println("Creating default employee.");
        return new Employee("DEFAULT", "Unknown Employee");
    }

    static void main(String[] args) {

        Optional<Employee> existingEmployee = findEmployee("EMP-001");
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        /*
         * The Optional contains an Employee, so that employee is returned.
         *
         * However, createDefaultEmployee() is still executed because
         * method arguments are evaluated before the method is called.
         */
        Employee employee = existingEmployee.orElse(createDefaultEmployee());

        System.out.println(employee);

        /*
         * The Optional is empty, so the default employee is returned.
         */
        Employee fallbackEmployee = missingEmployee.orElse(
                new Employee("DEFAULT", "Unknown Employee")
        );

        System.out.println(fallbackEmployee);

        /*
         * orElse() is appropriate when the fallback value is already
         * available or inexpensive to construct.
         *
         * For an expensive or conditionally executed fallback, consider
         * orElseGet(), which accepts a Supplier and evaluates it only
         * when the Optional is empty.
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

        @Override
        public String toString() {
            return "Employee{id='" + id + "', name='" + name + "'}";
        }
    }
}
package _10_optionals;

import java.util.Optional;

/*
 * ORELSEGET()
 *
 * Optional.orElseGet(Supplier) returns:
 *
 * 1. The contained value if the Optional is present.
 * 2. A value produced by the Supplier if the Optional is empty.
 *
 * A Supplier is a functional interface that takes no arguments
 * and returns a value.
 *
 * Syntax:
 *     optional.orElseGet(() -> createDefaultValue())
 *
 * Unlike orElse(), the fallback is evaluated only when the Optional
 * is empty.
 *
 * This is useful when creating the fallback requires computation,
 * a database lookup, or another potentially expensive operation.
 */
public class _09_OrElseGet {

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
         * The Optional contains an Employee.
         *
         * The Supplier is not executed, so createDefaultEmployee()
         * is not called.
         */
        Employee employee = existingEmployee.orElseGet(
                () -> createDefaultEmployee()
        );

        System.out.println(employee);

        /*
         * The Optional is empty.
         *
         * The Supplier is executed, creating and returning a default
         * Employee.
         */
        Employee fallbackEmployee = missingEmployee.orElseGet(
                () -> createDefaultEmployee()
        );

        System.out.println(fallbackEmployee);

        /*
         * orElse() versus orElseGet():
         *
         * orElse(value)
         *     Evaluates the fallback expression before the call.
         *
         * orElseGet(supplier)
         *     Evaluates the fallback only when the Optional is empty.
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
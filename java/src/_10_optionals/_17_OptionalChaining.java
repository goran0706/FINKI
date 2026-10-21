package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL CHAINING
 *
 * Optional chaining means combining Optional operations to process a
 * potentially missing value without repeatedly checking for null.
 *
 * Common operations:
 * - map()          transforms a present value.
 * - flatMap()      chains a function that already returns an Optional.
 * - filter()       keeps a value only if it satisfies a condition.
 * - orElse()       provides a default value.
 * - orElseThrow()  throws an exception when a value is missing.
 *
 * Each operation passes its result to the next operation.
 *
 * If an Optional becomes empty during the chain, subsequent map(),
 * flatMap(), and filter() operations do not execute their functions.
 */
public class _17_OptionalChaining {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-001",
                            "Alex",
                            new Department("Engineering"),
                            true
                    )
            );
        }

        if ("EMP-002".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-002",
                            "Sam",
                            null,
                            true
                    )
            );
        }

        if ("EMP-003".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-003",
                            "Jordan",
                            new Department("Finance"),
                            false
                    )
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        /*
         * Example 1: Chain map(), flatMap(), and orElse().
         *
         * 1. Find the Employee.
         * 2. Extract the Employee's name.
         * 3. Return the name or a default value.
         *
         * map() is appropriate because getName() returns String.
         */
        String employeeName = findEmployee("EMP-001")
                .map(Employee::getName)
                .orElse("Unknown Employee");

        System.out.println("Employee name: " + employeeName);

        /*
         * Example 2: Navigate through nested domain objects.
         *
         * 1. Find the Employee.
         * 2. Retrieve the Employee's Optional<Department>.
         * 3. Extract the Department's name.
         * 4. Return a default if the Employee or Department is missing.
         *
         * flatMap() is necessary because getDepartment() returns Optional.
         * map() is appropriate because getName() returns String.
         */
        String departmentName = findEmployee("EMP-001")
                .flatMap(Employee::getDepartment)
                .map(Department::name)
                .orElse("No Department");

        System.out.println("Department: " + departmentName);

        /*
         * Example 3: Filter before transforming.
         *
         * Only active Employees are accepted.
         *
         * If the Employee is inactive or missing, filter() produces
         * an empty Optional and orElse() supplies the default.
         */
        String activeEmployeeName = findEmployee("EMP-003")
                .filter(Employee::isActive)
                .map(Employee::getName)
                .orElse("No Active Employee");

        System.out.println("Active employee: " + activeEmployeeName);

        /*
         * Example 4: A missing intermediate value.
         *
         * EMP-002 exists, but has no Department.
         *
         * flatMap() produces an empty Optional.
         * map() is consequently skipped.
         * orElse() provides the default.
         */
        String missingDepartment = findEmployee("EMP-002")
                .flatMap(Employee::getDepartment)
                .map(Department::name)
                .orElse("No Department");

        System.out.println("Missing department: " + missingDepartment);

        /*
         * Example 5: Use orElseThrow() when the value is required.
         *
         * Unlike orElse(), orElseThrow() does not provide a fallback.
         * It throws the specified exception if the Optional is empty.
         *
         * The exception is caught here only to keep the demonstration
         * running. In an application, it may instead be handled by
         * an appropriate exception-handling layer.
         */
        try {
            String requiredEmployeeName = findEmployee("EMP-999")
                    .map(Employee::getName)
                    .orElseThrow(
                            () -> new IllegalStateException(
                                    "Required employee was not found."
                            )
                    );

            System.out.println("Required employee: " + requiredEmployeeName);

        } catch (IllegalStateException exception) {
            System.out.println(exception.getMessage());
        }
    }

    record Department(String name) {

    }

    static class Employee {

        private final String id;
        private final String name;
        private final Department department;
        private final boolean active;

        public Employee(
                String id,
                String name,
                Department department,
                boolean active
        ) {
            this.id = id;
            this.name = name;
            this.department = department;
            this.active = active;
        }

        public String getName() {
            return name;
        }

        public boolean isActive() {
            return active;
        }

        public Optional<Department> getDepartment() {
            return Optional.ofNullable(department);
        }
    }
}
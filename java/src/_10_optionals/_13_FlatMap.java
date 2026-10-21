package _10_optionals;

import java.util.Optional;

/*
 * FLATMAP()
 *
 * Optional.flatMap() transforms the value inside an Optional into
 * another Optional without creating a nested Optional.
 *
 * The key difference between map() and flatMap() is the return type
 * of the mapping function.
 *
 * map():
 *     T -> U
 *     Optional<T> -> Optional<U>
 *
 * flatMap():
 *     T -> Optional<U>
 *     Optional<T> -> Optional<U>
 *
 * Use map() when the transformation returns a regular value.
 * Use flatMap() when the transformation already returns an Optional.
 *
 * flatMap() is especially useful when chaining methods that can
 * return missing values.
 */
public class _13_FlatMap {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee(
                            "EMP-001",
                            "Alex",
                            new Department("Engineering")
                    )
            );
        }

        if ("EMP-002".equals(id)) {
            return Optional.of(
                    new Employee("EMP-002", "Sam", null)
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> employee = findEmployee("EMP-001");

        /*
         * map() is appropriate when the mapping function returns
         * a regular value, such as String.
         */
        Optional<String> employeeName = employee.map(
                Employee::getName
        );

        System.out.println(
                "Employee: " + employeeName.orElse("Unknown Employee")
        );

        /*
         * getDepartment() already returns Optional<Department>.
         *
         * Using map() would produce:
         *
         * Optional<Optional<Department>>
         *
         * The outer Optional represents whether the Employee exists.
         * The inner Optional represents whether the Department exists.
         *
         * This nested structure is usually not what we want.
         */
        Optional<Optional<Department>> nestedDepartment = employee.map(
                Employee::getDepartment
        );

        System.out.println(
                "Nested Optional: " + nestedDepartment
        );

        /*
         * flatMap() avoids the nested Optional.
         *
         * It unwraps the Optional returned by getDepartment()
         * and produces a single Optional<Department>.
         */
        Optional<Department> department = employee.flatMap(
                Employee::getDepartment
        );

        System.out.println(
                "Department: " + department
                        .map(Department::name)
                        .orElse("No Department")
        );

        /*
         * Optional operations can be chained.
         *
         * Step 1: Find the Employee.
         * Step 2: Retrieve the Employee's optional Department.
         * Step 3: Extract the Department's name.
         *
         * If either the Employee or Department is missing, the final
         * Optional<String> is empty.
         */
        Optional<String> departmentName = findEmployee("EMP-001")
                .flatMap(Employee::getDepartment)
                .map(Department::name);

        System.out.println(
                "Department name: "
                        + departmentName.orElse("No Department")
        );

        /*
         * The employee exists, but has no Department.
         *
         * flatMap() propagates the empty Optional, so the chain
         * finishes without throwing an exception.
         */
        Optional<String> missingDepartment = findEmployee("EMP-002")
                .flatMap(Employee::getDepartment)
                .map(Department::name);

        System.out.println(
                "Missing department: "
                        + missingDepartment.orElse("No Department")
        );

        /*
         * The Employee itself does not exist.
         *
         * flatMap() and map() are not executed on an empty Optional.
         */
        Optional<String> missingEmployeeDepartment = findEmployee("EMP-999")
                .flatMap(Employee::getDepartment)
                .map(Department::name);

        System.out.println(
                "Missing employee department: "
                        + missingEmployeeDepartment.orElse("No Department")
        );
    }

    record Department(String name) {

    }

    static class Employee {

        private final String id;
        private final String name;
        private final Department department;

        public Employee(String id, String name, Department department) {
            this.id = id;
            this.name = name;
            this.department = department;
        }

        public String getName() {
            return name;
        }

        /*
         * The employee may not belong to a department.
         *
         * Optional<Department> explicitly represents that possibility.
         */
        public Optional<Department> getDepartment() {
            return Optional.ofNullable(department);
        }
    }
}
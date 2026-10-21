package _10_optionals;

import java.util.Optional;

/*
 * MAP()
 *
 * Optional.map() transforms the value inside an Optional into another value.
 *
 * Syntax:
 *     optional.map(value -> transform(value))
 *
 * The result is always another Optional:
 *
 * 1. If the original Optional is present, map() applies the function
 *    and wraps the result in an Optional.
 *
 * 2. If the original Optional is empty, map() does not execute the
 *    function and returns an empty Optional.
 *
 * A Function is a functional interface that accepts one argument
 * and produces a result.
 *
 * map() is useful for extracting properties, converting values,
 * and transforming data without manually checking whether a value exists.
 */
public class _12_Map {

    public static Optional<Employee> findEmployee(String id) {

        if ("EMP-001".equals(id)) {
            return Optional.of(
                    new Employee("EMP-001", "Alex", "Engineering")
            );
        }

        return Optional.empty();
    }

    static void main(String[] args) {

        Optional<Employee> employee = findEmployee("EMP-001");

        /*
         * Extract the employee's name.
         *
         * map() calls getName() only when the Employee exists.
         *
         * The result is Optional<String>, not String, because the
         * Employee might not exist.
         */
        Optional<String> employeeName = employee.map(
                Employee::name
        );

        System.out.println(employeeName.orElse("Unknown Employee"));

        /*
         * Extract another property from the same Employee.
         */
        Optional<String> department = employee.map(
                Employee::department
        );

        System.out.println(department.orElse("No Department"));

        /*
         * Transform a String into another value.
         *
         * The lambda expression calls String.toUpperCase() on the
         * contained name.
         */
        Optional<String> uppercaseName = employee
                .map(Employee::name)
                .map(String::toUpperCase);

        System.out.println(uppercaseName.orElse("UNKNOWN EMPLOYEE"));

        /*
         * When the original Optional is empty, the mapping functions
         * are not executed and the result remains empty.
         */
        Optional<Employee> missingEmployee = findEmployee("EMP-999");

        Optional<String> missingName = missingEmployee.map(
                Employee::name
        );

        System.out.println(missingName.orElse("Unknown Employee"));

        /*
         * map() also handles a mapping function that returns null.
         *
         * If getDepartment() returned null, map() would produce
         * Optional.empty() rather than Optional.of(null).
         *
         * However, returning null from domain methods is often best
         * avoided when the absence of a value can be modeled explicitly.
         */
    }

    record Employee(String id, String name, String department) {

    }
}
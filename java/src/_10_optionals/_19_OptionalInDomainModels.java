package _10_optionals;

import java.util.Optional;

/*
 * OPTIONAL IN DOMAIN MODELS
 *
 * Optional is useful when a method may legitimately return no result.
 *
 * Common examples in business applications:
 * - Finding an Employee by ID.
 * - Finding an optional Department assignment.
 * - Looking up an optional manager.
 * - Retrieving an optional secondary contact.
 *
 * A useful distinction:
 *
 * 1. Optional as a return type:
 *    Communicates that a method might not produce a result.
 *
 * 2. Optional as a field:
 *    Usually avoided in domain models and persistence entities.
 *    A nullable field or another explicit domain representation is
 *    generally more appropriate.
 *
 * 3. Required domain values:
 *    Should not be modeled as optional when the business rules require
 *    them to exist.
 *
 * This example uses ordinary classes rather than records.
 */
public class _19_OptionalInDomainModels {

    static void main(String[] args) {

        EmployeeRepository repository = new EmployeeRepository();

        /*
         * Example 1: Retrieve an Employee.
         *
         * The repository communicates possible absence through Optional.
         */
        Optional<Employee> employeeResult =
                repository.findById("EMP-002");

        employeeResult.ifPresent(
                employee -> System.out.println(
                        "Employee: " + employee.getName()
                )
        );

        /*
         * Example 2: Retrieve an optional Department.
         *
         * flatMap() is used because Employee.getDepartment() returns
         * Optional<Department>.
         *
         * map() is used because Department.getName() returns String.
         */
        String departmentName = repository.findById("EMP-002")
                .flatMap(Employee::getDepartment)
                .map(Department::name)
                .orElse("No Department Assigned");

        System.out.println("Department: " + departmentName);

        /*
         * Example 3: Retrieve an optional Manager.
         */
        String managerName = repository.findById("EMP-002")
                .flatMap(Employee::getManager)
                .map(Employee::getName)
                .orElse("No Manager Assigned");

        System.out.println("Manager: " + managerName);

        /*
         * Example 4: The Employee exists, but has no Department or Manager.
         *
         * These are two distinct business facts:
         * - The Employee exists.
         * - The Employee has no Department or Manager assigned.
         */
        Optional<Employee> unassignedResult =
                repository.findById("EMP-003");

        System.out.println(
                "Employee exists: " + unassignedResult.isPresent()
        );

        String unassignedDepartment = unassignedResult
                .flatMap(Employee::getDepartment)
                .map(Department::name)
                .orElse("No Department Assigned");

        System.out.println("Department: " + unassignedDepartment);

        /*
         * Example 5: The Employee itself does not exist.
         *
         * This differs from an existing Employee without a Department.
         */
        String missingEmployeeDepartment = repository.findById("EMP-999")
                .flatMap(Employee::getDepartment)
                .map(Department::name)
                .orElse("Employee or Department Not Found");

        System.out.println(
                "Missing employee lookup: " + missingEmployeeDepartment
        );
    }

    record Department(String id, String name) {

        @Override
        public String toString() {
            return name;
        }
    }

    static class Employee {

        private final String id;
        private final String name;

        /*
         * The Employee may not have a Department assigned.
         *
         * The field is nullable internally, while the getter exposes
         * the possibility of absence through Optional.
         *
         * This keeps Optional out of the domain object's field structure.
         */
        private final Department department;

        /*
         * The manager may also be absent.
         */
        private final Employee manager;

        public Employee(
                String id,
                String name,
                Department department,
                Employee manager
        ) {
            this.id = id;
            this.name = name;
            this.department = department;
            this.manager = manager;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public Optional<Department> getDepartment() {
            return Optional.ofNullable(department);
        }

        public Optional<Employee> getManager() {
            return Optional.ofNullable(manager);
        }
    }

    /*
     * A repository is an abstraction responsible for retrieving domain
     * objects from a data source.
     *
     * This simple example uses hard-coded data instead of a database.
     */
    static class EmployeeRepository {

        private final Department engineering =
                new Department("DEP-001", "Engineering");

        private final Employee manager =
                new Employee("EMP-001", "Alex", engineering, null);

        private final Employee employee =
                new Employee("EMP-002", "Sam", engineering, manager);

        private final Employee unassignedEmployee =
                new Employee("EMP-003", "Jordan", null, null);

        /*
         * Returns Optional<Employee> because an employee with the
         * requested ID might not exist.
         */
        public Optional<Employee> findById(String id) {

            if (manager.getId().equals(id)) {
                return Optional.of(manager);
            }

            if (employee.getId().equals(id)) {
                return Optional.of(employee);
            }

            if (unassignedEmployee.getId().equals(id)) {
                return Optional.of(unassignedEmployee);
            }

            return Optional.empty();
        }
    }
}
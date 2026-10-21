package _07_records;

public class _17_RecordNullHandling {

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice", null);

        System.out.println(employee.id());
        System.out.println(employee.name());
        System.out.println(employee.department()); // null
        System.out.println(employee.hasDepartment()); // false

        // Invalid required components are rejected.
        try {
            new Employee(null, "Bob", "Engineering");
        } catch (IllegalArgumentException exception) {
            System.out.println(exception.getMessage());
        }
    }

    // Records do not automatically reject null component values.
    // Add constructor validation when a component must never be null.
    record Employee(String id, String name, String department) {

        Employee {
            if (id == null) {
                throw new IllegalArgumentException("Employee ID cannot be null");
            }

            if (name == null) {
                throw new IllegalArgumentException("Employee name cannot be null");
            }

            // department is optional, so null is allowed.
        }

        public boolean hasDepartment() {
            return department != null;
        }
    }
}
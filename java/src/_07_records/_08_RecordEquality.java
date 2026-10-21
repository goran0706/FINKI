package _07_records;

public class _08_RecordEquality {

    static void main(String[] args) {

        Employee employee1 = new Employee("E001", "Alice");
        Employee employee2 = new Employee("E001", "Alice");
        Employee employee3 = new Employee("E002", "Bob");

        // == compares object references, not component values.
        System.out.println(employee1 == employee2); // false

        // equals() compares record component values.
        System.out.println(employee1.equals(employee2)); // true
        System.out.println(employee1.equals(employee3)); // false

        // Equal records have equal hash codes.
        System.out.println(employee1.hashCode() == employee2.hashCode()); // true

        // Records work naturally with hash-based collections.
        java.util.Set<Employee> employees = new java.util.HashSet<>();

        employees.add(employee1);
        employees.add(employee2);
        employees.add(employee3);

        // employee1 and employee2 are equal, so only one is stored.
        System.out.println(employees.size()); // 2
    }

    // Records automatically implement equals() and hashCode()
    // using their components.
    record Employee(String id, String name) {
    }
}
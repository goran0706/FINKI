package _07_records;

public class _03_RecordConstructors {

    static void main(String[] args) {

        // Calls the automatically generated canonical constructor.
        Employee employee = new Employee("E001", "Alice", 30);

        System.out.println(employee.id());
        System.out.println(employee.name());
        System.out.println(employee.age());
    }

    // A record automatically generates a canonical constructor that accepts
    // one argument for every record component, in declaration order.
    record Employee(String id, String name, int age) {
    }
}
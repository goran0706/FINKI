package _07_records;

public class _13_RecordInheritance {

    // Records cannot extend ordinary classes because every record
    // implicitly extends java.lang.Record.
    //
    // A record can implement interfaces, but it cannot declare another
    // class as its superclass.

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice");

        // A record can be assigned to a reference of an implemented interface.
        Identifiable identifiable = employee;

        System.out.println(identifiable.id());

        // Compilation error: records cannot extend ordinary classes.
        // class Manager extends Employee { }
    }

    interface Identifiable {
        String id();
    }

    record Employee(String id, String name) implements Identifiable {
    }
}
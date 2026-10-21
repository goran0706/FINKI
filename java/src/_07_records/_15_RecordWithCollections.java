package _07_records;

import java.util.List;

// A record containing a collection is not automatically deeply immutable.
// The list reference is final, but the referenced list may still be mutable.
public class _15_RecordWithCollections {

    static void main(String[] args) {

        List<String> employees = new java.util.ArrayList<>();
        employees.add("Alice");
        employees.add("Bob");

        Department department = new Department("Engineering", employees);

        System.out.println(department.employees());

        // The record component cannot be reassigned, but the list itself
        // can still be modified through the accessor.
        department.employees().add("Charlie");

        System.out.println(department.employees());
        // [Alice, Bob, Charlie]

        // Mutating the original list also changes what the record exposes.
        employees.add("David");

        System.out.println(department.employees());
        // [Alice, Bob, Charlie, David]
    }

    record Department(String name, List<String> employees) {
    }
}
package _07_records;

import java.util.ArrayList;
import java.util.List;

public class _16_RecordDefensiveCopies {

    static void main(String[] args) {

        List<String> employees = new ArrayList<>();
        employees.add("Alice");
        employees.add("Bob");

        Department department = new Department("Engineering", employees);

        System.out.println(department.employees());
        // [Alice, Bob]

        // Modifying the original list does not affect the record.
        employees.add("Charlie");

        System.out.println(department.employees());
        // [Alice, Bob]

        // The list returned by the accessor is unmodifiable.
        try {
            department.employees().add("David");
        } catch (UnsupportedOperationException exception) {
            System.out.println("The employee list cannot be modified.");
        }

        System.out.println(department.employees());
        // [Alice, Bob]
    }

    // List.copyOf() creates an unmodifiable snapshot of the supplied list.
    // This prevents callers from changing the record's collection through
    // either the original list or the record's accessor.
    record Department(String name, List<String> employees) {

        Department {
            employees = List.copyOf(employees);
        }
    }
}
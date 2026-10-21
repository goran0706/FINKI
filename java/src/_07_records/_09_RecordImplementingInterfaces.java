package _07_records;

public class _09_RecordImplementingInterfaces {

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice");

        // Use the record directly.
        System.out.println(employee.id());
        System.out.println(employee.displayName());

        // Reference the record through an interface.
        Identifiable identifiable = employee;
        Displayable displayable = employee;

        System.out.println(identifiable.id());
        System.out.println(displayable.displayName());
    }

    // Records cannot extend arbitrary classes because they implicitly extend
    // java.lang.Record, but they can implement interfaces.
    interface Identifiable {
        String id();
    }

    interface Displayable {
        String displayName();
    }

    // The record components automatically provide the id() method required
    // by Identifiable. The record implements displayName() explicitly.
    record Employee(String id, String name) implements Identifiable, Displayable {

        @Override
        public String displayName() {
            return name;
        }
    }
}
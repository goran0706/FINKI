package _07_records;

public class _02_RecordVsClass {

    static void main(String[] args) {

        EmployeeClass classEmployee1 = new EmployeeClass("E001", "Alice");
        EmployeeClass classEmployee2 = new EmployeeClass("E001", "Alice");

        EmployeeRecord recordEmployee1 = new EmployeeRecord("E001", "Alice");
        EmployeeRecord recordEmployee2 = new EmployeeRecord("E001", "Alice");

        // Both implementations compare component values because the class
        // explicitly implements equals(), while the record generates it.
        System.out.println(classEmployee1.equals(classEmployee2));   // true
        System.out.println(recordEmployee1.equals(recordEmployee2)); // true

        // Regular classes commonly use JavaBean-style getters.
        System.out.println(classEmployee1.name());

        // Records use accessor methods named after their components.
        System.out.println(recordEmployee1.name());

        System.out.println(classEmployee1);
        System.out.println(recordEmployee1);
    }

    // A regular class can represent data, but requires more code to define
    // fields, a constructor, and methods such as equals() and toString().
    record EmployeeClass(String id, String name) {

        @Override
        public String toString() {
            return "EmployeeClass{id='" + id + "', name='" + name + "'}";
        }

        @Override
        public boolean equals(Object object) {
            if (this == object) {
                return true;
            }

            if (!(object instanceof EmployeeClass(String id1, String name1))) {
                return false;
            }

            return id.equals(id1) && name.equals(name1);
        }

    }

    // A record automatically provides its constructor, accessors,
    // equals(), hashCode(), and toString().
    record EmployeeRecord(String id, String name) {
    }
}
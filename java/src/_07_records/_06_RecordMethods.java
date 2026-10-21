package _07_records;

public class _06_RecordMethods {

    static void main(String[] args) {

        Employee employee = new Employee("E001", "Alice", "Smith", 5000.00);

        System.out.println(employee.fullName());          // Alice Smith
        System.out.println(employee.annualSalary());      // 60000.0
        System.out.println(employee.earnsMoreThan(4000)); // true
        System.out.println(employee.earnsMoreThan(6000)); // false
    }

    // Records can declare additional instance methods to provide behavior
    // derived from their components.
    record Employee(String id, String firstName, String lastName, double salary) {

        // A custom instance method can combine multiple components.
        public String fullName() {
            return firstName + " " + lastName;
        }

        // A method can calculate a value from existing components.
        public double annualSalary() {
            return salary * 12;
        }

        // A method can apply business rules using component values.
        public boolean earnsMoreThan(double amount) {
            return salary > amount;
        }
    }
}
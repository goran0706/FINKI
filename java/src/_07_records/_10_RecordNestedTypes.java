package _07_records;

public class _10_RecordNestedTypes {

    static void main(String[] args) {

        // Create a nested record without creating a Company instance.
        Company.Address address = new Company.Address(
                "Main Street 10",
                "Tetovo",
                "North Macedonia"
        );

        Company.Employee employee = new Company.Employee(
                "E001",
                "Alice",
                address
        );

        System.out.println(employee);
        System.out.println(employee.address().city());

        // An instance of Company can also use its nested record types.
        Company company = new Company();
        company.printEmployee(employee);
    }

    // Records can be declared inside other classes or records.
    // A nested record is implicitly static, so it does not require an
    // instance of its enclosing class.
    static class Company {

        public void printEmployee(Employee employee) {
            System.out.println(employee.name());
            System.out.println(employee.address().city());
        }

        record Address(String street, String city, String country) {
        }

        record Employee(String id, String name, Address address) {
        }
    }
}
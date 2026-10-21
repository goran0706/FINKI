package _07_records;

public class _14_RecordAsDto {

    // Converts the domain object into a response DTO.
    static EmployeeResponse toResponse(Employee employee) {
        return new EmployeeResponse(
                employee.id(),
                employee.firstName() + " " + employee.lastName(),
                employee.department(),
                employee.email()
        );
    }

    static void main(String[] args) {

        Employee employee = new Employee(
                "E001",
                "Alice",
                "Smith",
                "Engineering",
                "alice@example.com"
        );

        // The API response exposes only the fields selected for the DTO.
        EmployeeResponse response = toResponse(employee);

        System.out.println(response.id());
        System.out.println(response.fullName());
        System.out.println(response.department());
        System.out.println(response.email());

        System.out.println(response);
    }

    // A DTO (Data Transfer Object) carries data between application layers
    // or across API boundaries without containing infrastructure logic.
    //
    // Records are suitable for DTOs because they provide a concise
    // declaration of data fields, a constructor, accessors, and value equality.
    record EmployeeResponse(
            String id,
            String fullName,
            String department,
            String email
    ) {
    }

    // A simplified domain object used by the application.
    record Employee(String id, String firstName, String lastName, String department, String email) {
    }
}
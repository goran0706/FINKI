package _07_records.records;

public record Employee(
        String id,
        String firstName,
        String lastName,
        String department,
        double salary
) {
}
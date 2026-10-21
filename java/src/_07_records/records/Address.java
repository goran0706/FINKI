package _07_records.records;

public record Address(
        String street,
        String city,
        String postalCode,
        String country
) {
}
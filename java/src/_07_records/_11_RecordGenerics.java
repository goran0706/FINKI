package _07_records;

public class _11_RecordGenerics {

    static void main(String[] args) {

        // Store a String result.
        Result<String> nameResult = new Result<>(
                "Alice",
                true,
                "Employee retrieved successfully"
        );

        System.out.println(nameResult.value());
        System.out.println(nameResult.successful());
        System.out.println(nameResult.message());

        // Store an Integer result.
        Result<Integer> ageResult = new Result<>(
                30,
                true,
                "Age retrieved successfully"
        );

        System.out.println(ageResult.value());

        // Store an employee ID and employee name as a pair.
        Pair<String, String> employee = new Pair<>("E001", "Alice");

        System.out.println(employee.key());
        System.out.println(employee.value());

        // Generic records provide compile-time type safety.
        // String name = ageResult.value(); // Compilation error: Integer is not String.
    }

    // Records can declare type parameters just like regular classes.
    // T represents the type of the value stored in the record.
    record Result<T>(T value, boolean successful, String message) {
    }

    // Multiple type parameters allow a record to store values of different types.
    record Pair<K, V>(K key, V value) {
    }
}
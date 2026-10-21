package _12_streams;

import java.util.List;

public class _01_BasicStream {

    static void main(String[] args) {

        List<String> employees = List.of(
                "Alice",
                "Bob",
                "Charlie",
                "Diana"
        );

        // A stream processes elements from a source without modifying it.
        employees.stream()
                .forEach(System.out::println);

        // Filter elements using a condition.
        employees.stream()
                .filter(name -> name.length() > 3)
                .forEach(System.out::println);

        // Transform elements into new values.
        employees.stream()
                .map(String::toUpperCase)
                .forEach(System.out::println);

        // Combine filtering and transformation in one pipeline.
        employees.stream()
                .filter(name -> name.length() > 3)
                .map(String::toUpperCase)
                .forEach(System.out::println);
    }
}
package lessons._10_streams;

import java.util.Arrays;
import java.util.List;
import java.util.stream.DoubleStream;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class Streams {
    public static void main(String[] args) {
        // =========>
        // Streams represent a sequence of elements
        var stream1 = Stream.of(23, 10, 74, 100);
        stream1.forEach(i -> System.out.println(i));

        var stream2 = Stream.of(23, 10, 74, 100);
        stream2.filter(i -> i > 30).forEach(i -> System.out.println(i));

        var stream3 = Stream.of("Jack", "John", "Jane", "Tom", "David");
        stream3.filter(i -> i.startsWith("J")).forEach(i -> System.out.println(i));

        // =========>
        // Stream does not mutate the original list
        var listI = Arrays.asList(3, 1, 10, 45, 7);
        listI.stream().filter(i -> i % 2 == 0).forEach(System.out::println);

        var listS = Arrays.asList("Jack", "John", "Bill", "Daniel");
        listS.stream().filter(s -> s.length() > 4).forEach(System.out::println); // :: method reference a shorthand.

        // =========>
        int[] arr1 = {4, 80, 77, 10, 1};
        int[] arr2 = {41, 4, 67, 9};

        // Arrays are boxed into objects
        Stream.of(arr1, arr2).forEach(System.out::println);

        // Print all elements from the array
        Arrays.stream(arr1).filter(i -> i % 2 == 0).forEach(System.out::println);
        Arrays.stream(arr2).filter(i -> i % 2 == 0).forEach(System.out::println);

        // Generate Primitive values
        IntStream.range(1, 50).filter(i -> i % 2 == 0).forEach(System.out::println);

        // =========>
        var list = List.of(2, 10, 5, 7, 8);
        // Sorted
        list.stream().sorted().filter(i -> i % 2 == 0).forEach(System.out::println);
        // Min
        list.stream().min(Integer::compare).ifPresent(System.out::println);
        // Max
        list.stream().max(Integer::compare).ifPresent(System.out::println);

        // Min & Max using primitive types
        IntStream.of(1, 2, 6, 7, 8, 43, 32).min().ifPresent(System.out::println);
        IntStream.of(1, 2, 6, 7, 8, 43, 32).max().ifPresent(System.out::println);
        DoubleStream.of(1, 2.50, 6, 7, 8, 43.32, 32).min().ifPresent(System.out::println);
        DoubleStream.of(1, 2, 6, 7, 8.43, 43, 32).max().ifPresent(System.out::println);

        // Count
        var count = list.stream().filter(i -> i % 2 == 0).filter(i -> i > 5).count();
        System.out.println(count);

        // Reduce into a number that represent the number of elements
        list.stream().filter(i -> i % 2 == 0).filter(i -> i > 5).reduce(Integer::sum).ifPresent(System.out::println);

        // Transform elements using Map
        list.stream().map(i -> i + 10).forEach(System.out::println);
        list.stream().mapToInt(i -> i + 10).forEach(System.out::println);
        list.stream().mapToDouble(i -> i + 10.50).forEach(System.out::println);
        IntStream.of(1, 2, 3, 4).mapToObj(i -> "$" + i).forEach(System.out::println);

        // Order of Stream Operations
        list.stream()
                .map(i -> {
                    System.out.println("Mapping: " + i);
                    return i + 10;
                })
                .filter(i -> {
                    System.out.println("Filtering: " + i);
                    return i > 25;
                })
                .forEach(System.out::println);

        Stream.of(arr1, arr2).flatMapToInt(IntStream::of).max().ifPresent(System.out::println);


        var people = List.of(
                new Person("Jack", 30, 100),
                new Person("John", 23, 65),
                new Person("Jane", 33, 200),
                new Person("Tom", 18, 75),
                new Person("David", 46, 35)
        );

        var result = people.stream().filter(person -> person.age > 30).anyMatch(p -> p.score > 70);
    }
}

class Person {
    String name;
    int age;
    int score;

    public Person(String name, int age, int score) {
        this.name = name;
        this.age = age;
        this.score = score;
    }
}
package _08_generics;

import java.util.ArrayList;
import java.util.List;

/*
 * WILDCARDS
 *
 * A wildcard (?) represents an unknown type.
 *
 * Wildcards are useful when a method needs to work with generic types
 * without requiring the caller to specify one exact type.
 *
 * For example, List<?> can refer to:
 *     List<String>
 *     List<Integer>
 *     List<Employee>
 *
 * However, because the actual element type is unknown, we cannot safely
 * add arbitrary values to a List<?>.
 */
public class _08_Wildcards {

    // Accepts a list containing elements of any type.
    public static void printElements(List<?> items) {
        for (Object item : items) {
            System.out.println(item);
        }
    }

    static void main(String[] args) {

        List<String> names = new ArrayList<>();
        names.add("Alex");
        names.add("Maria");

        List<Integer> numbers = new ArrayList<>();
        numbers.add(10);
        numbers.add(20);

        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee("John"));
        employees.add(new Employee("Sarah"));

        printElements(names);
        printElements(numbers);
        printElements(employees);

        /*
         * A List<?> can be read, but arbitrary additions are not allowed.
         *
         * The compiler cannot guarantee that a String, Integer, or another
         * value matches the list's actual element type.
         */
        List<?> unknownItems = names;

        // Compilation error:
        // unknownItems.add("Robert");

        // null is permitted because it can be assigned to any reference type.
        unknownItems.add(null);
    }

    record Employee(String name) {

    }
}
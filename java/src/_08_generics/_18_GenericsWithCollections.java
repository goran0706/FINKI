package _08_generics;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 * GENERICS WITH COLLECTIONS
 *
 * Java collections use generics to enforce type safety.
 *
 * Without generics, collections could store unrelated types, requiring
 * explicit casts when retrieving values and risking ClassCastException.
 *
 * With generics, the compiler checks which types can be added and
 * which types are returned by collection operations.
 *
 * Common examples:
 * - List<E>: a collection of elements of type E.
 * - Set<E>: a collection of unique elements of type E.
 * - Map<K, V>: key-value mappings with key type K and value type V.
 */
public class _18_GenericsWithCollections {

    static void main(String[] args) {

        /*
         * List<String> stores String elements.
         *
         * The compiler prevents adding values of unrelated types.
         */
        List<String> employeeNames = new ArrayList<>();
        employeeNames.add("Alex");
        employeeNames.add("Maria");
        employeeNames.add("John");

        String firstName = employeeNames.get(0);
        System.out.println("First employee: " + firstName);

        // Compilation error: Integer is not a String.
        // employeeNames.add(100);

        /*
         * List<Employee> stores Employee objects.
         *
         * Retrieving an element returns Employee, so no explicit cast
         * is necessary.
         */
        List<Employee> employees = new ArrayList<>();
        employees.add(new Employee("EMP-001", "Alex"));
        employees.add(new Employee("EMP-002", "Maria"));

        Employee firstEmployee = employees.get(0);
        System.out.println(firstEmployee.name());

        for (Employee employee : employees) {
            System.out.println(employee);
        }

        /*
         * Map<String, Employee> associates String keys with Employee values.
         *
         * get() returns Employee, while keySet() exposes String keys.
         */
        Map<String, Employee> employeesById = new HashMap<>();

        employeesById.put("EMP-001", new Employee("EMP-001", "Alex"));
        employeesById.put("EMP-002", new Employee("EMP-002", "Maria"));

        Employee employee = employeesById.get("EMP-001");

        if (employee != null) {
            System.out.println("Found: " + employee.name());
        }

        // Compilation error: the value must be an Employee.
        // employeesById.put("EMP-003", "John");

        /*
         * Collections can also use bounded wildcards.
         *
         * This method accepts a List of Number or any Number subtype,
         * such as Integer or Double.
         */
        List<Integer> quantities = new ArrayList<>();
        quantities.add(10);
        quantities.add(20);
        quantities.add(30);

        printNumbers(quantities);

        List<Double> prices = new ArrayList<>();
        prices.add(19.99);
        prices.add(29.99);

        printNumbers(prices);
    }

    /*
     * The upper-bounded wildcard allows this method to accept different
     * numeric list types without making callers convert their collections.
     */
    public static void printNumbers(List<? extends Number> numbers) {
        for (Number number : numbers) {
            System.out.println(number);
        }
    }

    record Employee(String id, String name) {

        @Override
        public String toString() {
            return "Employee{id='" + id + "', name='" + name + "'}";
        }
    }
}
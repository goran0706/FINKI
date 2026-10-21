package _09_collections;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class _26_EqualityAndHashing {

    static void main(String[] args) {

        // equals() defines logical equality between objects.
        // hashCode() produces an integer used by hash-based collections.
        //
        // The equals/hashCode contract requires:
        // 1. Equal objects must have equal hash codes.
        // 2. Unequal objects may have equal hash codes (a collision).
        // 3. equals() must be consistent, symmetric, reflexive, and transitive.

        Employee first = new Employee(101, "Alice");
        Employee second = new Employee(101, "Alice");
        Employee third = new Employee(102, "Bob");

        // Without overriding equals(), Object.equals() checks identity.
        // With an appropriate override, separate objects can be logically equal.
        System.out.println("first == second: " + (first == second));
        System.out.println("first.equals(second): " + first.equals(second));
        System.out.println("first.equals(third): " + first.equals(third));

        System.out.println("\nHash codes:");
        System.out.println("first: " + first.hashCode());
        System.out.println("second: " + second.hashCode());
        System.out.println("third: " + third.hashCode());

        // HashSet uses hashCode() and equals() to identify duplicate elements.
        Set<Employee> employees = new HashSet<>();

        employees.add(first);
        employees.add(second);
        employees.add(third);

        System.out.println("\nHashSet size: " + employees.size());
        System.out.println("HashSet: " + employees);

        // HashMap uses the same contract for keys.
        HashMap<Employee, String> employeeDepartments = new HashMap<>();

        employeeDepartments.put(first, "Engineering");

        // A logically equal key can retrieve the existing mapping.
        System.out.println(
                "Department for second: " + employeeDepartments.get(second)
        );

        // Demonstrate a hash collision.
        // Different objects can share a hash code and remain unequal.
        CollisionExample collisionA = new CollisionExample("Alpha");
        CollisionExample collisionB = new CollisionExample("Beta");

        System.out.println("\nCollision examples:");
        System.out.println("Same hash code: "
                + (collisionA.hashCode() == collisionB.hashCode()));
        System.out.println("Equal objects: " + collisionA.equals(collisionB));

        Set<CollisionExample> collisionSet = new HashSet<>();

        collisionSet.add(collisionA);
        collisionSet.add(collisionB);

        System.out.println("Collision set size: " + collisionSet.size());

        // Avoid mutating fields used by equals() or hashCode() while an object
        // is stored in a HashSet or used as a HashMap key.
        //
        // Changing those fields can make the object difficult to find
        // or remove because it may no longer map to its original hash bucket.
        //
        // Records automatically implement equals() and hashCode()
        // based on their components.
        EmployeeRecord recordA = new EmployeeRecord(201, "Charlie");
        EmployeeRecord recordB = new EmployeeRecord(201, "Charlie");

        System.out.println("\nRecords equal: " + recordA.equals(recordB));
    }

    static final class Employee {

        private final int id;
        private final String name;

        Employee(int id, String name) {
            this.id = id;
            this.name = name;
        }

        @Override
        public boolean equals(Object object) {
            if (this == object) {
                return true;
            }

            if (!(object instanceof Employee other)) {
                return false;
            }

            return id == other.id
                    && Objects.equals(name, other.name);
        }

        @Override
        public int hashCode() {
            return Objects.hash(id, name);
        }

        @Override
        public String toString() {
            return "Employee{id=" + id + ", name='" + name + "'}";
        }
    }

    static final class CollisionExample {

        private final String value;

        CollisionExample(String value) {
            this.value = value;
        }

        @Override
        public boolean equals(Object object) {
            if (this == object) {
                return true;
            }

            if (!(object instanceof CollisionExample other)) {
                return false;
            }

            return Objects.equals(value, other.value);
        }

        @Override
        public int hashCode() {
            // Intentionally return a constant to demonstrate collisions.
            return 1;
        }
    }

    record EmployeeRecord(int id, String name) {
    }
}
package _02_classes;

/*
 * UML (Unified Modeling Language) class diagrams visualize a system's
 * classes, their fields, methods, and relationships.
 *
 * Visibility symbols:
 * + public
 * - private
 * # protected
 * ~ package-private
 *
 * Common relationships:
 * Inheritance:        Dog ─────▷ Animal
 * Association:       Person ─── Car
 * Composition:       House ◆─── Room
 * Dependency:        Class - - > Class
 *
 * This example represents a simple UML class diagram in Java output.
 * UML itself is a modeling notation, not a Java programming feature.
 */
public class _23_UML {

    static void main(String[] args) {
        System.out.println("""
                +---------------------------+
                |           Person          |
                +---------------------------+
                | - name: String            |
                | - age: int                |
                +---------------------------+
                | + Person(name, age)       |
                | + getName(): String       |
                | + getAge(): int           |
                | + introduce(): void       |
                +---------------------------+
                """);
    }
}
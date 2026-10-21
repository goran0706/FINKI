package _01_fundamentals;

/**
 * Demonstrates Javadoc documentation in Java.
 *
 * @author John Doe
 * @since 1.0
 */
public class _02_JavaDocs {

    /**
     * Returns a greeting for the specified name.
     *
     * @param name the name of the person to greet
     * @return a greeting containing the specified name
     * @throws IllegalArgumentException if {@code name} is null or blank
     */
    public static String greet(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be null or blank");
        }

        return "Hello, " + name + "!";
    }

    static void main(String[] args) {
        System.out.println(greet("Java"));
    }
}
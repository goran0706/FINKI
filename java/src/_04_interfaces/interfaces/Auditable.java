package _04_interfaces.interfaces;

/*
 * An interface can declare default methods with implementations.
 *
 * Implementing classes inherit the default behavior and may override it.
 */
public interface Auditable {

    default void audit() {
        System.out.println("Audit event recorded.");
    }
}
package _04_interfaces.interfaces;

/*
 * A functional interface has exactly one abstract method.
 *
 * It may also contain default, static, and private methods.
 * Functional interfaces can be implemented using lambdas or anonymous classes.
 */
@FunctionalInterface
public interface Printable {

    void print();
}
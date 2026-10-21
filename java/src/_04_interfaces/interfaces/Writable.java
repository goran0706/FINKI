package _04_interfaces.interfaces;

/*
 * An interface can extend multiple interfaces.
 *
 * Writable combines the contracts of Readable and Printable.
 * A concrete class implementing Writable must implement both read()
 * and print().
 */
public interface Writable extends Readable, Printable {

    void write();
}
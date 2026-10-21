package _08_generics;

/*
 * BASIC GENERICS
 *
 * Generics allow types to be specified as parameters.
 *
 * Here, Box<T> is a generic class. T is a type parameter that represents
 * the type of value stored in the box.
 *
 * When creating a Box, specify the actual type:
 *     Box<String> stores String values.
 *     Box<Integer> stores Integer values.
 *
 * Generics provide compile-time type safety and reduce the need
 * for explicit type casting.
 */
public class _01_BasicGenerics {

    static void main(String[] args) {

        // This box stores String values.
        Box<String> stringBox = new Box<>();
        stringBox.setValue("Hello, Java!");

        String message = stringBox.getValue();
        System.out.println(message);

        // This box stores Integer values.
        Box<Integer> integerBox = new Box<>();
        integerBox.setValue(100);

        int number = integerBox.getValue();
        System.out.println(number);

        // Compile-time type safety prevents assigning the wrong type.
        // stringBox.setValue(123); // Compilation error.
    }

    static class Box<T> {

        private T value;

        public T getValue() {
            return value;
        }

        public void setValue(T value) {
            this.value = value;
        }
    }
}
package _5_generics;


/*
 * By convention, type parameter names are single, uppercase letters;
 * T is usually used as a parameter to represent Types.
 *
 * Using Generics a type variable can be any non-primitive type we specify:
 * - any class type,
 * - any interface type,
 * - any array type, or
 * - even another type variable.
 *
 * The Type of the type parameter 'T' would be specified when we are creating a new Object of the Store class.
 * If T is an Integer, then the variable 'value' would be of type Integer, and the return type of getValue() would be an Integer.
 *
 * */
public class Generic<T> {
    T value;

    public Generic(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }

    public void printValueClass() {
        System.out.println(value.getClass());
    }
}

package _5_generics;

// Using bounded types, we can limit the number of generic types that can be used,
// in this case only types that extend the Number class. The Type parameter must be within its bound.
public class GenericBoundedTypes<T extends Number> {
    T number;

    public GenericBoundedTypes(T number) {
        this.number = number;
    }

    public T getNumber() {
        return number;
    }
}

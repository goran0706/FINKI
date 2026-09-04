package _5_generics;

public class GenericMultipleTypes<T, Y> {
    T value1;
    Y value2;

    public GenericMultipleTypes(T value1, Y value2) {
        this.value1 = value1;
        this.value2 = value2;
    }

    public T getValue1() {
        return value1;
    }

    public Y getValue2() {
        return value2;
    }
}

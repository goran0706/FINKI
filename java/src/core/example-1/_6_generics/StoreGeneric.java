package lessons._6_generics;

public class StoreGeneric<T> {
    T value;

    public StoreGeneric(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }

    public void valueClass() {
        System.out.println(value.getClass());
    }
}

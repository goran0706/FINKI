package lessons._6_generics;

public class StoreGenericNumber<T extends Number> {
    T value;

    public StoreGenericNumber(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }

    public void valueClass() {
        System.out.println(value.getClass());
    }
}

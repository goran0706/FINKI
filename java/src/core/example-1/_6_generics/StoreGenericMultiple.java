package lessons._6_generics;

public class StoreGenericMultiple<T, V> {
    T val1;
    V val2;

    public StoreGenericMultiple(T val1, V val2) {
        this.val1 = val1;
        this.val2 = val2;
    }

    public T getValue1() {
        return val1;
    }

    public V getValue2() {
        return val2;
    }
}

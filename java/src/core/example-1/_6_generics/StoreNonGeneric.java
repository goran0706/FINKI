package lessons._6_generics;

public class StoreNonGeneric {
    Object value;

    public StoreNonGeneric(Object value) {
        this.value = value;
    }

    public Object getValue() {
        return value;
    }

    public void valueClass() {
        System.out.println(value.getClass());
    }
}

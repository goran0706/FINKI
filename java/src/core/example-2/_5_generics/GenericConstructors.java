package _5_generics;

public class GenericConstructors {

    public <T extends Number> GenericConstructors(T num) {
        System.out.println("Generic constructor accepting a Number type");
    }
}

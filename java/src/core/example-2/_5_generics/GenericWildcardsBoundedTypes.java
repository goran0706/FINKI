package _5_generics;

public class GenericWildcardsBoundedTypes<T> {
    T[] list;

    public GenericWildcardsBoundedTypes(T[] list) {
        this.list = list;
    }

    // Using the '?' as a wildcard to represent a type that extends the Number class
    public void compareListSize(GenericWildcardsBoundedTypes<? extends Number> listToCompare) {
        if (list.length > listToCompare.list.length) {
            System.out.println("The list is greater");
        } else {
            System.out.println("The list is smaller");
        }
    }
}

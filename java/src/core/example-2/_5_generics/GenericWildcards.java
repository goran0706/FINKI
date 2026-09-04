package _5_generics;

public class GenericWildcards<T> {
    T[] list;

    public GenericWildcards(T[] list) {
        this.list = list;
    }

    // Using the '?' as a wildcard to represent any type
    public void compareListSize(GenericWildcards<?> listToCompare) {
        if (list.length > listToCompare.list.length) {
            System.out.println("The list is greater");
        } else {
            System.out.println("The list is smaller");
        }
    }
}

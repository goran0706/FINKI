package _5_generics;

public class GenericWildcardsLowerBound<T> {
    T[] list;

    public GenericWildcardsLowerBound(T[] list) {
        this.list = list;
    }

    // Using the '?' as a wildcard to represent an Integer type or its super class Number
    public void compareListSize(GenericWildcardsLowerBound<? super Integer> listToCompare) {
        if (list.length > listToCompare.list.length) {
            System.out.println("The list is greater");
        } else {
            System.out.println("The list is smaller");
        }
    }
}

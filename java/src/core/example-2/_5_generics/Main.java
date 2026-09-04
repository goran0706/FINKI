package _5_generics;

public class Main {
    public static void main(String[] args) {
        // Generics
        Generic<Integer> num = new Generic<>(4);
        num.printValueClass();
        System.out.println(num.getValue());

        Generic<String> str = new Generic<>("Hello World");
        str.printValueClass();
        System.out.println(str.getValue());

        // Generics using multiple types
        GenericMultipleTypes<String, Integer> balance = new GenericMultipleTypes<>("John", 2000);
        System.out.println(balance.getValue1() + " has balance of: $" + balance.getValue2());

        // Generics using bounded types
        GenericBoundedTypes<Integer> myNumber = new GenericBoundedTypes<>(1000);
        System.out.println(myNumber.getNumber());

        // Generics using wildcards
        var numbers = new Integer[]{1, 2, 3, 4, 5};
        var letter = new String[]{"A", "B", "C", "D"};
        GenericWildcards<Integer> numList = new GenericWildcards<>(numbers);
        GenericWildcards<String> strList = new GenericWildcards<>(letter);
        numList.compareListSize(strList);

        // Generics using wildcards
        var numArray1 = new Integer[]{1, 2, 3, 4};
        var numArray2 = new Integer[]{1, 2, 3, 4, 5};
        GenericWildcardsBoundedTypes<Integer> numList1 = new GenericWildcardsBoundedTypes<>(numArray1);
        GenericWildcardsBoundedTypes<Integer> numList2 = new GenericWildcardsBoundedTypes<>(numArray2);
        numList1.compareListSize(numList2);

        // Generics using lower-bound wildcards
        GenericWildcardsLowerBound<Integer> numList3 = new GenericWildcardsLowerBound<>(numArray1);
        GenericWildcardsLowerBound<Integer> numList4 = new GenericWildcardsLowerBound<>(numArray2);
        numList3.compareListSize(numList4);

        // Generic constructors
        GenericConstructors genericConstructor = new GenericConstructors(1);

        // Generic methods
        GenericMethods.printNumbers(1337);
        GenericMethods.printInfo("Demo Generic Methods");
    }
}

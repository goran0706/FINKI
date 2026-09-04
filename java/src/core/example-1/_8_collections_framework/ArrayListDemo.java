package lessons._8_collections_framework;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        var listA = new ArrayList<Integer>();
        // Add
        listA.add(10);
        listA.add(22); // remove
        listA.add(33); // remove
        listA.add(7);
        listA.add(65);
        listA.add(74);
        listA.add(23);

        // Remove
        listA.remove(1);
        listA.remove(Integer.valueOf(33));

        // Set
        listA.set(3, 33);

        var listB = new ArrayList<Integer>();
        listB.add(1);
        listB.add(2);
        listB.add(3);

        // Add All
        listA.addAll(listB);

        // Remove All
        listA.removeAll(listB);

        System.out.println(listA);

        // Using a mutable list, instead of a fixed array of elements
        var listC = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 0);

        // List Iterator
        var iterator = listC.listIterator();
        while (iterator.hasNext()) {
            var value = iterator.next();

            if (value % 2 == 0) {
                iterator.set(0);
            }
        }

        System.out.println(listC);

        // List Spliterator (Advantage might be in parallel programming
        var iteratorS = listC.spliterator();

        // Spliterator using Lambda Expression
        iteratorS.forEachRemaining(integer -> System.out.println(integer));
        iteratorS.forEachRemaining(System.out::println);

        // Spliterator using while loop
        while (iteratorS.tryAdvance(System.out::println))
            ; // it requires while in order to iterate through the next element

        var scores = new ArrayList<Integer>();
        scores.add(10);
        scores.add(5);
        scores.add(65);
        scores.add(32);
        scores.add(84);

        for (int i = 0; i < scores.size(); i++) System.out.println(i);
        for (int i : scores) System.out.println(i);

        // Immutable List
        var nums = List.of(1, 2, 3, 4, 5);
        // nums.add(1); // Error ImmutableCollections
        System.out.println(nums);

        // Convert Array to List and vice versa
        var letters = new char[]{'A', 'B', 'C'};
        var listFromArr = Arrays.asList(letters);
        var arrFromList = listFromArr.toArray();
    }
}

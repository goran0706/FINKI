import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class _21_ArrayList {
    public static void main(String[] args) {
        /*
         * Data Structures - containers that hold data (collections of elements)
         *
         * ArrayList:
         * - ArrayLists are a type of entity known as a generic
         * - Generics (including ArrayLists) can only work with reference types
         * - Can only hold reference types (not primitive types)
         * - We can use Wrapper classes to work with primitive types instead
         * - Are dynamically sized
         * - Have their own toString method overridden
         * * */
        List<String> namesList = new ArrayList<>();
        namesList.add("John");
        namesList.add("Jane");
        namesList.add("Matthew");
        namesList.add("Amanda");
        namesList.add("Samantha");

        System.out.println(namesList); // calls toString

        for (int i = 0; i < namesList.size(); i++) {
            System.out.println(namesList.get(i));
        }

        for (String s : namesList) {
            System.out.println(s);
        }

        Iterator<String> iterator = namesList.listIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }

        // Wrapper Classes
        // - Byte, Short, Integer, Long
        // - Float, Double
        // - Boolean
        // - Character

        List<Integer> integerList = new ArrayList<>();
        integerList.add(1);
        integerList.add(2);
        integerList.add(3);
        System.out.println(integerList);

        int num1 = integerList.get(0);
        System.out.println(num1);

        List<Double> doubleList = new ArrayList<>();
        doubleList.add(1.00);
        doubleList.add(2.50);
        doubleList.add(3.99);
        System.out.println(doubleList);

        double num2 = integerList.get(2);
        System.out.println(num2);

        List<Boolean> booleanList = new ArrayList<>();
        booleanList.add(true);
        booleanList.add(false);
        booleanList.add(true);
        System.out.println(booleanList);

        boolean rec1 = booleanList.get(2);
        System.out.println(rec1);
    }
}

package lessons._8_collections_framework;

import java.util.Comparator;
import java.util.TreeSet;

public class ComparatorDemo {
    public static void main(String[] args) {
        var comparator = new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                return o2.compareTo(o1);
            }
        };

        var treeSet = new TreeSet<Integer>(comparator);

        treeSet.add(45);
        treeSet.add(100);
        treeSet.add(23);
        treeSet.add(42);
        treeSet.add(67);
        treeSet.add(81);

        System.out.println(treeSet);
    }
}

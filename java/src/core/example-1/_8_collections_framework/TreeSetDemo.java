package lessons._8_collections_framework;

import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        var treeSet = new TreeSet<Integer>();

        treeSet.add(45);
        treeSet.add(100);
        treeSet.add(23);
        treeSet.add(42);
        treeSet.add(67);
        treeSet.add(81);

        System.out.println(treeSet);
    }
}

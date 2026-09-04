package lessons._8_collections_framework;


import java.util.LinkedHashSet;

public class LinkedHashSetDemo {
    public static void main(String[] args) {

        var hashSet = new LinkedHashSet<Integer>();

        hashSet.add(12);
        hashSet.add(100);
        hashSet.add(33);
        hashSet.add(45);
        hashSet.add(1);

        System.out.println(hashSet);
    }
}

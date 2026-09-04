package lessons._8_collections_framework;

import java.util.HashSet;

public class HashSetDemo {
    public static void main(String[] args) {

        // Default initial capacity of a HashMap is 16 and factor is 0.75% of the current hashMap size.

        // HashSet increases automatically when It reaches its capacity.
        // LoadFactor represents at what level the HashMap capacity should be doubled.
        var hashSet = new HashSet<Integer>(5, 0.4F);

        hashSet.add(32);
        hashSet.add(11);
        hashSet.add(22);
        hashSet.add(33);
        hashSet.add(55);

        System.out.println(hashSet);
    }
}

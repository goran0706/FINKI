package lessons._8_collections_framework.maps_and_hash_maps;

import java.util.LinkedHashMap;

public class LinkedHashMapDemo {
    public static void main(String[] args) {
        var map = new LinkedHashMap<Integer, Integer>();

        map.put(1, 355);
        map.put(82, 23);
        map.put(100, 541);
        map.put(53, 200);
        map.put(23, 100);

        System.out.println(map);
    }
}

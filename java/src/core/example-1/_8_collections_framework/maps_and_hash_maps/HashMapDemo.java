package lessons._8_collections_framework.maps_and_hash_maps;

import java.util.HashMap;

public class HashMapDemo {
    public static void main(String[] args) {
        var hashMap = new HashMap<Integer, Integer>();

        hashMap.put(1, 100);
        hashMap.put(2, 43);
        hashMap.put(3, 76);
        hashMap.put(200, 23);

        hashMap.putIfAbsent(2, 79);

        hashMap.remove(1);
        hashMap.remove(1, 100);

        hashMap.replace(1, 100, 1000);
        hashMap.replaceAll((k, v) -> k * 2);

        hashMap.compute(1, (k, v) -> v + 100);
        hashMap.computeIfPresent(12, (k, ov) -> ov * 10);

        hashMap.merge(23, 211, (ov, nv) -> ov + nv);

        hashMap.containsKey(2);
        hashMap.containsValue(100);

        hashMap.size();
        hashMap.isEmpty();

        // hashMap.clear();

        System.out.println(hashMap.get(200));

        var value = hashMap.getOrDefault(3, 1000);
        System.out.println(value);

        System.out.println(hashMap);

        var entries = hashMap.entrySet();
        var keys = hashMap.keySet();
        var values = hashMap.values();

        for (var entry : entries) {
            System.out.println(entry);
        }

        for (var key : keys) {
            System.out.println(key);
        }

        for (var val : values) {
            System.out.println(val);
        }

    }
}

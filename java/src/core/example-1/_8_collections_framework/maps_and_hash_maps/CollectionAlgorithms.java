package lessons._8_collections_framework.maps_and_hash_maps;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionAlgorithms {
    public static void main(String[] args) {
        var list = new ArrayList<>(List.of(5, 2, 3, 1, 4));

        Collections.swap(list, 0, 2);
        Collections.sort(list);
        Collections.reverse(list);

        System.out.println(list);
    }
}

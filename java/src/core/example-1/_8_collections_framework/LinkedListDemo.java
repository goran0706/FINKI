package lessons._8_collections_framework;

import java.util.LinkedList;

public class LinkedListDemo {
    public static void main(String[] args) {
        var linkedList = new LinkedList<>();

        linkedList.add(32);
        linkedList.add(11);
        linkedList.add(23);

        System.out.println(linkedList.get(1));
    }
}

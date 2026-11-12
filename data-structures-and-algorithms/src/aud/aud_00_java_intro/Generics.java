package aud.aud_00_java_intro;

import java.util.ArrayList;
import java.util.List;

interface IInterface {
    void methodOne();

    Integer methodTwo();
}

class Box<K, V> implements IInterface {
    private K key;
    private V value;

    public Box(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public void setKey(K key) {
        this.key = key;
    }

    public V getValue() {
        return value;
    }

    public void setValue(V value) {
        this.value = value;
    }

    @Override
    public void methodOne() {
    }

    @Override
    public Integer methodTwo() {
        return (Integer) key;
    }
}

class Circle implements IInterface {

    @Override
    public void methodOne() {

    }

    @Override
    public Integer methodTwo() {
        return 0;
    }
}

public class Generics {
    static void main() {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);

        int sum = 0;
        for (int i : list) {
            sum += i;
        }
        System.out.println("Integer sum: " + sum);

        Box<Integer, String> box = new Box<>(1, "One");
        Circle circle = new Circle();

        System.out.println("Box methodTwo: " + box.methodTwo());
        System.out.println("Circle methodTwo: " + circle.methodTwo());
    }
}

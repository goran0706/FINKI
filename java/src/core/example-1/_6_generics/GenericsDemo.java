package lessons._6_generics;

import lessons._1_oop.entities.Circle;

public class GenericsDemo {
    public static void main(String[] args) {
        // Store using specific types - non-generic
        StoreNonGeneric sng = new StoreNonGeneric(10);
        System.out.println(sng.getValue());
        sng.valueClass();

        // Store using int type
        StoreGeneric<Integer> intStore = new StoreGeneric<Integer>(10);
        System.out.println(intStore.getValue());
        intStore.valueClass();



        // Store using Integer type
        StoreGeneric<String> stringStore = new StoreGeneric<String>("10");
        System.out.println(stringStore.getValue());
        stringStore.valueClass();

        // Store using Integer type
        StoreGenericNumber<Number> storeNumber = new StoreGenericNumber<Number>(77);
        System.out.println(stringStore.getValue());
        stringStore.valueClass();

        // Store using String type
        StoreGeneric<Circle> circleStore = new StoreGeneric<Circle>(new Circle());
        System.out.println(circleStore.getValue());
        circleStore.valueClass();

        // Store using multiple type parameters
        StoreGenericMultiple multiple = new StoreGenericMultiple<Character, Integer>('A', 100);
        System.out.println(multiple.getValue1());
        System.out.println(multiple.getValue2());
    }
}

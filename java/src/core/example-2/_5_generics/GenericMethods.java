package _5_generics;

public class GenericMethods {

    static <T extends Number> void printNumbers(T num) {
        System.out.println(num);
    }

    static <T extends String> void printInfo(T info) {
        System.out.println(info);
    }
}

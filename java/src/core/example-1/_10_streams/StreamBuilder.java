package lessons._10_streams;

import java.util.Scanner;
import java.util.stream.Stream;

public class StreamBuilder {
    public static void main(String[] args) {
        var builder = Stream.<Integer>builder();
        var sc = new Scanner(System.in);
        var value = 0;

        do {
            System.out.println("Input a number:");
            builder.accept(value);
            value = sc.nextInt();
        } while (value != -1);

        var sum = builder.build().mapToInt(Integer::intValue).sum();
        System.out.println(sum);
    }
}

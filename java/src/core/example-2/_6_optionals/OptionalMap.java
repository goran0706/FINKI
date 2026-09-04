package _6_optionals;

import java.util.Optional;

public class OptionalMap {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();
        integerValue = Optional.of(45);

        System.out.println(integerValue.map(i -> i + 20).orElse(0));
    }
}

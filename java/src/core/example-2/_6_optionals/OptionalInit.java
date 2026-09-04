package _6_optionals;

import java.util.Optional;

public class OptionalInit {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();

        integerValue = Optional.of(23);

        System.out.println(integerValue.get());
    }
}

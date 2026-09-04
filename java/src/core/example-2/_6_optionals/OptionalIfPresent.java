package _6_optionals;

import java.util.Optional;

public class OptionalIfPresent {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();
        // integerValue = Optional.of(45);

        integerValue.ifPresent(System.out::println);
        integerValue.ifPresentOrElse(i -> System.out.println(i), () -> System.out.println(7));
    }
}

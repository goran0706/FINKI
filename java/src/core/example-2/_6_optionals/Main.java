package _6_optionals;

import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<Integer> integerValue = Optional.empty();

        if (integerValue.isEmpty()) {
            System.out.println("Optional is empty");
        }

        integerValue = Optional.of(100);

        if (integerValue.isPresent()) {
            System.out.println(integerValue.get());
        }
    }
}

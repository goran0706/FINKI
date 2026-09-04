package lessons._9_optionals;

import java.util.Optional;

public class OptionalFilter {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();
        integerValue = Optional.of(45);

        System.out.println(integerValue.filter(i -> i == 45).orElse(0));
    }
}

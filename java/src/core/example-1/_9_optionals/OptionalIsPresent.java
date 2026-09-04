package lessons._9_optionals;

import java.util.Optional;

public class OptionalIsPresent {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();

        // Do not pass null
        // integerValue = Optional.of(null);

        if (integerValue.isPresent()) {
            System.out.println(integerValue.get());
        } else {
            System.out.println("No value");
        }

        if (integerValue.isEmpty()) {
            System.out.println("Optional i smepty");
        }
    }
}

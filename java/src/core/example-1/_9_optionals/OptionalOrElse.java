package lessons._9_optionals;

import java.util.Optional;

public class OptionalOrElse {
    public static void main(String[] args) {
        var integerValue = Optional.<Integer>empty();

        System.out.println(integerValue.orElseThrow(IllegalStateException::new));
    }
}

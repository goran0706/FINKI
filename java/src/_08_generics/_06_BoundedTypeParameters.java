package _08_generics;

/*
 * BOUNDED TYPE PARAMETERS
 *
 * A bounded type parameter restricts which types can be used as arguments.
 *
 * Syntax:
 *     <T extends SomeClass>
 *
 * The type argument must be SomeClass or a subclass of SomeClass.
 *
 * This allows generic code to call methods defined by the bound.
 *
 * Although the keyword is "extends", it is used for both class and
 * interface bounds.
 */
public class _06_BoundedTypeParameters {

    static void main(String[] args) {

        NumericValue<Integer> integerValue = new NumericValue<>(100);
        System.out.println(integerValue.value());
        System.out.println(integerValue.asDouble());

        NumericValue<Double> doubleValue = new NumericValue<>(250.75);
        System.out.println(doubleValue.value());
        System.out.println(doubleValue.asDouble());

        // Compilation error: String does not extend Number.
        // NumericValue<String> invalid = new NumericValue<>("100");
    }

    /*
     * Number is the upper bound for T.
     *
     * T can be Integer, Double, Float, or another subclass of Number.
     * T cannot be String because String does not extend Number.
     */
    record NumericValue<T extends Number>(T value) {

        // Number defines doubleValue(), so it is available on T.
        public double asDouble() {
            return value.doubleValue();
        }
    }
}
public class _8_Operators {
    public static void main(String[] args) {
        /*
            Arithmetic Operators:
                + (addition)
                - (subtraction)
                * (multiplication)
                / (division)
                % (remainder/modulus)
        * */
        int a = 5;
        int b = 10;
        int result = a + b;
        int difference = a - b;
        int product = a * b;
        int quotient = b / a;
        int remainder = a % b;


        /*
            Unary Operators:
                ++ (increment by 1)
                -- (decrement by 1)
                += (increment and assign)
                -= (decrement and assign)
                *= (multiply and assign)
                /+ (divide and assign)
                %= (remainder and assign)
        * */
        ++result;
        --result;
        result++;
        result--;
        result += 10;
        result -= 10;
        result *= 10;
        result /= 10;
        result %= 10;


        /*
            Relational Operators - used for comparing values and returning a Boolean result:
                > (greater-than)
                >= (greater-than or equal)
                < (less-than)
                <= (less-than or equal)
                == (equal)
                != (not equal)
        * */
        int myAge = 33;
        int yourAge = 25;
        System.out.println(myAge > yourAge);
        System.out.println(myAge >= yourAge);
        System.out.println(myAge < yourAge);
        System.out.println(myAge <= yourAge);
        System.out.println(myAge == yourAge);
        System.out.println(myAge != yourAge);


        /*
            Logical Operators - used for combining Boolean values:
                &&
                ||
        * */
        boolean isWinter = false;
        boolean isCold = false;
        System.out.println(isWinter && isCold);
        System.out.println(isWinter || isCold);
        System.out.println(isWinter || !isCold);
    }
}

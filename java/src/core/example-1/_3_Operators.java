package lessons;

public class _3_Operators {
    public static void main(String[] args) {
        int num1;
        int num2;
        int res;
        boolean res2;

        //Simple Assignment
        num1 = 10;
        num2 = 5;

        //Arithmetic
        res = num1 + num2; //additive
        res = num1 - num2; //subtraction
        res = num1 * num2; //multiplication
        res = num1 / num2; //division
        res = num1 % num2; //remainder

        //Unary
        num1++; //post-increment
        num1--; //post-decrement
        ++num1; //pre-increment
        --num1; //pre-decrement
        System.out.println(!(num1 == num2)); //logical complement; inverts the value of a boolean

        //Equality
        res2 = num1 == num2; //equal
        res2 = num1 != num2; //not equal
        res2 = num1 > num2; //greater than
        res2 = num1 >= num2; //greater or equal than
        res2 = num1 < num2; //smaller
        res2 = num1 <= num2; //smaller or equal than

        //Conditional
        if (num1 > num2 && num2 < num1) { //conditional AND
            res = num1;
        }

        if (num1 > num2 || num2 < num1) { //conditional OR
            res = num1;
        }

        res = num1 > num2 ? num1 : num2; //ternary

        //Type Comparison
        String str = "Type Comparison Operator";
        System.out.println(str instanceof String); //compares an object to a specified type

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
        result++;
        result--;
        ++result;
        --result;
        result += 10;
        result -= 10;
        result *= 10;
        result /= 10;
        result %= 10;

        System.out.println(result);

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

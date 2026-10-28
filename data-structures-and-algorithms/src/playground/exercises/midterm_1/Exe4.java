package playground.exercises.midterm_1;

/*
    Да се напише алгоритам кој ќе пресметува (евалуира) математички израз составен од броеви и операциите за собирање (+) и множење (*).

    Забелешка: Операцијата множење има предност пред операцијата собирање.

    /

    Write an algorithm that will calculate (evaluate) a mathematical expression that consists of numbers and operations for adding (*) and multiplying (*).

    Note: The operation of multiplying has precedence before the operation of adding.

    For example:
    Input 	Result

    2+2*2*2*2*2*2+2*2

    70
*/

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Stack;

public class ExpressionEvaluator {

    public static int evaluateExpression(String expression){
        // Vasiot kod tuka

    }
    public static void main(String[] args) throws IOException {
        BufferedReader input=new BufferedReader(new InputStreamReader(System.in));
        System.out.println(evaluateExpression(input.readLine()));
    }

}

public class Exe4 {
}

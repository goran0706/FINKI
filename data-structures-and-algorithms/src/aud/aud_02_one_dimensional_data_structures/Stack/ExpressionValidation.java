package aud.aud_02_one_dimensional_data_structures.Stack;

import impl.Stack.LinkedStack;
import impl.Stack.Stack;

import java.util.Scanner;

// Задача 1)
// Да се провери коректноста на заградите во еден израз.
// Еден израз има коректни загради ако:
// – За секоја лева заграда, подоцна следува соодветна десна заграда
// – За секоја десна заграда претходно постои лева заграда
// – Секој под-израз меѓу пар од две загради содржи коректен број на загради
//
// Примери на изрази со коректни и некоректни загради:
// s x (s – a) x (s – b) x (s – c)  коректни
// (– b + sqrtb2 – 4ac]) / 2a       коректни
// s x (s – a) x (s – b x (s – c)   некоректни
// s x (s – a) x s – b) x (s – c)   некоректни
// (– b + sqrt/b2 – 4ac)] / 2a      некоректни

public class ExpressionValidation {

    static boolean isValid(String expression) {
        Stack<Character> stack = new LinkedStack<>();

        for (char c : expression.toCharArray()) {
            // Push opening brackets onto the stack.
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            }

            // Check closing brackets.
            else if (c == ')' || c == ']' || c == '}') {
                // A closing bracket without an opening bracket is invalid.
                if (stack.isEmpty()) {
                    return false;
                }

                char opening = stack.pop();

                // Check whether the brackets match.
                if (c == ')' && opening != '(' || c == ']' && opening != '[' || c == '}' && opening != '{') {
                    return false;
                }
            }
        }

        // All opening brackets must have a corresponding closing bracket.
        return stack.isEmpty();
    }

    static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String expression = sc.nextLine();
        System.out.println(isValid(expression) ? "Correct brackets" : "Incorrect brackets");
    }
}
package aud.aud_02_one_dimensional_data_structures.Stack;

import impl.Stack.LinkedStack;
import impl.Stack.Stack;

import java.util.Scanner;

// Задача 2)
// ЗА ДОМА. Да се напише алгоритам кој ќе врши евалуација на израз во постфикс нотација.
// Пр. 5 9 + 2 * 6 5 * + изразот е во постфикс нотација

// Algorithm:
// 1. Traverse the expression from left to right.
// 2. If the token is a number, push it onto the stack.
// 3. If the token is an operator:
//    - Pop the second operand (b).
//    - Pop the first operand (a).
//    - Perform the operation a operator b.
//    - Push the result onto the stack.
// 4. After processing all tokens, the stack contains the final result.

public class PostfixEvaluation {
    static int evaluate(String expression) {
        Stack<Integer> stack = new LinkedStack<>();

        String[] tokens = expression.trim().split("\\s+");

        for (String token : tokens) {
            // If the token is a number, push it onto the stack.
            if (token.matches("-?\\d+")) {
                stack.push(Integer.parseInt(token));
            }

            // Otherwise, evaluate the operator.
            else {
                int b = stack.pop();
                int a = stack.pop();

                int result = switch (token) {
                    case "+" -> a + b;
                    case "-" -> a - b;
                    case "*" -> a * b;
                    case "/" -> a / b;
                    default -> throw new IllegalArgumentException("Invalid operator: " + token);
                };

                stack.push(result);
            }
        }

        return stack.pop();
    }

    static void main() {
        Scanner sc = new Scanner(System.in);
        String expression = sc.nextLine();
        System.out.println(evaluate(expression));
    }
}

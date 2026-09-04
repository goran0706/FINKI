/*
    ======================================================
    Task 9
    ======================================================

    Read from SI two integers a and b. Write a program that will print all numbers from a to b (a < b), such as the
    number created from all the digits from next to the first to the next to last digit in the original number
    (the digits that will remain if we remove the first and the last digit from the original number),
    reversed (read from right to left) is divisible with the number created as the sum of the first and the last digit.
    For single and two digit numbers, the number created from the middle digits is 0, and these numbers are not printed.
    At the end print out the count of such numbers.

    Example. For the number 82675 the number created from the digits from the next to the first up to the next to
    last digit, reversed is 762, and the sum of the first and the last digit is (8 + 5) = 13.
    When printing out the numbers, next to each number that is satisfying the condition, print the equation of the
    condition in the following form:

    original_number -> (reversed_middle == (last_digit + first_digit) * quotient)

    for example: 291 -> (9 == (1 + 2) * 3) 84575 -> (754 == (5 + 8) * 58)

    Input: 15000 15500

    Output:
    [output exactly as provided]
    132
*/
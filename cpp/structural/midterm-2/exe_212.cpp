/*
    For one integer b we say that is a parity complement of other integer a if and only if in the number b
    all the even digits of the number a are replaced with the corresponding (odd) digit increased by 1,
    and all odd digits of the number a are replaced with the corresponding (odd) digit decreased by 1 .

    Example. Number b = 4013698 is a parity complement of a = 5102789.

    Read from SI unknown number of integers (not more than 100), until something that is not a number is entered.

    Your task is to print the smallest 5 of the parity complements of all numbers, from the smallest to the largest.

    Notice: If less than 5 numbers are entered, then print all the entered numbers.

    Finding the parity complement of a number should be implemented in a separate recursive function parcom(int a).

    Example.

    For numbers: 9641, 69403, 103007, 6, 11, 181, 20486 you should find their parity complements
    (those are: 8750, 78512, 12116, 7, 0, 90 and 31597, respectively),
    and print the 5 smallest of them in this order: 0 7 90 8750 12116.

    Using global variables is FORBIDDEN.

    Input:
    3602316 7558357 7189400 426455 1934014 3197048 5948148 820095 288991 4999373 2817440 67122 5893521
    3030693 9302180 8968891 5729366 8844459 7669164 5818250 5296392 4055440 771690 2471100 6584038
    5071538 1478321 3112448 905756 841929 1696675 7402977 6869252 x

    Output: 76033 399880 537544 569230 660781
*/

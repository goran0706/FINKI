/*
    Read words from SI. No words are longer than 20 characters.
    Write a program that on the SO will print all the words from the file that are unsigned hexadecimal numbers
    (one word per line in uppercase digits).
    At the end also print the total number of such numbers found in the file.

    The hexadecimal numbers can contain both upper and lowercase letters a-f and A-F,
    but when printing them convert them all to uppercase.
    The possible leading zeroes are also treated as part of the number and should also be printed.
    Since the numbers are unsigned whole numbers no sign or decimal point is considered as part of the number.

    Input:

    The_sum_is
    64
    and_the_minimum_is
    def
    ined_as
    a
    035
    where_signs_like
    +12AB
    are_not_considered
    as_well_as
    decimal_point_like
    12.f5a
    also_not
    this1
    or
    2one

    the program should print:
    
    64
    DEF
    A
    035
    Total: 4
*/

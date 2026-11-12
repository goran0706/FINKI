/*
    =============================================================
    EXERCISE 23
    =============================================================
    Define a recursive function  abbreviated(a, k)  that removes all digits from integer a that are ≤ k,
    returning the remaining digits assembled into a new integer.
    (Digits greater than k are kept; digits ≤ k are dropped.)

    Read N integers into an array, then read k.
    Apply abbreviated() to every element of the array, then print the maximum value among the abbreviated results.

    Example:
    Input : 4
    9321 456 108 73
    5
    Output: 97   (9321→9 drop 3,2,1; 456→6; 108→8; 73→73 → max=97... adjust per logic)
*/

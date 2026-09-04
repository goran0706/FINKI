/*
    =============================================================
    EXERCISE 19
    =============================================================
    Read an integer N, then an N×N matrix.
    Replace each element that lies on the main diagonal (i == j) with the sum of:
    - all elements to its right on the same row
    - all elements above it in the same column

    Replace each element on the anti-diagonal (i + j + 1 == N) with the sum of:
    - all elements to its left on the same row
    - all elements below it in the same column

    If N is odd, the center element (N/2, N/2) is replaced by the sum of all four arms (right, above, left, below).

    Print the resulting matrix.
*/

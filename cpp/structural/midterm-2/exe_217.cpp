/*
    Read a square binary matrix from standard input.
    First the dimension N is entered (1 < N <= 100) and then the elements of the matrix (either 0 or 1) by rows.

    Write a program that will calculate the smallest number of necessary changes of the elements in order
    to transform the matrix to zero diagonal symmetrical matrix.
    Any transition of an element form 0 to 1 or form 1 to 0 is counts as a single change.
    After the conversion all the elements of the main diagonal should be 0,
    and the matrix should be symmetrical with respect to the main diagonal.

    Print the minimal number of transitions required.

    For example for the input:

    4
    1 0 0 1
    1 1 1 1
    0 1 1 1
    0 0 0 0
    the output should be:

    7
    Explanation:
    the number of changes is 7, as the matrix after the transitions could have been transformed to:

    0 0 0 1
    0 0 1 1
    0 1 0 1
    1 1 1 0
*/

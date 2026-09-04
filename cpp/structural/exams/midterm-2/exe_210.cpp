/*
    The dimensions of one matrix (m,n <= 100), and then the elements of the matrix are entered from the keyboard.
    Make a transformation of the matrix so that the middle element in each column
    is replaced by the difference (by absolute value) of the sum of the elements in the first half of the column and
    the sum of the elements in the second half of the column.

    If the matrix has even numbed of rows, the value of the middle two elements should be changed.
    The middle element(s) are included when calculating the sum (in the case of an odd number of rows,
    the middle element is included when calculating both of the sums (upper and lower sum)!).

    Print the transformed matrix on the standard output.

    Input:
    6 5
    0 -5 0 -100 -10
    0 0 0 -30 0
    0 0 0 -20 22
    0 0 45 0 0
    0 4 -23 0 14
    0 -2 11 0 0

    Output:
    0 -5 0 -100 -10
    0 0 0 -30 0
    0 7 33 150 2
    0 7 33 150 2
    0 4 -23 0 14
    0 -2 11 0 0
*/

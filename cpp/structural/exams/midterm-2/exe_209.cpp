/*
    Read from standard input the dimensions of a matrix (m < 100 and n < 100) which contains only zeros and ones.
    Then read the elements of the matrix.

    Read the coordinates of one element of the matrix.
    If the element of the read position is 0, then it should become 1 and:

    all zeros above that element to the first element with value 1 or to the start of the column,
    all zeros bellow that element to the first element with value 1 or to the end of the column,
    all zeros left from that element to the first element with value 1 or to the begin of the row and
    all zeros right from that element to the first element with value 1 or to the end of the row.
    If the element of the given position is 1 than the matrix stays unchanged.

    Print the changed matrix.

    Input:
    7 6
    1 1 1 1 1 1
    0 0 0 0 1 0
    1 0 0 0 1 1
    1 1 0 1 0 0
    0 1 1 0 0 0
    0 1 0 0 0 0
    1 1 0 0 0 0
    5 5

    Output:
    1 1 1 1 1 1
    0 0 0 0 1 0
    1 0 0 0 1 1
    1 1 0 1 0 1
    0 1 1 0 0 1
    0 1 1 1 1 1
    1 1 0 0 0 1
*/
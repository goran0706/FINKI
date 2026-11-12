/*
    =============================================================
    TASK 6
    =============================================================
    Given an m x n binary matrix and a position (x, y):
    If arr[x][y] is already 1, print the matrix unchanged.
    Otherwise, starting from (x, y), fill 1s going up, down, left and right in each direction until a 1 is encountered
    or the boundary is reached (the starting cell itself becomes 1, the other cells along the cross also become 1).
    
    Print the resulting matrix.

    Example:
    3 3
    0 0 0
    0 0 0
    0 0 0
    x=1, y=1
    Output:
    0 1 0
    1 1 1
    0 1 0
    =============================================================
*/

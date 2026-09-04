/*
    =============================================================
    EXERCISE 33
    =============================================================
    Read an integer N, then an N×N matrix of floats.

    Collect, in order, the elements that form an "L-shaped" border consisting of three segments:
      1. The entire top row    (row 0,    columns 0 ... N-2)
      2. The anti-diagonal     (cells where i + j + 1 == N)
      3. The entire bottom row (row N-1,  columns 1 ... N-1)

    First, print those collected elements on one line separated by spaces.

    Then, write them BACK into the same positions but in REVERSE order
    (i.e. the last collected element goes to the first position, and so on).

    Finally, print the full modified N×N matrix, one row per line, elements separated by spaces.

    Example (N = 3):
      Input matrix:
        1 2 3
        4 5 6
        7 8 9

      Collected positions (top-row excl. last, anti-diag, bottom-row excl. first):
        top row cols 0..1 → mat[0][0]=1, mat[0][1]=2
        anti-diag (i+j+1==3) → mat[0][2]=3, mat[1][1]=5, mat[2][0]=7
        bottom row cols 1..2 → mat[2][1]=8, mat[2][2]=9
      Collected sequence: 1 2 3 5 7 8 9

      Output line 1: 1 2 3 5 7 8 9

      Reversed back into same positions:
        mat[0][0]=9, mat[0][1]=8, mat[0][2]=7,
        mat[1][1]=5, mat[2][0]=3,
        mat[2][1]=2, mat[2][2]=1
      (mat[1][0]=4 and mat[1][2]=6 are untouched)

      Output matrix:
        9 8 7
        4 5 6
        3 2 1
*/
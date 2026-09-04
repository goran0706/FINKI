/*
    =======================
    Task 1
    =======================

    From SI read N strings not longer than 80 chars. At the beginning of the program read two integers:

    N - number of strings you are going to read
    X - shifting size.

    Each of the read strings should be transformed in such a way that lowercase and uppercase letters (a-z, A-Z)
    are replaced with the same letter shifted X places afterward in the alphabet (a-z).
    If you overflow the range of alphabet, continue cyclic from the beginning of the alphabet.

    Transformed string should be printed on SO.

    Transformation of a string should be implemented in a separate recursive function.

    Example:
    Welcome -> transformed with shift 5 -> Bjqhtrj
*/
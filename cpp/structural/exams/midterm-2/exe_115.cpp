/*
    =============================================================
    EXERCISE 21
    =============================================================
    Read N and then an array of N integers.
    Using a recursive function, process the array from both ends (i=0, j=N-1) towards the center:
    - if arr[i] > arr[j]: set arr[j] = arr[i], increment counter
    - if arr[i] < arr[j]: set arr[i] = arr[j], increment counter
    - if arr[i] == arr[j]: no change

    Stop when i reaches the midpoint (ceil(N/2)).
    First print the total number of replacements made, then print the resulting array on one line separated by spaces.

    Example:
    Input : 5
    1 3 5 3 1
    Output:
    2
    5 3 5 3 5
*/

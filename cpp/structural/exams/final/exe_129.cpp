/*
    За дадена низа од знаци со големина од максимум 100 знаци (се внесува од тастатура)
    да се пронајде и врати првата голема буква со помош на рекурзивна функција.
    Пронајдената буква да се испечати на екран.
    Доколку нема, функцијата потребно е да го врати знакот ‘\0’.

    Input:
    daNh5}cFVfj.aQsC06eTHr;y0;!YZ~S;%cF{
    Output: N
*/

#include <iostream>
using namespace std;

char find_punct(char str[]) {
    if (*str == '\0') {
        return '\0';
    }

    if (isalpha(*str) && isupper(*str)) {
        return *str;
    }

    return find_punct(str + 1);
}

int main() {
    char str[100];
    cin.getline(str, 100);
    cout << find_punct(str);
}

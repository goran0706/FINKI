/*
    За дадена низа од знаци со големина од максимум 100 знаци (се внесува од тастатура)
    да се пронајде и врати првиот интерпукциски знак со помош на рекурзивна функција.

    Пронајдениот интерпукциски знак да се испечати на екран.
    Доколку нема, функцијата потребно е да го врати знакот ‘\0’.

    Input: daNh5 }cFVfj.aQsC06eTHr;y0;!YZ~S;%cF{

    Output: }
*/
#include <iostream>
using namespace std;

char find_punct(char str[]) {
    if (*str == '\0') {
        return '\0';
    }

    if (ispunct(*str)) {
        return *str;
    }

    return find_punct(str + 1);
}

int main() {
    char str[100];
    cin.getline(str, 100);
    cout << find_punct(str);
}

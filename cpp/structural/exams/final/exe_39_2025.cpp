/*
    === 5. ===
    Од стандарден влез се внесуваат непознат број на реченици претставени преку текстуални низи (стрингови) секоја не подолга од 100 знаци и секоја во нов ред.
    Програмата треба да го најде стрингот кој содржи најмногу сврзници и да го испечати заедно со бројот на најдените сврзници.

    За сврзници се сметаат сите зборови составени од една, две или три букви.


    Зборовите во текстуалната низа се одделени со едно или повеќе прзани места и/или интерпункциски знак.
    Броењето на сврзници во дадена текстуална низа треба да се реализира во посебна функција.
    Решенијата без користење функција ќе бидат оценети со најмногу 40% од поените.
    Ако има повеќе реченици со ист максимален број на сврзници, се печати прво најдената.

    Објаснување на тест примерот:
    Бројот на сврзници по реченици е 2, 3, 4, 2, 4 и 7 соодветно.
    Најмногу сврзници има по последната реченица па се печати бројот 7 и содржината на таа реченица.
*/
#include <iostream>
#include <cstring>
#include <cctype>

using namespace std;

int count_conjunctions(char str[]) {
    int conjunction_count = 0;
    int letter_count = 0;

    for (int i = 0; str[i] != '\0'; i++) {
        // If the character is a letter, increase the current word length
        if (isalpha(str[i])) {
            letter_count++;
        }
        // If it is not a letter (space, punctuation, etc.), the word has ended
        else {
            if (letter_count >= 1 && letter_count <= 3) {
                conjunction_count++;
            }
            letter_count = 0; // Reset for the next word
        }
    }

    // Check the very last word if the sentence ends without punctuation
    if (letter_count >= 1 && letter_count <= 3) {
        conjunction_count++;
    }

    return conjunction_count;
}

int main() {
    int max_count = -1;
    char max_str[100] = "";
    char str[100];

    while (cin.getline(str, 100)) {
        if (str[0] == '#') {
            break;
        }

        int current_count = count_conjunctions(str);

        if (current_count > max_count) {
            max_count = current_count;
            strcpy(max_str, str);
        }
    }

    cout << max_count << ": " << max_str << endl;

    return 0;
}

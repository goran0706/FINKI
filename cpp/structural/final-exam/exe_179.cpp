// Read an integer k from SI, followed by lines of characters.
// Print on SO the read lines transformed in such a way that all the vowels in the line will be repeated k times.
//
// For example:
// Input
// 3
// Do you ever wish you knew exactly what your dog is thinking? A team of designers from the Nordic Society for Invention and Discovery is playing Doctor Dolittle -- they've developed a doggie headset that can read animal brainwaves and translate them into human speech. That's just one of the many amazing scientific breakthroughs we've witnessed this week.

// Result
// Dooo yooouuu eeeveeer wiiish yooouuu kneeew eeexaaactly whaaat yooouuur dooog iiis thiiinkiiing? AAA teeeaaam ooof deeesiiigneeers frooom theee Nooordiiic Sooociiieeety fooor IIInveeentiiiooon aaand Diiiscoooveeery iiis plaaayiiing Doooctooor Doooliiittleee -- theeey'veee deeeveeelooopeeed aaa doooggiiieee heeeaaadseeet thaaat caaan reeeaaad aaaniiimaaal braaaiiinwaaaveees aaand traaanslaaateee theeem iiintooo huuumaaan speeeeeech. Thaaat's juuust oooneee ooof theee maaany aaamaaaziiing sciiieeentiiifiiic breeeaaakthrooouuughs weee'veee wiiitneeesseeed thiiis weeeeeek.

#include <cstring>
#include <cctype>
#include <iostream>
using namespace std;

bool is_vowel(char c) {
	c = tolower(c);
	return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int main() {
	int k;
	if (!(cin >> k)) return 0;
	cin.ignore();

	char str[1000];

	while (cin.getline(str, 1000)) {
		if (strlen(str) == 0) {
			break;
		}

		char tmp[5000];
		int write = 0;

		for (int i = 0; str[i] != '\0'; i++) {
			if (is_vowel(str[i])) {
				for (int j = 0; j < k; j++) {
					tmp[write++] = str[i];
				}
			} else {
				tmp[write++] = str[i];
			}
		}

		tmp[write] = '\0';

		cout << tmp << endl;
	}

	return 0;
}

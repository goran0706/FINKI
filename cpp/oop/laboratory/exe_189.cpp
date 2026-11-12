/*
Дефинирај класа Character која претставува лик во игра. За секој лик се чува ime (string), основна моќ на напад (double baseAttack) и ниво (int level).

Во класата да се дефинираат следните виртуелни методи:

    double attackPower() — ја враќа моќта на напад на ликот. Стандардно ова е baseAttack.

    double defense() — ја враќа одбраната на ликот. Стандардно ова е level * 10 (пасивна одбрана по ниво).

    double combatRating() — го враќа вкупниот борбен рејтинг. Имплементиран е како attackPower() + defense().

    string characterClass() — ја враќа класата на ликот. Стандардно враќа "Character".

    void print() — ги печати класата, името, моќта на напад, одбраната и борбениот рејтинг.

Да се изведе класа Archer која додава далечински бонус (double rangedBonus) и достапни стрели во тековната рунда (int arrowsAvailable). Да се препокријат методите на следниот начин:

    attackPower() — целосно се заменува формулата од основната класа со rangedBonus * arrowsAvailable.

    defense() — стрелците се лесно оклопени, па се враќа 0.

    characterClass() — враќа "Archer".

    print() — се печатат информациите како и за обичен лик, а потоа се печати дополнителна линија со далечинскиот бонус и бројот на достапни стрели.

Да се изведе класа Warrior која додава големина на групата (int partySize). Да се препокријат методите на следниот начин:

    attackPower() — воините се борат со груба сила и добиваат надоместок од 30%: Character::attackPower() * 1.3.

    defense() — воините ја добиваат пасивната одбрана плус partySize * 50 (бонус за штитен ѕид по член на групата).

    characterClass() — враќа "Warrior".

    print() — се печатат информациите како и за обичен лик, а потоа се печати дополнителна линија со големината на групата.

Да се дефинираат следните самостојни функции (надвор од било која класа) кои примаат низа од покажувачи Character**. Низата може да содржи мешавина од објекти од класите Character, Archer и Warrior:

    Character* strongestCharacter(Character **characters, int n) — го враќа ликот со највисок борбен рејтинг. Ако n == 0, враќа nullptr.

    double totalPartyPower(Character **characters, int n) — го враќа вкупниот борбен рејтинг на сите ликови во низата.

    Character* findByClass(Character **characters, int n, string cls) — го враќа првиот лик чија characterClass() е еднаква на дадената класа cls, или nullptr ако ниту еден не одговара.

НЕ ЈА ПИШУВАТЕ MAIN ФУНКЦИЈАТА!!!
ФОРМАТОТ Е ИСТ КАКО НА КОЛОКВИУМОТ, САМО ГИ ВНЕСУВАТЕ КЛАСИТЕ

Define a class Character representing a game character. Each character stores a name, a base attack power (double), and a level (int).

In the class, define the following virtual methods:

    double attackPower() — returns the character's attack power. By default this is baseAttack.

    double defense() — returns the character's defense. By default this is level * 10 (a small passive defense per level).

    double combatRating() — returns the overall combat rating. Implemented as attackPower() + defense().

    string characterClass() — returns the character's class. By default returns "Character".

    void print() — prints the class, name, attack power, defense, and combat rating.

Derive a class Archer which adds a ranged bonus (double rangedBonus) and arrows available this round (int arrowsAvailable). Override the methods as follows:

    attackPower() — completely replace the base formula with rangedBonus * arrowsAvailable.

    defense() — archers are lightly armored, so return 0.

    characterClass() — returns "Archer".

    print() — print the info as for a regular character, then print an additional line with the ranged bonus and arrows available.

Derive a class Warrior which adds a party size (int partySize). Override the methods as follows:

    attackPower() — warriors fight with raw power, receiving a 30% premium: Character::attackPower() * 1.3.

    defense() — warriors receive the base passive defense plus partySize * 50 (shield wall bonus per party member).

    characterClass() — returns "Warrior".

    print() — print the info as for a regular character, then print an additional line with the party size.

Define the following standalone functions that operate on an array of pointers Character**. The array may contain a mix of Character, Archer, and Warrior objects:

    Character* strongestCharacter(Character **characters, int n) — returns the character with the highest combat rating. Returns nullptr if n == 0.

    double totalPartyPower(Character **characters, int n) — returns the total combat rating across all characters in the array.

    Character* findByClass(Character **characters, int n, string cls) — returns the first character whose characterClass() equals cls, or nullptr if none match.

DON'T WRITE THE MAIN FUNCTION!!!
THE FORMAT IS THE SAME AS THE MIDTERM, YOU ONLY ENTER THE CLASSES

For example:
Test 	Result

const int N = 5;
Character *party[N] = {
    new Warrior("Martin", 110.0, 20, 20),
    new Character("Geralt", 85.0, 10),
    new Archer("Alloy", 14, 11.5, 18),
    new Warrior("Cloud", 110.0, 20, 5),
    new Warrior("Kratos", 120.0, 25, 3)
};
Character *best = strongestCharacter(party, N);
cout << "Strongest in mixed party: " << best->getName() << endl; // Cloud
for (int i = 0; i < N; i++) delete party[i];



Strongest in mixed party: Martin

Character *c = new Character("Ezio", 75.0, 8);
c->print();
delete c;



[Character] Ezio
    Attack power: 75
    Defense: 80
    Rating: 155

Character *c = new Archer("Alloy", 14, 11.5, 18);
c->print();
delete c;



[Archer] Alloy
    Attack power: 207
    Defense: 0
    Rating: 207
    Bonus/Arrows: 11.5 x 18

Character *c = new Warrior("Kratos", 110.0, 20, 5);
c->print();
delete c;



[Warrior] Kratos
    Attack power: 143
    Defense: 450
    Rating: 593
    Party size: 5
*/
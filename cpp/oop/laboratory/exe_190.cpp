/*
Дефинирај класа Monster која претставува чудовиште во темница. За секое чудовиште се чува ime (string), основна моќ на напад (double baseAttack) и ниво на закана (int threatLevel).

Во класата да се дефинираат следните виртуелни методи:

    double attackPower() — ја враќа моќта на напад. Стандардно ова е baseAttack.

    double armor() — ја враќа одбраната. Стандардно ова е threatLevel * 15 (пасивна одбрана по ниво на закана).

    double dangerRating() — го враќа вкупниот рејтинг на опасност. Имплементиран е како attackPower() + armor().

    string monsterType() — го враќа типот на чудовиштето. Стандардно враќа "Monster".

    void print() — ги печати типот, името, моќта на напад, одбраната и рејтингот на опасност.

Да се изведе класа Goblin која додава бонус за рој (double swarmBonus) и големина на ројот (int swarmSize). Да се препокријат методите на следниот начин:

    attackPower() — целосно се заменува формулата со swarmBonus * swarmSize.

    armor() — гоблините не носат оклоп, па се враќа 0.

    monsterType() — враќа "Goblin".

    print() — се печатат информациите како и за обично чудовиште, а потоа се печати дополнителна линија со бонусот за рој и големината наројот.

Да се изведе класа Dragon која додава големина на ризницата (int hoardSize). Да се препокријат методите на следниот начин:

    attackPower() — змејовите дишат оган и добиваат надоместок од 40%: Monster::attackPower() * 1.4.

    armor() — змејовите ја добиваат пасивната одбрана плус hoardSize * 80 (лушпите на оклопот се зацврстуваат со секое богатство во ризницата).

    monsterType() — враќа "Dragon".

    print() — се печатат информациите како и за обично чудовиште, а потоа се печати дополнителна линија со големината на ризницата.

Да се дефинираат следните самостојни функции (надвор од било која класа) кои примаат низа од покажувачи Monster**. Низата може да содржи мешавина од објекти од класите Monster, Goblin и Dragon:

    Monster* mostDangerous(Monster **monsters, int n) — го враќа чудовиштето со највисок рејтинг на опасност. Ако n == 0, враќа nullptr.

    double totalThreatLevel(Monster **monsters, int n) — го враќа вкупниот рејтинг на опасност на сите чудовишта во низата.

    Monster* findByType(Monster **monsters, int n, string type) — го враќа првото чудовиште чијшто monsterType() е еднаков на дадениот тип type, или nullptr ако ниту едно не одговара.

НЕ ЈА ПИШУВАТЕ MAIN ФУНКЦИЈАТА!!!
ФОРМАТОТ Е ИСТ КАКО НА КОЛОКВИУМОТ, САМО ГИ ВНЕСУВАТЕ КЛАСИТЕ

Define a class Monster representing a dungeon monster. Each monster stores a name, a base attack power (double baseAttack), and a threat level (int threatLevel).

In the class, define the following virtual methods:

    double attackPower() — returns the monster's attack power. By default this is baseAttack.

    double armor() — returns the monster's armor. By default this is threatLevel * 15 (passive armor per threat level).

    double dangerRating() — returns the overall danger rating. Implemented as attackPower() + armor().

    string monsterType() — returns the monster's type. By default returns "Monster".

    void print() — prints the type, name, attack power, armor, and danger rating.

Derive a class Goblin which adds a swarm size (int swarmSize) and swarm attack bonus (double swarmBonus). Override the methods as follows:

    attackPower() — completely replace the base formula with swarmBonus * swarmSize.

    armor() — goblins wear no armor, so return 0.

    monsterType() — returns "Goblin".

    print() — print the info as for a regular monster, then print an additional line with the swarm bonus and swarm size.

Derive a class Dragon which adds a hoard size (int hoardSize). Override the methods as follows:

    attackPower() — dragons breathe fire, receiving a 40% premium: Monster::attackPower() * 1.4.

    armor() — dragons receive the base passive armor plus hoardSize * 80 (scales harden with each treasure hoarded).

    monsterType() — returns "Dragon".

    print() — print the info as for a regular monster, then print an additional line with the hoard size.

Define the following standalone functions that operate on an array of pointers Monster**. The array may contain a mix of Monster, Goblin, and Dragon objects:

    Monster* mostDangerous(Monster **monsters, int n) — returns the monster with the highest danger rating. Returns nullptr if n == 0.

    double totalThreatLevel(Monster **monsters, int n) — returns the total danger rating across all monsters in the array.

    Monster* findByType(Monster **monsters, int n, string type) — returns the first monster whose monsterType() equals type, or nullptr if none match.

DON'T WRITE THE MAIN FUNCTION!!!
THE FORMAT IS THE SAME AS THE MIDTERM, YOU ONLY ENTER THE CLASSES

For example:
Test 	Result

Monster *m = new Monster("Ogre", 75.0, 8);
m->print();
delete m;



[Monster] Ogre
    Attack power: 75
    Armor: 120
    Danger: 195

Monster *m = new Goblin("Grix", 0, 4, 6.5, 20);
m->print();
delete m;



[Goblin] Grix
    Attack power: 130
    Armor: 0
    Danger: 130
    Bonus/Swarm: 6.5 x 20

Monster *m = new Dragon("Alduin", 180.0, 15, 7);
m->print();
delete m;



[Dragon] Alduin
    Attack power: 252
    Armor: 785
    Danger: 1037
    Hoard size: 7

const int N = 4;
Monster *dungeon[N] = {
    new Dragon("Martin", 600.0, 50, 20),
    new Monster("Troll", 60.0, 5),
    new Goblin("Snag", 0, 3, 8.0, 12),
    new Dragon("Smaug", 200.0, 20, 10)
};
Monster *best = mostDangerous(dungeon, N);
cout << "Most dangerous: " << best->getName() << endl; // Smaug
for (int i = 0; i < N; i++) delete dungeon[i];



Most dangerous: Martin
*/
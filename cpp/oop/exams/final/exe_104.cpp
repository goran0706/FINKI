/*
Да се дефинира класа Song за претставување на информации за песна.
Во класата се чуваат следните информации:
- име на песната (string)
- број на слушања (int)
- број на лајкови (int)
- времетраење на песната во секунди (int)

За класата да се имплементираат:
- Потребните конструктори, set и get методи
- Метод void print() const за печатење на информациите за песната во прегледен формат: име, број на слушања, број на лајкови и времетраење.

Да се дефинира класа Playlist за претставување на музичка плејлиста.

Во класата се чуваат следните информации:

- име на плејлистата (string)
- динамички алоцирана низа од песни Song* (не е дозволено користење на std::vector)
- број на песни во плејлистата (int)

За класата да се имплементираат:

- Потребните конструктори
- Метод double playlistEngagement() const кој го пресметува степенот на интеракција на корисниците со плејлистата според формулата:

playlistEngagement = (вкупно слушања + 2 * вкупно лајкови) / вкупно времетраење
Доколку вкупното времетраење на песните во плејлистата е 0, методот враќа 0.

- Метод void print() const кој го печати името на плејлистата, а потоа секоја песна во форматот зададен во Song::print(). Песните се печатат во истиот редослед како што се додадени во низата. На крајот да се испечати степенот на интеракција на корисниците со плејлистата.
- Оператор Playlist& operator+=(const Song& s) кој додава нова песна во плејлистата, односно ја проширува динамичката низа за еден елемент.

Во функцијата main() каде што е означено треба од тастатура да се прочитаат информации за N песни, да се формира плејлиста со тие песни со користење на операторот +=. Потоа  на стандарден излез да се испечатат податоците за плејлистата, вклучувајќи ги и податоците за сите нејзини песни.

-------------------------------------------------------------------------

Define a class Song for representing information about a song.

The class should store the following information:

- song name (string)
- number of listens (int)
- number of likes (int)
- duration of the song in seconds (int)

For the class, implement:

- The required constructors, set and get methods
- Method void print() const for printing the information about the song in a clear format: name, number of listens, number of likes, and duration.

Define a class Playlist for representing a music playlist.

The class should store the following information:

- playlist name (string)
- dynamically allocated array of songs Song* (std::vector is not allowed)
- number of songs in the playlist (int)

For the class, implement:

- The required constructors
- Method double playlistEngagement() const which calculates the level of user interaction with the playlist using the formula:

  playlistEngagement = (total listens + 2 * total likes) / total duration
  If the total duration of the songs in the playlist is 0, the method returns 0.

- Method void print() const which prints the name of the playlist, and then each song in the format defined in Song::print(). The songs are printed in the same order in which they were added to the array. At the end, the level of user interaction with the playlist should be printed.
- Operator Playlist& operator+=(const Song& s) which adds a new song to the playlist by expanding the dynamic array by one element.

In the main() function where it is marked, read information for N songs from standard input, create a playlist with those songs using the += operator, and then print the data about the playlist to standard output, including the data about all of its songs.

За печатење користете / For printing use : cout << "Playlist engagement: " << fixed << setprecision(2) << playlistEngagement() << endl;

For example:

Input 	Result

1
Narodni_Hitovi
1
Brala_Moma_Kapini 1000 150 200


Playlist: Narodni_Hitovi
Brala_Moma_Kapini - listens: 1000, likes: 150, duration: 200
Playlist engagement: 6.50
----------------------------------
1
Vesela_Makedonija
3
Kicice_Bujna_Lobodo 800 120 180
Bor_Sadila_Moma_Evgenija 950 180 220
Zajdi_Zajdi 1500 300 250


Playlist: Vesela_Makedonija
Kicice_Bujna_Lobodo - listens: 800, likes: 120, duration: 180
Bor_Sadila_Moma_Evgenija - listens: 950, likes: 180, duration: 220
Zajdi_Zajdi - listens: 1500, likes: 300, duration: 250
Playlist engagement: 6.85
----------------------------------
1
Kafana_Do_Sabajle
3
Ne_Kazi_Libe_Dobra_Nok 1200 250 240
Eleno_Kerko 600 90 0
Oj_Devojce_Devojce 750 130 200


Playlist: Kafana_Do_Sabajle
Ne_Kazi_Libe_Dobra_Nok - listens: 1200, likes: 250, duration: 240
Eleno_Kerko - listens: 600, likes: 90, duration: 0
Oj_Devojce_Devojce - listens: 750, likes: 130, duration: 200
Playlist engagement: 7.93
----------------------------------
1
Svadba_Vo_Mariovo_Afterparty
5
Ako_Umram_Il_Zaginam 1000 220 230
Mori_Cupija_Kumanovka 850 140 210
Jano_Mori 920 160 200
Uci_Me_Majko_Karaj_Me 700 110 190
Angelino_Mome 760 130 180


Playlist: Svadba_Vo_Mariovo_Afterparty
Ako_Umram_Il_Zaginam - listens: 1000, likes: 220, duration: 230
Mori_Cupija_Kumanovka - listens: 850, likes: 140, duration: 210
Jano_Mori - listens: 920, likes: 160, duration: 200
Uci_Me_Majko_Karaj_Me - listens: 700, likes: 110, duration: 190
Angelino_Mome - listens: 760, likes: 130, duration: 180
Playlist engagement: 5.69
----------------------------------
1
Ajde_Na_Oro
4
Makedonsko_Dete 1200 300 240
Nalej_Nalej 0 150 180
Oj_Ti_Pile 600 0 200
Site_Momi_Makedonki 0 0 160


Playlist: Ajde_Na_Oro
Makedonsko_Dete - listens: 1200, likes: 300, duration: 240
Nalej_Nalej - listens: 0, likes: 150, duration: 180
Oj_Ti_Pile - listens: 600, likes: 0, duration: 200
Site_Momi_Makedonki - listens: 0, likes: 0, duration: 160
Playlist engagement: 3.46
*/

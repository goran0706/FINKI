/*
Да се дополни претходната (влезна) задача со следните барања:

Барања за класата Song:

    Метод int popularity() const кој ја пресметува популарноста на песната според формулата: popularity = 3 * број_на_слушања + број_на_лајкови - 5 Соодветно треба да се надополни и методот print() според пресметаната популарност на песната.

Барања за класата Playlist:

    Метод Song worstSong() const кој ја враќа песната со најмала популарност. Доколку постојат повеќе песни со иста популарност, тогаш најмалку популарната песна се одредува според критериумите дадени во следниот редослед: прво помал број лајкови, потоа поголемо времетраење, на крај последна по редослед на појавување.
    Метод void readFromFile(ifstream &in) кој ги чита податоците за плејлистата од еден отворен влезен поток. Пред читањето, методот треба да ја избрише постоечката низа песни (доколку постои). Форматот на податоците е:

SummerHits
3
BlindingLights 12000 850 20
Flowers 9500 700 210
Believer 15000 900 204


(прв ред — име на плејлистата, втор ред — број на песни, потоа по еден ред за секоја песна: име на песна, број на слушања, број на лајкови и времетраење; да се претпостави дека имињата на песните немаат празни места)

Да се имплементираат следните надворешни функции:

    Playlist operator+(const Playlist& pl, const Song& s) — враќа нова плејлиста (копија на pl) со додадена песна s, без да ја менува оригиналната плејлиста.
    bool operator>(const Playlist& p1, const Playlist& p2) — ги споредува двете плејлисти по playlistEngagement(); плејлистата со поголем степен на интеракција се смета за поголема. Кога двете плејлисти имаат ист степен на интеракција, плејлистата со повеќе песни се смета за поголема.
    Song* getLongSongs(Playlist* playlists, int playlistCount, int minDuration, int& resultSize) Функцијата ги поминува сите песни од сите дадени плејлисти и враќа динамички алоцирана низа од Song објекти (копии) за оние чие времетраење е најмалку minDuration секунди (без сортирање — по редослед на нивно појавување). Во resultSize се запишува бројот на пронајдени песни. Доколку нема песна која го задоволува условот, функцијата враќа nullptr, а resultSize се поставува на 0.
    void writeSongsToFile(const Song* songs, int count, const string& filename) Функцијата креира (или презапишува) датотека со име filename и во неа ги запишува информациите за дадените песни (низата songs со должина count), во ист формат како методот Song::print().

Extend the previous (entry-level) task with the following requirements:

Requirements for the Song class:

    Method int popularity() const that computes the popularity of a song according to the formula: popularity = 3 * listens + likes - 5. The print() method must be updated accordingly to also display the computed popularity.

Requirements for the Playlist class:

    Method Song worstSong() const that returns the song with the lowest popularity. If multiple songs share the same popularity, the least popular song is determined by the following tiebreaker criteria in order: first fewer likes, then longer duration, and finally last by order of appearance.
    Method void readFromFile(ifstream &in) that reads playlist data from an open input stream. Before reading, the method must delete the existing array of songs (if any exists). The data format is:

SummerHits
3
BlindingLights 12000 850 200
Flowers 9500 700 210
Believer 15000 900 204

(first line — playlist name, second line — number of songs, then one line per song: song name, number of listens, number of likes, and duration; assume song names contain no spaces)

The following external functions must be implemented:

    Playlist operator+(const Playlist& pl, const Song& s) — returns a new playlist (a copy of pl) with song s appended, without modifying the original playlist.
    bool operator>(const Playlist& p1, const Playlist& p2) — compares two playlists by playlistEngagement(); the playlist with the higher engagement score is considered greater. If both playlists have equal engagement, the one with more songs is considered greater.
    Song* getLongSongs(Playlist* playlists, int playlistCount, int minDuration, int& resultSize) — iterates over all songs in all given playlists and returns a dynamically allocated array of Song objects (copies) for those whose duration is at least minDuration seconds (no sorting — in order of appearance). The number of found songs is stored in resultSize. If no song satisfies the condition, the function returns nullptr and sets resultSize to 0.
    void writeSongsToFile(const Song* songs, int count, const string& filename) — creates (or overwrites) a file named filename and writes the information for the given songs (the array songs of length count) in the same format as Song::print().



For example:
Song s("Flowers", 20, 15, 200);
cout << s.popularity() << endl;


70
----------------------------------
Song s("Blinding", 25, 5, 200);
s.print();


Blinding - listens: 25, likes: 5, duration: 200, popularity: 75
----------------------------------
Playlist pl("P");
pl += Song("A", 10, 2, 150);
pl += Song("B",  5, 8, 100);
pl += Song("C",  3, 3, 200);
pl.worstSong().print();


C - listens: 3, likes: 3, duration: 200, popularity: 7
----------------------------------
Playlist pl("P");
pl += Song("A",  5, 3, 120);
pl += Song("B",  4, 6, 100);
pl.worstSong().print();


A - listens: 5, likes: 3, duration: 120, popularity: 13
----------------------------------
Playlist pl("P");
pl += Song("A", 0, 10, 200);
pl += Song("B", 0, 10, 100);
pl.worstSong().print();


A - listens: 0, likes: 10, duration: 200, popularity: 5
----------------------------------
Playlist pl("P");
pl += Song("A", 10, 5, 100);
pl += Song("B", 10, 5, 100);
pl.worstSong().print();


B - listens: 10, likes: 5, duration: 100, popularity: 30
----------------------------------
ofstream out("playlist.txt");
out << "SummerHits" << endl;
out << 3 << endl;
out << "BlindingLights 12000 850 200" << endl;
out << "Flowers 9500 700 210" << endl;
out << "Believer 15000 900 204" << endl;
out.close();
Playlist pl;
ifstream in("playlist.txt");
pl.readFromFile(in);
in.close();
pl.print();


Playlist: SummerHits
BlindingLights - listens: 12000, likes: 850, duration: 200, popularity: 36845
Flowers - listens: 9500, likes: 700, duration: 210, popularity: 29195
Believer - listens: 15000, likes: 900, duration: 204, popularity: 45895
Playlist engagement: 67.43
----------------------------------
Playlist pl("Old");
pl += Song("Ghost", 500, 50, 180);
ofstream out("playlist.txt");
out << "SummerHits" << endl;
out << 2 << endl;
out << "Flowers 9500 700 210" << endl;
out << "Believer 15000 900 204" << endl;
out.close();
ifstream in("playlist.txt");
pl.readFromFile(in);
in.close();
cout << pl.getSongCount() << endl;
pl.print();


2
Playlist: SummerHits
Flowers - listens: 9500, likes: 700, duration: 210, popularity: 29195
Believer - listens: 15000, likes: 900, duration: 204, popularity: 45895
Playlist engagement: 66.91
----------------------------------
Playlist pl1("P1");
pl1 += Song("Flowers", 9500, 700, 210);
Playlist pl2 = pl1 + Song("Believer", 15000, 900, 204);
cout << pl1.getSongCount() << endl;
cout << pl2.getSongCount() << endl;


1
2
----------------------------------
Playlist p1("P1"), p2("P2");
p1 += Song("A", 20, 10, 10);
p2 += Song("B",  5,  5, 10);
cout << (p1 > p2 ? "yes" : "no") << endl;
cout << (p2 > p1 ? "yes" : "no") << endl;


yes
no
----------------------------------
Playlist p1("P1"), p2("P2");
p1 += Song("A", 10, 10, 10);
p1 += Song("B", 10, 10, 10);
p2 += Song("C", 10, 10, 10);
cout << (p1 > p2 ? "yes" : "no") << endl;
cout << (p2 > p1 ? "yes" : "no") << endl;


yes
no
----------------------------------
Playlist playlists[2];
playlists[0] += Song("Flowers",  9500, 700, 210);
playlists[0] += Song("Short",     100,  50,  90);
playlists[1] += Song("Believer", 15000, 900, 204);
playlists[1] += Song("Tiny",       50,  20,  80);
int size = 0;
Song *long_songs = getLongSongs(playlists, 2, 200, size);
cout << size << endl;
for (int i = 0; i < size; i++) {
    long_songs[i].print();
}
delete [] long_songs;


2
Flowers - listens: 9500, likes: 700, duration: 210, popularity: 29195
Believer - listens: 15000, likes: 900, duration: 204, popularity: 45895
----------------------------------
Playlist playlists[1];
playlists[0] += Song("A", 3, 2, 50);
int size = -1;
Song *long_songs = getLongSongs(playlists, 1, 200, size);
cout << (long_songs == nullptr ? "nullptr" : "not null") << endl;
cout << size << endl;


nullptr
0
----------------------------------
Song arr[2] = {
    Song("Flowers",  9500, 700, 210),
    Song("Believer", 15000, 900, 204)
};
writeSongsToFile(arr, 2, "songs.txt");
ifstream in("songs.txt");
string line;
while (getline(in, line)) {
    cout << line << endl;
}
in.close();


Flowers - listens: 9500, likes: 700, duration: 210, popularity: 29195
Believer - listens: 15000, likes: 900, duration: 204, popularity: 45895
----------------------------------
Playlist pl("P");
pl += Song("A", 4, 4, 120);
pl += Song("B", 3, 7, 100);
pl += Song("C", 3, 7, 150);
pl.worstSong().print();


A - listens: 4, likes: 4, duration: 120, popularity: 11
----------------------------------
Playlist base("Base");
base += Song("A", 100, 50, 180);
Playlist r1 = base + Song("B", 200, 80, 200);
Playlist r2 = r1   + Song("C", 300, 120, 210);
cout << base.getSongCount() << endl;
cout << r1.getSongCount() << endl;
cout << r2.getSongCount() << endl;


1
2
3
----------------------------------
Playlist playlists[1];
playlists[0] += Song("Exact", 100, 50, 200);
playlists[0] += Song("Below", 100, 50, 199);
int size = 0;
Song *res = getLongSongs(playlists, 1, 200, size);
cout << size << endl;
cout << res[0].getName() << endl;
delete [] res;


1
Exact
----------------------------------
Playlist p1("P1");
    p1 += Song("Alpha", 900, 180, 240);
    p1 += Song("Beta",  600, 120, 190);

    {
        Playlist p2("P2");
        p2 += Song("Gamma", 200, 40, 160);

        p2 = p1;

    }

    {
        Playlist inner("Inner P1");
        inner += Song("Alpha", 900, 180, 240);
        inner += Song("Beta",  600, 120, 190);

        Playlist outer("Outer P2");
        outer += Song("Gamma", 200, 40, 160);
        outer = inner;

        {
            Playlist dying(inner);
        }

        cout << "=== p2 (assigned, source destroyed) ===" << endl;
        outer.print();
        cout << endl;

        outer = outer;
        cout << "=== p2 after self-assignment ===" << endl;
        outer.print();
    }



=== p2 (assigned, source destroyed) ===
Playlist: Inner P1
Alpha - listens: 900, likes: 180, duration: 240, popularity: 2875
Beta - listens: 600, likes: 120, duration: 190, popularity: 1915
Playlist engagement: 4.88

=== p2 after self-assignment ===
Playlist: Inner P1
Alpha - listens: 900, likes: 180, duration: 240, popularity: 2875
Beta - listens: 600, likes: 120, duration: 190, popularity: 1915
Playlist engagement: 4.88
*/

/*
Ваша задача е да креирате систем за управување со различни типови на аудио содржини. Креирајте апстрактна класа AudioContent со две чисто виртуелни функции:

    displayContentInfo()
    calculateStreamingRevenue()

Потоа креирајте 2 подкласи:

    Song
    Podcast

Класата Song треба да ги има атрибути:

    hasPremiumArtist – bool променлива

Да се имплементираат методите така што:

    displayContentInfo() ќе печати:
    This is a song available for streaming.
    Ако е од премиум артист, дополнително да се испечати:
    It is created by a premium artist.
    calculateStreamingRevenue()
    Печати:
    Revenue from the song is [amount] dollars.
    Приход:
        0.02 по стрим ако е премиум артист
        0.01 по стрим ако не е.

Класата Podcast треба да ги има:

    hasSponsors – bool променлива

Да се имплементираат методите:

    displayContentInfo() ќе печати:
    This is a podcast episode.
    Ако има спонзори, дополнително да се испечати:
    It includes sponsored segments.
    calculateStreamingRevenue()
    Печати:
    Revenue from the podcast is [amount] dollars.
    Приход:
        50 ако има спонзори
        20 ако нема

Напомена: Секоја содржина има по 100000 стримови.

---

Your task is to create a system for managing different types of audio content. Create an abstract class AudioContent with two pure virtual functions:

    displayContentInfo()
    calculateStreamingRevenue()

Then create 2 subclasses:

    Song
    Podcast

The class Song should have the attribute:

    hasPremiumArtist – boolean variable

Implement the methods as follows:

    displayContentInfo() should print:
    This is a song available for streaming.
    If it is created by a premium artist, additionally print:
    It is created by a premium artist.
    calculateStreamingRevenue()
    Prints:
    Revenue from the song is [amount] dollars.
    Revenue:
        0.02 per stream if it is a premium artist
        0.01 per stream if not

The class Podcast should have:

    hasSponsors – boolean variable

Implement the methods:

    displayContentInfo() should print:
    This is a podcast episode.
    If it has sponsors, additionally print:
    It includes sponsored segments.
    calculateStreamingRevenue()
    Prints:
    Revenue from the podcast is [amount] dollars.
    Revenue:
        50 if it has sponsors
        20 if it does not

Note: Each content object has 100000 streams.

For example:
Input 	Result

3
1
1
1
0
0



TEST CASE 3: MIXED CONTENT
This is a song available for streaming.
It is created by a premium artist.
Revenue from the song is 2000 dollars.
This is a podcast episode.
It includes sponsored segments.
Revenue from the podcast is 50 dollars.
This is a song available for streaming.
It is created by a premium artist.
Revenue from the song is 2000 dollars.
This is a podcast episode.
Revenue from the podcast is 20 dollars.
This is a song available for streaming.
Revenue from the song is 1000 dollars.
*/
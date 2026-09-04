/*
Дефинирај класа Musician која чува:

    динамички алоцирана низа од знаци за името на музичарот

    низа од максимум 50 знаци за жанрот на музичарот

    просечен број на стримувања по песна оваа година (double, во милиони)

    просечен приход по концерт оваа година (double, во илјади)

    број на издадени албуми (int)

За класата, дефинирај:

    default конструктор и конструктор со аргументи

    конструктор за копирање и оператор за доделување (=)

    деструктор

    метода score() која го враќа резултатот на популарноста на музичарот, пресметан на следниот начин:

        Пресметај основа: 55% од стримувања + 45% од приход

        Пресметај множител: 1.0 + албуми × 0.05 (секој албум додава 5% бонус)

        Врати основа × множител

    метода print() која го печати музичарот во следниот формат:

Name - Genre
Streams (avg): streams M
Revenue (avg): revenue K
Albums: albums
Score: score

Од класата Musician, изведи класа AwardWinningMusician, која дополнително чува:

    просечен број на стримувања по песна на изданија прикажани на доделување на награди (double, во милиони)

    просечен приход по концерт за турнеи во сезоната на награди (double, во илјади)

    број на освоени награди (int)

За класата, дефинирај:

    default конструктор

    конструктор кој прима објект од Musician плус дополнителните информации

    конструктор кој прима сите аргументи

    конструктор за копирање, оператор за доделување (=) и деструктор

    метода awardScore() која го враќа резултатот од сезоната на награди, со иста логика на множител:

        Пресметај основа: 55% од стримувања на награди + 45% од приход на награди

        Пресметај множител: 1.0 + албуми × 0.05 (го користи наследениот број на албуми)

        Врати основа × множител

    Препокрај ги методите:

        score(), кој треба да ја врати просечната вредност од редовниот резултат и резултатот од наградите

        print(), кој покрај основните информации за музичарот, исто така печати:

Award Score: award_score
New Score: average_score
Define a class Musician which stores:

    a dynamically allocated array of characters for the musician's name

    an array of maximum 50 characters for the musician's genre

    average streams per song this year (double, in millions)

    average concert revenue per show this year (double, in thousands)

    number of albums released (int)

For the class, define:

    a default constructor and a constructor with arguments

    a copy constructor and an assignment operator (=)

    a destructor

    a method score() that returns the musician's popularity score, calculated as:

        Compute a base: 55% of streams + 45% of revenue

        Compute a multiplier: 1.0 + albums × 0.05 (each album adds a 5% bonus)

        Return base × multiplier

    a method print() that prints the musician in the following format:

Name - Genre
Streams (avg): streams M
Revenue (avg): revenue K
Albums: albums
Score: score

From Musician, derive a class AwardWinningMusician, which additionally stores:

    average streams per song at award-show-featured releases (double, in millions)

    average concert revenue for award-season tours (double, in thousands)

    number of awards won (int)

For the class, define:

    a default constructor

    a constructor that accepts an object of Musician plus the additional information

    a constructor that accepts all arguments

    a copy constructor, assignment operator (=), and destructor

    a method awardScore() that returns the award-season score, using the same multiplier logic:

        Compute a base: 55% of award streams + 45% of award revenue

        Compute a multiplier: 1.0 + albums × 0.05 (reuses the inherited album count)

        Return base × multiplier

    Override the methods:

        score(), which should return the average of the regular score and the award score

        print(), which besides the basic musician info, also prints:

Award Score: award_score
New Score: average_score

For example:
Input 	Result

1
The_Strokes IndieRock 18.4 310.0 6
Pink_Floyd ClassicRock 25.7 890.0 15
Daft_Punk ElectronicPop 33.2 760.0 5
The_Smiths AlternativeRock 14.9 280.0 5
Mac_DeMarco Indie 12.3 195.0 9
TV_Girl IndiePop 9.8 140.0 4
Radiohead AlternativeRock 22.6 670.0 9


MUSICIANS:
=====================================
The_Strokes - IndieRock
Streams (avg): 18.4 M
Revenue (avg): 310 K
Albums: 6
Score: 194.506
Pink_Floyd - ClassicRock
Streams (avg): 25.7 M
Revenue (avg): 890 K
Albums: 15
Score: 725.611
Daft_Punk - ElectronicPop
Streams (avg): 33.2 M
Revenue (avg): 760 K
Albums: 5
Score: 450.325
The_Smiths - AlternativeRock
Streams (avg): 14.9 M
Revenue (avg): 280 K
Albums: 5
Score: 167.744
Mac_DeMarco - Indie
Streams (avg): 12.3 M
Revenue (avg): 195 K
Albums: 9
Score: 137.047
TV_Girl - IndiePop
Streams (avg): 9.8 M
Revenue (avg): 140 K
Albums: 4
Score: 82.068
Radiohead - AlternativeRock
Streams (avg): 22.6 M
Revenue (avg): 670 K
Albums: 9
Score: 455.199
*/
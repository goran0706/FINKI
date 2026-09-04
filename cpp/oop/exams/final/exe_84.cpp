#include<iostream>
#include<string.h>
#include<exception>
using namespace std;

class Person {
private:
    char name[20];
    int year;

public:
    Person(char *name, int year) {
        strcpy(this->name, name);
        this->year = year;
    }

    Person() {
        strcpy(this->name, "");
    }

    bool operator==(char *name) {
        return strcmp(this->name, name) == 0;
    }

    char const *getName() {
        return name;
    }

    void print() { cout << name << " (" << year << ")"; }
};

class RatingMissingException : public exception {
    const char *what() const noexcept override {
        return "Rating Missing";
    }
};

class Song {
protected:
    char title[30];
    Person performers[10];
    int numberPerformers;
    int *ratings;
    int numberRatings;

public:
    Song(char *title, Person *performers, int numberPerformers, int *ratings, int numberRatings) {
        strcpy(this->title, title);
        this->numberPerformers = numberPerformers;
        for (int i = 0; i < numberPerformers; i++) this->performers[i] = performers[i];
        this->numberRatings = numberRatings;
        this->ratings = new int[numberRatings];
        for (int i = 0; i < numberRatings; i++) this->ratings[i] = ratings[i];
    }

    virtual ~Song() {
        delete[] ratings;
    }

    virtual float getTotalRating() {
        if (numberRatings == 0) {
            throw RatingMissingException();
        }
        int minRating = ratings[0], maxRating = ratings[0];
        for (int i = 1; i < numberRatings; ++i) {
            if (ratings[i] < minRating) minRating = ratings[i];
            if (ratings[i] > maxRating) maxRating = ratings[i];
        }
        return (minRating + maxRating) / 2.0;
    }

    virtual void print() {
        for (int i = 0; i < numberPerformers; i++) {
            performers[i].print();
            if (i != numberPerformers - 1) cout << ",";
        }
        cout << ":" << title << endl;
    }

    int getnumberPerformers() { return numberPerformers; }

    Person operator[](int i) {
        if (i < numberPerformers && i >= 0) return performers[i];
        else return Person();
    }

    Person *getPerformers() {
        return performers; // Return the array of performers
    }

    const char *getTitle() const {
        return title;
    }
};

class Movie {
private:
    char *title;

protected:
    int popularity;

public:
    Movie(char *title, int popularity) {
        this->popularity = popularity;
        this->title = new char[strlen(title) + 1];
        strcpy(this->title, title);
    }

    Movie(const Movie &v) {
        this->popularity = v.popularity;
        this->title = new char[strlen(v.title) + 1];
        strcpy(this->title, v.title);
    }

    Movie &operator=(const Movie &v) {
        if (this == &v) return *this;
        this->popularity = v.popularity;
        delete[] title;
        this->title = new char[strlen(v.title) + 1];
        strcpy(this->title, v.title);
        return *this;
    }

    virtual ~Movie() {
        delete[] title;
    }

    void print() {
        cout << "Movie: " << title << endl;
    }

    char *getMovieTitil() {
        return title;
    }
};

class MovieSong : public Song, public Movie {
private:
    int songPopularity;

public:
    MovieSong(char *songTitle, Person *performers, int numberOfPerformers, int *ratings, int numberOfRatings,
              char *movieTitle, int moviePopularity, int songPopularity)
        : Song(songTitle, performers, numberOfPerformers, ratings, numberOfRatings),
          Movie(movieTitle, moviePopularity) {
        this->songPopularity = songPopularity;
    }

    float getTotalRating() override {
        if (numberRatings == 0) {
            throw RatingMissingException();
        }

        int minRating = ratings[0], maxRating = ratings[0];
        for (int i = 1; i < numberRatings; ++i) {
            if (ratings[i] < minRating) minRating = ratings[i];
            if (ratings[i] > maxRating) maxRating = ratings[i];
        }

        float avgMinMax = (minRating + maxRating) / 2.0;
        return avgMinMax * (static_cast<float>(songPopularity) / popularity);
    }

    void print() override {
        for (int i = 0; i < numberPerformers; i++) {
            performers[i].print();
            if (i != numberPerformers - 1) cout << ",";
        }
        cout << ":" << getTitle() << endl;
        cout << "Movie:" << getMovieTitil() << endl;
    }
};

double averageRating(Song **songs, int n) {
    double totalRating = 0;
    int movieSongCount = 0;
    for (int i = 0; i < n; i++) {
        MovieSong *movieSong = dynamic_cast<MovieSong *>(songs[i]);
        if (movieSong != nullptr) {
            try {
                totalRating += movieSong->getTotalRating();
                movieSongCount++;
            } catch (const RatingMissingException &) {
                totalRating += 5;
                movieSongCount++;
            }
        }
    }

    return (movieSongCount == 0) ? 0 : totalRating / movieSongCount;
}

void printSongs(char *performer, Song **songs, int n) {
    for (int i = 0; i < n; i++) {
        bool found = false;
        for (int j = 0; j < songs[i]->getnumberPerformers(); j++) {
            if (strcmp(songs[i]->getPerformers()[j].getName(), performer) == 0) {
                found = true;
                break;
            }
        }

        if (found) {
            songs[i]->print();
        }
    }
}

int main() {
    Person performers[10];
    int year, numberOfPerformers, ratings[20], rating, numberOfRatings, type, popularity, songPopularity;
    char name[40], title[30], perfomer[30];

    cin >> type;

    if (type == 1) //test class MovieSong
    {
        cout << "-----TEST MovieSong-----" << endl;
        cin >> title >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }
        cin >> title >> popularity >> songPopularity;


        MovieSong ok(title, performers, numberOfPerformers, ratings, numberOfRatings, title, popularity,
                     songPopularity);
        cout << "Object of class MovieSong is created";
    } else if (type == 2) // function print in song
    {
        cout << "-----TEST print-----" << endl;
        cin >> title >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }

        Song k(title, performers, numberOfPerformers, ratings, numberOfRatings);
        k.print();
    } else if (type == 3) // function getTotalRating
    {
        cout << "-----TEST getTotalRating-----" << endl;
        cin >> title >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }

        Song k(title, performers, numberOfPerformers, ratings, numberOfRatings);
        cout << "Total rating: " << k.getTotalRating() << endl;
    } else if (type == 4) //funkcija getTotalRating vo MovieSong
    {
        cout << "-----TEST getTotalRating-----" << endl;
        cin >> title >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }
        cin >> title >> popularity >> songPopularity;

        MovieSong fp(title, performers, numberOfPerformers, ratings, numberOfRatings, title, popularity,
                     songPopularity);
        cout << "Total rating: " << fp.getTotalRating() << endl;
    } else if (type == 5) //funkcija print vo MovieSong
    {
        cout << "-----TEST print -----" << endl;
        char ttt[100];
        cin >> ttt >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }
        cin >> title >> popularity >> songPopularity;

        MovieSong fp(ttt, performers, numberOfPerformers, ratings, numberOfRatings, title, popularity, songPopularity);
        fp.print();
    } else if (type == 6) //all classes
    {
        cout << "-----TEST Song and MovieSong-----" << endl;
        cin >> title >> numberOfPerformers;
        for (int i = 0; i < numberOfPerformers; i++) {
            cin >> name >> year;
            performers[i] = Person(name, year);
        }
        cin >> numberOfRatings;
        for (int i = 0; i < numberOfRatings; i++) {
            cin >> rating;
            ratings[i] = rating;
        }
        cin >> title >> popularity >> songPopularity;

        Song *p = new MovieSong(title, performers, numberOfPerformers, ratings, numberOfRatings, title, popularity,
                                songPopularity);
        p->print();
        cout << "Total rating: " << p->getTotalRating() << endl;
        delete p;
    } else if (type == 7) // function average rating
    {
        cout << "-----TEST average rating-----" << endl;
        int k, opt;
        cin >> k;
        Song **pesni = new Song *[k];
        for (int j = 0; j < k; j++) {
            cin >> opt; //1 Song 2 MovieSong
            cin >> title >> numberOfPerformers;
            for (int i = 0; i < numberOfPerformers; i++) {
                cin >> name >> year;
                performers[i] = Person(name, year);
            }
            cin >> numberOfRatings;
            for (int i = 0; i < numberOfRatings; i++) {
                cin >> rating;
                ratings[i] = rating;
            }
            if (opt == 1) {
                pesni[j] = new Song(title, performers, numberOfPerformers, ratings, numberOfRatings);
            } else {
                cin >> title >> popularity >> songPopularity;
                pesni[j] = new MovieSong(title, performers, numberOfPerformers, ratings, numberOfRatings, title,
                                         popularity, songPopularity);
            }
        }

        cout << "Average rating of the songs is " << averageRating(pesni, k);
        for (int j = 0; j < k; j++) delete pesni[j];
        delete [] pesni;
    } else if (type == 8) // function print songs
    {
        cout << "-----TEST print songs-----" << endl;
        int k, opt;
        cin >> k;
        Song **pesni = new Song *[k];
        for (int j = 0; j < k; j++) {
            cin >> opt; //1 Song 2 MovieSong
            char ttt[100];
            cin >> ttt >> numberOfPerformers;
            for (int i = 0; i < numberOfPerformers; i++) {
                cin >> name >> year;
                performers[i] = Person(name, year);
            }
            cin >> numberOfRatings;
            for (int i = 0; i < numberOfRatings; i++) {
                cin >> rating;
                ratings[i] = rating;
            }
            if (opt == 1) {
                pesni[j] = new Song(ttt, performers, numberOfPerformers, ratings, numberOfRatings);
            } else {
                cin >> title >> popularity >> songPopularity;
                pesni[j] = new MovieSong(ttt, performers, numberOfPerformers, ratings, numberOfRatings, title,
                                         popularity, songPopularity);
            }
        }
        cin >> perfomer;
        cout << "Songs of " << perfomer << " are:" << endl;
        printSongs(perfomer, pesni, k);
        for (int j = 0; j < k; j++) delete pesni[j];
        delete [] pesni;
    }


    return 0;
}

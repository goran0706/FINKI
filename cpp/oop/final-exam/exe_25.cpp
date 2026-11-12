#include <iostream>
#include <fstream>

using namespace std;

class Song {
private:
    string name;
    string author;
    string izveduvach;
    int duration;

public:
    //    Song(string name="", string author="",string izveduvach = "", int duration = 0){
    //        this->name=name;
    //        this->author=author;
    //        this->izveduvach=izveduvach;
    //        this->duration=duration;
    //    }

    friend istream &operator>>(istream &in, Song &s) {
        in.ignore();
        getline(in, s.name);
        getline(in, s.author);
        getline(in, s.izveduvach);
        in >> s.duration;
        //        in.ignore();
        return in;
    }

    void print(ofstream &out) {
        out << "Song title: " << name << ", Author: " << author << ", Interpreted by: " << izveduvach << ", " <<
                duration << " sek." << endl;
    }

    bool operator ==(const Song &other) const {
        return (name == other.name) && (author == other.author) && (izveduvach == other.izveduvach) && (
                   duration == other.duration);
    }

    string getAuthorr() {
        return author;
    }
};

class Festival {
private:
    string nameFestival, city, date;
    Song *songs;
    int n;

public:
    Festival() {
        songs = new Song[0];
        n = 0;
    }

    Festival(const Festival &f) {
        this->nameFestival = f.nameFestival;
        this->city = f.city;
        this->date = f.date;
        this->n = f.n;
        this->songs = new Song[f.n];
        for (int i = 0; i < f.n; ++i) {
            this->songs[i] = f.songs[i];
        }
    }

    Festival &operator =(const Festival &f) {
        if (this != &f) {
            delete[]songs;
            this->nameFestival = f.nameFestival;
            this->city = f.city;
            this->date = f.date;
            this->n = f.n;
            this->songs = new Song[f.n];
            for (int i = 0; i < f.n; ++i) {
                this->songs[i] = f.songs[i];
            }
        }
        return *this;
    }

    Festival &operator -=(Song &s) {
        if (n == 0) {
            cout << "Trying to delete from an empty list!" << endl;
        }
        int counter = 0;
        for (int i = 0; i < n; ++i) {
            if (songs[i] == s) {
                counter++;
            }
        }
        Song *tmp = new Song[n - counter];
        int j = 0;
        for (int i = 0; i < n; ++i) {
            if (!(songs[i] == s)) {
                tmp[j++] = songs[i];
            }
        }
        delete[]songs;
        songs = tmp;
        n = j;
        return *this;
    }

    void print(ofstream &out) {
        out << "Festival: " << nameFestival << " - " << city << ", " << date << endl;
        for (int i = 0; i < n; ++i) {
            songs[i].print(out);
        }
    }

    friend istream &operator>>(istream &in, Festival &s) {
        getline(in, s.nameFestival);
        getline(in, s.city);
        getline(in, s.date);
        in >> s.n;
        s.songs = new Song[s.n];
        for (int i = 0; i < s.n; ++i) {
            in >> s.songs[i];
        }
        return in;
    }

    Festival notFromAuthor(string &author) {
        Festival newObject = *this;
        if (n == 0) {
            cout << "Trying to delete from an empty list!" << endl;
        }
        for (int i = 0; i < n; ++i) {
            if (songs[i].getAuthorr() == author) {
                newObject -= songs[i];
            }
        }
        return newObject;
    }

    ~Festival() {
        delete[]songs;
    }
};

void wtf() {
    ofstream fout("vlezna.txt");
    string line;
    while (getline(std::cin, line)) {
        if (line == "----") {
            break;
        }
        fout << line << endl;
    }
}

void rff(string path) {
    ifstream fin(path);
    string line;
    while (getline(fin, line)) {
        cout << line << endl;
    }
}


int main() {
    wtf();

    Festival festival;
    //TODO your code here
    //TODO Read the data from the file and store them in `festival`
    ifstream fin("vlezna.txt");
    ofstream fout("izlezna1.txt");
    ofstream fout2("izlezna2.txt");

    fin >> festival;
    fin.close();


    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
    string author;
    getline(cin, author);
    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files izlezna1.txt and izlezna2.txt after this line

    festival.print(fout);
    fout.close();

    Festival f = festival.notFromAuthor(author);
    f.print(fout2);
    fout2.close();


    //DO NOT MODIFY THE CODE BELLOW

    cout << "All the data for the festival:" << endl;
    rff("izlezna1.txt");
    cout << "Songs NOT from the author " << author << ": " << endl;
    rff("izlezna2.txt");


    return 0;
}

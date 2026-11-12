#include <iostream>
#include <fstream>

using namespace std;

class Song {
private:
    string title;
    string author;
    string performer;
    int time;

public:
    Song(const string &title = "", const string &author = "", const string &performer = "", int time = 0) {
        this->title = title;
        this->author = author;
        this->performer = performer;
        this->time = time;
    }

    friend istream &operator>>(istream &is, Song &song) {
        getline(is, song.title);
        getline(is, song.author);
        getline(is, song.performer);
        is >> song.time;
        is.ignore();
        return is;
    }

    void print(ofstream &out) {
        //Song title: Usni na usni, Author: Grigor Koprov, Interpreted by: Toshe Proeski, 215 sek.
        out << "Song title: " << title << ", Author: " << author << ", Interpreted by: " << performer << ", " << time <<
                " sek." << endl;
    }

    //наслов, автор, изведувач и времетраење
    bool isSame(const Song &s) {
        return s.title == title && s.author == author && s.performer == performer && s.time == time;
    }

    bool sameAuthor(const string &author) {
        return this->author == author;
    }
};

class Festival {
private:
    string name;
    string city;
    string date;
    Song *array;
    int n;

public:
    Festival(const string &name = "", const string &city = "", const string &date = "", const Song *array = nullptr,
             int n = 0) {
        this->name = name;
        this->city = city;
        this->date = date;
        this->n = n;
        this->array = new Song [n];
        for (int i = 0; i < n; i++) {
            if (array) {
                this->array[i] = array[i];
            } else {
                this->array[i] = Song();
            }
        }
    }

    Festival(const Festival &f) {
        this->name = f.name;
        this->city = f.city;
        this->date = f.date;
        this->n = f.n;
        this->array = new Song [n];
        for (int i = 0; i < n; i++) {
            this->array[i] = f.array[i];
        }
    }

    Festival &operator=(const Festival &f) {
        if (this != &f) {
            delete [] this->array;
            this->name = f.name;
            this->city = f.city;
            this->date = f.date;
            this->n = f.n;
            this->array = new Song [n];
            for (int i = 0; i < n; i++) {
                this->array[i] = f.array[i];
            }
        }
        return *this;
    }

    ~Festival() {
        delete[] this->array;
    }

    Festival &operator -=(const Song &s) {
        if (n == 0) {
            cout << "Trying to delete from an empty list!" << endl;
            return *this;
        }
        for (int i = 0; i < n; i++) {
            if (array[i].isSame(s)) {
                for (int j = i; j < n - 1; j++) {
                    array[j] = array[j + 1];
                }
                i--;
                n--;
            }
        }
        return *this;
    }

    void print(ofstream &out) {
        //Festival: Ohridski Trubaduri - Ohrid, 30/08/2024
        out << "Festival: " << name << " - " << city << ", " << date << endl;
        for (int i = 0; i < n; i++) {
            array[i].print(out);
        }
    }

    friend istream &operator>>(istream &is, Festival &f) {
        getline(is, f.name);
        getline(is, f.city);
        getline(is, f.date);
        is >> f.n;
        is.ignore();
        f.array = new Song [f.n];
        for (int i = 0; i < f.n; i++) {
            is >> f.array[i];
        }
        return is;
    }

    Festival notFromAuthor(const string &author) {
        for (int i = 0; i < n; i++) {
            if (array[i].sameAuthor(author)) {
                for (int j = i; j < n - 1; j++) {
                    array[j] = array[j + 1];
                }
                i--;
                n--;
            }
        }
        return *this;
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

void rff(const string &path) {
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
    if (!fin.is_open()) {
        cout << "Error opening vlezna.txt" << endl;
        return 1;
    }
    fin >> festival;
    fin.close();

    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
    string author;
    getline(cin, author);
    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files izlezna1.txt and izlezna2.txt after this line
    Song s = Song();
    festival -= s;
    ofstream fout("izlezna1.txt");
    if (!fout.is_open()) {
        cout << "Error opening izlezna1.txt" << endl;
        return 1;
    }
    festival.print(fout);
    fout.close();
    ofstream fout2("izlezna2.txt");
    if (!fout2.is_open()) {
        cout << "Error opening izlezna2.txt" << endl;
        return 1;
    }
    festival.notFromAuthor(author);
    festival.print(fout2);
    fout2.close();
    //DO NOT MODIFY THE CODE BELLOW

    cout << "All the data for the festival:" << endl;
    rff("izlezna1.txt");
    cout << "Songs NOT from the author " << author << ": " << endl;
    rff("izlezna2.txt");


    return 0;
}

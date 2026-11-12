#include <iostream>
#include <cstring>
using namespace std;

class Word {
private:
    char *array;

public:
    Word(const char *array = "UNDEFINED") {
        this->array = new char [strlen(array) + 1];
        strcpy(this->array, array);
    }

    Word(const Word &w) {
        this->array = new char [strlen(w.array) + 1];
        strcpy(this->array, w.array);
    }

    Word &operator=(const Word &other) {
        if (this != &other) {
            delete[] array;
            array = new char[strlen(other.array) + 1];
            strcpy(array, other.array);
        }
        return *this;
    }

    ~Word() {
        delete[] this->array;
    }

    void print() {
        cout << this->array;
    }

    void swapp(Word &w, Word &w2) {
        // Word temp=word[i];
        // word[i]=word[j];
        // word[j]=temp;
        char *temp = w.array;
        w.array = w2.array;
        w2.array = temp;
    }
};

class Sentence {
private:
    Word *word;
    int n;
    int capacity;

public:
    Sentence(const int capacity = 10) {
        this->capacity = capacity;
        this->n = 0;
        word = new Word[capacity];
    }

    Sentence(const Sentence &s) {
        this->capacity = s.capacity;
        this->n = s.n;
        word = new Word[s.capacity];
        for (int i = 0; i < this->n; i++) {
            this->word[i] = s.word[i];
        }
    }

    Sentence &operator=(const Sentence &other) {
        if (this != &other) {
            delete[] word;
            this->capacity = other.capacity;
            this->n = other.n;
            this->word = new Word[other.capacity];
            for (int i = 0; i < this->n; i++) {
                this->word[i] = other.word[i];
            }
        }
        return *this;
    }

    ~Sentence() {
        delete[] this->word;
    }

    void add(Word &w) {
        if (n >= capacity) {
            capacity += 10;
            Word *temp = new Word[capacity];
            for (int i = 0; i < n; i++) {
                temp[i] = word[i];
            }
            delete[] word;
            word = temp;
        }
        word[n++] = w;
    }

    void print() {
        for (int i = 0; i < n; i++) {
            word[i].print();
            cout << " ";
        }
        cout << endl;
    }

    void swap(int i, int j) {
        // Word temp=word[i];
        // word[i]=word[j];
        // word[j]=temp;
        // word[i].print();
        // word[j].print();
        word->swapp(word[i], word[j]);
    }
};

int main() {
    //  Word word=Word();
    //  //word.print();
    //  Word word2=Word("something");
    //  Word word3=Word("something1");
    //  Word word4=Word("something2");
    //  Word word5=Word("something3");
    //  Word word6=Word("something4");
    //  Word word7=Word("something5");
    //  Word word8=Word("something6");
    //  Word word9=Word("something7");
    //  Word word10=Word("something8");
    //  Word word11=Word("something9");
    //  Word word12=Word("something10");
    //  Word word13=Word("something11");
    // // word2.print();
    //  Sentence sentence=Sentence();
    //
    //  sentence.add(word);
    //  sentence.add(word2);
    //  sentence.add(word3);
    //  sentence.add(word4);
    //  sentence.add(word5);
    //  sentence.add(word6);
    //  sentence.add(word7);
    //  sentence.add(word8);
    //  sentence.add(word9);
    //  sentence.add(word10);
    //  sentence.add(word11);
    //  sentence.add(word12);
    //  sentence.add(word13);
    //
    //  sentence.print();
    //  cout <<endl;
    //
    //  sentence.swap(0,10);
    //
    //  sentence.print();
    //  return 0;

    int n;
    cin >> n;
    cin.get();
    cout << "CONSTRUCTOR" << endl;
    Sentence s;
    cout << "ADD WORD" << endl;
    for (int i = 0; i < n; ++i) {
        char w[100];
        cin.getline(w, 100);
        Word word(w);
        s.add(word);
    }
    cout << "PRINT SENTENCE" << endl;
    s.print();
    cout << "COPY" << endl;
    Sentence x = s;
    cout << "SWAP" << endl;
    x.swap(n / 2, n / 3);
    x.print();
    cout << "ORIGINAL" << endl;
    s.print();
    return 0;
}

// Да се дефинира класа MovieActor за која ќе се чуваат:
//
// динамички алоцирана низа од карактери за името на актерот
// низа од максимум 40 карактери за државата од која потекнува
// просечна оцена на филмовите во кои глумел актерот годинава (double)
// вкупен број на филмови годинава (int)
// вкупна заработка од тие филмови во милиони долари (double)
//
// За потребите на класата да се дефинираат:
//
// default конструктор и конструктор со аргументи
// copy constructor и оператор =
// деструктор
// метод rating() кој го враќа рејтингот на актерот пресметан како:
//
// (просечнаоценка * 0.4) + (бројнафилмови * 0.2) + (заработка * 0.4)
//
// метод print() кој ги печати податоците во следниот формат:
// [Име] - [држава]
// Average rating: [просечна оцена]
// Movies this year: [вкупен број]
// Total earnings: [вкупна заработка]
// Rating: [рејтинг]
//
// Од MovieActor да се изведе класа OscarWinner за која дополнително ќе се чуваат:
//
// просечна оцена на филмовите по добиениот Оскар (double)
// број на филмови по добиениот Оскар (int)
// вкупна заработка од тие филмови (double)
//
// За потребите на класата да се дефинираат:
//
// default конструктор
// конструктор кој прима објект од MovieActor и плус дополнителните информации
// конструктор кој ги прима сите аргументи (видете main)
// copy constructor, оператор =, деструктор
// метод oscarRating() кој го враќа рејтингот од пост-Оскар филмовите:
//
// (пост-оскарпросечнаоценка * 0.6) + (пост-оскарбројнафилмови * 0.1) + (пост-оскар_заработка * 0.3)
//
// Да се препокријат методите:
//
// rating() кој враќа просек од основниот и oscar рејтинг
// print() кој покрај основните информации за актерот печати и:
//
// Oscar Rating: [рејтинг]
// New Rating: [просечниот]

#include "iostream"
#include "cstring"
using namespace std;
class MovieActor{
protected:
    char *name;
    char country[41];
    double avgRating;
    int num; //vkupno filmovi
    double zarabotka;
public:
    MovieActor(){
        this->name= new char[1];
        this->name[0] = '\0';
        avgRating=0;
        num=0;
        zarabotka=0;
    }
    MovieActor(char *name, char *country, double avgRating, int num, double zarabotka){
        this->name=new char[strlen(name)+1];
        strcpy(this->name,name);
        strcpy(this->country,country);
        this->avgRating=avgRating;
        this->num=num;
        this->zarabotka=zarabotka;
    }
    MovieActor(const MovieActor &m){
        this->name=new char[strlen(m.name)+1];
        strcpy(this->name,m.name);
        strcpy(this->country,m.country);
        this->avgRating=m.avgRating;
        this->num=m.num;
        this->zarabotka=m.zarabotka;
    }
    ~MovieActor(){
        delete[]name;
    }
    MovieActor &operator = (const MovieActor &m){
        if (this!=&m){
            delete[]name;
            this->name=new char[strlen(m.name)+1];
            strcpy(this->name,m.name);
            strcpy(this->country,m.country);
            this->avgRating=m.avgRating;
            this->num=m.num;
            this->zarabotka=m.zarabotka;
        }
        return *this;
    }

    virtual double rating(){
        return (avgRating * 0.4) + (num * 0.2) + (zarabotka * 0.4);
    }
    virtual void print(){
        cout<<name<<" - "<<country<<endl;
        cout<<"Average rating: "<<avgRating<<endl;
        cout<<"Movies this year: "<<num<<endl;
        cout<<"Total earnings: "<<zarabotka<<endl;
        cout<<"Rating: "<<rating()<<endl;
    }
};
class OscarWinner:public MovieActor{
private:
    double postAvgRating;
    int postNumMovies;
    double postZarabotka;
public:
    OscarWinner():MovieActor(){
        this->postAvgRating=0;
        this->postNumMovies=0;
        this->postZarabotka=0;
    }
    OscarWinner(char *name, char *country, double avgRating, int num, double zarabotka,
                double postAvgRating, int postNumMovies, double postZarabotka ):MovieActor(name,country,avgRating,num,zarabotka){
        this->postAvgRating=postAvgRating;
        this->postNumMovies=postNumMovies;
        this->postZarabotka=postZarabotka;
    }
    OscarWinner(const MovieActor &m,double postAvgRating, int postNumMovies, double postZarabotka):MovieActor(m){
    }
    OscarWinner(const OscarWinner &m):MovieActor(m){
        this->postAvgRating=m.postAvgRating;
        this->postNumMovies=m.postNumMovies;
        this->postZarabotka=m.postZarabotka;
    }
    ~OscarWinner(){

    }
    OscarWinner &operator = (const OscarWinner &m){
        if (this!=&m){
            delete[]name;
            this->name=new char[strlen(m.name)+1];
            strcpy(this->name,m.name);
            strcpy(this->country,m.country);
            this->avgRating=m.avgRating;
            this->num=m.num;
            this->zarabotka=m.zarabotka;

            this->postAvgRating=m.postAvgRating;
            this->postNumMovies=m.postNumMovies;
            this->postZarabotka=m.postZarabotka;
        }
        return *this;
    }

    double oscarRating(){
        return (postAvgRating * 0.6) + (postNumMovies * 0.1) + (postZarabotka * 0.3);
    }

    virtual double rating(){
        return (MovieActor::rating() + oscarRating()) / 2;
    }

    virtual void print(){
        MovieActor::print();
        cout<<"Oscar Rating: "<<oscarRating()<<endl;
        cout<<"New Rating: "<<rating()<<endl;
    }
};


int main() {
    char name[100];
    char country[41];
    double avg_rating;
    int num_movies;
    double earnings;
    double post_avg_rating;
    int post_num_movies;
    double post_earnings;

    int n;
    cin >> n;

    if (n == 1) {
        // Test MovieActor basic functionality
        cout << "MOVIE ACTORS:" << endl;
        cout << "=====================================" << endl;
        int numActors;
        cin >> numActors;

        MovieActor* actors = new MovieActor[numActors];

        for (int i = 0; i < numActors; ++i) {
            cin >> name >> country >> avg_rating >> num_movies >> earnings;
            actors[i] = MovieActor(name, country, avg_rating, num_movies, earnings);
            actors[i].print();
            cout << "-------------------------" << endl;
        }

        delete[] actors;
    }
    else if (n == 2) {
        // Test MovieActor and create OscarWinner from it
        int numActors;
        cin >> numActors;

        MovieActor* actors = new MovieActor[numActors];
        OscarWinner* oscarWinners = new OscarWinner[numActors];

        for (int i = 0; i < numActors; ++i) {
            cin >> name >> country >> avg_rating >> num_movies >> earnings;
            cin >> post_avg_rating >> post_num_movies >> post_earnings;

            actors[i] = MovieActor(name, country, avg_rating, num_movies, earnings);
            oscarWinners[i] = OscarWinner(actors[i], post_avg_rating, post_num_movies, post_earnings);
        }

        cout << "MOVIE ACTORS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < numActors; ++i) {
            actors[i].print();
            cout << "-------------------------" << endl;
        }

        cout << "OSCAR WINNERS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < numActors; ++i) {
            oscarWinners[i].print();
            cout << "-------------------------" << endl;
        }

        delete[] actors;
        delete[] oscarWinners;
    }
    else if (n == 3) {
        // Test OscarWinner with all arguments constructor
        int numWinners;
        cin >> numWinners;

        OscarWinner* oscarWinners = new OscarWinner[numWinners];

        for (int i = 0; i < numWinners; ++i) {
            cin >> name >> country >> avg_rating >> num_movies >> earnings;
            cin >> post_avg_rating >> post_num_movies >> post_earnings;

            oscarWinners[i] = OscarWinner(name, country, avg_rating, num_movies, earnings,
                                          post_avg_rating, post_num_movies, post_earnings);
        }

        cout << "OSCAR WINNERS:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < numWinners; ++i) {
            oscarWinners[i].print();
            cout << "-------------------------" << endl;
        }

        delete[] oscarWinners;
    }
    else if (n == 4) {
        // Test copy constructor and operator= for MovieActor
        MovieActor actor1;
        cin >> name >> country >> avg_rating >> num_movies >> earnings;
        actor1 = MovieActor(name, country, avg_rating, num_movies, earnings);

        MovieActor actor2(actor1); // Using copy constructor
        MovieActor actor3;
        actor3 = actor1;           // Using operator=

        cout << "ORIGINAL:" << endl;
        actor1.print();
        cout << "-------------------------" << endl;

        cout << "COPY CONSTRUCTOR:" << endl;
        actor2.print();
        cout << "-------------------------" << endl;

        cout << "OPERATOR=:" << endl;
        actor3.print();
        cout << "-------------------------" << endl;
    }
    else if (n == 5) {
        // Test copy constructor and operator= for OscarWinner
        OscarWinner winner1;
        cin >> name >> country >> avg_rating >> num_movies >> earnings;
        cin >> post_avg_rating >> post_num_movies >> post_earnings;

        winner1 = OscarWinner(name, country, avg_rating, num_movies, earnings,
                              post_avg_rating, post_num_movies, post_earnings);

        OscarWinner winner2(winner1); // Using copy constructor
        OscarWinner winner3;
        winner3 = winner1;            // Using operator=

        cout << "ORIGINAL:" << endl;
        winner1.print();
        cout << "-------------------------" << endl;

        cout << "COPY CONSTRUCTOR:" << endl;
        winner2.print();
        cout << "-------------------------" << endl;

        cout << "OPERATOR=:" << endl;
        winner3.print();
        cout << "-------------------------" << endl;
    }

    return 0;
}
//
//
// Да се дефинира класа Movie за која ќе се чуваат:
//   - динамички алоцирана низа од карактери за насловот на филмот
//   - низа од максимум 30 карактери за жанрот (Action, Drama, Comedy, итн.)
//   - просечна оцена на филмот на платформата (double, скала 1-10)
//   - траење во минути (int)
//
// За потребите на класата да се дефинираат:
//   - default конструктор и конструктор со аргументи
//   - copy constructor и оператор =
//   - деструктор
//   - метод score() кој го враќа скорот на филмот, пресметан како:
//       70% од оцената + 30% од (траење / 30.0)
//   - метод print() кој го печати филмот во следниот формат:
//
//       [Наслов] ([Жанр])
//       Rating: [оцена]
//       Duration: [траење] min
//       Score: [скор]
//
//
// Од класата Movie да се изведе класата AwardMovie за која дополнително ќе се
// чуваат:
//   - низа од максимум 50 карактери за името на наградата (Oscar, BAFTA, итн.)
//   - годината во која е освоена наградата (int)
//   - бројот на номинации на тој филм (int)
//
// За потребите на класата да се дефинираат:
//   - default конструктор
//   - конструктор кој прима објект од Movie и дополнителните информации
//   - конструктор кој ги прима сите аргументи
//   - copy constructor, оператор =, деструктор
//   - метод awardScore() кој го враќа наградниот скор, пресметан како:
//       50% од (awardYear - 1900) / 100.0 + 50% од бројот на номинации
//   - да се препокријат методите:
//       score()  -- враќа просек од Movie::score() и awardScore()
//       print()  -- покрај основните информации, печати и:
//
//           Award: [наградаИме] ([година])
//           Nominations: [номинации]
//           Award Score: [awardScore]
//           New Score: [новиот score]
//
// ----------
//
//
// Define a class Movie that stores:
//   - a dynamically allocated character array for the movie title
//   - a character array of at most 30 characters for the genre (Action, Drama, ...)
//   - the average platform rating of the movie (double, scale 1-10)
//   - the runtime in minutes (int)
//
// The class must provide:
//   - a default constructor and a constructor with arguments
//   - a copy constructor and operator =
//   - a destructor
//   - a method score() that returns the movie score, calculated as:
//       70% of rating + 30% of (duration / 30.0)
//   - a method print() that outputs the movie in the following format:
//
//       Title (Genre)
//       Rating: rating
//       Duration: duration min
//       Score: score
//
//
// Derive the class AwardMovie from Movie. It additionally stores:
//   - a character array of at most 50 characters for the award name (Oscar, BAFTA, ...)
//   - the year the award was won (int)
//   - the total number of nominations the film received (int)
//
// The class must provide:
//   - a default constructor
//   - a constructor that accepts a Movie object plus the additional fields
//   - a constructor that accepts all arguments
//   - a copy constructor, operator =, destructor
//   - a method awardScore() that returns the award score, calculated as:
//       50% of (awardYear - 1900) / 100.0 + 50% of nominations
//   - overrides for:
//       score()  -- returns the average of Movie::score() and awardScore()
//       print()  -- in addition to the base information, also prints:
//
//           Award: awardName (year)
//           Nominations: nominations
//           Award Score: awardScore
//           New Score: new score
//
// For example:
// Input 	Result
//
// 1
// Inception Action 8.8 148
// Titanic Drama 7.9 194
// TheMatrix SciFi 8.7 136
// Interstellar SciFi 8.6 169
// Parasite Drama 8.5 132
//
//
//
// MOVIES:
// =====================================
// Inception (Action)
// Rating: 8.8
// Duration: 148 min
// Score: 7.64
// Titanic (Drama)
// Rating: 7.9
// Duration: 194 min
// Score: 7.47
// TheMatrix (SciFi)
// Rating: 8.7
// Duration: 136 min
// Score: 7.45
// Interstellar (SciFi)
// Rating: 8.6
// Duration: 169 min
// Score: 7.71
// Parasite (Drama)
// Rating: 8.5
// Duration: 132 min
// Score: 7.27

int main() {
    char title[100], genre[30], award[50];
    double rating;
    int duration, awardYear, nominations;
    int n;
    cin >> n;

    Movie *movies = new Movie[5];
    AwardMovie *aMovies = new AwardMovie[5];

    if (n == 1) {
        cout << "MOVIES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i) {
            cin >> title >> genre >> rating >> duration;
            movies[i] = Movie(title, genre, rating, duration);
            movies[i].print();
        }
    } else if (n == 2) {
        for (int i = 0; i < 5; ++i) {
            cin >> title >> genre >> rating >> duration;
            cin >> award >> awardYear >> nominations;
            movies[i] = Movie(title, genre, rating, duration);
            aMovies[i] = AwardMovie(movies[i], award, awardYear, nominations);
        }
        cout << "MOVIES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            movies[i].print();
        cout << "AWARD MOVIES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            aMovies[i].print();
    } else if (n == 3) {
        for (int i = 0; i < 5; ++i) {
            cin >> title >> genre >> rating >> duration;
            cin >> award >> awardYear >> nominations;
            aMovies[i] = AwardMovie(title, genre, rating, duration,
                                    award, awardYear, nominations);
        }
        cout << "AWARD MOVIES:" << endl;
        cout << "=====================================" << endl;
        for (int i = 0; i < 5; ++i)
            aMovies[i].print();
    }

    delete [] movies;
    delete [] aMovies;
    return 0;
}

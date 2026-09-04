#include <iostream>
#include <cstring>
using namespace std;

class ExistingGame {
public:
    void message() {
        cout << "The game is already in the collection" << endl;
    }
};

class Game {
protected:
    char gameName[101];
    float gamePrice;
    bool gameOnSale;

public:
    Game() {
        strcpy(gameName, "");
        gamePrice = 0;
        gameOnSale = false;
    }

    Game(char *gameName, float gamePrice, bool gameOnSale) {
        strcpy(this->gameName, gameName);
        this->gamePrice = gamePrice;
        this->gameOnSale = gameOnSale;
    }

    virtual ~Game() {
    }

    friend istream &operator>>(istream &in, Game &g) {
        in.get();
        in.getline(g.gameName, 101);
        in >> g.gamePrice >> g.gameOnSale;
        return in;
    }

    friend ostream &operator<<(ostream &out, const Game &g) {
        out << "Game: " << g.gameName << ", regular price: $" << g.gamePrice;
        if (g.gameOnSale) {
            out << ", bought on sale";
        }
        return out;
    }

    bool operator==(const Game &other) const {
        return strcmp(gameName, other.gameName) == 0;
    }

    virtual float totalPrice() const {
        return gamePrice;
    }

    virtual Game *clone() const {
        return new Game(*this);
    }
};

class SubscriptionGame : public Game {
private:
    float monthlyFee;
    int month, year;

public:
    SubscriptionGame() : Game() {
        monthlyFee = 0;
        month = 0;
        year = 0;
    }

    SubscriptionGame(char *gameName, float gamePrice, bool gameOnSale,
                     float monthlyFee, int month, int year)
        : Game(gameName, gamePrice, gameOnSale) {
        this->monthlyFee = monthlyFee;
        this->month = month;
        this->year = year;
    }

    friend istream &operator>>(istream &in, SubscriptionGame &g) {
        in.get();
        in.getline(g.gameName, 101);
        in >> g.gamePrice >> g.gameOnSale;
        in >> g.monthlyFee >> g.month >> g.year;
        return in;
    }

    friend ostream &operator<<(ostream &out, const SubscriptionGame &g) {
        out << "Game:: " << g.gameName << ", regular price: $" << g.gamePrice;
        if (g.gameOnSale) {
            out << ", bought on sale";
        }
        out << ", monthly fee: $" << g.monthlyFee << ", purchased: "
                << g.month << "-" << g.year;
        return out;
    }

    float totalPrice() const override {
        return gamePrice + monthlyFee;
    }

    Game *clone() const override {
        return new SubscriptionGame(*this);
    }
};

class User {
private:
    char username[101];
    Game **games;
    int n;

public:
    User(char *username) {
        strcpy(this->username, username);
        games = nullptr;
        n = 0;
    }

    User(const User &other) {
        strcpy(this->username, other.username);
        n = other.n;
        games = new Game *[n];
        for (int i = 0; i < n; ++i) {
            games[i] = other.games[i]->clone();
        }
    }

    User &operator=(const User &other) {
        if (this != &other) {
            for (int i = 0; i < n; ++i)
                delete games[i];
            delete[] games;

            strcpy(this->username, other.username);
            n = other.n;
            games = new Game *[n];
            for (int i = 0; i < n; ++i) {
                games[i] = other.games[i]->clone();
            }
        }
        return *this;
    }

    ~User() {
        for (int i = 0; i < n; ++i)
            delete games[i];
        delete[] games;
    }

    User &operator+=(Game &g) {
        for (int i = 0; i < n; ++i) {
            if (*games[i] == g)
                throw ExistingGame();
        }

        Game **temp = new Game *[n + 1];
        for (int i = 0; i < n; ++i)
            temp[i] = games[i];
        temp[n++] = g.clone();

        delete[] games;
        games = temp;

        return *this;
    }

    friend ostream &operator<<(ostream &out, const User &u) {
        //        out<<endl;
        out << "User: " << u.username << endl;
        for (int i = 0; i < u.n; ++i) {
            out << "- " << *u.games[i] << endl;
        }
        return out;
    }

    float total_spent() const {
        float sum = 0;
        for (int i = 0; i < n; ++i) {
            sum += games[i]->totalPrice();
        }
        return sum;
    }
};

int main() {
    int test_case_num;

    cin >> test_case_num;

    // for Game
    char game_name[100];
    float game_price;
    bool game_on_sale;

    // for SubscritionGame
    float sub_game_monthly_fee;
    int sub_game_month, sub_game_year;

    // for User
    char username[100];
    int num_user_games;

    if (test_case_num == 1) {
        cout << "Testing class Game and operator<< for Game" << std::endl;
        cin.get();
        cin.getline(game_name, 100);
        //cin.get();
        cin >> game_price >> game_on_sale;

        Game g(game_name, game_price, game_on_sale);

        cout << g;
    } else if (test_case_num == 2) {
        cout << "Testing class SubscriptionGame and operator<< for SubscritionGame" << std::endl;
        cin.get();
        cin.getline(game_name, 100);

        cin >> game_price >> game_on_sale;

        cin >> sub_game_monthly_fee;
        cin >> sub_game_month >> sub_game_year;

        SubscriptionGame sg(game_name, game_price, game_on_sale, sub_game_monthly_fee, sub_game_month, sub_game_year);
        cout << sg;
    } else if (test_case_num == 3) {
        cout << "Testing operator>> for Game" << std::endl;
        Game g;

        cin >> g;

        cout << g;
    } else if (test_case_num == 4) {
        cout << "Testing operator>> for SubscriptionGame" << std::endl;
        SubscriptionGame sg;

        cin >> sg;

        cout << sg;
    } else if (test_case_num == 5) {
        cout << "Testing class User and operator+= for User" << std::endl;
        cin.get();
        cin.getline(username, 100);
        User u(username);

        int num_user_games;
        int game_type;
        cin >> num_user_games;

        try {
            for (int i = 0; i < num_user_games; ++i) {
                cin >> game_type;

                Game *g;
                // 1 - Game, 2 - SubscriptionGame
                if (game_type == 1) {
                    cin.get();
                    cin.getline(game_name, 100);

                    cin >> game_price >> game_on_sale;
                    g = new Game(game_name, game_price, game_on_sale);
                } else if (game_type == 2) {
                    cin.get();
                    cin.getline(game_name, 100);

                    cin >> game_price >> game_on_sale;

                    cin >> sub_game_monthly_fee;
                    cin >> sub_game_month >> sub_game_year;
                    g = new SubscriptionGame(game_name, game_price, game_on_sale, sub_game_monthly_fee, sub_game_month,
                                             sub_game_year);
                }

                //cout<<(*g);


                u += (*g);
            }
        } catch (ExistingGame &ex) {
            ex.message();
        }

        cout << u;

        //    cout<<"\nUser: "<<u.get_username()<<"\n";

        //    for (int i=0; i < u.get_games_number(); ++i){
        //        Game * g;
        //        SubscriptionGame * sg;
        //        g = &(u.get_game(i));

        //        sg = dynamic_cast<SubscriptionGame *> (g);

        //        if (sg){
        //          cout<<"- "<<(*sg);
        //        }
        //        else {
        //          cout<<"- "<<(*g);
        //        }
        //        cout<<"\n";
        //    }
    } else if (test_case_num == 6) {
        cout << "Testing exception ExistingGame for User" << std::endl;
        cin.get();
        cin.getline(username, 100);
        User u(username);

        int num_user_games;
        int game_type;
        cin >> num_user_games;

        for (int i = 0; i < num_user_games; ++i) {
            cin >> game_type;

            Game *g;
            // 1 - Game, 2 - SubscriptionGame
            if (game_type == 1) {
                cin.get();
                cin.getline(game_name, 100);

                cin >> game_price >> game_on_sale;
                g = new Game(game_name, game_price, game_on_sale);
            } else if (game_type == 2) {
                cin.get();
                cin.getline(game_name, 100);

                cin >> game_price >> game_on_sale;

                cin >> sub_game_monthly_fee;
                cin >> sub_game_month >> sub_game_year;
                g = new SubscriptionGame(game_name, game_price, game_on_sale, sub_game_monthly_fee, sub_game_month,
                                         sub_game_year);
            }

            //cout<<(*g);

            try {
                u += (*g);
            } catch (ExistingGame &ex) {
                ex.message();
            }
        }

        cout << u;

        //      for (int i=0; i < u.get_games_number(); ++i){
        //          Game * g;
        //          SubscriptionGame * sg;
        //          g = &(u.get_game(i));

        //          sg = dynamic_cast<SubscriptionGame *> (g);

        //          if (sg){
        //            cout<<"- "<<(*sg);
        //          }
        //          else {
        //            cout<<"- "<<(*g);
        //          }
        //          cout<<"\n";
        //      }
    } else if (test_case_num == 7) {
        cout << "Testing total_spent method() for User" << std::endl;
        cin.get();
        cin.getline(username, 100);
        User u(username);

        int num_user_games;
        int game_type;
        cin >> num_user_games;

        for (int i = 0; i < num_user_games; ++i) {
            cin >> game_type;

            Game *g;
            // 1 - Game, 2 - SubscriptionGame
            if (game_type == 1) {
                cin.get();
                cin.getline(game_name, 100);

                cin >> game_price >> game_on_sale;
                g = new Game(game_name, game_price, game_on_sale);
            } else if (game_type == 2) {
                cin.get();
                cin.getline(game_name, 100);

                cin >> game_price >> game_on_sale;

                cin >> sub_game_monthly_fee;
                cin >> sub_game_month >> sub_game_year;
                g = new SubscriptionGame(game_name, game_price, game_on_sale, sub_game_monthly_fee, sub_game_month,
                                         sub_game_year);
            }

            //cout<<(*g);


            u += (*g);
        }

        cout << u;

        cout << "Total money spent: $" << u.total_spent() << endl;
    }
}

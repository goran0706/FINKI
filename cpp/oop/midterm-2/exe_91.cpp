// Implement a class for online podcasts subscription (Podcast), that contains information on: (5 поени)
//
//     podcast name (array of max 100 characters)
//     a podcast url (a maximum of 1000 characters)
//     cost for streaming (real number)
//     discount with which the podcast subscription was purchased (an integer from 0 to 100).
//
// The StreamingPodcast class is derived from the Podcast class, that will additionally store: (5 поени)
//
//     monthly fee for streaming (real number).
//     date when the subscription was purchased (month and year as positive integers)
//
// Overload the print (<<) and read (>>) operators for the Podcast and StreamingPodcast classes. (10 поени)
//
// Overload the operator == that will compare the podcasts of any type according to their url. (5 поени)
//
// Define a Playlist class with the following information: (5 поени)
//
//     the playlist name (a maximum of 100 characters)
//     a collection of podcasts that are purchased by the user (dynamically allocated array of pointers to Podcast)
//     total number of pointers (integer).
//
// Overload the += operator that will enable adding a new podcast to the playlist collection. (5 поени) In addition, if the user has already added the same podcast, an exception of type 'ExistingPodcast' should be thrown. An appropriate constructor and method for printing a message on the screen should be provided for the ExistingPodcast class. (5 поени)
//
// Create a total_spent() method in the Playlist class that will calculate how much money is spent on the given playlist. If the podcast is purchased with a discount, the appropriate price should be calculated. If the podcast is of type 'StreamingPodcast', it is necessary to calculate the amount spent for the monthly fee (number of months times price per month). (10 поени)
//
// Overload the operator << to print the playlist information, in the following format: (5 поени)
//
// Playlist: Programming
// Podcast: Developer Tea
// URL: https://spec.fm/podcasts/developer-tea
// regular price: $10
// Podcast: The Game Studio
// URL: https://spec.fm/podcasts/game-studio
// regular price: $20, monthly fee: $1.5, purchased: 1-2018
// ...
//
// For example:
// Input 	Result
//
// 3
// The Game Studio
// https://spec.fm/podcasts/game-studio
// 20
// 50
//
//
//
// Testing operator&gt;&gt; for Podcast
// Podcast: The Game Studio
// URL: https://spec.fm/podcasts/game-studio
// regular price: $20, bought on discount

#include <iostream>
#include <cstring>

using namespace std;

class ExistingPodcast {
private:
  char msg[256];

public:
  ExistingPodcast(char msg_txt[]) {
    strncpy(this->msg, msg_txt, 255);
    this->msg[255] = '\0';
  }

  void message() {
    std::cout << this->msg << std::endl;
  }
};

class Podcast {
protected:
  char name[100];
  float price;
  int discount;
  char url[1000];

public:
  Podcast() {
    name[0] = '\0';
    url[0] = '\0';
  }

  Podcast(char *n, char *u, float p, int d = 0) {
    strncpy(name, n, 99);
    this->name[99] = '\0';

    strncpy(url, u, 999);
    this->url[999] = '\0';

    price = p;

    discount = d;
  }

  virtual float get_price() {
    return price * (1.0 - (this->discount / 100.0));
  }

  bool operator==(Podcast &p) {
    return !strcmp(this->url, p.url);
  }

  friend ostream &operator<<(ostream &, const Podcast &);

  friend istream &operator>>(istream &, Podcast &);
};

class StreamingPodcast : public Podcast {
protected:
  float monthly_fee;
  int month, year;

public:
  StreamingPodcast() {
    name[0] = '\0';
    url[0] = '\0';
  }

  StreamingPodcast(char *n, char *u, float p, bool s, float mf, int m, int y) : Podcast(n, u, p, s),
    monthly_fee(mf),
    month(m),
    year(y) {
  }

  float get_price() {
    float p = Podcast::get_price();

    int months = 0;
    if (year < 2018) {
      months = (12 - this->month) + (2017 - year) * 12 + 5;
    } else {
      months = 5 - this->month;
    }

    p += months * monthly_fee;

    return p;
  }

  friend ostream &operator<<(ostream &, StreamingPodcast &);

  friend istream &operator>>(istream &, StreamingPodcast &);
};

ostream &operator<<(ostream &o, const Podcast &p) {
  o << "Podcast: " << p.name << "\nURL: " << p.url
      << "\nregular price: $" << p.price;

  if (p.discount) {
    o << ", bought on discount";
  }
  return o;
}

ostream &operator<<(ostream &o, StreamingPodcast &sp) {
  Podcast *tmp = dynamic_cast<Podcast *>(&sp);

  o << *tmp;

  o << ", monthly fee: $" << sp.monthly_fee
      << ", purchased: " << sp.month << "-" << sp.year << std::endl;

  return o;
}

istream &operator>>(istream &is, Podcast &p) {
  is.get();
  is.getline(p.name, 100);
  is.getline(p.url, 1000);
  //cin.get();
  is >> p.price >> p.discount;

  return is;
}

istream &operator>>(istream &is, StreamingPodcast &sp) {
  is.get();
  is.getline(sp.name, 100);
  is.getline(sp.url, 1000);
  is >> sp.price >> sp.discount;
  is >> sp.monthly_fee >> sp.month >> sp.year;
  return is;
}

class Playlist {
private:
  void obj_copy(const Playlist *orig, Playlist *cpy) {
    strcpy(cpy->name, orig->name);
    cpy->num_podcasts = orig->num_podcasts;

    cpy->podcasts = new Podcast *[cpy->num_podcasts];

    for (int i = 0; i < cpy->num_podcasts; ++i) {
      cpy->podcasts[i] = new Podcast(*(orig->podcasts[i]));
    }
  }

protected:
  char name[100];
  Podcast **podcasts;
  int num_podcasts;

public:
  Playlist(char const *const n = "") {
    strncpy(this->name, n, 99);
    this->name[99] = '\0';
    podcasts = 0;
    num_podcasts = 0;
  }

  Playlist(const Playlist &orig) {
    obj_copy(&orig, this);
  }

  ~Playlist() {
    for (int i = 0; i < this->num_podcasts; ++i) {
      delete this->podcasts[i];
    }
    delete [] podcasts;
  }

  Playlist &operator=(Playlist &orig) {
    if (&orig != this) {
      for (int i = 0; i < this->num_podcasts; ++i) {
        delete orig.podcasts[i];
      }

      delete [] orig.podcasts;

      obj_copy(&orig, this);
    }
    return *this;
  }

  Playlist &operator+=(Podcast &g) {
    Podcast **new_podcasts = new Podcast *[this->num_podcasts + 1];

    //cout<<this->num_games<<std::endl;

    for (int i = 0; i < (this->num_podcasts); ++i) {
      if ((*(this->podcasts[i])) == g) {
        throw ExistingPodcast("The podcast is already in the collection");
      }

      new_podcasts[i] = podcasts[i];
    }

    for (int i = 0; i < (this->num_podcasts); ++i) {
      new_podcasts[i] = podcasts[i];
    }

    StreamingPodcast *sg = dynamic_cast<StreamingPodcast *>(&g);

    if (sg) {
      //cout<<"SubGame"<<endl;
      new_podcasts[num_podcasts] = new StreamingPodcast(*sg);
    } else {
      //cout<<"Game"<<endl;
      new_podcasts[num_podcasts] = new Podcast(g);
    }

    delete [] this->podcasts;
    this->podcasts = new_podcasts;
    this->num_podcasts++;

    return *this;
  }

  Podcast &get_podcast(int i) {
    return (*(this->podcasts[i]));
  }

  float total_spent() {
    float sum = 0.0f;
    for (int i = 0; i < this->num_podcasts; ++i) {
      sum += podcasts[i]->get_price();
    }
    return sum;
  }

  char const *const get_name() {
    return this->name;
  }

  int get_podcast_number() {
    return this->num_podcasts;
  }
};

ostream &operator<<(ostream &o, Playlist &u) {
  o << "\nPlaylist: " << u.get_name() << "\n";

  for (int i = 0; i < u.get_podcast_number(); ++i) {
    Podcast *g;
    StreamingPodcast *sg;
    g = &(u.get_podcast(i));

    sg = dynamic_cast<StreamingPodcast *>(g);

    if (sg) {
      cout << (*sg);
    } else {
      cout << (*g);
    }
    cout << "\n";
  }
  return o;
}

int main() {
  int test_case_num;

  cin >> test_case_num;

  // for Podcast
  char podcast_name[100];
  char podcast_url[1000];
  float podcast_price;
  int podcast_discount;

  // for StreamingPodcast
  float sub_podcast_monthly_fee;
  int sub_podcast_month, sub_podcast_year;

  // for Playlist
  char name[100];
  int num_podcasts_in_playlist;

  if (test_case_num == 1) {
    cout << "Testing class Podcast and operator<< for Podcast" << std::endl;
    cin.get();
    cin.getline(podcast_name, 100);
    cin.getline(podcast_url, 1000);
    //cin.get();
    cin >> podcast_price >> podcast_discount;

    Podcast p(podcast_name, podcast_url, podcast_price, podcast_discount);

    cout << p;
  } else if (test_case_num == 2) {
    cout << "Testing class StreamingPodcast and operator<< for StreamingPodcast" << std::endl;
    cin.get();
    cin.getline(podcast_name, 100);
    cin.getline(podcast_url, 1000);
    //cin.get();
    cin >> podcast_price >> podcast_discount;

    cin >> sub_podcast_monthly_fee;
    cin >> sub_podcast_month >> sub_podcast_year;

    StreamingPodcast sp(podcast_name, podcast_url, podcast_price, podcast_discount, sub_podcast_monthly_fee,
                        sub_podcast_month, sub_podcast_year);
    cout << sp;
  } else if (test_case_num == 3) {
    cout << "Testing operator>> for Podcast" << std::endl;
    Podcast p;

    cin >> p;

    cout << p;
  } else if (test_case_num == 4) {
    cout << "Testing operator>> for StreamingPodcast" << std::endl;
    StreamingPodcast sp;

    cin >> sp;

    cout << sp;
  } else if (test_case_num == 5) {
    cout << "Testing class Playlist and operator+= for Playlist" << std::endl;
    cin.get();
    cin.getline(name, 100);
    Playlist u(name);

    int num_user_podcasts;
    int podcast_type;
    cin >> num_user_podcasts;

    try {
      for (int i = 0; i < num_user_podcasts; ++i) {
        cin >> podcast_type;

        Podcast *g;
        // 1 - Game, 2 - SubscriptionGame
        if (podcast_type == 1) {
          cin.get();
          cin.getline(podcast_name, 100);
          cin.getline(podcast_url, 1000);

          cin >> podcast_price >> podcast_discount;
          g = new Podcast(podcast_name, podcast_url, podcast_price, podcast_discount);
        } else if (podcast_type == 2) {
          cin.get();
          cin.getline(podcast_name, 100);
          cin.getline(podcast_url, 1000);

          cin >> podcast_price >> podcast_discount;

          cin >> sub_podcast_monthly_fee;
          cin >> sub_podcast_month >> sub_podcast_year;
          g = new StreamingPodcast(podcast_name, podcast_url, podcast_price, podcast_discount, sub_podcast_monthly_fee,
                                   sub_podcast_month, sub_podcast_year);
        }

        //cout<<(*g);


        u += (*g);
      }
    } catch (ExistingPodcast &ex) {
      ex.message();
    }

    cout << u;
  } else if (test_case_num == 6) {
    cout << "Testing exception ExistingPodcast for Playlist" << std::endl;
    cin.get();
    cin.getline(name, 100);
    Playlist u(name);

    int num_podcasts_in_playlist;
    int podcast_type;
    cin >> num_podcasts_in_playlist;

    for (int i = 0; i < num_podcasts_in_playlist; ++i) {
      cin >> podcast_type;

      Podcast *g;
      // 1 - Game, 2 - SubscriptionGame
      if (podcast_type == 1) {
        cin.get();
        cin.getline(podcast_name, 100);
        cin.getline(podcast_url, 1000);

        cin >> podcast_price >> podcast_discount;
        g = new Podcast(podcast_name, podcast_url, podcast_price, podcast_discount);
      } else if (podcast_type == 2) {
        cin.get();
        cin.getline(podcast_name, 100);
        cin.getline(podcast_url, 1000);

        cin >> podcast_price >> podcast_discount;

        cin >> sub_podcast_monthly_fee;
        cin >> sub_podcast_month >> sub_podcast_year;
        g = new StreamingPodcast(podcast_name, podcast_url, podcast_price, podcast_discount, sub_podcast_monthly_fee,
                                 sub_podcast_month, sub_podcast_year);
      }

      //cout<<(*g);

      try {
        u += (*g);
      } catch (ExistingPodcast &ex) {
        ex.message();
      }
    }

    cout << u;
  } else if (test_case_num == 7) {
    cout << "Testing total_spent method() for Playlist" << std::endl;
    cin.get();
    cin.getline(name, 100);
    Playlist u(name);

    int num_podcasts_in_playlist;
    int podcast_type;
    cin >> num_podcasts_in_playlist;

    for (int i = 0; i < num_podcasts_in_playlist; ++i) {
      cin >> podcast_type;

      Podcast *g;
      // 1 - Game, 2 - SubscriptionGame
      if (podcast_type == 1) {
        cin.get();
        cin.getline(podcast_name, 100);
        cin.getline(podcast_url, 1000);

        cin >> podcast_price >> podcast_discount;
        g = new Podcast(podcast_name, podcast_url, podcast_price, podcast_discount);
      } else if (podcast_type == 2) {
        cin.get();
        cin.getline(podcast_name, 100);
        cin.getline(podcast_url, 1000);

        cin >> podcast_price >> podcast_discount;

        cin >> sub_podcast_monthly_fee;
        cin >> sub_podcast_month >> sub_podcast_year;
        g = new StreamingPodcast(podcast_name, podcast_url, podcast_price, podcast_discount, sub_podcast_monthly_fee,
                                 sub_podcast_month, sub_podcast_year);
      }

      //cout<<(*g);

      try {
        u += (*g);
      } catch (ExistingPodcast &ex) {
        ex.message();
      }
    }

    cout << u;

    cout << "Total money spent: $" << u.total_spent() << endl;
  }
}

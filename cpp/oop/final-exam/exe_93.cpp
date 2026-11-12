#include <iostream>
#include <cstring>
using namespace std;

class MonthlyInvoice {
protected:
    char username[101];
    int userNumber;
    float basic_price;
    int spent_gigabytes;

public:
    virtual float total_price() const = 0; // Pure virtual function
    virtual ~MonthlyInvoice() {
    }

    MonthlyInvoice(const char *username = "", int userNumber = 0, float basic_price = 0, int spent_gigabytes = 0) {
        strcpy(this->username, username);
        this->userNumber = userNumber;
        this->basic_price = basic_price;
        this->spent_gigabytes = spent_gigabytes;
    }

    friend ostream &operator<<(ostream &os, const MonthlyInvoice &invoice) {
        os << invoice.userNumber << " - " << invoice.username << ", " << invoice.basic_price << endl;
        return os;
    }
};

class BusinessInvoice : public MonthlyInvoice {
private:
    bool optical; // True for optical, false for cable
    int free_gigabytes;

public:
    BusinessInvoice(const char *username = "", int userNumber = 0, float basic_price = 0, int spent_gigabytes = 0,
                    bool optical = false, int free_gigabytes = 0)
        : MonthlyInvoice(username, userNumber, basic_price, spent_gigabytes), optical(optical),
          free_gigabytes(free_gigabytes) {
    }

    float total_price() const override {
        float total = basic_price;
        if (optical) {
            total *= 1.5;
        }
        int extra_gb = spent_gigabytes - free_gigabytes;
        if (extra_gb > 0) {
            total += extra_gb * 100;
        }
        return total;
    }

    BusinessInvoice &operator++(int) {
        spent_gigabytes++;
        return *this;
    }

    // friend ostream& operator<<(ostream& os, const BusinessInvoice& b) {
    //     os << b.userNumber << " - " << b.username << ", " << b.basic_price << endl;
    //     os << (b.optical ? "optical link," : "cable link,") << " " << b.spent_gigabytes - b.free_gigabytes << endl;
    //     return os;
    // }

    friend ostream &operator<<(ostream &os, const BusinessInvoice &b) {
        os << b.userNumber << " - " << b.username << ", " << b.basic_price << endl;
        if (b.optical) {
            os << "optical link, ";
        } else {
            os << "cable link, ";
        }

        // Ensure the spent_gigabytes and free_gigabytes difference is not negative
        int extra_gb = b.spent_gigabytes - b.free_gigabytes;
        if (extra_gb < 0) {
            extra_gb = 0;
        }

        os << extra_gb << endl;
        return os;
    }
};

class PrivateInvoice : public MonthlyInvoice {
private:
    char identification[13];
    int *movie_sizes;
    int num_movies;

public:
    PrivateInvoice(const char *username = "", int userNumber = 0, float basic_price = 0, int spent_gigabytes = 0)
        : MonthlyInvoice(username, userNumber, basic_price, spent_gigabytes), num_movies(0), movie_sizes(nullptr) {
    }

    ~PrivateInvoice() {
        delete[] movie_sizes;
    }

    float total_price() const override {
        int movie_size_total = 0;
        for (int i = 0; i < num_movies; i++) {
            movie_size_total += movie_sizes[i];
        }
        return basic_price + spent_gigabytes * 50 + movie_size_total * 10;
    }

    PrivateInvoice &operator+=(int movie_size) {
        int *new_array = new int[num_movies + 1];
        for (int i = 0; i < num_movies; i++) {
            new_array[i] = movie_sizes[i];
        }
        new_array[num_movies] = movie_size;
        delete[] movie_sizes;
        movie_sizes = new_array;
        num_movies++;
        return *this;
    }

    PrivateInvoice &operator++(int) {
        spent_gigabytes++;
        return *this;
    }

    int &operator[](int index) {
        if (index >= 0 && index < num_movies) {
            return movie_sizes[index];
        }
        static int invalid = -1;
        return invalid;
    }

    friend ostream &operator<<(ostream &os, const PrivateInvoice &p) {
        os << p.userNumber << " - " << p.username << ", " << p.basic_price << endl;
        os << p.spent_gigabytes << endl;
        os << p.num_movies << "";
        int total_movie_size = 0;
        for (int i = 0; i < p.num_movies; i++) {
            total_movie_size += p.movie_sizes[i];
        }
        os << ", " << total_movie_size << endl;
        return os;
    }

    int getMoviesNo() {
        return num_movies;
    }
};

MonthlyInvoice &biggestInvoice(MonthlyInvoice **mi, int num_invoices) {
    float max_price = mi[0]->total_price();
    MonthlyInvoice *max_invoice = mi[0];
    for (int i = 1; i < num_invoices; ++i) {
        float current_price = mi[i]->total_price();
        if (current_price > max_price) {
            max_price = current_price;
            max_invoice = mi[i];
        }
    }
    return *max_invoice;
}


int main() {
    int test_case;
    char username[101];
    int userNumber;
    float basic_price;
    int spent_gigabytes;
    bool optical;
    int free_gigabytes;
    int num_inc;

    cin >> test_case;
    if (test_case == 1) {
        // Test Case Business Invoice - Constructor, operator <<
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        cin >> optical >> free_gigabytes;
        BusinessInvoice bi(username, userNumber, basic_price, spent_gigabytes, optical, free_gigabytes);
        cout << "BusinessInvoice Created:\n";
        cout << bi;
    } else if (test_case == 2) {
        // Test Case Business Invoice - Constructor, operators <<, ++
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        cin >> optical >> free_gigabytes;
        BusinessInvoice bi(username, userNumber, basic_price, spent_gigabytes, optical, free_gigabytes);
        cout << "BusinessInvoice:\n";
        cout << bi;
        cout << "testing operator++\n";

        // Additional spent gigabytes
        cin >> num_inc;
        for (int i = 0; i < num_inc; ++i) {
            bi++;
        }
        cout << bi;
    } else if (test_case == 3) {
        // Test Case Business Invoice - Constructor, total_price, operators <<, ++,
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        cin >> optical >> free_gigabytes;
        BusinessInvoice bi(username, userNumber, basic_price, spent_gigabytes, optical, free_gigabytes);
        cout << "Testing total_price()\n";
        cout << bi;
        cout << bi.total_price() << endl;
        bi++;
        cout << bi;
        cout << bi.total_price() << endl;
    } else if (test_case == 4) {
        // Test Case Private Invoice - Constructor, operator <<
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;

        PrivateInvoice pi(username, userNumber, basic_price, spent_gigabytes);
        cout << "Private Invoice Created:\n";
        cout << pi;
    } else if (test_case == 5) {
        // Test Case Private Invoice - Constructor, operators <<, ++
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        PrivateInvoice pi(username, userNumber, basic_price, spent_gigabytes);
        cin >> num_inc;
        for (int i = 0; i < num_inc; ++i) {
            pi++;
        }
        cout << pi;
    } else if (test_case == 6) {
        // Test Case Private Invoice - Constructor, operators <<, +=
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        PrivateInvoice pi(username, userNumber, basic_price, spent_gigabytes);
        cin >> num_inc;
        int film_length;
        for (int i = 0; i < num_inc; ++i) {
            cin >> film_length;
            pi += film_length;
        }
        cout << pi;
    } else if (test_case == 7) {
        // Test Case Private Invoice - Constructor, operators <<, +=, []
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        PrivateInvoice pi(username, userNumber, basic_price, spent_gigabytes);
        cin >> num_inc;
        int film_length;
        for (int i = 0; i < num_inc; ++i) {
            cin >> film_length;
            pi += film_length;
        }
        cout << pi;
        cout << "Movie sizes: [";
        for (int i = 0; i < pi.getMoviesNo(); ++i) {
            cout << pi[i] << " ";
        }
        cout << "]" << endl;
    } else if (test_case == 8) {
        // Test Case Private Invoice - Constructor, total_price
        cin >> username >> userNumber >> basic_price >> spent_gigabytes;
        PrivateInvoice pi(username, userNumber, basic_price, spent_gigabytes);
        cout << pi;
        cout << pi.total_price() << endl;
        cin >> num_inc;
        int film_length;
        for (int i = 0; i < num_inc; ++i) {
            cin >> film_length;
            pi += film_length;
        }
        cin >> num_inc;
        for (int i = 0; i < num_inc; ++i) {
            pi++;
        }
        cout << pi;
        cout << pi.total_price() << endl;
    } else if (test_case == 9) {
        // Test Case

        int num_invoices;
        int invoice_type;

        cin >> num_invoices;
        MonthlyInvoice **mi = new MonthlyInvoice *[num_invoices];
        for (int j = 0; j < num_invoices; ++j) {
            cin >> invoice_type;
            if (invoice_type == 1) {
                cin >> username >> userNumber >> basic_price >> spent_gigabytes;
                cin >> optical >> free_gigabytes;
                BusinessInvoice *bip;
                bip = new BusinessInvoice(username, userNumber, basic_price, spent_gigabytes, optical, free_gigabytes);
                cin >> num_inc;
                for (int i = 0; i < num_inc; ++i) {
                    (*(bip))++;
                }
                cout << *(bip);
                cout << bip->total_price() << endl;

                mi[j] = bip;
            }
            if (invoice_type == 2) {
                cin >> username >> userNumber >> basic_price >> spent_gigabytes;
                PrivateInvoice *pip = new PrivateInvoice(username, userNumber, basic_price, spent_gigabytes);
                cin >> num_inc;
                int film_length;
                for (int i = 0; i < num_inc; ++i) {
                    cin >> film_length;
                    (*pip) += film_length;
                }
                cin >> num_inc;
                for (int i = 0; i < num_inc; ++i) {
                    (*pip)++;
                }
                cout << (*pip);
                cout << pip->total_price() << endl;
                mi[j] = pip;
            }
        }

        cout << "The biggest invoice is:\n";
        MonthlyInvoice &invoice = biggestInvoice(mi, num_invoices);

        MonthlyInvoice *m = &invoice;
        BusinessInvoice *bip;
        PrivateInvoice *pip;
        if (dynamic_cast<BusinessInvoice *>(m)) {
            bip = dynamic_cast<BusinessInvoice *>(m);
            cout << *bip << bip->total_price();
        }
        if (dynamic_cast<PrivateInvoice *>(m)) {
            pip = dynamic_cast<PrivateInvoice *>(m);
            cout << *pip << pip->total_price();
        }
    }
    return 0;
}

#include <iostream>
#include "fstream"
using namespace std;

class NoProductFoundException {
private:
    string category;

public:
    NoProductFoundException(string category) {
        this->category = category;
    }

    void message() {
        cout << "No products from category " << category << " were found in the store" << endl;
    }
};

class Product {
private:
    string name;
    string category;
    int price;
    int quantity;

public:
    Product(string name = "", string category = "", int price = 0, int quantity = 0) {
        this->name = name;
        this->category = category;
        this->price = price;
        this->quantity = quantity;
    }

    int totalPrice() {
        return price * quantity;
    }

    friend ostream &operator<<(ostream &out, Product &p) {
        out << p.name << " (" << p.category << ") " << p.quantity << " x " << p.price << " = " << p.totalPrice();
        return out;
    }

    friend ifstream &operator >>(ifstream &in, Product &p) {
        //        in.get();
        getline(in, p.name);
        getline(in, p.category);
        in >> p.price;
        in >> p.quantity;
        in.ignore();
        return in;
    }

    string getCategory() {
        return category;
    }
};

class Store {
private:
    Product *products;
    int n;

public:
    Store() {
        products = nullptr;
        n = 0;
    }

    Store(Product *products, int n) {
        this->n = n;
        this->products = new Product[n];
        for (int i = 0; i < n; ++i) {
            this->products[i] = products[i];
        }
    }

    Store(const Store &s) {
        this->n = s.n;
        this->products = new Product[s.n];
        for (int i = 0; i < s.n; ++i) {
            this->products[i] = s.products[i];
        }
    }

    Store &operator =(const Store &s) {
        if (this != &s) {
            delete[]products;
            this->n = s.n;
            this->products = new Product[s.n];
            for (int i = 0; i < s.n; ++i) {
                this->products[i] = s.products[i];
            }
        }
        return *this;
    }

    Store &operator +=(const Product &s) {
        Product *tmp = new Product[n + 1];
        for (int i = 0; i < n; ++i) {
            tmp[i] = products[i];
        }
        tmp[n++] = s;
        delete[]products;
        products = tmp;
        return *this;
    }

    friend ostream &operator <<(ostream &out, const Store &s) {
        for (int i = 0; i < s.n; ++i) {
            out << s.products[i] << endl;
        }
        return out;
    }

    Store fromCategory(string &category) {
        Store tmp;
        for (int i = 0; i < n; ++i) {
            if (products[i].getCategory() == category) {
                tmp += products[i];
            }
        }
        if (tmp.products == nullptr) {
            throw NoProductFoundException(category);
        }
        return tmp;
    }
};

void wtf() {
    ofstream fout("input.txt");
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


    Store s;

    //TODO your code starts here
    //TODO Read the products from the file and add them in the store `s`
    ifstream fin("input.txt");
    ofstream fout("output1.txt");
    ofstream fout2("output2.txt");

    Product product;
    while (fin >> product) {
        s += product;
    }
    fout << s;
    fout.close();


    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT

    string category;
    cin >> category;

    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files output1.txt and output2.txt after this line
    try {
        fout2 << s.fromCategory(category);
    } catch (NoProductFoundException &e) {
        e.message();
    }


    //DO NOT MODIFY THE CODE BELLOW

    cout << "All products:" << endl;
    rff("output1.txt");
    cout << "Products from category " << category << ": " << endl;
    rff("output2.txt");


    return 0;
}

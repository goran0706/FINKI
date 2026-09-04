#include <iostream>
#include <cstring>
#include <fstream>
#include <vector>

using namespace std;

class NoProductFoundException : public exception {
private:
    string category;

public:
    NoProductFoundException(const string &category = "") {
        this->category = category;
    }

    void print() {
        cout << "No products from category " << category << " were found in the store" << endl;
    }
};

class Product {
private:
    string name;
    string category;
    int price;
    int number;

public:
    Product(const string &name = "", const string &category = "", int price = 0, int number = 0) {
        this->name = name;
        this->category = category;
        this->price = price;
        this->number = number;
    }

    Product(const Product &product) {
        this->name = product.name;
        this->category = product.category;
        this->price = product.price;
        this->number = product.number;
    }

    Product &operator=(const Product &product) {
        if (this != &product) {
            this->name = product.name;
            this->category = product.category;
            this->price = product.price;
            this->number = product.number;
        }
        return *this;
    }

    ~Product() {
    }

    friend ostream &operator<<(ostream &os, const Product &product) {
        //Coca-cola zero 1.75L (drinks) 100 x 80 = 8000
        os << product.name << " (" << product.category << ") " << product.number << " x " << product.price << " = " <<
                product.totalPrice() << endl;
        return os;
    }

    int totalPrice() const {
        return price * number;
    }

    string getCategory() {
        return category;
    }
};

class Store {
private:
    Product *array;
    int n;

public:
    Store(const Product *p = nullptr, int n = 0) {
        this->n = n;
        this->array = new Product[n];
        for (int i = 0; i < n; i++) {
            if (p) {
                this->array[i] = p[i];
            } else {
                this->array[i] = Product();
            }
        }
    }

    Store(const vector<Product> &products) {
        n = products.size();
        array = new Product[n];
        for (int i = 0; i < n; i++) {
            this->array[i] = products[i];
        }
    }

    Store &operator=(const Store &product) {
        if (this != &product) {
            delete [] array;
            this->n = product.n;
            this->array = new Product[n];
            for (int i = 0; i < n; i++) {
                this->array[i] = product.array[i];
            }
        }
        return *this;
    }

    ~Store() {
        delete[] array;
    }

    Store &operator +=(Product &product) {
        Product *temp = new Product [n + 1];
        for (int i = 0; i < n; i++) {
            temp[i] = array[i];
        }
        temp[n] = product;
        n++;
        delete[] array;
        array = temp;
        return *this;
    }

    friend ostream &operator<<(ostream &os, const Store &store) {
        for (int i = 0; i < store.n; i++) {
            os << store.array[i];
        }
        return os;
    }

    //solved without vectors
    // Store fromCategory(string &category) {
    //     int counter = 0;
    //     Product *temp = new Product[n + 1];
    //     for (int i = 0; i < n; i++) {
    //         if (array[i].getCategory() == category) {
    //             temp[counter] = array[i];
    //             counter++;
    //         }
    //     }
    //     if (counter == 0) {
    //         delete[] temp;
    //         throw NoProductFoundException(category);
    //     }
    //     return {temp, counter};
    // }
    //solved with vectors, but need an extra constructor so we can directly return the vector
    Store fromCategory(string &category) {
        vector<Product> products;
        for (int i = 0; i < n; i++) {
            if (array[i].getCategory() == category) {
                products.push_back(array[i]);
            }
        }

        if (products.size() == 0) {
            throw NoProductFoundException(category);
        }

        return {products};
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
    ifstream in("input.txt");
    //TODO your code starts here
    //TODO Read the products from the file and add them in the store s
    string line;
    while (getline(in, line)) {
        if (line == "----") {
            break;
        }
        string name;
        string category;
        int price;
        int number;
        name = line;
        getline(in, category);
        in >> price;
        in >> number;
        in.ignore();
        Product p = Product(name, category, price, number);
        s += p;
    }

    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
    string category;
    cin >> category;

    //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT

    //TODO Save the results in the files output1.txt and output2.txt after this line

    ofstream fout("output1.txt");
    fout << s;
    ofstream fout2("output2.txt");
    Store temp;
    try {
        temp = s.fromCategory(category);
        fout2 << temp << endl;
    } catch (NoProductFoundException &e) {
        e.print();
    }
    //DO NOT MODIFY THE CODE BELLOW

    cout << "All products:" << endl;
    rff("output1.txt");
    cout << "Products from category " << category << ": " << endl;
    rff("output2.txt");


    return 0;
}

--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
--
-

// #include <iostream>
// #include <cstring>
// #include <fstream>
// using namespace std;
//
// class Product {
// private:
//     string name;
//     string category;
//     int price;
//     int available;
//
// public:
//     Product(const string &name = "", const string &category = "", int price = 0, int available = 0) {
//         this->name = name;
//         this->category = category;
//         this->price = price;
//         this->available = available;
//     }
//
//     friend ostream &operator <<(ostream &os, const Product &product) {
//         //Coca-cola zero 1.75L (drinks) 100 x 80 = 8000
//         os << product.name << " (" << product.category << ") " << product.available << " x " << product.price << " = "
//                 << product.totalPrice() << endl;
//         return os;
//     }
//
//     int totalPrice() const {
//         return price * available;
//     }
//
//     bool isSameCategory(const string &cat) {
//         return category == cat;
//     }
// };
//
// class NoProductFoundException : public exception {
// private:
//     string category;
//
// public:
//     NoProductFoundException(const string &category = "") {
//         this->category = category;
//     }
//
//     void print() {
//         cout << "No products from category " << category << " were found in the store" << endl;
//     }
//
//     //“No products from category {category} were found in the store”
// };
//
// class Store {
// private:
//     Product *array;
//     int n;
//
// public:
//     Store(const Product *array = nullptr, int n = 0) {
//         this->n = n;
//         this->array = new Product [n];
//         for (int i = 0; i < n; i++) {
//             if (array) {
//                 this->array[i] = array[i];
//             } else {
//                 this->array[i] = Product();
//             }
//         }
//     }
//
//     Store(const Store &other) {
//         this->n = other.n;
//         this->array = new Product [n];
//         for (int i = 0; i < n; i++) {
//             this->array[i] = other.array[i];
//         }
//     }
//
//     Store &operator =(const Store &other) {
//         if (this != &other) {
//             delete [] this->array;
//             this->n = other.n;
//             this->array = new Product [n];
//             for (int i = 0; i < n; i++) {
//                 this->array[i] = other.array[i];
//             }
//         }
//         return *this;
//     }
//
//     ~Store() {
//         delete [] this->array;
//     }
//
//     Store &operator+=(const Product &product) {
//         Product *temp = new Product [n + 1];
//         for (int i = 0; i < n; i++) {
//             temp[i] = this->array[i];
//         }
//         temp[n] = product;
//         delete [] this->array;
//         this->array = temp;
//         n++;
//         return *this;
//     }
//
//     friend ostream &operator <<(ostream &os, const Store &product) {
//         for (int i = 0; i < product.n; i++) {
//             os << product.array[i];
//         }
//         return os;
//     }
//
//     Store fromCategory(string &category) {
//         Store temp;
//         int counter = 0;
//         for (int i = 0; i < n; i++) {
//             if (array[i].isSameCategory(category)) {
//                 temp += array[i];
//                 counter++;
//             }
//         }
//         if (counter == 0) {
//             throw NoProductFoundException(category);
//         }
//         return temp;
//     }
//
//     // Store fromCategory (string & category) {
//     //     int counter = 0;
//     //     for (int i=0;i<n;i++) {
//     //         if (array[i].isSameCategory(category)) {
//     //             counter++;
//     //         }
//     //         else {
//     //             for (int j=i;j<n-1;j++) {
//     //                 array[j]=array[j+1];
//     //             }
//     //             n--;
//     //             i--;
//     //         }
//     //     }
//     //     if (counter == 0) {
//     //         throw NoProductFoundException(category);
//     //     }
//     //     return *this;
//     // }
// };
//
// void wtf() {
//     ofstream fout("input.txt");
//     string line;
//     while (getline(std::cin, line)) {
//         if (line == "----") {
//             break;
//         }
//         fout << line << endl;
//     }
// }
//
// void rff(string path) {
//     ifstream fin(path);
//     string line;
//     while (getline(fin, line)) {
//         cout << line << endl;
//     }
// }
//
//
// int main() {
//     wtf();
//
//
//     Store s;
//
//     //TODO your code starts here
//     //TODO Read the products from the file and add them in the store `s`
//
//     ifstream fin("input.txt");
//     //name cat price available
//     if (!fin.is_open()) {
//         cout << "Error in opening input.txt " << endl;
//         return 1;
//     }
//     string name;
//     int i = 0;
//     Product array[20];
//     while (getline(fin, name) && name != "----") {
//         string category;
//         int price;
//         int available;
//         getline(fin, category);
//         fin >> price;
//         fin >> available;
//         fin.ignore();
//         array[i] = Product(name, category, price, available);
//         i++;
//         //Product temp = Product(name,category,price,available);
//         //s+=temp;
//     }
//     fin.close();
//     for (int j = 0; j < i; j++) {
//         s += array[j];
//     }
//     //DO NOT MODIFY THE CODE BETWEEN THIS AND THE NEXT COMMENT
//
//     string category;
//     cin >> category;
//
//     //DO NOT MODIFY THE CODE BETWEEN THIS AND THE PREVIOUS COMMENT
//
//     //TODO Save the results in the files output1.txt and output2.txt after this line
//
//     ofstream fout("output1.txt");
//     if (!fout.is_open()) {
//         cout << "Error in opening output1.txt " << endl;
//         return 1;
//     }
//     fout << s;
//     fout.close();
//     Store temp;
//     ofstream fout2("output2.txt");
//     if (!fout2.is_open()) {
//         cout << "Error in opening output2.txt " << endl;
//         return 1;
//     }
//     try {
//         temp = s.fromCategory(category);
//         //s.fromCategory(category);
//     } catch (NoProductFoundException &e) {
//         e.print();
//     }
//     fout2 << temp;
//     fout2.close();
//     //DO NOT MODIFY THE CODE BELLOW
//
//     cout << "All products:" << endl;
//     rff("output1.txt");
//     cout << "Products from category " << category << ": " << endl;
//     rff("output2.txt");
//
//
//     return 0;
// }

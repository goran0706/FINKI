//
// Created by Huhe on 4/6/2025.
//
//Дадена е класа Product во која се чува id и цена на продукт, соодветен конструктор и метода за печатење.
//
//Да се дефинира класа DiscountProduct која наследува од класата Product и која вклучува целобројна променлива за процент на попуст.  Процентот на попустот мора да е вредност поголема од 0% и помала од 100%,  во спротивно попустот поставете го на 10%.
//
//За класата DiscountProduct да се дефинира
//
//соодветен конструктор
//метод float calculatePrice() со којшто се пресметува цената на продуктот со попуст
//        метод за печатење void print(), којшто го печати id-то на продуктот, неговата цена и попуст
#include <iostream>

using namespace std;

class Product {
protected:
    string id;
    float price;
public:
    Product(string id = "PROD-123456", float price = 10.0) : id(id), price(price) {}

    ~Product() {}

    void print() {
        cout << id << " " << price << " ";
    }
};
class DiscountProduct:public Product{
public:
    int popust;
public:
    explicit DiscountProduct(string id = "PROD-123456", float price = 10.0,int popust=0): Product(id,price) {
        if (popust>0 && popust<100){
            this->popust=popust;
        }else{
            this->popust=10;
        }
    }
    float calculatePrice(){
        return price-(price * popust/100) ;
    }
    void print(){
        cout<<id<<" "<<price<<" "<<popust<<endl;
    }
};



DiscountProduct *createDicsProducts(int n) {
    DiscountProduct *discProducts = new DiscountProduct[n];
    string id;
    float price;
    int disc;
    for (int i = 0; i < n; i++) {
        cin >> id >> price >> disc;
        discProducts[i] = DiscountProduct(id, price, disc);
    }
    return discProducts;
}


int main() {
    int testCase;
    cin >> testCase;

    switch (testCase) {
        case 1 : {
            DiscountProduct discountProduct;
            discountProduct.print();
            break;
        }
        case 2 : {
            DiscountProduct discountProduct("CS101", 50, 5);
            discountProduct.print();
            DiscountProduct discountProduct1("CS102", 70, 10);
            discountProduct1.print();
            break;
        }
        case 3 : {
            DiscountProduct discountProduct("CS101", 50, 105);
            discountProduct.print();
            DiscountProduct discountProduct1("CS102", 70, 0);
            discountProduct1.print();
            break;
        }
        case 4: {
            DiscountProduct discountProduct("CS101", 40, 20);
            cout << discountProduct.calculatePrice();
            break;
        }
        case 5: {
            int n;
            cin >> n;
            DiscountProduct *discountProducts = createDicsProducts(n);
            for (int i = 0; i < n; i++) {
                discountProducts[i].print();
            }
            delete [] discountProducts;
            break;
        }
        default: {
            int n;
            cin >> n;

            DiscountProduct *discountProducts = createDicsProducts(n);
            for (int i = 0; i < n; i++) {
                discountProducts[i].print();
            }
            for (int i = 0; i < n; i++) {
                cout << discountProducts[i].calculatePrice() << endl;
            }
            delete [] discountProducts;
            break;
        }
    }
}

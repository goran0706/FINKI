/*
    Објектно ориентирано програмирање

    Аудиториска вежба 2 (Класи)
    
    1.Класи
    1.1 Дефиниција на класи

    class ime_na_klasata {
        private:
            // deklaracija na promenlivi i metodi koi ne se vidlivi nadvor od klasata

        public :
            // deklaracija na promenlivi i metodi koi se vidlivi nadvor od klasata
    };

    1.2. Креирање (инстанцирање) објекти

    Синтакса: ime_na_klasa ime_na_objekt;
    Пример ex1.cpp: Cuboid c(10, 15, 20);

    1.3. Животен циклус на објектите

    - Конструктор (Constructor) - посебен метод на секоја класа кој се повикува секогаш кога се креира (инстанцира) објект од класата
    - Деструктор (Destructor) - посебен метод на секоја класа кој се повикува кога треба да се ослободи меморијата која ја опфатил конструираниот објект
*/

class Cuboid {
private:
    int a, b, c;

public:
    // Default constructor
    Cuboid() {
        cout << "Default constructor" << endl;
    }

    // Constructor with arguments
    Cuboid(int aa, int bb, int cc) {
        a = aa;
        b = bb;
        c = cc;
        cout << "Constructor" << endl;
    }

    ~Cuboid() { cout << "Destructor" << endl; }
    // Method for computing area
    int area() {
        return 2 * (a * b + a * c + b * c);
    }

    // Method for computing volume
    int volume() {
        return a * b * c;
    }
};


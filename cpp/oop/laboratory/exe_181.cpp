// Да се дефинира класа Camera во која ќе се чуваат податоци за една камера:
//
//     модел (низа од карактери не подолга од 20 карактери)
//     мегапиксели (цел број)
//     година на производство (цел број)
//
// За класата да се дефинира:
//
//     default конструктор
//     конструктор со аргументи
//     copy конструктор
//     деструктор
//     get и set методи (доколку има потреба од истите)
//
// Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат:
//
// (модел) (мегапиксели)MP produced in: (година)
//
// Потоа да се дефинира класа Photographer во која се чуваат следните информации:
//
//     име (низа од карактери не подолга од 20 карактери)
//     презиме (низа од карактери не подолга од 20 карактери)
//     камера (објект од класа Camera)
//
// Да се креира:
//
//     default конструктор
//     конструктор со аргументи
//     деструктор
//     get и set методи (доколку има потреба од истите)
//
// Исто така да се дефинира функција за печатење на информации за класата која ќе печати во следниот формат:
//
// (име) (презиме) shoots with the camera: (информации за камерата)
//
// ДА НЕ СЕ МЕНУВА MAIN ФУНКЦИЈАТА!!!
//
// ---
//
// Define a class Camera that will store data for a camera:
//
//     model (a character array not longer than 20 characters)
//     megapixels (integer)
//     production year (integer)
//
// For this class define:
//
//     a default constructor
//     a constructor with arguments
//     a copy constructor
//     a destructor
//     get and set methods (only if needed)
//
// Also define a function that prints the information about the class in the following format:
//
// (model) (megapixels)MP produced in: (year)
//
// Then define a class Photographer that stores the following information:
//
//     first name (a character array not longer than 20 characters)
//     last name (a character array not longer than 20 characters)
//     camera (an object of class Camera)
//
// Create:
//
//     a default constructor
//     a constructor with arguments
//     a destructor
//     get and set methods (only if needed)
//
// Also define a function that prints the information about the class in the following format:
//
// (first name) (last name) shoots with the camera: (camera information)
//
// DO NOT MODIFY THE MAIN FUNCTION!!!
//
// For example:
// Input 	Result
//
// 1
// PanasonicGH5
// 20
// 2018
// Igor
// Igorovski
//
//
//
// Igor Igorovski shoots with the camera: PanasonicGH5 20MP, produced in: 2018
#include <iostream>
#include <cstring>

using namespace std;

//YOUR CODE HERE
class Camera {
private:
    char model[20]{};
    int megapixels;
    int year;

public:
    Camera() = default;

    Camera(const char *model, int megapixels, int year) {
        strcpy(this->model, model);
        this->megapixels = megapixels;
        this->year = year;
    }

    Camera(const Camera &camera) {
        strcpy(this->model, camera.model);
        this->megapixels = camera.megapixels;
        this->year = camera.year;
    }

    ~Camera() {
        // ??????? CLEAN UP FOR WHAT>???
    }


    [[nodiscard]] const char *getModel() const {
        return model;
    }

    [[nodiscard]] int getMegapixels() const {
        return megapixels;
    }

    [[nodiscard]] int getYear() const {
        return year;
    }

    void print() const {
        cout << model << " " << megapixels << "MP," << " produced in: " << year;
    }
};


class Photographer {
private:
    char firstName[20]{};
    char lastName[20]{};
    Camera camera;

public:
    Photographer() = default;

    Photographer(const char firstName[20], const char lastName[20], const Camera &camera) {
        strcpy(this->firstName, firstName);
        strcpy(this->lastName, lastName);
        this->camera = camera;
    }

    ~Photographer() {
        // ??????????
    }

    [[nodiscard]] const char *getFirstName() const {
        return firstName;
    }

    [[nodiscard]] const char *getLastName() const {
        return lastName;
    }

    [[nodiscard]] Camera getCamera() const {
        return camera;
    }

    void print() {
        cout << firstName << " " << lastName << " shoots with the camera: ";
        camera.print();
    }
};


//DO NOT CHANGE THE MAIN FUNCTION
int main() {
    char model[20];
    int megapixels;
    int year;
    char name[20];
    char surname[20];

    int testCase;

    cin >> testCase;

    cin >> model;
    cin >> megapixels;
    cin >> year;
    cin >> name;
    cin >> surname;

    if (testCase == 1) {
        Camera camera(model, megapixels, year);

        Photographer photographer(name, surname, camera);
        photographer.print();
    }

    if (testCase == 2) {
        Camera camera(Camera(model, megapixels, year));

        Photographer photographer(name, surname, camera);
        photographer.print();
    }
}

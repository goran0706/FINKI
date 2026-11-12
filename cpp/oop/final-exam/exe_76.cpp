#include <iostream>
#include <cstring>
using namespace std;

class Camera {
protected:
    char manifacturer[20];
    char model[20];
    int year;
    float resolution;

public:
    virtual float price() const = 0;

    virtual float rentalPrice(int days) const = 0;

    Camera(const char *manifacturer = "", const char *model = "", int year = 0, float resolution = 0) {
        strcpy(this->manifacturer, manifacturer);
        strcpy(this->model, model);
        this->year = year;
        this->resolution = resolution;
    }

    Camera(const Camera &camera) {
        strcpy(this->manifacturer, camera.manifacturer);
        strcpy(this->model, camera.model);
        this->year = camera.year;
        this->resolution = camera.resolution;
    }

    Camera &operator=(const Camera &camera) {
        if (this != &camera) {
            strcpy(this->manifacturer, camera.manifacturer);
            strcpy(this->model, camera.model);
            this->year = camera.year;
            this->resolution = camera.resolution;
        }
        return *this;
    }

    ~Camera() {
    }

    bool operator<(Camera &camera) {
        if (this->price() < camera.price()) {
            return true;
        } else {
            return false;
        }
    }

    char *getName() {
        return model;
    }
};

class PhotoCamera : public Camera {
private:
    bool RAW;

public:
    PhotoCamera(const char *manifacturer = "", const char *model = "", int year = 0, float resolution = 0,
                bool RAW = false) : Camera(manifacturer, model, year, resolution) {
        this->RAW = RAW;
    }

    PhotoCamera(const PhotoCamera &camera) {
        this->RAW = camera.RAW;
        strcpy(this->manifacturer, camera.manifacturer);
        strcpy(this->model, camera.model);
        this->year = camera.year;
        this->resolution = camera.resolution;
    }

    PhotoCamera &operator=(const PhotoCamera &camera) {
        if (this != &camera) {
            this->RAW = camera.RAW;
            strcpy(this->manifacturer, camera.manifacturer);
            strcpy(this->model, camera.model);
            this->year = camera.year;
            this->resolution = camera.resolution;
        }
        return *this;
    }

    ~PhotoCamera() {
    }

    float price() const override {
        int price = 100 + resolution * 20;
        if (RAW) {
            price = price + 50;
        }
        return price;
    }

    float rentalPrice(int days) const override {
        float perDay = price() / 100;
        if (days >= 7) {
            // perDay = perDay - ((perDay/100)*20);
            // perDay = perDay * days;
            perDay = perDay * days;
            //perDay = perDay - ((perDay/100)*20);
            perDay = perDay * 0.8;

            return perDay;
        } else {
            return perDay * days;
        }
    }
};

class VideoCamera : public Camera {
private:
    int length;

public:
    VideoCamera(const char *manifacturer = "", const char *model = "", int year = 0, float resolution = 0,
                int length = 0) : Camera(manifacturer, model, year, resolution) {
        this->length = length;
    }

    VideoCamera(const VideoCamera &camera) {
        strcpy(this->manifacturer, camera.manifacturer);
        strcpy(this->model, camera.model);
        this->year = camera.year;
        this->resolution = camera.resolution;
        this->length = camera.length;
    }

    VideoCamera &operator=(const VideoCamera &camera) {
        if (this != &camera) {
            strcpy(this->manifacturer, camera.manifacturer);
            strcpy(this->model, camera.model);
            this->year = camera.year;
            this->resolution = camera.resolution;
            this->length = camera.length;
        }
        return *this;
    }

    ~VideoCamera() {
    }

    float price() const override {
        float price = resolution * 80;
        if (length > 3600) {
            price = price + ((price / 100) * 40);
        }
        return price;
    }

    float rentalPrice(int days) const override {
        float perDay = price() / 100;
        if (days >= 7) {
            // perDay = perDay - ((perDay/100)*20);
            // perDay = perDay * days;
            perDay = perDay * days;
            //perDay = perDay - ((perDay/100)*20);
            perDay = perDay * 0.8;
            return perDay;
        } else {
            return perDay * days;
        }
    }
};

class FilmCamera : public Camera {
private:
    int fps;

public:
    FilmCamera(const char *manifacture = "", const char *model = "", int year = 0, float resolution = 0,
               int fps = 0) : Camera(manifacturer, model, year, resolution) {
        this->fps = fps;
    }

    FilmCamera(const FilmCamera &camera) {
        strcpy(this->manifacturer, camera.manifacturer);
        strcpy(this->model, camera.model);
        this->fps = camera.fps;
        this->resolution = camera.resolution;
        this->fps = camera.fps;
    }

    FilmCamera &operator=(const FilmCamera &camera) {
        if (this != &camera) {
            strcpy(this->manifacturer, camera.manifacturer);
            strcpy(this->model, camera.model);
            this->fps = camera.fps;
            this->resolution = camera.resolution;
            this->fps = camera.fps;
        }
        return *this;
    }

    ~FilmCamera() {
    }

    float price() const override {
        float price = 50000;
        if (fps > 30) {
            int diff = fps - 30;
            price = price + (diff * 5000);
        }
        return price;
    }

    float rentalPrice(int days) const override {
        float perDay = 500;
        if (fps > 60) {
            perDay = 1000;
        }
        return perDay * days;
    }
};

float production(Camera **c, int n, int days) {
    float total = 0;
    for (int i = 0; i < n; i++) {
        total = total + c[i]->rentalPrice(days);
    }
    return total;
}

char *mostExpensiveCamera(Camera **c, int n) {
    float max = 0;
    int index = 0;
    for (int i = 0; i < n; i++) {
        if (max < c[i]->price()) {
            max = c[i]->price();
            index = i;
        }
    }
    return c[index]->getName();
}

int main(int argc, char *argv[]) {
    // Variables for reading input
    char model[20], producer[20];
    int year, length, fps, n;
    float resolution;
    bool raw;

    int t;

    // Array of cameras
    Camera *c[10];

    // Read number of cameras
    cin >> n;

    for (int i = 0; i < n; ++i) {
        // Camera type: 1 - Photo, 2 - Video, 3 - Film
        cin >> t;

        if (t == 1) {
            cin >> producer >> model >> year >> resolution;
            cin >> raw;
            c[i] = new PhotoCamera(producer, model, year, resolution, raw);
        } else if (t == 2) {
            cin >> producer >> model >> year >> resolution;
            cin >> length;
            c[i] = new VideoCamera(producer, model, year, resolution, length);
        } else if (t == 3) {
            cin >> producer >> model >> year >> resolution;
            cin >> fps;
            c[i] = new FilmCamera(producer, model, year, resolution, fps);
        }
    }


    // Production days
    int days;
    cin >> days;


    cout << "Price of production is: " << production(c, n, days);
    cout << "\n" << "Most expensive camera used in production is: " << mostExpensiveCamera(c, n);


    return 0;
}

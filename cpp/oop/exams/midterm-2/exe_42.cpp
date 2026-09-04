#include <iostream>
#include <cstring>
#include <iomanip>
using namespace std;

class Image {
protected:
    char *name;
    char owner[50];
    int height;
    int width;

public:
    Image(const char *name = "untitled", const char *owner = "unknown", int width = 800, int height = 800) {
        this->name = new char[strlen(name) + 1];
        strcpy(this->name, name);
        strcpy(this->owner, owner);
        this->height = height;
        this->width = width;
    }

    Image(const Image &i) {
        name = new char[strlen(i.name) + 1];
        strcpy(name, i.name);
        strcpy(owner, i.owner);
        height = i.height;
        width = i.width;
    }

    Image &operator=(const Image &i) {
        if (this != &i) {
            delete[] name;
            name = new char[strlen(i.name) + 1];
            strcpy(name, i.name);
            strcpy(owner, i.owner);
            height = i.height;
            width = i.width;
        }
        return *this;
    }

    virtual ~Image() {
        delete[] name;
    }

    virtual double fileSize() const {
        return width * height * 3;
    }

    virtual Image *clone() const {
        return new Image(*this);
    }

    friend ostream &operator<<(ostream &os, const Image &i) {
        os << i.name << " " << i.owner << " " << fixed << setprecision(0) << i.fileSize() << endl;
        return os;
    }

    bool operator>(const Image &i) const {
        return fileSize() > i.fileSize();
    }
};

class TransparentImage : public Image {
private:
    bool supports;

public:
    TransparentImage(const char *name = "untitled", const char *owner = "unknown", int width = 800, int height = 800,
                     bool supports = true)
        : Image(name, owner, width, height), supports(supports) {
    }

    TransparentImage(const TransparentImage &ti) : Image(ti), supports(ti.supports) {
    }

    TransparentImage &operator=(const TransparentImage &ti) {
        if (this != &ti) {
            Image::operator=(ti);
            supports = ti.supports;
        }
        return *this;
    }

    double fileSize() const override {
        if (supports) {
            return width * height * 4;
        } else {
            return (width * height) + ((width * height) / 8.0);
        }
    }

    Image *clone() const override {
        return new TransparentImage(*this);
    }
};

class Folder {
private:
    char name[255];
    char owner[50];
    Image *array[100];
    int n;

    void copyFrom(const Folder &f) {
        strcpy(name, f.name);
        strcpy(owner, f.owner);
        n = f.n;
        for (int i = 0; i < n; ++i) {
            array[i] = f.array[i]->clone();
        }
    }

    void free() {
        for (int i = 0; i < n; ++i) {
            delete array[i];
        }
        n = 0;
    }

public:
    Folder(const char *name = "", const char *owner = "unknown") {
        strcpy(this->name, name);
        strcpy(this->owner, owner);
        n = 0;
    }

    Folder(const Folder &f) {
        copyFrom(f);
    }

    Folder &operator=(const Folder &f) {
        if (this != &f) {
            free();
            copyFrom(f);
        }
        return *this;
    }

    ~Folder() {
        free();
    }

    double folderSize() const {
        double total = 0;
        for (int i = 0; i < n; i++) {
            total += array[i]->fileSize();
        }
        return total;
    }

    Image *getMaxFile() const {
        if (n == 0) return nullptr;
        Image *max = array[0];
        for (int i = 1; i < n; i++) {
            if (*array[i] > *max) {
                max = array[i];
            }
        }
        return max;
    }

    Folder &operator+=(const Image &i) {
        if (n < 100) {
            array[n++] = i.clone(); // Correct: uses polymorphic clone
        }
        return *this;
    }

    friend ostream &operator<<(ostream &os, const Folder &f) {
        os << f.name << " " << f.owner << endl;
        os << "--" << endl;
        for (int i = 0; i < f.n; i++) {
            os << *f.array[i];
        }
        os << "--" << endl;
        os << "Folder size: " << f.folderSize() << endl;
        return os;
    }

    Image *operator[](int index) const {
        if (index < 0 || index >= n) return nullptr;
        return array[index];
    }
};

Folder max_folder_size(Folder *array, int n) {
    if (n == 0) return Folder();

    Folder maxFolder = array[0];
    double maxSize = array[0].folderSize();

    for (int i = 1; i < n; i++) {
        if (array[i].folderSize() > maxSize) {
            maxSize = array[i].folderSize();
            maxFolder = array[i];
        }
    }

    return maxFolder;
}

int main() {
    int tc; // Test Case

    char name[255];
    char user_name[51];
    int w, h;
    bool tl;

    cin >> tc;

    if (tc == 1) {
        // Testing constructor(s) & operator << for class File

        cin >> name;
        cin >> user_name;
        cin >> w;
        cin >> h;


        Image f1;

        cout << f1;

        Image f2(name);
        cout << f2;

        Image f3(name, user_name);
        cout << f3;

        Image f4(name, user_name, w, h);
        cout << f4;
    } else if (tc == 2) {
        // Testing constructor(s) & operator << for class TextFile
        cin >> name;
        cin >> user_name;
        cin >> w >> h;
        cin >> tl;

        TransparentImage tf1;
        cout << tf1;

        TransparentImage tf4(name, user_name, w, h, tl);
        cout << tf4;
    } else if (tc == 3) {
        // Testing constructor(s) & operator << for class Folder
        cin >> name;
        cin >> user_name;

        Folder f3(name, user_name);
        cout << f3;
    } else if (tc == 4) {
        // Adding files to folder
        cin >> name;
        cin >> user_name;

        Folder dir(name, user_name);

        Image *f;
        TransparentImage *tf;

        int sub, fileType;

        while (1) {
            cin >> sub; // Should we add subfiles to this folder
            if (!sub) break;

            cin >> fileType;
            if (fileType == 1) {
                // Reading File
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                f = new Image(name, user_name, w, h);
                dir += *f;
            } else if (fileType == 2) {
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                cin >> tl;
                tf = new TransparentImage(name, user_name, w, h, tl);
                dir += *tf;
            }
        }
        cout << dir;
    } else if (tc == 5) {
        // Testing getMaxFile for folder

        cin >> name;
        cin >> user_name;

        Folder dir(name, user_name);

        Image *f;
        TransparentImage *tf;

        int sub, fileType;

        while (1) {
            cin >> sub; // Should we add subfiles to this folder
            if (!sub) break;

            cin >> fileType;
            if (fileType == 1) {
                // Reading File
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                f = new Image(name, user_name, w, h);
                dir += *f;
            } else if (fileType == 2) {
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                cin >> tl;
                tf = new TransparentImage(name, user_name, w, h, tl);
                dir += *tf;
            }
        }
        cout << *(dir.getMaxFile());
    } else if (tc == 6) {
        // Testing operator [] for folder

        cin >> name;
        cin >> user_name;

        Folder dir(name, user_name);

        Image *f;
        TransparentImage *tf;

        int sub, fileType;

        while (1) {
            cin >> sub; // Should we add subfiles to this folder
            if (!sub) break;

            cin >> fileType;
            if (fileType == 1) {
                // Reading File
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                f = new Image(name, user_name, w, h);
                dir += *f;
            } else if (fileType == 2) {
                cin >> name;
                cin >> user_name;
                cin >> w >> h;
                cin >> tl;
                tf = new TransparentImage(name, user_name, w, h, tl);
                dir += *tf;
            }
        }

        cin >> sub; // Reading index of specific file
        cout << *dir[sub];
    } else if (tc == 7) {
        // Testing function max_folder_size
        int folders_num;

        Folder dir_list[10];

        Folder dir;
        cin >> folders_num;

        for (int i = 0; i < folders_num; ++i) {
            cin >> name;
            cin >> user_name;
            dir = Folder(name, user_name);


            Image *f;
            TransparentImage *tf;

            int sub, fileType;

            while (1) {
                cin >> sub; // Should we add subfiles to this folder
                if (!sub) break;

                cin >> fileType;
                if (fileType == 1) {
                    // Reading File
                    cin >> name;
                    cin >> user_name;
                    cin >> w >> h;
                    f = new Image(name, user_name, w, h);
                    dir += *f;
                } else if (fileType == 2) {
                    cin >> name;
                    cin >> user_name;
                    cin >> w >> h;
                    cin >> tl;
                    tf = new TransparentImage(name, user_name, w, h, tl);
                    dir += *tf;
                }
            }
            dir_list[i] = dir;
        }

        cout << max_folder_size(dir_list, folders_num);
    }
    return 0;
};

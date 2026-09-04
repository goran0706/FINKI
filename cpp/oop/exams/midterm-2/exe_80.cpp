// Да се креира класа која претставува слика (Image) во рамките на еден компјутер. За секоја датотека се чуваат (5 поени):
//
//     име на сликата (дин. алоцирана низа од знаци). Предефинирано поставено на untitled.
//     име на корисникот кој е сопственик на датотеката (низа од макс. 50 знаци). Предефинирано поставено на unknown.
//     димензии на сликата (2 цели броеви кои претставуваат ширина и висина во пиксели). Предефинирано поставени на 800.
//
// Од класата Imageда се изведе класата TransparentImage, која претставува слика која содржи поддржува транспарентност. За транспарентна слика дополнително се чува :
//
//     дали поддржува нивоа на транспарентност (bool променлива, предефинирано не поддржува транспарентност).
//
// За класите Image и TransparentImage да биде достапна метода (fileSize)за пресметка на големината на сликата (во бајти). Големината се пресметува на сл. начин (5 поени):
//
//     за објектите од класата Image, големината на датотеката е еднаква на:висината * ширината * 3.
//     за TransparentImage, доколку поддржува нивоа на транспарентност, големината на датотеката е еднаква на ширина * висина * 4. Доколку не поддржува транспарентност, големината на сликата се пресметува како ширина * висина + бр._на_пиксели_присутни_во_сликата / 8.
//
// За класите Image и TransparentImage да се преоптоварат следниве оператори (5 поени):
//
//     оператор << кој ги печати податоците од датотеката во сл. формат:
//
//     ime_fajl avtor golemina_na_fajlot_vo_bajti
//
//     оператор > кој ги споредува сликите според нивната големина.
//
// Да се дефинира класа Folder, што репрезентира директориум во кој може да се поставуваат слики. За секој фолдер се чува (5 поени):
//
//     име на фолдерот (низа од макс 255 знаци)
//     име на корисникот кој е сопственик на фолдерот (низа од макс. 50 знаци). Предефинирано поставено на unknown.
//     низа од покажувачи кон Image објекти (макс. 100 во рамките на еден фолдер).
//
// Да се имплементираат следниве методи (5 поени):
//
//     метода за пресметка на големината на фолдерот (folderSize). Големината на фолдерот е сума од големините од сите слики во рамките на фолдерот.
//
//     метода за пронаоѓање на наголемата слика во рамките на фолдерот (getMaxFile). Методата враќа покажувач кон најголемата слика во фолдерот (сметано во бајти).
//
// За класата Folder да се имплементира и оператор += кој додава објекти од типот Image/TransparentImage во рамките на фолдерот (5 поени).
//
// Да се креираат следниве функционалности за класите (5 поени):
//
//     operator << - со кој се печатат податоците за фолдерот во формат (5 поени):
//
//     ime_folder sopstvenik --
//         imeslika avtor goleminanafajlotvo_bajti
//         imeslika avtor goleminanafajlotvobajti -- goleminanafoldervo_bajti
//
//     operator [] - кој враќа покажувач кон соодветната слика во фолдерот. Доколку не постои слика на тој индекс, треба да се врати NULL (5 поени).
//
// Да се креира и глобална функција max_folder_size која го прима низа од објекти од типот Folder и го враќа фолдерот кој има зафаќа најмногу простор (во бајти). (5 поени)
//
// Да се овозможи правилно функционирање на класите (потребни set или get методи/оператори/конструктори/деструктори) според изворниот код кој е веќе зададен. Сите податочни членови на класите се protected. (5 поени)
//
// For example:
// Input 	Result
//
// 5
// folder
// user
// 1
// 2
// image1
// u1
// 100 100
// 1
// 1
// 2
// image1
// u1
// 100 100
// 0
// 0
//
//
//
// image1 u1 40000
//
// 7
// 3
// dd
// uu
// 1
// 1
// fileName1
// user1
// 50 50
// 1
// 2
// textfile
// pero
// 100 100
// 1
// 1
// 2
// textfile
// kiro
// 100 100
// 0
// 0
// directory2
// ana
// 1
// 1
// fajl
// ana
// 10 10
// 0
// oop
// alek
// 0
//
//
//
// dd uu
// --
// fileName1 user1 7500
// textfile pero 40000
// textfile kiro 11250
// --
// Folder size: 58750
//
// 4
// folder
// user
// 1
// 2
// image1
// u1
// 100 100
// 1
// 1
// 2
// image1
// u1
// 100 100
// 0
// 0
//
//
//
// folder user
// --
// image1 u1 40000
// image1 u1 11250
// --
// Folder size: 51250
//
// 1
// filename
// username
// 10
// 10
//
//
//
// untitled unknown 1920000
// filename unknown 1920000
// filename username 1920000
// filename username 300
//
// 3
// folder
// user
//
//
//
// folder user
// --
// --
// Folder size: 0
//
// 4
// folder
// user
// 1
// 1
// image1
// u1
// 1000 1000
// 1
// 1
// image1
// u1
// 100 100
// 0
//
//
//
// folder user
// --
// image1 u1 3000000
// image1 u1 30000
// --
// Folder size: 3030000
//
// 4
// folder
// user
// 1
// 1
// image1
// u1
// 100 100
// 1
// 2
// image1
// u1
// 10 10
// 0
// 0
//
//
//
// folder user
// --
// image1 u1 30000
// image1 u1 112
// --
// Folder size: 30112
//
// 6
// dirName
// user
// 1
// 1
// image1
// user1
// 100 100
// 1
// 2
// trasnparentImage
// pero
// 100 100
// 1
// 1
// 2
// trasparentImage2
// kiro
// 500 500
// 0
// 0
// 1
//
//
//
// trasnparentImage pero 40000
//
// 2
// transpImage
// user
// 10
// 10
// 0
//
//
//
// untitled unknown 2560000
// transpImage user 112
//
// 6
// dirName
// user
// 1
// 1
// image1
// user1
// 100 100
// 1
// 2
// trasnparentImage
// pero
// 100 100
// 1
// 1
// 2
// trasparentImage2
// kiro
// 500 500
// 0
// 0
// 2
//
//
//
// trasparentImage2 kiro 281250
//
// 5
// folder
// user
// 1
// 2
// image1
// u1
// 100 100
// 1
// 1
// 2
// image1
// u1
// 10 10
// 0
// 0
//
//
//
// image1 u1 40000

#include <iostream>
#include <cstdlib>
#include <cstring>

using namespace std;

// TODO...

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

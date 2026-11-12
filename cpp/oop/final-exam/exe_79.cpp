// #include <iostream>
// #include <cstring>
// #include <iomanip>
// using namespace std;
//
// struct Film {
//         char MovieTitle[100];
//         int Duration;
//         float Price;
//         bool Discount;
//
//         void print () {
//                 cout<<MovieTitle<<" "<<Duration<<" "<<fixed<<setprecision(2)<<Price<<endl;
//         }
// };
//
// struct FilmFestival {
//         char NameOfFestival [100];
//         char NameOfPlace [100];
//         Film array[100];
//         int n;
//
//         void print () {
//                 cout<<NameOfFestival<<" "<<NameOfPlace<<" "<<endl;
//                 for (int i = 0; i < n; i++) {
//                         array[i].print ();
//                 }
//         }
// };
//
// void BestFestival (FilmFestival *f, int n) {
// int totalDuration = 0, maxDuration = 0;
// int totalDiscount = 0, maxDiscount = 0;
// int index = 0;
// for (int i=0; i<n; i++) {
//         totalDuration=0;
//         totalDiscount=0;
//         for (int j=0; j<f[i].n;j++) {
//                 totalDuration += f[i].array[j].Duration;
//                         if (f[i].array[j].Discount == true) {
//                                 totalDiscount++;
//                         }
//                 }
//         if  (totalDiscount > maxDiscount) {
//                 maxDiscount = totalDiscount;
//                 index = i;
//                 maxDuration = totalDuration;
//         }
//         if (totalDiscount==maxDiscount && maxDuration < totalDuration) {
//                 maxDiscount = totalDiscount;
//                 index = i;
//                 maxDuration = totalDuration;
//         }
//         }
//         cout<<"Najdobar festival: "<<f[index].NameOfFestival<<" "<<f[index].NameOfPlace<<endl;
// }
//
// int main () {
//         FilmFestival festival[30];
//
//         int n;
//         cin>>n;
//
//         for (int i=0; i<n; i++) {
//                 cin>>festival[i].NameOfFestival;
//                 cin>>festival[i].NameOfPlace;
//                 cin>>festival[i].n;
//                 for (int j=0; j<festival[i].n; j++) {
//                         cin>>festival[i].array[j].MovieTitle;
//                         cin>>festival[i].array[j].Duration;
//                         cin>>festival[i].array[j].Price;
//                         cin>>festival[i].array[j].Discount;
//                 }
//         }
//
//         for (int i=0; i<n; i++) {
//                 festival[i].print ();
//         }
//
//         BestFestival(festival, n);
//
//
//         return 0;
// }

#include<stdio.h>


struct Film {
    char name[100];
    int time;
    float price;
    int discount; // Use int (0 or 1) instead of bool (not available in C)
};

struct FilmFestival {
    char name[100];
    char place[100];
    struct Film films[100];
    int no;
};

// Function to print a single Film
void printFilm(struct Film f) {
    printf("%s %d %.2f\n", f.name, f.time, f.price);
}

// Function to print a FilmFestival
void printFestival(struct FilmFestival ff) {
    printf("%s %s\n", ff.name, ff.place);
    for (int i = 0; i < ff.no; i++) {
        printFilm(ff.films[i]);
    }
}

// Function to determine the best festival
void BestFestival(struct FilmFestival *f, int n) {
    int totalDuration = 0, maxDuration = 0;
    int totalDiscount = 0, maxDiscount = 0;
    int index = 0;

    for (int i = 0; i < n; i++) {
        totalDuration = 0;
        totalDiscount = 0;

        for (int j = 0; j < f[i].no; j++) {
            totalDuration += f[i].films[j].time;
            if (f[i].films[j].discount == 1) {
                // Use 1 instead of true
                totalDiscount++;
            }
        }

        if (totalDiscount > maxDiscount) {
            maxDiscount = totalDiscount;
            index = i;
            maxDuration = totalDuration;
        } else if (totalDiscount == maxDiscount && totalDuration > maxDuration) {
            maxDuration = totalDuration;
            index = i;
        }
    }

    printf("Najdobar festival: %s %s\n", f[index].name, f[index].place);
}


int main() {
    int i, j, n, broj;
    struct FilmFestival ff[50];
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        /* name of the festival */
        scanf("%s", ff[i].name);
        /* place it is held */
        scanf("%s", ff[i].place);
        /* number of movies */
        scanf("%d", &ff[i].no);

        for (j = 0; j < ff[i].no; j++) {
            scanf("%s", ff[i].films[j].name); /* title of the movie */
            scanf("%d", &ff[i].films[j].time); /* duration */
            scanf("%f", &ff[i].films[j].price); /* price */
            scanf("%d", &ff[i].films[j].discount); /* discount */
        }
    }

    for (i = 0; i < n; ++i) {
        printFestival(ff[i]);
    }

    BestFestival(ff, n);


    return 0;
}

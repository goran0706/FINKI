// Implement a class SkiLift that stores the following information:
//
// name(char array 15)
// maximum number of users for one ride
// whether the lift is in function.
//
// Implement a class SkiCenter that stores the following information:
//
// name of the ski center (char array with max 20 character)
// the country(char array with max 20 chars)
// array of ski lifts(maximum 20 sifts)
// number of ski lifts.
//
// Implement a function:
//
// void biggestCapacity(SkiCenter *sc, int n)
//
// which will print the ski center with the biggest capacity for skiers at the same time. If there are two ski centers with the same capacity, print the one with more ski lifts. The printing should be in different lines (one for Name, one for Country, one for Capacity). When calculating the capacity, only consider the ski lifts that are in function!
//
// Write a main function where you read an integer N (maximum 100) representing the number of ski centers. Then read the data for each ski center, including the data for its ski lifts.
//
// Call the function biggestCapacity and print the result according to the described format.
//
// For example:
// Input 	Result
//
// 2
// Shapka
// Makedonija
// 5
// Teteks1
// 20
// 1
// Teteks2
// 50
// 0
// Ceripashina
// 100
// 0
// Jelak
// 10
// 1
// Aerodrom
// 36
// 1
// Bansko
// Bugarija
// 6
// Tomba
// 40
// 0
// Shiligarnika
// 80
// 1
// Banderitsa
// 70
// 1
// Todorka
// 36
// 1
// ChalinValog
// 24
// 0
// Plato
// 60
// 1
//
//
//
// Bansko
// Bugarija
// 246
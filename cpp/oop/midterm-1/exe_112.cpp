// Define a class Driver with fields for his name (char array of max 100) and time in seconds (integer). (5 points) Then define a class Race with fields for location (char array of max 100), number of drivers (integers) and an array of drivers (max 100). (5 points)
//
// Write a main function that will read the data for N races and for each race will print the top 3 drivers by their time in increasing order. (30 points)
//
// For the format of the input data and format of the output, see the sample input and sample output (the time is printed in two fixed places for minutes and two fixed places with leading zero for seconds, separated with :).
//
// For example:
// Input 	Result
//
// 6
// Location-1
// 20
// Sarah
// 966
// Natalie
// 1204
// Nicholas
// 422
// Nathan
// 294
// Elizabeth
// 1291
// Chloe
// 1299
// James
// 939
// Joshua
// 492
// Andrew
// 1595
// Alexis
// 1802
// Matthew
// 975
// Tyler
// 1551
// John
// 1207
// Ethan
// 1925
// Emma
// 1246
// Jacob
// 1822
// Ashley
// 1344
// Jonathan
// 878
// Grace
// 989
// Sophia
// 304
// Location-2
// 14
// Joshua
// 1365
// Sarah
// 1701
// Madison
// 512
// Isabella
// 1055
// Nathan
// 1305
// Alexis
// 231
// David
// 839
// Brianna
// 511
// Matthew
// 327
// Tyler
// 1095
// William
// 1469
// Jacob
// 1547
// John
// 1263
// Emily
// 398
// Location-3
// 13
// Madison
// 1954
// John
// 1197
// Jonathan
// 794
// Ryan
// 1307
// David
// 1532
// Brianna
// 738
// Natalie
// 677
// Joseph
// 1641
// Alexis
// 642
// Jacob
// 1410
// Nicholas
// 1391
// Ava
// 213
// Emily
// 1102
// Location-4
// 14
// Joshua
// 1099
// Sarah
// 380
// Natalie
// 925
// Nathan
// 1214
// Samantha
// 330
// Abigail
// 217
// Matthew
// 769
// Olivia
// 1305
// Jacob
// 1243
// Emma
// 1304
// Nicholas
// 1446
// Ava
// 890
// Sophia
// 332
// Emily
// 1634
// Location-5
// 8
// Emma
// 818
// Andrew
// 1124
// Alexis
// 729
// Brianna
// 1826
// Daniel
// 992
// Christopher
// 1378
// Abigail
// 1851
// Jacob
// 1523
// Location-6
// 20
// Isabella
// 610
// Chloe
// 539
// Hannah
// 1946
// Samantha
// 931
// Michael
// 1161
// Andrew
// 184
// Alexis
// 1809
// David
// 770
// Daniel
// 1671
// Matthew
// 1499
// Joseph
// 380
// Christopher
// 1140
// Ryan
// 1630
// James
// 428
// Jacob
// 865
// Olivia
// 1104
// John
// 911
// Grace
// 968
// Ava
// 768
// Alexander
// 834
//
//
//
// Location-1 (20 Drivers)
// 1. Nathan 4:54
// 2. Sophia 5:04
// 3. Nicholas 7:02
// Location-2 (14 Drivers)
// 1. Alexis 3:51
// 2. Matthew 5:27
// 3. Emily 6:38
// Location-3 (13 Drivers)
// 1. Ava 3:33
// 2. Alexis 10:42
// 3. Natalie 11:17
// Location-4 (14 Drivers)
// 1. Abigail 3:37
// 2. Samantha 5:30
// 3. Sophia 5:32
// Location-5 (8 Drivers)
// 1. Alexis 12:09
// 2. Emma 13:38
// 3. Daniel 16:32
// Location-6 (20 Drivers)
// 1. Andrew 3:04
// 2. Joseph 6:20
// 3. James 7:08

#include <iostream>
#include <cstring>
using namespace std;

int main() {
    int n;
    cin >> n;

    // read races
    for(int i = 0; i < n; i++) {

        // read location
        // read number of drivers

        // read drivers (name and time in seconds)

    }

    // printing format for time:
    // minutes = time / 60
    // seconds = time % 60
    // if seconds < 10 print a leading zero
    // example: 1:05

    return 0;
}
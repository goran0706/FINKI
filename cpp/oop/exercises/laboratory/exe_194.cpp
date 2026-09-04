/*
Gaming Console System

Креирајте апстрактна класа GamingDevice што опишува играчка конзола или уред.

Класата треба да содржи:

    Чисто виртуелни методи:
        calculatePowerUsage() – ја пресметува вкупната потрошувачка на енергија на уредот за време на употребата
        printInfo() – ги печати информациите за уредот

Податоци за секој уред:

    model – динамички алоцирана низа од карактери
    brand – низа со максимум 50 знаци
    basePower – основна потрошувачка на енергија во вати (float)

-----------------------------------------------------

Од оваа класа произлегуваат две класи:

HighPerformanceConsole -> Претставува моќни играчки конзоли.

Дополнителни податоци:

    gpuUnits – број на GPU процесорски единици (int)

Пресметка на потрошувачката на енергија:

Ако конзолата има повеќе од 10 GPU единици, секоја дополнителна единица над 10 ја зголемува потрошувачката на енергија за 15W

-----------------------------------------------------

PortableConsole -> Претставува преносни уреди за игри.

Дополнителни податоци:

    hasCoolingSystem – булова вредност

Пресметка на потрошувачката на енергија:
Ако уредот има систем за ладење, вкупната потрошувачка на енергија се зголемува за 25W

-----------------------------------------------------

Формат на печатење:

За HighPerformanceConsole :

[model], [brand], [gpuUnits] - [total power usage]

За PortableConsole :

[model], [brand], [cooling system] - [total power usage]

(За cooling system испечатете: YES / NO)

-----------------------------------------------------

Дефинирајте глобална функција:

float mostPowerHungryDevice(GamingDevice *devices[], int n)

Функцијата:

    прима низа од покажувачи кон GamingDevice и големина на таа низа
    го наоѓа уредот со најголема потрошувачка за енергија
    ги печати своите информации користејќи printInfo()
    ја враќа неговата потрошувачка на енергија

Create an abstract class GamingDevice that describes a gaming console or device.

The class should contain:

    Pure virtual methods:
        calculatePowerUsage() – calculates total power consumption of the device during use
        printInfo() – prints device information

Data members for each device:

    model – dynamically allocated array of chars
    brand – array with maximum 50 characters
    basePower – base power consumption in watts (float)

-----------------------------------------------------

From this class derive two classes:

HighPerformanceConsole -> Represents powerful gaming consoles.

Additional data:

    gpuUnits – number of GPU processing units (int)

Power usage calculation:

If the console has more than 10 GPU units,
each additional unit above 10 increases power consumption by 15W

-----------------------------------------------------

PortableConsole -> Represents handheld gaming devices.

Additional data:

    hasCoolingSystem – boolean

Power usage calculation:

If the device has a cooling system, total power consumption increases by 25W

-----------------------------------------------------

Printing format

For HighPerformanceConsole:

[model], [brand], [gpuUnits] - [total power usage]

For PortableConsole:

[model], [brand], [cooling system] - [total power usage]

(For cooling system print: YES / NO)

-----------------------------------------------------

Define Global function

float mostPowerHungryDevice(GamingDevice *devices[], int n)

The function:

    receives an array of pointers to GamingDevice and size of the array
    finds the device with the highest power consumption
    prints its information using printInfo()
    returns its power usage

For example:
Input 	Result

3
1
PS5
Sony
200
12
2
Switch
Nintendo
100
1
1
Xbox
Microsoft
180
8



PS5, Sony, 12 - 230

2
2
SteamDeck
Valve
120
1
2
PSP
Sony
80
0



SteamDeck, Valve, YES - 145
*/
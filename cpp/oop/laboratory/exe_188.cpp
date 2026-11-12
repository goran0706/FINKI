/*
Да се дефинира класа DeliveryVehicle која претставува комбе или камион за достава. Се чуваат име на моделот, регистарска ознака и податоците потребни за пресметки на гориво: капацитет на резервоарот (литри), потрошувачка (литри на 100 km) и цена на гориво (по литар).

Да се дефинираат следните виртуелни методи:

    double fuelCostPer100km() — ја враќа цената за изминување на 100 km, пресметана како consumption × fuelPrice.
    int maxRangeKm() — враќа колку далеку може возилото да оди со полн резервоар: tankCapacity / consumption × 100.
    string vehicleType() — враќа ознака, на пр. "Diesel".

Да се изведе класа ElectricVehicle која не користи резервоар за гориво. Наместо тоа чува капацитет на батерија (kWh), потрошувачка на електрична енергија (kWh на 100 km) и цена на електрична енергија (по kWh). Да се препокријат сите три методи така што пресметките да ги користат електричните вредности, а vehicleType() да враќа "Electric".

Да се дефинира класа Fleet со име на компанијата и бројач. Таа ги има следните методи:

    void registerVehicle(DeliveryVehicle &v) — ги печати типот, моделот, регистарската ознака, цената за гориво на 100 km и максималниот опсег на возилото, и го зголемува бројачот. (Истиот образец на полиморфизам преку референца како во задача 1.1.)
    DeliveryVehicle* mostEfficient(DeliveryVehicle **vehicles, int n) — прима низа од покажувачи и го враќа возилото со најниска fuelCostPer100km(). Низата може да содржи мешавина од објекти од класите DeliveryVehicle и ElectricVehicle — токму поради тоа мора да бидат покажувачи, а не вредности.
    int totalFleetRangeKm(DeliveryVehicle **vehicles, int n) — ги собира резултатите од maxRangeKm() за сите возила во низата.
    DeliveryVehicle* findForTrip(DeliveryVehicle **vehicles, int n, int tripKm) — го враќа првото возило во низата чиј опсег може да покрие tripKm, или nullptr ако ниту едно возило не може.

--

Define a class DeliveryVehicle representing a delivery van or truck. It stores a model name, a plate number, and the data needed for fuel calculations: tank capacity (liters), consumption (liters per 100 km), and fuel price (per liter).

Define the following virtual methods:

    double fuelCostPer100km() — returns the cost to drive 100 km, computed as consumption × fuelPrice.
    int maxRangeKm() — returns how far the vehicle can go on a full tank: tankCapacity / consumption × 100.
    string vehicleType() — returns a label, e.g. "Diesel".

Derive a class ElectricVehicle that does not use a fuel tank. Instead it stores battery capacity (kWh), electricity consumption (kWh per 100 km), and electricity price (per kWh). Override all three methods so the calculations use the electric values, and vehicleType() returns "Electric".

Define the following functions:

    DeliveryVehicle* mostEfficient(DeliveryVehicle **vehicles, int n) — receives an array of pointers and returns the vehicle with the lowest fuelCostPer100km(). The array can hold a mix of DeliveryVehicle and ElectricVehicle objects — that's the whole reason it has to be pointers and not values.
    int totalFleetRangeKm(DeliveryVehicle **vehicles, int n) — sums maxRangeKm() across all vehicles in the array.
    DeliveryVehicle* findForTrip(DeliveryVehicle **vehicles, int n, int tripKm) — returns the first vehicle in the array whose range can cover tripKm, or nullptr if none can.
*/
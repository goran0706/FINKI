/*
Да се дефинира класа Animal која претставува животно. За секое животно се чува името, возраста во месеци и тежината во килограми.

Во класата да се дефинираат следните виртуелни методи:

    string sound() — го враќа звукот што го прави животното. Стандардно враќа "..." (не го знаеме звукот на непознато животно).
    int dailyFoodGrams() — враќа колку грама храна му се потребни на животното дневно. Стандардно ова е weightKg * 20.
    int adoptionScore() — враќа оценка која означува колку е веројатно животното да биде посвоено. Стандардно, помладите животни имаат повисока оценка: max(0, 100 - ageMonths / 2).

Да се изведе класа Dog која додава раса (string) и индикатор trained (bool). Да се препокријат сите три методи:

    sound() враќа "Woof!".
    dailyFoodGrams() — кучињата јадат повеќе, па се користи weightKg * 30. Ако кучето е обучено, се додаваат 100 g протеински додаток.
    adoptionScore() — се почнува од основната оценка, се додава 20 ако кучето е обучено.

Да се изведе класа Cat која додава боја (string) и индикатор indoor (bool). Да се препокријат сите три методи:

    sound() враќа "Meow!".
    dailyFoodGrams() — мачките јадат помалку од кучињата, но повеќе од стандардното, па се користи weightKg * 25. Мачките кои живеат надвор трошат повеќе енергија, па за нив се додаваат 50 g.
    adoptionScore() — се почнува од основната оценка; маченцата (под 12 месеци) се посвојуваат многу брзо, па се додава 25 на основната оценка; возрасните мачки потешко наоѓаат дом, па се одзема 10 од основната оценка. Оценката не смее да биде помала од 0.

---

Define a class Animal representing an animal. Each animal stores a name, age in months, and weight in kilograms.

In the class, define the following virtual methods:

    string sound() — returns the sound the animal makes. By default it returns "..." (we don't know the sound of an unknown animal).
    int dailyFoodGrams() — returns how many grams of food the animal needs per day. By default this is weightKg * 20.
    int adoptionScore() — returns a score indicating how likely the animal is to be adopted. By default, younger animals score higher: max(0, 100 - ageMonths / 2).

Derive a class Dog that adds a breed (string) and a trained flag (bool). Override all three methods:

    sound() returns "Woof!".
    dailyFoodGrams() — dogs eat more, so use weightKg * 30. If the dog is trained, add 100 g of protein supplement.
    adoptionScore() — start from the base score, add 20 if the dog is trained.

Derive a class Cat that adds a color (string) and an indoor flag (bool). Override all three methods:

    sound() returns "Meow!".
    dailyFoodGrams() — cats eat less than dogs but more than the default, so use weightKg * 25. Outdoor cats burn more energy, so add 50 g for them.
    adoptionScore() — start from the base score; kittens (under 12 months) are adopted very quickly, so add 25; adult cats are harder to place, so subtract 10. Don't let the score go below 0.

For example:
Test 	Result

Animal *a = new Animal("Ghost", 5, 3.0);
    cout << "animal sound: " << a->sound() << endl;
    delete a;



animal sound: ...
*/
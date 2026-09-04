// Da se napise virtuelna klasa User, vo koja se cuvaat name string promenliva, email string promenliva, password string promenliva,
// i slednite cisto vitruelni metodi:
// print
// calculatePasswordStrength.
//
// Od ovaa klasa da se izvedat slednite klasi, regularUser, za koj dopolnitelno se cuvaat FA bool promenliva, i klasa adminUser
// za koja dopolnitelno se cuva level string promenliva i multiFactorAuth bool promenliva.
//
// Za regularUser metodite treba da se preoptovarat na sledniot nacin:
//
// za calculatePasswordStrength: ako prviot karakter od pass e bukva zgolemi bezbednost, ako imat twoFA (bool promenliva) zgolemi bezbednost,
// ako dolzina e pogolema od 8 zgolemi bezbednost, ako imat brojka vo pass zgolemi bezbednost, na krajot vraca celobrojna promenliva so
// bezbednosta na passwordot.
//
// za print: da se vidat test case za nacin na pecatenje.
//
// Za adminUser:
//
// ako golemina e poce od 10 zgolemi bezbednost, ako poslediot karakter e bukva zgolemi bezbednost,
// ako imat multiFactAuth (bool promenliva) zgolemi bezbednost,
// ako level (string promenliva) e "superuser" ili "admin" togas zgolemi bezbednost
// na krajot vraca celobrojna promenliva so bezbednosta na passwordot.
//
// za print: da se vidat test case za nacin na pecatenje.
//
// da se napise golbalna funkcija koja koja gi pecati regularUsers i na krajot ja pecati srednata vrednost na
// silata na nivnite lozniki. Za nacinot na pecatenje da se vidat test primerite.

/*
Дефинирајте класа AudioDevice која складира информации за:

    baseVolume – стандардното ниво на јачина на звук на уредот (двојно)

За класата дефинирајте:

    default конструктор
    конструктор со аргументи
    copy конструктор

И следните методи:

    double powerOutput() – ја враќа основната јачина на звукот на уредот
    double soundQuality() – враќа baseVolume * 2
    void print() – печати информации за уредот (формат даден во тест случаи)



Дефинирајте друга класа StereoSystem што наследува од AudioDevice.

Оваа класа складира дополнителни информации:

    leftBoost – засилување применето на левиот канал (двојно)
    rightBoost – засилување применето на десниот канал (двојно)



За класата дефинирајте:

    default конструктор
    конструктор со аргументи StereoSystem(const AudioDevice &a, double l, double r)
    copy конструктор



Стерео системот сега се однесува на следниов начин:

    left channel = baseVolume + leftBoost
    right channel = baseVolume + rightBoost



Препокријте ги методите:

    powerOutput() → враќа просек од левиот и десниот канал
    soundQuality() → враќа (leftChannel + rightChannel) * 2
    print() → печати ги сите релевантни информации



⚠️ ВАЖЕН УСЛОВ

Ако leftBoost = rightBoost, тогаш системот се однесува како стандарден избалансиран уред.

Во тој случај:

    третирајте го како основен AudioDevice
    print() мора да се однесува точно како основната класа
    презапишаните методи мора да ја користат повторно логиката на основната класа



⚠️ ПРАВИЛО

Кога презапишувате методи во StereoSystem, МОРА да ги повикате соодветните методи од основната класа AudioDevice.



Define a class AudioDevice that stores information about:

    baseVolume – the default volume level of the device (double)



For the class define:

    default constructor
    constructor with arguments
    copy constructor



And the following methods:

    double powerOutput() – returns the base volume of the device
    double soundQuality() – returns baseVolume * 2
    void print() – prints information about the device (format given in test cases)



Define another class StereoSystem that inherits from AudioDevice

This class stores additional information:

    leftBoost – boost applied to the left channel (double)
    rightBoost – boost applied to the right channel (double)



For the class define:

    default constructor
    constructor StereoSystem(const AudioDevice &a, double l, double r)
    copy constructor



The stereo system now behaves as follows:

    left channel = baseVolume + leftBoost
    right channel = baseVolume + rightBoost

Override the methods:

    powerOutput() → returns the average of left and right channel
    soundQuality() → returns (leftChannel + rightChannel) * 2
    print() → prints all relevant info



⚠️ IMPORTANT CONDITION

If leftBoost = rightBoost, then the system behaves like a standard balanced device.

In that case:

    treat it as a basic AudioDevice
    print() must behave exactly like the base class
    overridden methods must reuse base class logic



⚠️ RULE

When overriding methods in StereoSystem, you MUST call the corresponding methods from the base class AudioDevice.

For example:
Input 	Result

4
1 8
2 10 2 4
2 6 3 3
1 5



AudioDevice: baseVolume=8 powerOutput=8 soundQuality=16
StereoSystem: baseVolume=10 leftChannel=12 rightChannel=14 powerOutput=13 soundQuality=52
AudioDevice: baseVolume=6 powerOutput=6 soundQuality=12
AudioDevice: baseVolume=5 powerOutput=5 soundQuality=10

2
2 0 0 0
1 0



AudioDevice: baseVolume=0 powerOutput=0 soundQuality=0
AudioDevice: baseVolume=0 powerOutput=0 soundQuality=0
*/
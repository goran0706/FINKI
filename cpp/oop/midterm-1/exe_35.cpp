/*
    Да се дефинира класа Пица за која ќе се чуваат податоци за:

    име на пицата (низа од 15 знаци)
    цена (цел број)
    состојки (динамички алоцирана низа од знаци)
    намалување на цената во проценти (цел број) - ако пицата не е на промоција намалувањето има вредност нула,
    во спротивно, вредност поголема од нула и не поголема од 100.
    За потребите на оваа класа да се креираат потребните конструктори и да се напише соодветен деструктор.
    Дополнително за оваа класа да се дефинира функцијата:

    pecati() - функција во која ќе се печатат податоците за пицата во следниот формат: име - состојки, цена.
    istiSe(Pica p) - функција за споредба на две пици според состојките :
    Да се дефинира класа Picerija во која се чуваат:

    име (низа од максимум 15 знаци)
    динмички алоцирана низа од објекти од класата Pica
    број на пици (цел број)
    За потребите на оваа класа да се дефинираат потребните конструктори и да се напише соодветен деструктор.
    Да се имплементираат и следниве методи:

    dodadi(Pica P) - за додавање нова пица во пицеријата, но само ако не постои иста во низата (нема пица со исти состојки со пицата што треба да се додаде).
    void piciNaPromocija() - се печатат сите пици од пицеријата што се на промоција во формат : име - состојки, цена, цена со попуст.

    Input:
    FINKI-Pica
    4
    Margarita
    200
    Domaten sos, kaskaval, maslinovo maslo
    0
    Napolitana
    210
    Domaten sos, kaskaval, svezi sampinjoni, maslinovo maslo
    0
    Kapricioza
    210
    Domaten sos, kaskaval, sunka, svezi sampinjoni
    30
    Vegetarijana
    230
    Domaten sos, kaskaval, tikvici, svezi sampinjoni, piperka, domat, maslinki, rukola, pcenka
    20
    Pica-FINKI
    Vegetarijana
    230
    Domaten sos, kaskaval, tikvici, svezi sampinjoni, piperka, domat, maslinki, rukola, pcenka
    20

    Output:
    FINKI-Pica
    Pici na promocija:
    Kapricioza  - Domaten sos, kaskaval, sunka, svezi sampinjoni, 210 147
    Vegetarijana - Domaten sos, kaskaval, tikvici, svezi sampinjoni, piperka, domat, maslinki, rukola, pcenka, 230 184
    Pica-FINKI
    Pici na promocija:
    Kapricioza  - Domaten sos, kaskaval, sunka, svezi sampinjoni, 210 147
    Vegetarijana - Domaten sos, kaskaval, tikvici, svezi sampinjoni, piperka, domat, maslinki, rukola, pcenka, 230 184
*/
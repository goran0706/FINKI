// Implement a class String that keeps dynamically allocated array of characters and its length. For this class implement:
//
//     appropriate constructors and destructor (10 points)
//     operator [] for accessing character at given index i. If the index is less then 0 or greater then (the length of the array - 1) it should throw an exception of type IndexOutOfBounds. Handle this exception in the right place in the main function and print the message as in the sample output example. (10 points)
//
// Implement class named StringBuilder that keeps dynamically allocated array of characters, the number of used characters and the total capacity. For this class implement:
//
//     constructor StringBuilder(int capacity) that instantiate object of this class with given capacity and usage of 0 (10 points)
//
//     operator += that accepts reference of the class String and adds the contents (the char array) from this class at the end of the character array of the object of the class StringBuilder. Therefore if there is not enough capacity, it should expand so:
//         if after doubling the capacity (capacity * 2) there is enough capacity for the new array, the it's expanded in this manner
//         if after the expansion by doubling, still there is not enough space, the expand the array for what is needed to fit the new array you are adding
//         The original array should never be lost during the expansion. (15 points)
//
//     operator << for printing objects of this class on the standard output in format: (5 points)
//
// Capacity: {capacity}
// Size: {size}
// Contents: {contents}
//
// For example:
// Input 	Result
//
// 34
// 44
// wpfxmytkmjxvwjufgaqvolqabjbntqeivgkfjgem 30
// eeqzoeva 32
// tazajlzoxqvphqrcdgsnwmwwokuwjkuyoxmmczrxcddflcobqy 55
// orczteqjgi 97
// vrnpnliotqppquvlgzapisqyloxkn 29
// urivtzlpfgtdtijdslfopwlbyemsgxvwzlmomveus 12
// reijhnnoesxqbkzjjwtxlmibfj 70
// qofimuinqdtdtjp 97
// mgrqchxycueuqkxofgaskpdxavdgbkqdktjvzuqmz 47
// vvhkpnvbgckdyjsxliz 57
// xmsvtzgrfkbbjvnikcshsdhvdzoohneybijzsywlimtwiaeblf 4
// slmflrqddlkpmdeaxdzygymhtjgrzun 74
// uzzwliubgknqspjhidbebmovlqjssypgqcodiavdocrwrsgxd 83
// qppmwlbrgfkvshahyrvxahjzjpiclgzjkskgtjpgjunn 77
// eyotkqjcewbljvrslvfneesfenkbbvyn 81
// usdppe -7
// wounp -1
// aizfbbrdkkzudlqxukguhiudnirenycxcznzzrxa 52
// lfnydltjzvxnbnjgoyrrpftlebbqnuofslicbcvhjotgcwjcn 78
// qdunldmnkwdorhyfymdnzehmekonfpmlpbqafhnerudgkb 2
// gfkfrgjnyaze -9
// grxrposnxgfbhxbvpmuqwwyqwopenyqf 80
// hwmsyzulmbaubialmsuqpozaqodkjlqrysvpjq 75
// pwruxilwbcyi 89
// soqdlsofdpdxhwhbuoyyvnsk 44
// yvbdbtdxcqnxhbbbzsvrvlskeahdjauugasg 55
// kcxveblsfzugtfzxunmmschadenhwaggkonskmstpcfh -2
// dhzchdinoqdxcnx 41
// zgvqjvxbaihlbdjketheae 32
// bobzoolyzubpkadcmbaljiysrnrefdxdd 72
// deqcivorswovkcqtnyshnzkcldzyx 59
// uuqjrpjilqynvwpuhvcwnewckcuywonemuwyu -9
// ihfwhmqcqcnqixyzdqj 76
// byrgrqryelszsjkvzkgty 12
// fxiqdlfnwhnxwxsyibyjythqizxmogrnmgprsetoes 19
// qlrgfogfzgjjcvvbtgxalixqgjlivzgsjoqccs 58
// uxqhoimnmexjczgwijimyciwnrtkfxjekkqxvs 6
// ywkqbfugtylyaxaefjktbhtnvn 22
// fnztiiwioiqhmqkconett 0
// wxplciefajgnktgzryoyvehcphrfdnhrcfljbmz 77
// vadwoxhbauylnvfgrutklg 42
// ezppuizpjt 65
// mnvkgdwfquaypykfsqyehgtejvzblwxabwqhqnzdfz 42
// rtyubulnejltrukhlemgdgewjufdhdywfwisgfip 79
//
//
//
// s[30] = e
// s[32] = Index '32' is out of bounds
// s[55] = Index '55' is out of bounds
// s[97] = Index '97' is out of bounds
// s[29] = Index '29' is out of bounds
// s[12] = t
// s[70] = Index '70' is out of bounds
// s[97] = Index '97' is out of bounds
// s[47] = Index '47' is out of bounds
// s[57] = Index '57' is out of bounds
// s[4] = t
// s[74] = Index '74' is out of bounds
// s[83] = Index '83' is out of bounds
// s[77] = Index '77' is out of bounds
// s[81] = Index '81' is out of bounds
// s[-7] = Index '-7' is out of bounds
// s[-1] = Index '-1' is out of bounds
// s[52] = Index '52' is out of bounds
// s[78] = Index '78' is out of bounds
// s[2] = u
// s[-9] = Index '-9' is out of bounds
// s[80] = Index '80' is out of bounds
// s[75] = Index '75' is out of bounds
// s[89] = Index '89' is out of bounds
// s[44] = Index '44' is out of bounds
// s[55] = Index '55' is out of bounds
// s[-2] = Index '-2' is out of bounds
// s[41] = Index '41' is out of bounds
// s[32] = Index '32' is out of bounds
// s[72] = Index '72' is out of bounds
// s[59] = Index '59' is out of bounds
// s[-9] = Index '-9' is out of bounds
// s[76] = Index '76' is out of bounds
// s[12] = s
// s[19] = j
// s[58] = Index '58' is out of bounds
// s[6] = m
// s[22] = t
// s[0] = f
// s[77] = Index '77' is out of bounds
// s[42] = Index '42' is out of bounds
// s[65] = Index '65' is out of bounds
// s[42] = Index '42' is out of bounds
// s[79] = Index '79' is out of bounds
// Capacity: 2176
// Size: 1323
// Contents: wpfxmytkmjxvwjufgaqvolqabjbntqeivgkfjgemeeqzoevatazajlzoxqvphqrcdgsnwmwwokuwjkuyoxmmczrxcddflcobqyorczteqjgivrnpnliotqppquvlgzapisqyloxknurivtzlpfgtdtijdslfopwlbyemsgxvwzlmomveusreijhnnoesxqbkzjjwtxlmibfjqofimuinqdtdtjpmgrqchxycueuqkxofgaskpdxavdgbkqdktjvzuqmzvvhkpnvbgckdyjsxlizxmsvtzgrfkbbjvnikcshsdhvdzoohneybijzsywlimtwiaeblfslmflrqddlkpmdeaxdzygymhtjgrzunuzzwliubgknqspjhidbebmovlqjssypgqcodiavdocrwrsgxdqppmwlbrgfkvshahyrvxahjzjpiclgzjkskgtjpgjunneyotkqjcewbljvrslvfneesfenkbbvynusdppewounpaizfbbrdkkzudlqxukguhiudnirenycxcznzzrxalfnydltjzvxnbnjgoyrrpftlebbqnuofslicbcvhjotgcwjcnqdunldmnkwdorhyfymdnzehmekonfpmlpbqafhnerudgkbgfkfrgjnyazegrxrposnxgfbhxbvpmuqwwyqwopenyqfhwmsyzulmbaubialmsuqpozaqodkjlqrysvpjqpwruxilwbcyisoqdlsofdpdxhwhbuoyyvnskyvbdbtdxcqnxhbbbzsvrvlskeahdjauugasgkcxveblsfzugtfzxunmmschadenhwaggkonskmstpcfhdhzchdinoqdxcnxzgvqjvxbaihlbdjketheaebobzoolyzubpkadcmbaljiysrnrefdxdddeqcivorswovkcqtnyshnzkcldzyxuuqjrpjilqynvwpuhvcwnewckcuywonemuwyuihfwhmqcqcnqixyzdqjbyrgrqryelszsjkvzkgtyfxiqdlfnwhnxwxsyibyjythqizxmogrnmgprsetoesqlrgfogfzgjjcvvbtgxalixqgjlivzgsjoqccsuxqhoimnmexjczgwijimyciwnrtkfxjekkqxvsywkqbfugtylyaxaefjktbhtnvnfnztiiwioiqhmqkconettwxplciefajgnktgzryoyvehcphrfdnhrcfljbmzvadwoxhbauylnvfgrutklgezppuizpjtmnvkgdwfquaypykfsqyehgtejvzblwxabwqhqnzdfzrtyubulnejltrukhlemgdgewjufdhdywfwisgfip

#include <iostream>
using namespace std;

// your code here

int main() {
    int n;
    cin >> n;
    StringBuilder sb(n);
    cin >> n;
    for (int i = 0; i < n; ++i) {
        char input[100];
        cin >> input;
        String s(input);
        int x;
        cin >> x;

        cout << "s[" << x << "] = " << s[x] << endl;


        sb += s;
    }
    cout << sb;
    return 0;
}

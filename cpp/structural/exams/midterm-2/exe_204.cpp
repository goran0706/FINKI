/*
    From SI read N strings not longer than 80 chars.
    At the beginning of the program read two integers:

    N - number of strings you are going to read
    X - shifting size.
    Each of the read strings should be transformed in such a way that lowercase and uppercase letters (a-z, A-Z)
    are replaced with the same letter shifted X places afterward in the alphabet (a-z).
    If you overflow the range of alphabet, continue cyclic from the beginning of the alphabet.
    Transformed string should be printed on SO.

    Transformation of a string should be implemented in a separate recursive function.

    Example:

    Welcome -> transformed with shift 5 -> Bjqhtrj

    Input:
    16 10
    Sheets of empty canvas, untouched sheets of clay
    Were laid spread out before me as her body once did.
    All of five horizons revolved around her soul as the earth to the sun
    Now the air I tasted and breathed has taken a turn
    Ooh, and all I taught her was everything
    Ooh, I know she gave me all that she was
    And now my bitter hands chafe beneath the clouds of what was everything.
    Oh, the pictures have all been washed in black, tattooed everything...
    I take a walk outside, I'm surrounded by some kids at play
    I can feel their laughter, so why do I sear?
    Oh, and twisted thoughts that spin round my head, I'm spinning, oh,
    I'm spinning, how quick the sun can drop away
    And now my bitter hands cradle broken glass of what was everything
    All the pictures have all been washed in black, tattooed everything...
    All the love gone bad turned my world to black
    Tattooed all I see, all that I am, all I'll be... yeah...

    Output:
    Croodc yp owzdi mkxfkc, exdyemron croodc yp mvki
    Gobo vksn czbokn yed lopybo wo kc rob lyni yxmo nsn.
    Kvv yp psfo rybsjyxc bofyvfon kbyexn rob cyev kc dro okbdr dy dro cex
    Xyg dro ksb S dkcdon kxn lbokdron rkc dkuox k debx
    Yyr, kxn kvv S dkeqrd rob gkc ofobidrsxq
    Yyr, S uxyg cro qkfo wo kvv drkd cro gkc
    Kxn xyg wi lsddob rkxnc mrkpo loxokdr dro mvyenc yp grkd gkc ofobidrsxq.
    Yr, dro zsmdeboc rkfo kvv loox gkcron sx lvkmu, dkddyyon ofobidrsxq...
    S dkuo k gkvu yedcsno, S'w cebbyexnon li cywo usnc kd zvki
    S mkx poov drosb vkeqrdob, cy gri ny S cokb?
    Yr, kxn dgscdon dryeqrdc drkd czsx byexn wi rokn, S'w czsxxsxq, yr,
    S'w czsxxsxq, ryg aesmu dro cex mkx nbyz kgki
    Kxn xyg wi lsddob rkxnc mbknvo lbyuox qvkcc yp grkd gkc ofobidrsxq
    Kvv dro zsmdeboc rkfo kvv loox gkcron sx lvkmu, dkddyyon ofobidrsxq...
    Kvv dro vyfo qyxo lkn debxon wi gybvn dy lvkmu
    Dkddyyon kvv S coo, kvv drkd S kw, kvv S'vv lo... iokr...
*/
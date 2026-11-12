/*
    Змија (Snake)

    Се чита мрежа со димензии N x M.
    Змијата започнува од позицијата (N-1, M-1) и гледа нагоре (UP).
    На мрежата се наоѓа едно јаболко на позиција (apple_x, apple_y).

    Се чита низа од потези (до 15 знаци) составена од:
      'F' – оди напред (во насоката во која гледа)
      'L' – сврти лево (промени насока за -1)
      'R' – сврти десно (промени насока за +1)
    Сите останати знаци се игнорираат.

    Насоките се дефинирани циклично:
      0 = UP, 1 = RIGHT, 2 = DOWN, 3 = LEFT
    (по LEFT се враќа на UP, и обратно)

    При секој потег 'F':
      - Змијата се поместува во тековната насока.
      - Ако новата позиција го содржи јаболкото → испечати "NJAM" и заврши.
      - Ако новата позиција е веќе посетена (змијата се удрила сама) →
        испечати "GAME OVER Ouch" и заврши.
      - Инаку, позицијата се означува како посетена.

    Ако потезите завршат без ниту еден од горните услови →
    испечати "GAME OVER".

    Влез:
      Прв ред  : N M
      Втор ред : apple_x apple_y
      Трет ред : низа од потези (само F, L, R и евентуални непознати знаци)

    Излез:
      "NJAM"            – ако змијата го изела јаболкото
      "GAME OVER Ouch"  – ако змијата се удрила сама
      "GAME OVER"       – ако потезите завршиле без настан

    Пример за влез 1:
      5 5
      3 3
      FFFRF

    Пример за излез 1:
      NJAM

    Пример за влез 2:
      5 5
      0 0
      FFLFF

    Пример за излез 2:
      GAME OVER Ouch

    Пример за влез 3:
      5 5
      0 0
      FF

    Пример за излез 3:
      GAME OVER
*/
#include <iostream>
using namespace std;

int main() {
    int N, M;
    cin >> N >> M;

    int apple_x, apple_y;
    cin >> apple_x >> apple_y;

    char moves[15];
    cin >> moves;

    bool visited[100][100] = {false};

    int x = N - 1, y = M - 1;
    // Direction encoding: 0=UP, 1=RIGHT, 2=DOWN, 3=LEFT
    // These cycle: UP(0) -> RIGHT(1) -> DOWN(2) -> LEFT(3) -> UP(0)
    int dir = 0;

    visited[x][y] = true;

    for (char c: moves) {
        if (c == 'L') {
            // Turn left: decrease direction by 1, but wrap around
            // Example: if dir=0 (UP), then (0-1+4)%4 = 3%4 = 3 (LEFT)
            // The +4 prevents negative modulo issues in C++
            // (negative % in C++ can return negative, so we add modulus first)
            dir = (dir - 1 + 4) % 4;
        } else if (c == 'R') {
            // Turn right: increase direction by 1, wrap around
            // Example: if dir=0 (UP), then (0+1)%4 = 1 (RIGHT)
            // No +4 needed here because dir+1 is always positive
            dir = (dir + 1) % 4;
        } else if (c == 'F') {
            // Move forward in current direction
            if (dir == 0) {
                x--; // UP: move to smaller row number (toward top)
            } else if (dir == 1) {
                y++; // RIGHT: move to larger column number (toward right)
            } else if (dir == 2) {
                x++; // DOWN: move to larger row number (toward bottom)
            } else if (dir == 3) {
                y--; // LEFT: move to smaller column number (toward left)
            }

            // Check if snake went out of bounds (hit wall)
            if (x < 0 || x >= N || y < 0 || y >= M) {
                cout << "GAME OVER Ouch\n";
                return 0;
            }

            // Check if snake ate the apple
            if (x == apple_x && y == apple_y) {
                cout << "NJAM\n";
                return 0;
            }

            // Check if snake hit itself (visited this position before)
            if (visited[x][y]) {
                cout << "GAME OVER Ouch\n";
                return 0;
            }

            // Mark this position as visited
            visited[x][y] = true;
        }
        // Ignore all other characters (not F, L, or R)
    }

    // All moves processed without eating apple or hitting anything
    cout << "GAME OVER\n";

    return 0;
}

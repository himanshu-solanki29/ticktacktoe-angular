import { SelectGameModeComponent } from "./select-game-mode/select-game-mode.component";
import { WinnerComponent } from "./winner/winner.component";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { SelectPlayerComponent } from "./select-player/select-player.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "ticktacktoe";
  currentPlayer;
  userPlayer;
  gameOver = false;
  multiPlayer = false;
  selectableSequences = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  winningCombos = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  selectedSequencesByX = [];
  selectedSequencesByO = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.selectGameMode();
  }

  selectGameMode() {
    const dialogRef = this.dialog.open(SelectGameModeComponent, {
      disableClose: true,
      width: "400px",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectPlayer();
      } else {
        this.multiPlayer = true;
        this.getRandomPlayerToStart();
      }
    });
  }

  selectPlayer() {
    const dialogRef = this.dialog.open(SelectPlayerComponent, {
      disableClose: true,
      width: "400px",
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userPlayer = "X";
      } else {
        this.userPlayer = "O";
      }
      this.getRandomPlayerToStart();
      this.runBot(true);
    });
  }

  getRandomPlayerToStart() {
    if (this.getRandomInt() % 2 == 0) this.currentPlayer = "X";
    else this.currentPlayer = "O";
  }

  getRandomInt() {
    return Math.floor(Math.random() * 9);
  }

  endGameAndShowResults(_combo, _winner) {
    this.gameOver = true;
    let _resultData = { icon: null, text: null };

    if (_combo) {
      this.highlightWinnerCombo(_combo, _winner);
    }

    if (_winner === null) {
      _resultData.icon = "far fa-handshake";
      _resultData.text = "Match Draw";
    } else if (!this.multiPlayer) {
      if (this.userPlayer === _winner) {
        _resultData.text = "You Win";
        _resultData.icon = "fas fa-trophy";
      } else {
        _resultData.text = "You Lost";
        _resultData.icon = "fas fa-heart-broken";
      }
    } else {
      _resultData.text = `Player ${_winner} Wins`;
      _resultData.icon = "fas fa-trophy";
    }

    setTimeout(() => {
      const dialogRef = this.dialog.open(WinnerComponent, {
        disableClose: true,
        height: "400px",
        width: "400px",
        autoFocus: false,
        data: _resultData,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.reset();
        }
      });
    }, 500);
  }

  validateAndSelectUserInput(seq) {
    if (this.multiPlayer || this.currentPlayer === this.userPlayer)
      this.select(seq);
  }

  select(seq) {
    if (this.isSelected(seq) || this.gameOver) {
      return;
    }

    if (this.currentPlayer === "X") this.selectedSequencesByX.push(seq);
    else this.selectedSequencesByO.push(seq);

    this.selectWinner();
    if (!this.gameOver) {
      this.toggleCurrentPlayer();
      this.runBot(!this.multiPlayer);
    }
  }

  isSelected(seq) {
    return this.isSelectedByO(seq) || this.isSelectedByX(seq);
  }

  isSelectedByX(seq) {
    if (
      this.selectedSequencesByX.find((e) => {
        return e === seq;
      })
    ) {
      return true;
    }
    return false;
  }

  isSelectedByO(seq) {
    if (
      this.selectedSequencesByO.find((e) => {
        return e === seq;
      })
    ) {
      return true;
    }
    return false;
  }

  toggleCurrentPlayer() {
    if (this.currentPlayer === "X") this.currentPlayer = "O";
    else this.currentPlayer = "X";
  }

  selectWinner() {
    for (let index = 0; index < this.winningCombos.length; index++) {
      let combo = this.winningCombos[index];

      if (this.currentPlayer === "X") {
        let result = combo.filter((x) => {
          return !this.selectedSequencesByX.includes(x);
        });
        if (result.length == 0) {
          this.endGameAndShowResults(combo, "X");
          break;
        }
      } else {
        let result = combo.filter((x) => {
          return !this.selectedSequencesByO.includes(x);
        });
        if (result.length == 0) {
          this.endGameAndShowResults(combo, "O");
          break;
        }
      }
    }

    if (!this.gameOver && this.getSelectableItems().length == 0) {
      this.endGameAndShowResults(null, null);
    }
  }

  highlightWinnerCombo(combo, winner) {
    combo.forEach((e) => {
      let element = document.getElementById("tab_" + e);
      element.classList.add("animateBoardItem");
      if (winner === "X") element.classList.add("border-info");
      else element.classList.add("border-warning");
    });
  }

  resetView() {
    document.querySelectorAll(".boardItem").forEach((e) => {
      e.classList.remove("border-info");
      e.classList.remove("border-warning");
      e.classList.remove("animateBoardItem");
    });
  }

  getSelectableItems() {
    let selectedTabs = this.selectedSequencesByO.concat(
      this.selectedSequencesByX
    );
    return this.selectableSequences.filter((x) => {
      return !selectedTabs.includes(x);
    });
  }

  runBot(doRun) {
    if (doRun && this.currentPlayer !== this.userPlayer) {
      let items = this.getSelectableItems();
      let itemSelectedByBot = items[Math.floor(Math.random() * items.length)];
      let delay = this.getRandomInt() * 100;
      setTimeout(() => {
        this.select(itemSelectedByBot);
      }, delay);
    }
  }

  reset() {
    this.selectedSequencesByO = [];
    this.selectedSequencesByX = [];
    this.gameOver = false;
    this.multiPlayer = false;
    this.currentPlayer = null;
    this.userPlayer = null;
    this.resetView();
    this.selectGameMode();
  }
}

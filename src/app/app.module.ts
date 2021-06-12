import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatIconModule } from '@angular/material';
import { SelectPlayerComponent } from './select-player/select-player.component';
import { WinnerComponent } from './winner/winner.component';
import { SelectGameModeComponent } from './select-game-mode/select-game-mode.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectPlayerComponent,
    WinnerComponent,
    SelectGameModeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [],
  entryComponents:[ SelectPlayerComponent, WinnerComponent, SelectGameModeComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }

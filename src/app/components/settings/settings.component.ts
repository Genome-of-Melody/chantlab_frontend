import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-alignment-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  alignmentSettingsVisible = true;
  dashboardSettingsVisible = false;

  constructor(
    public settingsService: SettingsService
  ) { }

  ngOnInit(): void {
  }

}

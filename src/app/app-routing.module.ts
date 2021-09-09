import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChantFetchComponent } from './components/chant-fetch/chant-fetch.component';
import { AlignedComponent } from './components/aligned/aligned.component';
import { DashboardComponent } from './components/visualization/dashboard/dashboard.component';
import { ChantListWrapperComponent } from './components/chant-list-wrapper/chant-list-wrapper.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { SettingsComponent } from './components/settings/settings.component';


const routes: Routes = [
  { path: '', redirectTo: 'chants', pathMatch: 'full' },
  { path: 'chants', component: ChantListWrapperComponent },
  { path: 'chants/:id', component: ChantFetchComponent },
  { path: 'align', component: AlignedComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'upload', component: DataUploadComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

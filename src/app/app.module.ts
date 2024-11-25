import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioGroup, MatRadioModule } from '@angular/material/radio';

import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChantDetailsComponent } from './components/chant-details/chant-details.component';
import { ChantListComponent } from './components/chant-list/chant-list.component';
import { ChantFetchComponent } from './components/chant-fetch/chant-fetch.component';
import { DashboardComponent } from './components/visualization/dashboard/dashboard.component';
import { StackedHistogramComponent } from './components/visualization/stacked-histogram/stacked-histogram.component';
import { AlignedComponent } from './components/aligned/aligned.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ChantListWrapperComponent } from './components/chant-list-wrapper/chant-list-wrapper.component';
import { NoChantTextDialogComponent } from './components/dialogs/no-chant-text-dialog/no-chant-text-dialog.component';
import { NotEnoughToAlignDialogComponent } from './components/dialogs/not-enough-to-aling-dialog/not-enough-to-aling-dialog.component';
import { AlignmentErrorDialogComponent } from './components/dialogs/alignment-error-dialog/alignment-error-dialog.component';
import { ChantDetailDialogComponent } from './components/dialogs/chant-detail-dialog/chant-detail-dialog.component';
import { MultipleSeriesScatterplotComponent } from './components/visualization/multiple-series-scatterplot/multiple-series-scatterplot.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { SelectDataSourceComponent } from './components/select-data-source/select-data-source.component';
import { SourceSelectionSavedDialogComponent } from './components/dialogs/source-selection-saved-dialog/source-selection-saved-dialog.component';
import { UploadSuccessfulDialogComponent } from './components/dialogs/upload-successful-dialog/upload-successful-dialog.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { SavedFilterDialogComponent } from './components/dialogs/saved-filter-dialog/saved-filter-dialog.component';
import { NameOnCreateDatasetComponent } from './components/dialogs/name-on-create-dataset/name-on-create-dataset.component';
import { MissingDatasetNameDialogComponent } from './components/dialogs/missing-dataset-name-dialog/missing-dataset-name-dialog.component';
import { DatasetCreatedDialogComponent } from './components/dialogs/dataset-created-dialog/dataset-created-dialog.component';
import { DistanceMatrixComponent } from './components/distance-matrix/distance-matrix.component';
import { SettingsComponent } from './components/settings/settings.component';
import {RouterModule} from '@angular/router';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { AlignedPageComponent } from './components/aligned-page/aligned-page.component';
import { AlignmentManagerComponent } from './components/alignment-manager/alignment-manager.component';
import { AlignmentListComponent } from './components/alignment-manager/alignment-list/alignment-list.component';
import { NameOnCreateAlignmentComponent } from './components/dialogs/name-on-create-alignment/name-on-create-alignment.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { NetworkGraphComponent } from './components/visualization/network-graph/network-graph.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { NetworkGraphWrapperComponent } from './components/visualization/network-graph-wrapper/network-graph-wrapper.component';
import { AddedToDatasetDialogComponent } from './components/dialogs/added-to-dataset-dialog/added-to-dataset-dialog.component';
import { IdxOnAddToDatasetComponent } from './components/dialogs/idx-on-add-to-dataset/idx-on-add-to-dataset.component';
import { VolpianoUpdatedDialogComponent } from './components/dialogs/volpiano-updated-dialog/volpiano-updated-dialog.component';
import { ChantNotFoundDialogComponent } from './components/dialogs/chant-not-found-dialog/chant-not-found-dialog.component';
import { ZoomableCanvasComponent } from './components/visualization/zoomable-canvas/zoomable-canvas.component';
import { ZoomableSvgViewComponent } from './components/visualization/zoomable-svg-view/zoomable-svg-view.component';
import { GuideTreeComponent } from './components/guide-tree/guide-tree.component';
import { PhylogenyComponent } from './components/phylogeny/phylogeny.component';
import { PhylogenyPageComponent } from './components/phylogeny-page/phylogeny-page.component';
import { PhylogenyErrorDialogComponent } from './components/dialogs/phylogeny-error-dialog/phylogeny-error-dialog.component';
import { NotEnoughToRemoveDialogComponent } from './components/dialogs/not-enough-to-remove-dialog/not-enough-to-remove-dialog.component';
import { ContrafactReductionResultDialogComponent } from './components/dialogs/contrafact-reduction-result-dialog/contrafact-reduction-result-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        ChantDetailsComponent,
        ChantListComponent,
        ChantFetchComponent,
        DashboardComponent,
        StackedHistogramComponent,
        AlignedComponent,
        NavigationComponent,
        ChantListWrapperComponent,
        NoChantTextDialogComponent,
        NotEnoughToAlignDialogComponent,
        NotEnoughToRemoveDialogComponent,
        AlignmentErrorDialogComponent,
        PhylogenyErrorDialogComponent,
        ChantDetailDialogComponent,
        MultipleSeriesScatterplotComponent,
        DataUploadComponent,
        SelectDataSourceComponent,
        SourceSelectionSavedDialogComponent,
        UploadSuccessfulDialogComponent,
        ContrafactReductionResultDialogComponent,
        SearchFilterComponent,
        SavedFilterDialogComponent,
        NameOnCreateDatasetComponent,
        MissingDatasetNameDialogComponent,
        DatasetCreatedDialogComponent,
        DistanceMatrixComponent,
        SettingsComponent,
        DatasetListComponent,
        AlignedPageComponent,
        AlignmentManagerComponent,
        AlignmentListComponent,
        NameOnCreateAlignmentComponent,
        AboutPageComponent,
        NetworkGraphComponent,
        NetworkGraphWrapperComponent,
        AddedToDatasetDialogComponent,
        IdxOnAddToDatasetComponent,
        VolpianoUpdatedDialogComponent,
        ChantNotFoundDialogComponent,
        ZoomableCanvasComponent,
        ZoomableSvgViewComponent,
        GuideTreeComponent,
        PhylogenyPageComponent,
        PhylogenyComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatToolbarModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatIconModule,
        MatPaginatorModule,
        MatCardModule,
        MatDialogModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        DragDropModule,
        MatButtonToggleModule,
        RouterModule,
        ScrollingModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

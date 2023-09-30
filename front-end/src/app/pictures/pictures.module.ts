import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from '../shared/app-material/app-material.module';
import { PicturesRoutingModule } from './pictures-routing.module';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { FormComponent } from './form/form.component';
import { SearchComponent } from './search/search.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    DetailComponent,
    FormComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    PicturesRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ]
})
export class PicturesModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppMaterialModule } from './shared/app-material/app-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpinnerComponent } from './core/spinner/spinner.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SpinnerComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    AppMaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

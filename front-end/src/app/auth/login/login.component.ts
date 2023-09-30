import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userForm:FormGroup;

  constructor(private http:HttpClient,
    private formBuilder: FormBuilder,
    private router:Router,
    private userService: UserService,
    private authService:AuthService){
}

  ngOnInit():void{
    this.userForm = this.formBuilder.group({
      email: "",
      password: "",
    })
  }

  submit():void{

    let user = this.userForm.getRawValue();
    if( user.email == "" || user.password == ""){
      Swal.fire("Error", "Favor preencher todos os campos!", "error")
    }
    else{
      this.userService.loginUser(user).subscribe(
        ()=> {
          Swal.fire("Login efetuado com sucesso!")
          this.router.navigate(['/']);
          this.authService.login();
        }, (err: { error: { error: string | undefined; }; })=>{
        Swal.fire("Erro", err.error.error, "error")
      })
    }
  }

}



import { Component } from '@angular/core';
import { User } from 'src/app/Model/User';
import { AuthentificationApi } from 'src/app/Services/AuthentificationApi.service';
import { UserApiService } from 'src/app/Services/UserApiService';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    standalone: false
})
export class UserProfileComponent {

  user: User = new User();

  constructor(private readonly userService: UserApiService, private readonly authService: AuthentificationApi){
    this.getMyProfile();
  }

  getMyProfile(){
    this.userService.getMyProfile().subscribe((user) => {
      this.user = user;
    })
  }

  changeAvatar(){
    console.log('Update avatar');
  }

  updateIdentity(){
    console.log('Update identity');
  }

  changePassword(){
    console.log('Change password');
  }

  logout(){
    this.authService.logOut();
  }
}

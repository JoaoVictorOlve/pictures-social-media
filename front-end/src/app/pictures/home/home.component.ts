import { Router } from '@angular/router';
import { PostService } from './../../services/post.service';
import { Component } from '@angular/core';
import { Post } from 'src/app/shared/models/post';
import { PostListResponse } from 'src/app/shared/models/post-list-response';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  pageIsEmpty: boolean = false;
  errorLoadingPage: boolean = false;
  posts: Post[] = [];
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;

  constructor(private postService: PostService, private router: Router, private userService:UserService){
  }

  ngOnInit(){
    this.loadPosts();
  }

  loadPosts():void{
    this.postService.getPostList(16, 0).subscribe(
      (response: PostListResponse)=>{
        this.posts = response.results;
        this.nextPageUrl = response.nextUrl;
        this.previousPageUrl = response.previousUrl;
        if(!(this.posts.length > 0)){
          this.pageIsEmpty = true;
        }
      },
      (err)=>{
        if(err.error.error == "Unauthorized"){
          this.router.navigate(['/auth/login'])
        } else {
          Swal.fire('error', 'Something wrong happened!', 'error')
          this.router.navigate(['/auth/login'])
        }
      }
    );
  }

  loadNextPage():void{
    if(this.nextPageUrl){
      const params = new URLSearchParams(this.nextPageUrl.split('?')[1]);
      const limit = +params.get('limit')!;
      const offset = +params.get('offset')!;
      this.postService.getPostList(limit, offset).subscribe(
        (response: PostListResponse)=>{
          const responsePosts = response.results;
          this.posts = this.posts.concat(responsePosts);
          this.nextPageUrl = response.nextUrl;
          this.previousPageUrl = response.previousUrl;
        },
        (err)=>{
          if(err.error.error == "Unauthorized"){
            this.router.navigate(['/auth/login'])
          } else {
            Swal.fire('error', 'Something wrong happened!', 'error')
            this.router.navigate(['/auth/login'])
          }
        }
      );
    }
  }
}

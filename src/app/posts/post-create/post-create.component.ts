import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {

  private editsub: Subscription;
  private editId: string | null;
  constructor(public postsService: PostsService) { }
  @ViewChild('postForm') postForm;

  ngOnInit() {
    // Subscribes to the post service and then patches the values of the subscription
    this.editsub = this.postsService.getEditPostListiner().subscribe((post: Post) => {
      this.postForm.form.patchValue({content: post.content});
      this.postForm.form.patchValue({title: post.title});

      this.editId = post.id;
    });

  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    try {
      if(this.editId){
        console.log("put");
        this.postsService.putPost(form.value.title, form.value.content, this.editId);
        this.editId = null;
      }else{
        this.postsService.addPost(form.value.title, form.value.content);
      }
    } catch (error) {
      console.log("Add/Update Error", error);
    }

    form.resetForm();
  }

  ngOnDestroy() {
    this.editsub.unsubscribe();
  }

}

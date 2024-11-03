import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService, ForumPost, PrivateMessage } from '../../services/forum/forum.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class ForumPage implements OnInit {
  posts$: Observable<ForumPost[]>;
  messages$: Observable<PrivateMessage[]>;
  selectedCategory: string = 'all';
  showNewPostModal: boolean = false;
  showChatModal: boolean = false;
  newPost = {
    title: '',
    content: '',
    category: 'general'
  };
  newMessage = {
    content: '',
    receiverId: ''
  };
  categories = ['all', 'family', 'faith', 'education', 'business', 'general'];
  mockUserId = '123'; // In real app, this would come from auth service

  constructor(private forumService: ForumService) {
    this.posts$ = this.forumService.getPosts();
    this.messages$ = this.forumService.getPrivateMessages(this.mockUserId);
  }

  ngOnInit() {}

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.posts$ = this.forumService.getPosts();
    } else {
      this.posts$ = this.forumService.getPostsByCategory(category);
    }
  }

  submitPost() {
    if (this.newPost.title && this.newPost.content) {
      this.forumService.addPost({
        title: this.newPost.title,
        content: this.newPost.content,
        category: this.newPost.category as any,
        author: 'Current User',
        date: new Date()
      });
      this.showNewPostModal = false;
      this.newPost = {
        title: '',
        content: '',
        category: 'general'
      };
    }
  }

  submitReply(postId: string, replyContent: string) {
    if (replyContent) {
      this.forumService.addReply(postId, {
        content: replyContent,
        author: 'Current User',
        date: new Date()
      });
    }
  }

  toggleLike(postId: string) {
    this.forumService.toggleLike(postId);
  }

  sendMessage() {
    if (this.newMessage.content && this.newMessage.receiverId) {
      this.forumService.sendPrivateMessage({
        content: this.newMessage.content,
        senderId: this.mockUserId,
        receiverId: this.newMessage.receiverId
      });
      this.showChatModal = false;
      this.newMessage = {
        content: '',
        receiverId: ''
      };
    }
  }

  markMessageAsRead(messageId: string) {
    this.forumService.markMessageAsRead(messageId);
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'family':
        return 'people';
      case 'faith':
        return 'heart';
      case 'education':
        return 'school';
      case 'business':
        return 'briefcase';
      default:
        return 'chatbubbles';
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  category: 'family' | 'faith' | 'education' | 'business' | 'general';
  likes: number;
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  date: Date;
  likes: number;
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  date: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private posts = new BehaviorSubject<ForumPost[]>([
    {
      id: '1',
      title: 'Tips for Ramadan Preparation',
      content: 'What are your best tips for preparing for Ramadan?',
      author: 'Ahmad',
      date: new Date('2024-02-15'),
      category: 'faith',
      likes: 15,
      replies: [
        {
          id: '1',
          content: 'Start adjusting your sleep schedule gradually.',
          author: 'Sarah',
          date: new Date('2024-02-15'),
          likes: 5
        }
      ]
    },
    {
      id: '2',
      title: 'Halal Business Networking',
      content: 'Looking to connect with other Muslim entrepreneurs.',
      author: 'Fatima',
      date: new Date('2024-02-14'),
      category: 'business',
      likes: 8,
      replies: []
    }
  ]);

  private messages = new BehaviorSubject<PrivateMessage[]>([]);

  constructor() {}

  getPosts(): Observable<ForumPost[]> {
    return this.posts.asObservable();
  }

  getPostsByCategory(category: string): Observable<ForumPost[]> {
    return new BehaviorSubject(
      this.posts.value.filter(post => post.category === category)
    ).asObservable();
  }

  addPost(post: Omit<ForumPost, 'id' | 'likes' | 'replies'>): void {
    const newPost: ForumPost = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      replies: []
    };
    this.posts.next([...this.posts.value, newPost]);
  }

  addReply(postId: string, reply: Omit<ForumReply, 'id' | 'likes'>): void {
    const updatedPosts = this.posts.value.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [
            ...post.replies,
            { ...reply, id: Date.now().toString(), likes: 0 }
          ]
        };
      }
      return post;
    });
    this.posts.next(updatedPosts);
  }

  toggleLike(postId: string): void {
    const updatedPosts = this.posts.value.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    this.posts.next(updatedPosts);
  }

  sendPrivateMessage(message: Omit<PrivateMessage, 'id' | 'date' | 'read'>): void {
    const newMessage: PrivateMessage = {
      ...message,
      id: Date.now().toString(),
      date: new Date(),
      read: false
    };
    this.messages.next([...this.messages.value, newMessage]);
  }

  getPrivateMessages(userId: string): Observable<PrivateMessage[]> {
    return new BehaviorSubject(
      this.messages.value.filter(
        msg => msg.senderId === userId || msg.receiverId === userId
      )
    ).asObservable();
  }

  markMessageAsRead(messageId: string): void {
    const updatedMessages = this.messages.value.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, read: true };
      }
      return msg;
    });
    this.messages.next(updatedMessages);
  }
}

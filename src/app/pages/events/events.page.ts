import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventsService, CommunityEvent } from '../../services/events/events.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule]
})
export class EventsPage implements OnInit {
  events$: Observable<CommunityEvent[]>;
  selectedLocation: string = '';
  eventTypes = ['all', 'jummah', 'gathering', 'class', 'other'];
  selectedType: string = 'all';

  constructor(private eventsService: EventsService) {
    this.events$ = this.eventsService.getEvents();
  }

  ngOnInit() {}

  onLocationChange() {
    if (this.selectedLocation) {
      this.events$ = this.eventsService.getEventsByLocation(this.selectedLocation);
    } else {
      this.events$ = this.eventsService.getEvents();
    }
  }

  toggleRsvp(eventId: string) {
    this.eventsService.toggleRsvp(eventId);
  }

  filterByType(type: string) {
    this.selectedType = type;
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'jummah':
        return 'mosque';
      case 'gathering':
        return 'people';
      case 'class':
        return 'book';
      default:
        return 'calendar';
    }
  }

  async enableNotifications(event: CommunityEvent) {
    // Request notification permissions
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Schedule notification for event
        const eventDate = new Date(event.date);
        const notificationTime = new Date(eventDate.getTime() - 30 * 60000); // 30 minutes before

        if (notificationTime > new Date()) {
          setTimeout(() => {
            new Notification(event.title, {
              body: `Reminder: ${event.title} starts in 30 minutes at ${event.location}`,
              icon: '/assets/icon/favicon.png'
            });
          }, notificationTime.getTime() - new Date().getTime());
        }
      }
    }
  }
}

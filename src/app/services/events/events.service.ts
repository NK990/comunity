import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'jummah' | 'gathering' | 'class' | 'other';
  rsvpCount: number;
  userRsvped?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private events = new BehaviorSubject<CommunityEvent[]>([
    {
      id: '1',
      title: 'Jummah Prayer',
      description: 'Weekly Friday prayer with special sermon on family values.',
      date: new Date('2024-03-08'),
      time: '13:00',
      location: 'Central Mosque',
      type: 'jummah',
      rsvpCount: 45
    },
    {
      id: '2',
      title: 'Islamic Studies Class',
      description: 'Weekly class on understanding Quran and Hadith.',
      date: new Date('2024-03-10'),
      time: '18:30',
      location: 'Community Center',
      type: 'class',
      rsvpCount: 12
    },
    {
      id: '3',
      title: 'Community Iftar',
      description: 'Community gathering for breaking fast during Ramadan.',
      date: new Date('2024-03-15'),
      time: '18:00',
      location: 'Islamic Center',
      type: 'gathering',
      rsvpCount: 78
    }
  ]);

  constructor() {}

  getEvents(): Observable<CommunityEvent[]> {
    return this.events.asObservable();
  }

  getEventsByLocation(location: string): Observable<CommunityEvent[]> {
    return new BehaviorSubject(
      this.events.value.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      )
    ).asObservable();
  }

  toggleRsvp(eventId: string): void {
    const updatedEvents = this.events.value.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          rsvpCount: event.userRsvped ? event.rsvpCount - 1 : event.rsvpCount + 1,
          userRsvped: !event.userRsvped
        };
      }
      return event;
    });
    this.events.next(updatedEvents);
  }

  addEvent(event: Omit<CommunityEvent, 'id' | 'rsvpCount'>): void {
    const newEvent: CommunityEvent = {
      ...event,
      id: Date.now().toString(),
      rsvpCount: 0
    };
    this.events.next([...this.events.value, newEvent]);
  }
}

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class EventHubService {
  private eventStream$: Subject<ISubjectEvent<any>> = new Subject<
    ISubjectEvent<any>
  >();

  constructor() {}
/*
* this method will emit events
*/
  notify<T>(event: ISubjectEvent<T>): void {
    this.eventStream$.next(event);
  }

/*
* listens to all events
* @param eventName use to filter events
*/

  listen<T>(eventName?: string): Observable<ISubjectEvent<T>> {
    if (eventName) {
      return this.eventStream$.pipe(
        filter((event: ISubjectEvent<T>) => {
          return event.name === eventName;
        })
      );
    } else {
      return this.eventStream$;
    }
  }
}

export class ISubjectEvent<T> {
  name: string;
  data: T;
}

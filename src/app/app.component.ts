import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventColor } from 'calendar-utils';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, of } from 'rxjs';

export interface User {
  id: number;
  name: string;
  color: EventColor;
}

const count = 5;
const fakeDataUrl =
  'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedValue = new Date('2023-01-27');
  listDataMap = new Map<string, Array<any>>();
  currDateEvents: any[] = [];
  initLoading = true; // bug
  loadingMore = false;
  data: any[] = [];
  list: Array<{ loading: boolean; name: any }> = [];

  constructor(private http: HttpClient, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.getData((res: any) => {
      this.data = res.results;
      this.list = res.results;
      this.initLoading = false;
    });
    this.listDataMap.set('2023-01-08', [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
    ]);
    this.listDataMap.set('2023-01-10', [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
      { type: 'error', content: 'This is error event.' },
    ]);
    this.listDataMap.set('2023-01-12', [
      { type: 'warning', content: 'This is warning event' },
      { type: 'success', content: 'This is very long usual event........' },
      { type: 'error', content: 'This is error event 1.' },
      { type: 'error', content: 'This is error event 2.' },
      { type: 'error', content: 'This is error event 3.' },
      { type: 'error', content: 'This is error event 4.' },
    ]);
  }

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }

  selectChange(date: Date): void {
  }

  isEventOn(date: Date): boolean {
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    const dateString = date.toISOString().slice(0, 10);
    const events = this.listDataMap.get(dateString.toString());
    // this.currDateEvents = events ? events : [];
    // console.log(this.currDateEvents)
    return !!events;
  }

  isThereEvents(): boolean {
    const events = this.listDataMap.get(this.selectedValue.toISOString().slice(0, 10).toString());
    console.log(events, this.selectedValue)
    return !!events;
  }

  getData(callback: (res: any) => void): void {
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => callback(res));
  }

  onLoadMore(): void {
    this.loadingMore = true;
    this.list = this.data.concat(
      [...Array(count)].fill({}).map(() => ({ loading: true, name: {} }))
    );
    this.http
      .get(fakeDataUrl)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res: any) => {
        setTimeout(() => {
          this.data = this.data.concat(res.results);
          this.list = [...this.data];
          this.loadingMore = false;
        }, 5000);
      });
  }

  edit(item: any): void {
    this.msg.success(item.email);
  }
}

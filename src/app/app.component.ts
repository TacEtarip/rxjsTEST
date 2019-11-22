import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  observable, Observable, merge, concat,
  BehaviorSubject, Subject, ReplaySubject, of, from,
  interval,
  fromEvent
} from 'rxjs';
import { delay, switchMap, take, map, takeUntil, startWith, scan, filter, debounceTime, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup;


  constructor(private formBuilder: FormBuilder) { }

  newObserver$: Observable<any> =
    new Observable(subscriber => {
      subscriber.next(100);
      subscriber.next(101);
      subscriber.complete();
    });

  of$: Observable<any> = of(100, 101);

  from$: Observable<any> = from([100, 101]);

  behasub$: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  subj$: Subject<any> = new Subject<any>();
  replays$: ReplaySubject<number> = new ReplaySubject<number>();

  interval$: Observable<number> = interval(1000);




  ngOnInit() {

    const searchBox = document.getElementById('testDebounce');
    const keyup$ = fromEvent(searchBox, 'keyup');

    this.form = this.formBuilder.group({
      test: this.formBuilder.control(''),
      testDebounce: this.formBuilder.control('OPC2')
    });

    keyup$.pipe(debounceTime(500))
      .subscribe(x => console.log(x));


    const seed = 0;
    this.interval$.pipe(startWith(-1), take(5), delay(100), scan((acc, one) => acc + one, seed), map(x => console.log(x)))
      .subscribe();



    // ! switchMap terminara toda subscripción anterior para empezar una nueva
    fromEvent(document, 'click')
      .pipe(switchMap(() => {
        return interval(1000).pipe(take(10), map(x => console.log('hola ' + x)));
      }))
      .subscribe();

    interval(2000)
      .pipe(filter(x => x % 2 === 0), take(100), map(val => console.log(val))).subscribe();



    this.newObserver$.subscribe(x => console.log('from nothing ' + x));
    this.of$.subscribe(x => console.log('from of ' + x));
    this.from$.subscribe(x => console.log('from from ' + x));

    this.behasub$.next(1);
    this.behasub$.next(2);



    this.subj$.next(3);
    this.subj$.next(4);



    this.replays$.next(10);
    this.replays$.next(11);


    // temp$.subscribe(res => unsub$.next(res));


    // this.ubje$.subscribe(x => console.log(x));

  }

  test() {
    // !SUBSJECT REALIZARA LA SUBSCRIBCIÓN CADA QUE SE AGREGUE UN NUEVO ELEMENTO, PERO UNA NUEVA SUBSCRIPCIÓN
    // !NO TOMA EN CUENTA LOS ELEMENTOS ANTERIORES
    this.subj$.subscribe(x => console.log(x));
  }

  test2() {
    // ! BEHAVIORSUBJECT REALIZARA LA SUBSCRIPCIÓN CADA QUE SE AGREGEUE UN NUEVO ELEMENTO, Y EN UNA SUBSCRIPCIÓN
    // ! NUEVA TOMARA EN CUENTA TAMBIEN A EL VALOR ACTUAL O ULTIMO
    this.behasub$.subscribe(x => console.log(x));
  }

  test3() {
    // ! REPLAYSUBJECT REALIZARA LA SUBSCRIPCIÓN CADA QUE SE AGREGEUE UN NUEVO ELEMENTO, Y EN UNA SUBSCRIPCIÓN
    // ! NUEVA TOMARA EN CUENTA TODOS LOS ELEMENTOS QUE HAYAN SIDO DADOS AL OBSERVABLE
    this.replays$.subscribe(x => console.log(x));
  }

  test4() {
    this.replays$.next(20);
    this.behasub$.next(25);
    this.subj$.next(30);
  }

  onSubmit(formValue) {
    console.log(formValue);
  }
}

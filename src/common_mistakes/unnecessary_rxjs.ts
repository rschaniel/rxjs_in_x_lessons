import { range } from 'rxjs';
import { map } from 'rxjs/operators';

function getRandomNumbers() {
  return range(1, 10).pipe(
    map(() => Math.random())
  );
}

getRandomNumbers().subscribe(value => console.log(value));


for (var i = 0; i < 10; i++) {
    console.log(Math.random());
}



<my-component[id]="(myObservable$ | async).id">
<my-component2[name]="(myObservable$ | async).name">
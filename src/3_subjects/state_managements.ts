import { BehaviorSubject, Observable } from 'rxjs';

interface User {
    firstName: string;
    lastName: string;
}

export class UserStateService {

    constructor() {}

    private initialState: User = null;
    private userState = new BehaviorSubject<User>(this.initialState);

    getUser(): Observable<User> {
        return this.userState.asObservable();
    }

    setUser(value: User): void {
        this.userState.next(value);
    }

    reset(): void {
        this.userState.next(this.initialState);
    }
}
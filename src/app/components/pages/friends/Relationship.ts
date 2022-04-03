export class Relationship {
    isFriend: boolean;
    id: {
        owner: {
            login: string;
            firstName: string;
            lastName: string;
        }
        friend: {
            login: string;
            firstName: string;
            lastName: string;
        }
    }
}
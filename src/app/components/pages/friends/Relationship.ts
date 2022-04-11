export class Relationship {
    isFriend: boolean;
    id: {
        owner: {
            pictureUrl: string;
            login: string;
            firstName: string;
            lastName: string;
        }
        friend: {
            pictureUrl: string;
            login: string;
            firstName: string;
            lastName: string;
        }
    }
}
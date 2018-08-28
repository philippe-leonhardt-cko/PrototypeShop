export class BaseAddress {
    public firstName: string | undefined;
    public lastName: string | undefined;
    public companyName: string | undefined;
    public streetName: string | undefined;
    public houseNumber: number | undefined;
    public zip: string | undefined;
    public city: string | undefined;
    public country: string | undefined;

    get fullName(): string | undefined {
        if (this.firstName && this.lastName) {
            return `${this.firstName} ${this.lastName}`;
        } else {
            return undefined;
        }
    }
}
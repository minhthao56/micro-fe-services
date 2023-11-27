export interface GeneralNumberResponse {
    monthly_booking?:  number;
    monthly_customer?: number;
    monthly_driver?:   number;
    monthly_phone?:    number;
    new_booking?:      number;
    new_customer?:     number;
    new_driver?:       number;
    new_phone?:        number;
    total_booking?:    number;
    total_customer?:   number;
    total_driver?:     number;
    total_phone?:      number;
    [property: string]: any;
}

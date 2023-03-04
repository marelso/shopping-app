import { Coupon } from './Coupon';
import { Category } from './Category';

export interface Offer {
    id: number,
    title: string,
    price: number,
    description: string,
    categories: Category[],
    coupon: Coupon,
    active: boolean
}  
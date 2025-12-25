export type Category = {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    icon: string | null;
    order_index: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type SelectedAddon = {
    id: string;
    name: string;
    price: number;
};

export type Restaurant = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    cover_image_url: string | null;
    rating: number;
    review_count: number;
    delivery_time_min: number;
    delivery_fee: number;
    minimum_order: number;
    category_id: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    phone: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type MenuItem = {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    price: number;
    category: string | null;
    is_available: boolean;
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_spicy: boolean;
    calories: number | null;
    addons?: SelectedAddon[];
    order_index: number;
    created_at: string;
    updated_at: string;
};

export type CartItem = {
    id: string;
    user_id: string;
    restaurant_id: string;
    menu_item_id: string;
    quantity: number;
    special_instructions: string | null;
    created_at: string;
    updated_at: string;
    menu_item?: MenuItem;
    selected_addons?: SelectedAddon[];
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Order = {
    id: string;
    user_id: string;
    restaurant_id: string;
    order_number: string;
    status: OrderStatus;
    subtotal: number;
    delivery_fee: number;
    tax: number;
    total: number;
    delivery_address: string;
    delivery_instructions: string | null;
    customer_phone: string | null;
    payment_method: string | null;
    payment_status: 'pending' | 'paid' | 'failed';
    estimated_delivery_time: string | null;
    created_at: string;
    updated_at: string;
};

export type OrderItem = {
    id: string;
    order_id: string;
    menu_item_id: string;
    menu_item_name: string;
    menu_item_price: number;
    quantity: number;
    special_instructions: string | null;
    subtotal: number;
    created_at: string;
};

export interface Property {
  name: string;
  type: string;
  price: number;
  billingCycle: 'Monthly' | 'Yearly';
  location: {
    address: string;
  };
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  furnishing: string;
  description: string;
  amenities: string[];
  rules: {
    petsAllowed: boolean;
    smokingAllowed: boolean;
    partiesAllowed: boolean;
  };
  owner: {
    name: string;
    email: string;
  };
  images: File[];
}

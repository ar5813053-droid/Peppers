export const CONFIG = {
  brandName: "Pepper's Pizza",
  location: "Bilaspur",
  currency: "₹",
  currencyCode: "INR",
  deliveryFee: 40,
  freeDeliveryMin: 399,
  minOrder: 149,
  demoPrepTimeMin: 25,
  demoPrepTimeMax: 40,
  storageVersion: 1,
  storagePrefix: "peppers_pizza_v1_",
};

export const DEMO_COUPONS = [
  {
    code: "PEPPER50",
    description: "₹50 off on orders above ₹299",
    type: "flat",
    value: 50,
    minOrder: 299,
    maxDiscount: 50,
  },
  {
    code: "FIRST100",
    description: "₹100 off on first order above ₹499",
    type: "flat",
    value: 100,
    minOrder: 499,
    maxDiscount: 100,
  },
  {
    code: "SAVE20",
    description: "20% off up to ₹80",
    type: "percent",
    value: 20,
    minOrder: 249,
    maxDiscount: 80,
  },
];

export const DEMO_ADDRESSES = [
  {
    id: "addr1",
    label: "Home",
    line1: "Near Bus Stand, Bilaspur",
    line2: "Chhattisgarh 495001",
    isDefault: true,
  },
];

export const DEFAULT_PROFILE = {
  name: "Guest",
  email: "",
  phone: "",
  isLoggedIn: false,
};
